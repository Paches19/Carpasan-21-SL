const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const passport = require('passport');
const session = require('express-session');
const { check, validationResult } = require('express-validator');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const cors = require('cors');
require('dotenv').config();
console.log(process.env.DB_HOST);
// app.use(helmet());


const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.static('public'));

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
  };

passport.use(new LocalStrategy(
    (username, password, done) => {
        console.log(`Intento de inicio de sesión para usuario: ${username}`);
        db.query('SELECT * FROM Usuarios WHERE Usuario = ?', [username], (err, results) => {
            if (err) return done(err);
            
            const user = results[0];
            
            if (!user) {
                console.log(`Usuario ${username} no encontrado.`);
                return done(null, false, { message: 'Usuario no encontrado.' });
            }
            
            bcrypt.compare(password, user.Contraseña, (err, isMatch) => {
                if (err) return done(err);
                
                if (isMatch) {
                    console.log(`inicio exitoso.`);
                    return done(null, user);
                } else {
                    console.log(`Contraseña incorrecta`);
                    return done(null, false, { message: 'Contraseña incorrecta.' });
                }
            });
        });
    }
));

// Serializar y deserializar el usuario para mantener la sesión
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.query('SELECT * FROM Usuarios WHERE id = ?', [id], (err, results) => {
        done(err, results[0]);
    });
});

// Configuración de sesiones
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// Inicialización de Passport
app.use(passport.initialize());
app.use(passport.session());

// ...

// Middleware de autenticación
function asegurarAutenticacion(req, res, next) {
    if(req.isAuthenticated()) { 
        return next();
    } else {
        res.status(401).send('No autorizado');
    }
}

// Middleware de autorización para el rol admin
function asegurarAdmin(req, res, next) {
    if(req.user && (req.user.rol === "gestorPedidos" || req.user.rol === "admin")) {
        return next();
    } else {
        res.status(403).send('Requiere permisos de administrador');
    }
}

// Conexión a MySQL
const db = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME
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
	res.status(500).send('Algo salió mal!');
  });

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

// Ruta de inicio de sesión
app.post('/iniciar-sesion', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        if (!user) {
            return res.status(400).json({ error: info.message });
        }
        req.login(user, err => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ message: 'Inicio de sesión exitoso.', user });
        });
    })(req, res, next);
});

// Ruta de cierre de sesión
app.get('/cerrar-sesion', (req, res) => {
    req.logout();
    res.redirect('/');
});

// Dashboard
app.get('/dashboard', asegurarAutenticacion, (req, res) => {
    res.send('Bienvenido al Dashboard');
});

// Ver historial de pedidos ordenados por fecha
app.get('/HistorialPedidos', (req, res) => {
    db.query('SELECT * FROM Pedidos ORDER BY FechaPedido DESC, ID_Pedido DESC;', (err, results) => {
        if(err) {
            return res.status(500).send("Error en la base de datos");
        }
        res.json(results);
    });
  });

  app.get('/pedido/:id', (req, res) => {
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
          productos: results.map(row => ({
            ID_Producto: row.ID_Producto,
            Cantidad: row.Cantidad,
            procesado: row.procesado,
            NombreProducto: row.NombreProducto,
            Precio: row.Precio
          }))
        };
        
        res.json(pedidoData);
      } else {
        res.status(404).json({ message: 'Pedido no encontrado' });
      }
    });
  });
  

