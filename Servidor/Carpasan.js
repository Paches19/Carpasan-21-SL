const express = require('express');
const bodyParser = require('body-parser');
var mysql = require('mysql');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'pedidos',
  password: 'pedidos',
  database: 'Carpasan',
  connectionLimit: 5
});

const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

app.post('/submit-order', (req, res) => {
console.log('Pedido recibido:', req.body);
  const order = req.body;

  // Agrega el pedido a la tabla de Pedidos
  connection.query('INSERT INTO Pedidos SET ?', {
    Nombre: order.firstName,
    Apellido: order.lastName,
    Direccion: order.address,
    Telefono: order.phone,
    Email: order.email,
    OpcionEnvio: order.deliveryOption,
    InfoExtra: order.extraInfo,
    EstadoPedido: 'Recibido',
    FechaPedido: currentDate
  }, (error, results) => {
    if (error) {
	console.error(error);
      return res.status(500).json({ error });
    }

    const orderId = results.insertId;

    let orderDetailsPromises = [];

// Agrega los detalles del pedido a la tabla de DetallesPedidos
for (let productName in order.cart) {
    let quantity = order.cart[productName];

    // Crea una nueva promesa para cada operación de base de datos
    let promise = new Promise((resolve, reject) => {
        // Busca el ID del producto que corresponde al nombre del producto
        connection.query('SELECT ID_Producto FROM Productos WHERE NombreProducto = ?', [productName], (error, results) => {
            if (error) {
                return reject(error);
            }

            if (results.length > 0) {
                let productId = results[0].ID_Producto;

                // Inserta una fila en la tabla de DetallesPedidos
                connection.query('INSERT INTO DetallesPedidos SET ?', {
                    ID_Pedido: orderId,
                    ID_Producto: productId,
                    Cantidad: quantity
                }, (error) => {
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
}

// Ejecuta todas las operaciones de base de datos y envía una única respuesta HTTP
Promise.all(orderDetailsPromises)
    .then(() => res.json({ orderId }))
    .catch((error) => res.status(500).json({ error }));
    // res.status(200).json({ message: 'Pedido recibido correctamente.' });
  });
});

app.use(function(err, req, res, next) {
	console.error(err.stack)
	res.status(500).send('¡Algo salió mal!')
  })
  
app.listen(3019, () => console.log('Servidor ejecutándose en el puerto 3019.'));
