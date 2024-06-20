const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const { check, validationResult } = require("express-validator");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require('path'); // Añade esta línea
require("dotenv").config();

const app = express();
const PORT = 3001;

// Primero importa las dependencias de seguridad
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

// Luego configura los middlewares de seguridad
app.use(helmet());
app.use(cookieParser());
app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());

const corsOptions = {
  origin: 'http://carpasan21.com:2080',
  credentials: true, // Permitir cookies
  optionsSuccessStatus: 200,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type, Authorization'
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

passport.use(
  new LocalStrategy((username, password, done) => {
    console.log(`Intento de inicio de sesión para usuario: ${username}`);
    db.query(
      "SELECT * FROM Usuarios WHERE Usuario = ?",
      [username],
      (err, results) => {
        if (err)
        {
          console.log(`error` + err);
          return done(err);
        }

        const user = results[0];

        if (!user) {
          console.log(`Usuario ${username} no encontrado.`);
          return done(null, false, { message: "Usuario no encontrado." });
        }

        bcrypt.compare(password, user.Password, (err, isMatch) => {
          if (err) 
          {
            console.log(`ierror` + err);
            return done(err);
          }

          if (isMatch) {
            console.log(`inicio exitoso.`);
            return done(null, user);
          } else {
            console.log(`Contraseña incorrecta`);
            return done(null, false, { message: "Contraseña incorrecta." });
          }
        });
      }
    );
  })
);

// Serializar y deserializar el usuario para mantener la sesión
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.query("SELECT * FROM Usuarios WHERE id = ?", [id], (err, results) => {
    done(err, results[0]);
  });
});

// Configuración de sesiones
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Cambia a true si estás utilizando HTTPS
      maxAge: 24 * 60 * 60 * 1000, // Tiempo de vida de la cookie en milisegundos (aquí, 1 día)
    },
  })
);

// Inicialización de Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware de autenticación
function asegurarAutenticacion(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).send("No autorizado");
  }
}

// Conexión a MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((error) => {
  if (error) throw error;
  console.log("Conexión a la base de datos establecida...");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Bienvenido al panel de administración de pedidos.");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Algo salió mal!");
});

// Ruta de inicio de sesión
app.post("/react/iniciar-sesion", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    if (!user) {
      console.log("no existe usuario");
      return res.status(400).json({ error: info.message });
    }
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      // Genera el token aquí después de que el usuario se haya autenticado
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1d", // Duración del token (1 día en este caso)
      });

      res.cookie("user_id", user.id); // Establece una cookie con el ID de usuario
      return res.json({ message: "Inicio de sesion exitoso.", token });
    });
  })(req, res, next);
});

// Ruta de cierre de sesión
app.get("/react/cerrar-sesion", (req, res) => {
  req.logout();
  res.clearCookie("user_id"); // Borra la cookie al cerrar sesión
  res.redirect("/");
});

// Dashboard
app.get("/react/dashboard", asegurarAutenticacion, (req, res) => {
  res.send("Bienvenido al Dashboard");
});

// Ver historial de pedidos ordenados por fecha
app.get("/react/HistorialPedidos", (req, res) => {
  db.query(
    "SELECT * FROM Pedidos ORDER BY FechaPedido DESC, ID_Pedido DESC;",
    (err, results) => {
      if (err) {
        return res.status(500).send("Error en la base de datos");
      }
      res.json(results);
    }
  );
});

// Actualizar el estado de un pedido específico
app.post("/react/pedido/:pedidoId/estado", (req, res) => {
  const pedidoId = req.params.pedidoId;
  const nuevoEstado = req.body.estado;

  db.query(
    `UPDATE Pedidos SET EstadoPedido = ? WHERE ID_Pedido = ?`,
    [nuevoEstado, pedidoId],
    function (error, results) {
      if (error) {
        console.error("Error al actualizar el estado del pedido: ", error);
        res.status(500).send("Error interno del servidor");
        return;
      }

      res.json({ success: true, message: "Estado actualizado" });
    }
  );
});

app.delete("/react/pedidos/:id", (req, res) => {
  const pedidoId = req.params.id;
  console.log("Pedido a eliminar: ", pedidoId);

  // Primero elimina los detalles del pedido
  const deleteDetailsQuery = "DELETE FROM DetallesPedidos WHERE ID_Pedido = ?";

  db.query(deleteDetailsQuery, [pedidoId], (errDetails, resultDetails) => {
    if (errDetails) {
      console.error("Error al eliminar los detalles del pedido:", errDetails);
      res.status(500).send("Error al eliminar los detalles del pedido");
    } else {
      console.log("Detalles del pedido eliminados exitosamente");

      // Si se eliminan los detalles, procede a eliminar el pedido
      const deleteOrderQuery = "DELETE FROM Pedidos WHERE ID_Pedido = ?";

      db.query(deleteOrderQuery, [pedidoId], (errOrder, resultOrder) => {
        if (errOrder) {
          console.error("Error al eliminar el pedido:", errOrder);
          res.status(500).send("Error al eliminar el pedido");
        } else {
          console.log("Pedido eliminado exitosamente");
          res.status(200).send("Pedido y detalles eliminados exitosamente");
        }
      });
    }
  });
});

//Mostrar pedido con detalles y productos
app.get("/react/pedido/:id", (req, res) => {
  const pedidoId = req.params.id;
  // Consulta SQL para obtener detalles del pedido junto con los productos
  const query = `
      SELECT 
        p.ID_Pedido, 
        p.Nombre,
        p.Apellido,
        p.Direccion,
        p.Email,
        p.Telefono,
        p.OpcionEnvio,
        p.InfoExtra,
        p.FechaPedido,
        p.EstadoPedido,
        dp.ID_Producto,
        dp.Cantidad,
        dp.procesado,
        prod.NombreProducto,
        prod.Precio
      FROM Pedidos p
      JOIN DetallesPedidos dp ON p.ID_Pedido = dp.ID_Pedido
      JOIN Productos prod ON dp.ID_Producto = prod.ID_Producto
      WHERE p.ID_Pedido = ?
    `;

  db.query(query, [pedidoId], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error });
    }

    // Transforma los resultados para que se ajusten al formato deseado
    if (results.length > 0) {
      const pedidoData = {
        ID_Pedido: results[0].ID_Pedido,
        Nombre: results[0].Nombre,
        Apellido: results[0].Apellido,
        Direccion: results[0].Direccion,
        Email: results[0].Email,
        Telefono: results[0].Telefono,
        OpcionEnvio: results[0].OpcionEnvio,
        InfoExtra: results[0].InfoExtra,
        FechaPedido: results[0].FechaPedido,
        EstadoPedido: results[0].EstadoPedido,
        productos: results.map((row) => ({
          ID_Producto: row.ID_Producto,
          Cantidad: row.Cantidad,
          procesado: row.procesado,
          NombreProducto: row.NombreProducto,
          Precio: row.Precio,
        })),
      };

      res.json(pedidoData);
    } else {
      res.status(404).json({ message: "Pedido no encontrado" });
    }
  });
});

//Listado productos
app.get("/react/Productos", (req, res) => {
  const query =
    "SELECT ID_Producto, NombreProducto, Precio, Descripcion, Tags, Imagen FROM Productos ORDER BY NombreProducto";

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error al obtener los productos");
      return;
    }
    res.json(results);
  });
});

//Modificar productos
app.put("/react/Productos/:id", (req, res) => {
  const productId = req.params.id;
  const { nombre, precio, descripcion, tags, imagen } = req.body;

  const updateQuery = `
    UPDATE Productos
    SET NombreProducto = ?, Precio = ?, Descripcion = ?, Tags = ?, Imagen = ?
    WHERE ID_Producto = ?
  `;

  db.query(
    updateQuery,
    [nombre, precio, descripcion, tags, imagen, productId],
    (err, result) => {
      if (err) {
        console.error("Error al actualizar el producto:", err);
        res.status(500).send("Error al actualizar el producto");
      } else {
        console.log("Producto actualizado exitosamente");
        res.status(200).send("Producto actualizado exitosamente");
      }
    }
  );
});

// Añadir un nuevo producto
app.post("/react/add-product", (req, res) => {
  const { nombre, precio, descripcion, tags, imagen } = req.body;
  const tagsString = tags.join(",");
  const insertQuery = `
    INSERT INTO Productos (NombreProducto, Precio, Descripcion, Tags, Imagen)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    insertQuery,
    [nombre, precio, descripcion, tagsString, imagen],
    (err, result) => {
      if (err) {
        console.error("Error al añadir el producto:", err);
        res.status(500).send("Error al añadir el producto");
      } else {
        console.log("Producto añadido exitosamente");
        res.status(200).send("Producto añadido exitosamente");
      }
    }
  );
});

// Eliminar un producto
app.delete("/react/Productos/:id", (req, res) => {
  const productId = req.params.id;
  const deleteQuery = "DELETE FROM Productos WHERE ID_Producto = ?";

  db.query(deleteQuery, [productId], (err, result) => {
    if (err) {
      console.error("Error al eliminar el producto:", err);
      res.status(500).send("Error al eliminar el producto");
    } else {
      console.log("Producto eliminado exitosamente");
      res.status(200).send("Producto eliminado exitosamente");
    }
  });
});

// Ruta para ventas totales por mes
app.get("/react/ventasTotalesPorMes", (req, res) => {
  const sql =
    "SELECT MONTH(FechaPedido) as Mes, COUNT(*) as TotalVentas FROM Pedidos GROUP BY Mes";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// Ruta para ventas por producto
app.get("/react/ventasPorProducto", (req, res) => {
  const sql = `
    SELECT Productos.NombreProducto, SUM(DetallesPedidos.Cantidad) as TotalVentas
    FROM DetallesPedidos
    JOIN Productos ON DetallesPedidos.ID_Producto = Productos.ID_Producto
    GROUP BY Productos.NombreProducto
  `;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.put("/react/modificarPedido/:id", (req, res) => {
  const pedidoId = req.params.id;
  const {
    Nombre,
    Apellido,
    Direccion,
    Telefono,
    Email,
    OpcionEnvio,
    InfoExtra,
    EstadoPedido,
    Productos,
  } = req.body;

  // Start MySQL transaction
  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Update Pedidos table
    const updatePedidoQuery = "UPDATE Pedidos SET ? WHERE ID_Pedido = ?";
    db.query(
      updatePedidoQuery,
      [
        {
          Nombre,
          Apellido,
          Direccion,
          Telefono,
          Email,
          OpcionEnvio,
          InfoExtra,
          EstadoPedido,
        },
        pedidoId,
      ],
      (err) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ error: err.message });
          });
        }

        // Delete existing product details for this order
        const deleteDetallesQuery =
          "DELETE FROM DetallesPedidos WHERE ID_Pedido = ?";
        db.query(deleteDetallesQuery, [pedidoId], (err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ error: err.message });
            });
          }

          // Insert new product details for this order
          const insertDetallesQuery =
            "INSERT INTO DetallesPedidos (ID_Pedido, ID_Producto, Cantidad) VALUES ?";
          const detallesData = Productos.map((producto) => [
            pedidoId,
            producto.ID_Producto,
            producto.Cantidad,
          ]);

          db.query(insertDetallesQuery, [detallesData], (err) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).json({ error: err.message });
              });
            }

            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  res.status(500).json({ error: err.message });
                });
              }
              res
                .status(200)
                .json({ message: "Pedido modificado exitosamente" });
            });
          });
        });
      }
    );
  });
});

app.post("/react/crearPedido", (req, res) => {

  const {
    Nombre,
    Apellido,
    Direccion,
    Telefono,
    Email,
    OpcionEnvio,
    InfoExtra,
    EstadoPedido,
    Productos,
  } = req.body;

  const nuevoPedido = {
    Nombre,
    Apellido,
    Direccion,
    Telefono,
    Email,
    OpcionEnvio,
    InfoExtra,
    EstadoPedido,
    FechaPedido: new Date().toISOString().slice(0, 19).replace('T', ' '),
  };

  const sqlInsertPedido = "INSERT INTO Pedidos SET ?";

  db.query(sqlInsertPedido, nuevoPedido, (err, resultado) => {

    if (err) {
      console.error("Error al insertar en Pedidos: ", err);
      return res.status(500).send("Error al crear el pedido");
    }
    const idPedidoCreado = resultado.insertId;

    if (!idPedidoCreado) {
      console.error("No se pudo obtener el idPedidoCreado");
      return res.status(500).send("Error desconocido");
    }

    const detallesPedidos = Productos.map((producto) => [
      idPedidoCreado,
      producto.ID_Producto,
      producto.Cantidad,
    ]);

    const sqlInsertDetalles =
      "INSERT INTO DetallesPedidos (ID_Pedido, ID_Producto, Cantidad) VALUES ?";

    db.query(sqlInsertDetalles, [detallesPedidos], (err, resultado) => {
      if (err) {
        console.error("Error al insertar en DetallesPedidos: ", err);
        return res.status(500).send("Error al crear los detalles del pedido");
      }

      res.status(201).send("Pedido creado con éxito");
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://carpasan21.com:${PORT}`);
});
