CREATE DATABASE IF NOT EXISTS Carpasan;

CREATE USER 'pedidos'@'%' IDENTIFIED BY 'pedidos';
GRANT ALL PRIVILEGES ON Carpasan.* TO 'pedidos'@'%';
FLUSH PRIVILEGES;

USE Carpasan;

CREATE TABLE IF NOT EXISTS Usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Usuario VARCHAR(255) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    role ENUM('usuario', 'gestorPedidos', 'admin') NOT NULL
);

INSERT INTO Usuarios (Usuario, Password, role) VALUES ('pedidos', '$2b$10$ZTWBQjqI8JnbstLwmpatpOhzE5jrFJtULfKtYHc2f/.WM0xohyNB6', 'gestorPedidos');

CREATE TABLE IF NOT EXISTS Productos (
    ID_Producto INT AUTO_INCREMENT PRIMARY KEY,
    NombreProducto VARCHAR(255) NOT NULL,
    Precio DECIMAL(10, 2) NOT NULL,
    Imagen VARCHAR(255),
    Tags VARCHAR(255),
    Descripcion TEXT
);

CREATE TABLE IF NOT EXISTS Pedidos (
    ID_Pedido INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(255) NOT NULL,
    Apellido VARCHAR(255) NOT NULL,
    Direccion TEXT NOT NULL,
    Telefono VARCHAR(20) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    OpcionEnvio VARCHAR(255) NOT NULL,
    InfoExtra TEXT,
    EstadoPedido VARCHAR(255) NOT NULL,
    FechaPedido DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS DetallesPedidos (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    ID_Pedido INT,
    ID_Producto INT,
    Cantidad DECIMAL(10, 2),
    procesado TINYINT(1) DEFAULT 0,
    FOREIGN KEY (ID_Pedido) REFERENCES Pedidos(ID_Pedido),
    FOREIGN KEY (ID_Producto) REFERENCES Productos(ID_Producto)
);
