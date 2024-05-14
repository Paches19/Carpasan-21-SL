const express = require('express');
const { body, validationResult } = require('express-validator');
const bodyParser = require('body-parser');
var mysql = require('mysql');
const cors = require('cors');
const app = express();
const moment = require('moment-timezone');
require('dotenv').config();
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

// Carga las credenciales de cliente desde un archivo local
const CREDENTIALS_PATH = 'credentials.json';
const TOKEN_PATH = 'token.json';

const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectionLimit: 5
});

connection.connect(function(error) {
  if (error) throw error;
  console.log('Conectado con el ID ' + connection.threadId);
});

// Ruta para recuperar todos los productos
app.get('/get-products', (req, res) => {
  let query = 'SELECT * FROM Productos';
  connection.query(query, (err, result) => {
    if (err) {
      console.error('Error al obtener los productos:', err);
      res.status(500).send('Error al obtener los productos');
    } else {
      const productos = result.map((row) => {
        return {
          nombre: row.NombreProducto,
          precio: row.Precio,
          imagen: row.Imagen,
          tags: row.Tags.split(','),
          descripcion: row.Descripcion,
        };
      });
      res.status(200).json(productos);
    }
  });
});

app.post('/submit-order', [
  body('firstName').notEmpty().trim().escape(),
  body('lastName').notEmpty().trim().escape(),
  body('address').notEmpty().trim().escape(),
  body('phone').notEmpty().isMobilePhone().trim().escape(),
  body('email').notEmpty().isEmail().normalizeEmail(),
  body('deliveryOption').notEmpty().trim().escape(),
  body('extraInfo').optional().trim().escape(),
  body('cart').isObject(),
  body('cart.*.quantity').isNumeric(),
  body('cart.*.productName').trim().escape()
], (req, res) => {
  // Revisa errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  function getLocalDateTime() {
    return moment().tz("Europe/Madrid").format('YYYY-MM-DD HH:mm:ss');
  }
  const currentDate = getLocalDateTime();
  console.log('Pedido recibido:', req.body);
  const order = req.body;

  // Agrega el pedido a la tabla de Pedidos con marcadores de posición para evitar inyecciones SQL
  const insertOrderQuery = `
    INSERT INTO Pedidos (Nombre, Apellido, Direccion, Telefono, Email, OpcionEnvio, InfoExtra, EstadoPedido, FechaPedido) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  connection.query(insertOrderQuery, [
    order.firstName,
    order.lastName,
    order.address,
    order.phone,
    order.email,
    order.deliveryOption,
    order.extraInfo || '',
    'Recibido',
    currentDate
  ], (error, results) => {
    if (error) {
      console.error('Error al agregar el pedido:', error);
      return res.status(500).json({ error });
    }

    const orderId = results.insertId;
    let orderDetailsPromises = [];

    // Procesa cada producto en el pedido
    Object.entries(order.cart).forEach(([productName, quantity]) => {
      // Promesa para insertar los detalles del pedido
      let promise = new Promise((resolve, reject) => {
        const selectProductQuery = 'SELECT ID_Producto FROM Productos WHERE NombreProducto = ?';
        connection.query(selectProductQuery, [productName], (error, results) => {
          if (error) {
            return reject(error);
          }

          if (results.length > 0) {
            let productId = results[0].ID_Producto;
            const insertDetailsQuery = 'INSERT INTO DetallesPedidos (ID_Pedido, ID_Producto, Cantidad) VALUES (?, ?, ?)';
            connection.query(insertDetailsQuery, [orderId, productId, quantity], (error) => {
              if (error) {
                return reject(error);
              }
              resolve();
            });
          } else {
            console.log(`No se encontró un producto con el nombre ${productName}.`);
            resolve();
          }
        });
      });

      orderDetailsPromises.push(promise);
    });

    Promise.all(orderDetailsPromises)
      .then(() => {
        sendEmail(order);

        res.json({ message: 'Pedido recibido correctamente', orderId });
      })
      .catch((error) => {
        console.error('Error al procesar los detalles del pedido:', error);
        res.status(500).json({ error });
      });
  });
});

// Función para cargar las credenciales y autorizar el cliente OAuth2
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Comprueba si tenemos un token previamente almacenado
  fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getAccessToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
  });
}

// Función para obtener un nuevo token de acceso
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Almacena el token para futuras ejecuciones
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

// Función para enviar un correo electrónico
function sendEmail(order) {
  // Carga las credenciales de cliente
  fs.readFile(CREDENTIALS_PATH, (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    authorize(JSON.parse(content), (auth) => {
      const gmail = google.gmail({ version: 'v1', auth });

      const emailContent = `
        To: ${order.email}\r\n
        Subject: Resumen de tu pedido\r\n
        \r\n
        Gracias por tu pedido, ${order.firstName} ${order.lastName}.\r\n
        Aquí está el resumen de tu compra:\r\n
        Dirección: ${order.address}\r\n
        Teléfono: ${order.phone}\r\n
        \r\n
        Productos:\r\n
        ${Object.entries(order.cart).map(([productName, quantity]) => `${productName}: ${quantity}`).join('\r\n')}
        \r\n
        Opción de envío: ${order.deliveryOption}\r\n
        Información adicional: ${order.extraInfo || 'N/A'}\r\n
        \r\n
        Fecha de pedido: ${new Date().toLocaleString()}
      `;

      const encodedMessage = Buffer.from(emailContent)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      gmail.users.messages.send({
        userId: 'me',
        requestBody: { raw: encodedMessage },
      }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        console.log('Email sent: ', res.data);
      });
    });
  });
}

app.use(function(err, req, res, next) {
	console.error(err.stack)
	res.status(500).send('¡Algo salió mal!')
  })
  
app.listen(3000, () => console.log('Servidor ejecutándose en el puerto 3000.'));
