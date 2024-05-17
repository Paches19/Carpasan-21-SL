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

app.get('/oauth2callback', (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send('No code provided');
  }

  // Carga las credenciales de cliente
  fs.readFile(CREDENTIALS_PATH, (err, content) => {
    if (err) return res.status(500).send('Error loading client secret file');
    authorizeWithCode(JSON.parse(content), code, (auth) => {
      res.send('Authorization successful! You can close this window.');
    });
  });
});

function authorizeWithCode(credentials, code, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

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
}

function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

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

function sendEmail(order) {
  // Carga las credenciales de cliente
  fs.readFile(CREDENTIALS_PATH, (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    authorize(JSON.parse(content), (auth) => {
      const gmail = google.gmail({ version: 'v1', auth });

      const emailContent = `
      <html>
      <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 20px;">
        <h2 style="color: #555;">Gracias por tu compra, ${order.firstName} ${order.lastName}.</h2>
        <p>Nos complace confirmar tu pedido con la siguiente información:</p>
        <h3 style="color: #555;">Resumen de tu compra</h3>
        <p><strong>Dirección:</strong> ${order.address}</p>
        <p><strong>Teléfono:</strong> ${order.phone}</p>
        <h3 style="color: #555;">Productos:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; text-align: left;">Producto</th>
              <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; text-align: left;">Cantidad</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(order.cart).map(([productName, quantity]) => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${productName}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${quantity} kg</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <p><strong>Precio total aproximado:</strong> ${order.total} €</p>
        <p><strong>Opción de envío:</strong> ${order.deliveryOption}</p>
        <p><strong>Información adicional:</strong> ${order.extraInfo || 'N/A'}</p>
        <h3 style="color: #555;">Detalles de entrega:</h3>
        <p>Los plazos normales de entrega son entre 1 y 3 días. Si has elegido la opción de recogida, te avisaremos por teléfono. Las entregas se realizan por la tarde.</p>
        <p>Recuerda que tanto el precio final como las cantidades son aproximadas. El pago se realizará al entregar el producto y se indicará el importe final real de la compra.</p>
        <p>¡Gracias por comprar con nosotros!</p>
        <p>Saludos,<br>Equipo de Carpasan</p>
      </body>
      </html>
    `;

      // Asegurarse de que el campo "To" no está vacío o undefined
      if (!order.email) {
        return console.log('Error: Recipient address is missing');
      }

      const rawMessage = [
        `To: ${order.email}`,
        'Subject: Resumen de tu pedido',
        'Content-Type: text/html; charset=utf-8',
        'Content-Transfer-Encoding: base64',
        '',
        Buffer.from(emailContent).toString('base64')
      ].join('\r\n');

      const encodedMessage = Buffer.from(rawMessage)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      gmail.users.messages.send({
        userId: 'me',
        requestBody: { raw: encodedMessage },
      }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        console.log('Email sent:', res.data);
      });
    });
  });
}

app.use(function(err, req, res, next) {
	console.error(err.stack)
	res.status(500).send('¡Algo salió mal!')
  })
  
app.listen(3000, () => console.log('Servidor ejecutándose en el puerto 3000.'));
