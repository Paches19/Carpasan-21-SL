const express = require('express');
const { body, validationResult } = require('express-validator');
const bodyParser = require('body-parser');
var mysql = require('mysql');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectionLimit: 5
});

connection.connect(function(err) {
  if (err) {
    console.error('Error de conexion: ' + err.stack);
    return;
  }

  console.log('Conectado con el ID ' + connection.threadId);
});

const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

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

    // Ejecuta todas las promesas
    Promise.all(orderDetailsPromises)
      .then(() => res.json({ message: 'Pedido recibido correctamente', orderId }))
      .catch((error) => {
        console.error('Error al procesar los detalles del pedido:', error);
        res.status(500).json({ error });
      });
  });
});

app.use(function(err, req, res, next) {
	console.error(err.stack)
	res.status(500).send('¡Algo salió mal!')
  })
  
app.listen(3019, () => console.log('Servidor ejecutándose en el puerto 3019.'));
