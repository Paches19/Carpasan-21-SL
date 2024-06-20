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

INSERT INTO Usuarios (Usuario, Password, role) VALUES ('pedidos', '$2b$10$16TFhMW3/I9icvk.2xebj.DVJGfLsSJV/KJKcS67o.qEsImBdzfOS', 'gestorPedidos');

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

INSERT INTO Productos (NombreProducto, Precio, Imagen, Tags, Descripcion) VALUES
('Carne Picada Mixta', 8.50, '/images/vacuno/carne_picada.jpg', 'Vacuno', 'Carne picada de cerdo, ternera y mixta'),
('Carne Magra para Guisar', 8.50, '/images/vacuno/carne_magra.jpg', 'Vacuno', 'Carne magra para guisar de vacuno'),
('Churrasco de Falda Vaca', 9.50, '/images/vacuno/falda_churrasco.jpg', 'Vacuno', ''),
('Filetes de Babilla y Cadera', 10.90, '/images/vacuno/filetes_babilla_cadera.jpg', 'Vacuno', ''),
('Rabo de Vaca Gallega', 12.50, '/images/vacuno/rabo_vaca.jpg', 'Vacuno', ''),
('Aguja de Novilla', 12.50, '/images/vacuno/aguja_novilla.jpg', 'Vacuno', ''),
('Lomo Alto de Vaca Gallega Madurado', 12.00, '/images/vacuno/lomo_alto_vaca.jpg', 'Vacuno', ''),

('Oreja de Cerdo', 3.50, '/images/cerdo/oreja.jpg', 'Cerdo', ''),
('Manos de Cerdo', 3.50, '/images/cerdo/manos.jpg', 'Cerdo', ''),
('Rabos de Cerdo', 3.50, '/images/cerdo/rabos.jpg', 'Cerdo', ''),
('Filetes de Cerdo', 5.50, '/images/cerdo/filetes_cerdo.jpg', 'Cerdo', 'Filetes de cerdo para plancha o empanado'),
('Magro de Cerdo en Trozos', 5.50, '/images/cerdo/magro_cerdo.jpg', 'Cerdo', ''),
('Chuletas de Aguja de Cerdo', 5.50, '/images/cerdo/chuletas_aguja.jpg', 'Cerdo', ''),
('Chuletas de Lomo de Cerdo', 5.90, '/images/cerdo/chuletas_lomo.jpg', 'Cerdo', ''),
('Panceta de Cerdo', 5.90, '/images/cerdo/panceta.jpg', 'Cerdo', ''),
('Cinta de Lomo de Cerdo Fresca', 6.10, '/images/cerdo/cinta_lomo_fresca.jpg', 'Cerdo', ''),
('Cinta de Lomo de Cerdo Adobada', 6.99, '/images/cerdo/cinta_lomo_adobada.jpg', 'Cerdo', ''),
('Costillares de Cerdo', 6.90, '/images/cerdo/costillares.jpg', 'Cerdo', ''),
('Costillas de Cerdo Tipo Foster', 8.20, '/images/cerdo/costillas_foster.jpg', 'Cerdo', 'Costillas de cerdo, tiras tipo Foster'),
('Cochinillos Congelados', 65.00, '/images/cerdo/cochinillo.jpg', 'Cerdo', 'Cochinillos congelados entre 4 y 5 kg por pieza'),

('Higados de Pollo', 2.40, '/images/pollo/higados_pollo.jpg', 'Pollo', ''),
('Mollejas de Pollo', 2.50, '/images/pollo/mollejas_pollo.jpg', 'Pollo', 'Mollejas de pollo'),
('Jamoncitos de Pollo', 3.20, '/images/pollo/jamoncitos_pollo.jpg', 'Pollo', 'Jamoncitos de pollo'),
('Traseros de Pollo', 3.20, '/images/pollo/traseros_pollo.jpg', 'Pollo', 'Traseros de pollo'),
('Pollos Enteros', 3.40, '/images/pollo/pollos_enteros.jpg', 'Pollo', 'Pollos enteros'),
('Alas de Pollo Frescas', 3.95, '/images/pollo/alas_pollo.jpg', 'Pollo', 'Alas de pollo frescas'),
('Contras de Pollo', 4.40, '/images/pollo/contras_pollo.jpg', 'Pollo', 'Contras de pollo'),
('Alas Adobadas de Pollo', 4.50, '/images/pollo/alas_adobadas.jpg', 'Pollo, Adobados', 'Alas adobadas de pollo'),
('Pechugas Deshuesadas', 6.50, '/images/pollo/pechugas_deshuesadas.jpg', 'Pollo', 'Pechugas deshuesadas'),
('Conejo', 9.20, '/images/especiales/conejos.jpg', 'Especiales', 'Conejo entero'),

('Butifarras en Pinchitos', 6.50, '/images/obrador/butifarras_pinchitos.jpg', 'Obrador', 'Butifarras frescas presentadas en pinchitos'),
('Chorizo para Guisar, Barbacoa y Pincho', 6.50, '/images/obrador/chorizo_variedades.jpg', 'Obrador', 'Chorizo versatil para guisar, barbacoa y pincho'),
('Morcilla de Cebolla', 6.50, '/images/obrador/morcilla_cebolla.jpg', 'Obrador', 'Morcilla de cebolla'),
('Morcilla de Cebolla en Pincho', 6.50, '/images/obrador/morcilla_cebolla.jpg', 'Obrador', 'Morcilla de cebolla en pincho'),
('Salchichas Frescas', 6.99, '/images/obrador/salchichas_frescas.jpg', 'Obrador', ''),
('Hamburguesas Mixtas', 6.99, '/images/obrador/hamburguesas_mixtas.jpg', 'Obrador, Vacuno, Cerdo', ''),
('Hamburguesas de Vaca de Pontevedra', 7.50, '/images/obrador/hamburguesas_vaca.jpg', 'Obrador, Vacuno', ''),
('Cabeza de Jabali (Chicharron)', 10.00, '/images/obrador/chicharron.jpg', 'Obrador', 'Cabeza de jabali procesada en forma de chicharron'),
('Sarta Dulce', 12.00, '/images/obrador/sarta_dulce.jpg', 'Obrador', ''),
('Sarta Picante', 12.00, '/images/obrador/sarta_picante.jpg', 'Obrador', ''),
('Fuet Imperial', 12.00, '/images/obrador/fuet_imperial.jpg', 'Obrador', ''),

-- Embutidos y Fiambres
('Fiambre de Magro Monte Sierra', 5.00, '/images/embutido/fiambre_magro.jpg', 'Embutido', ''),
('Bacon Ahumado', 7.50, '/images/embutido/bacon_ahumado.jpg', 'Embutido', ''),
('Queso Barra para Lonchear', 7.50, '/images/embutido/queso_barra.jpg', 'Embutido', ''),
('Salchichon y Chorizo Vela Colsell', 10.00, '/images/embutido/salchichon_chorizo_vela.jpg', 'Embutido', ''),
('Queso Semicurado San Isidro', 11.50, '/images/embutido/queso_semicurado.jpg', 'Embutido', ''),
('Centros de Jamon para Lonchear', 12.50, '/images/embutido/centros_jamon.jpg', 'Embutido', ''),

-- Adobados
('Pincho Moruno de Cerdo', 6.50, '/images/adobados/pincho_moruno.jpg', 'Adobados, Cerdo', ''),
('Costillas Adobadas de Cerdo', 6.99, '/images/adobados/costillas_adobadas.jpg', 'Adobados, Cerdo', ''),

--Ofertas Especiales
('Pack Barbacoa', 29.00, '/images/especiales/pack_barbacoa.jpg', 'Especiales', 'Oferta especial barbacoa'),
('Pack Pollo', 17.50, '/images/especiales/pack_pollo.jpg', 'Especiales', 'Oferta especial pollo');
