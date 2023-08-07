const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const passport = require('passport');
const session = require('express-session');
const { check, validationResult } = require('express-validator');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
require('dotenv').config();
app.use(helmet());
const app = express();
const PORT = 3000;

passport.use(new LocalStrategy(
    (username, password, done) => {
        db.query('SELECT * FROM Usuarios WHERE Usuario = ?', [username], (err, results) => {
            if (err) return done(err);
            
            const user = results[0];
            
            if (!user) {
                return done(null, false, { message: 'Usuario no encontrado.' });
            }
            
            bcrypt.compare(password, user.Contraseña, (err, isMatch) => {
                if (err) return done(err);
                
                if (isMatch) {
                    return done(null, user);
                } else {
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

// Crear nuevo pedido
app.post('/pedidos', asegurarAutenticacion, asegurarAdmin, [
    check('Estado').notEmpty().withMessage('El estado es obligatorio')
    // ... Otras validaciones
], (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    const nuevoPedido = req.body;
    db.query('INSERT INTO Pedidos SET ?', nuevoPedido, (err, result) => {
        if(err) {
            return res.send(err);
        }
        res.send('Pedido creado con éxito.');
    });
});

// Modificar estado del pedido
app.put('/pedido/:id/estado', asegurarAutenticacion, asegurarAdmin, [
    check('Estado').notEmpty().withMessage('El estado es obligatorio')
], (req, res) => {
    const nuevoEstado = req.body.estado;
    db.query('UPDATE Pedidos SET Estado = ? WHERE ID_Pedido = ?', [nuevoEstado, req.params.id], (err, result) => {
        if(err) {
            return res.send(err);
        }
        res.send('Estado del pedido actualizado con éxito.');
    });
});

// Modificar productos del pedido
app.put('/pedido/:id/productos', asegurarAutenticacion, asegurarAdmin, (req, res) => {
    const nuevosProductos = req.body.productos;
    // Aquí deberías tener un proceso más complejo para actualizar los productos asociados al pedido
    // ... código de implementación ...
    res.send('Productos del pedido actualizados con éxito.');
});

// Ver todos los pedidos
app.get("/pedidos", asegurarAutenticacion, asegurarAdmin, (req, res) => {
    db.query("SELECT * FROM Pedidos", (err, results) => {
        if (err) {
            return res.send(err);
        }
        res.json(results);
    });
});

// Ver historial de pedidos ordenados por fecha
app.get('/historial', asegurarAutenticacion, asegurarAdmin, (req, res) => {
    db.query('SELECT * FROM Pedidos ORDER BY Fecha DESC', (err, results) => {
        if(err) {
            return res.send(err);
        }
        res.json(results);
    });
});

// Filtrar historial por cliente
app.get('/historial/cliente/:clienteId', asegurarAutenticacion, asegurarAdmin, (req, res) => {
    db.query('SELECT * FROM Pedidos WHERE ID_Cliente = ? ORDER BY Fecha DESC', [req.params.clienteId], (err, results) => {
        if(err) {
            return res.send(err);
        }
        res.json(results);
    });
});

// Ver un pedido específico
app.get("/pedido/:id", asegurarAutenticacion, asegurarAdmin, (req, res) => {
    db.query("SELECT * FROM Pedidos WHERE ID_Pedido = ?", [req.params.id], (err, results) => {
        if (err) {
            return res.send(err);
        }
        res.json(results);
    });
});

// Similarmente para otras rutas...
