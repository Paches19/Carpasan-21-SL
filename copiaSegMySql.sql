-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: localhost    Database: Carpasan
-- ------------------------------------------------------
-- Server version	8.0.36-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `DetallesPedidos`
--

DROP TABLE IF EXISTS `DetallesPedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DetallesPedidos` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `ID_Pedido` int DEFAULT NULL,
  `ID_Producto` int DEFAULT NULL,
  `Cantidad` float DEFAULT NULL,
  `procesado` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`ID`),
  KEY `ID_Pedido` (`ID_Pedido`),
  KEY `ID_Producto` (`ID_Producto`),
  CONSTRAINT `DetallesPedidos_ibfk_1` FOREIGN KEY (`ID_Pedido`) REFERENCES `Pedidos` (`ID_Pedido`),
  CONSTRAINT `DetallesPedidos_ibfk_2` FOREIGN KEY (`ID_Producto`) REFERENCES `Productos` (`ID_Producto`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DetallesPedidos`
--

LOCK TABLES `DetallesPedidos` WRITE;
/*!40000 ALTER TABLE `DetallesPedidos` DISABLE KEYS */;
INSERT INTO `DetallesPedidos` VALUES (2,2,1,2,0),(3,2,2,3,0),(4,2,3,2,0),(5,2,4,3,0),(6,2,5,6,0),(7,2,6,0,0),(8,2,7,1,0),(9,2,11,2,0),(12,3,7,2,0),(13,3,6,2.5,0),(14,1,1,2,0);
/*!40000 ALTER TABLE `DetallesPedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Pedidos`
--

DROP TABLE IF EXISTS `Pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Pedidos` (
  `ID_Pedido` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(255) NOT NULL,
  `Apellido` varchar(255) NOT NULL,
  `Direccion` text NOT NULL,
  `Telefono` varchar(20) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `OpcionEnvio` varchar(255) NOT NULL,
  `InfoExtra` text,
  `EstadoPedido` varchar(255) NOT NULL,
  `FechaPedido` datetime NOT NULL,
  PRIMARY KEY (`ID_Pedido`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Pedidos`
--

LOCK TABLES `Pedidos` WRITE;
/*!40000 ALTER TABLE `Pedidos` DISABLE KEYS */;
INSERT INTO `Pedidos` VALUES (1,'Adrian','Pacheco Teran','Calle Pico de los Artilleros 78, 3C','653999552','adrianpachecotera@gmail.com','recoger','Info prueba','Enviado','2024-04-09 16:59:59'),(2,'Adrian','Pacheco Teran','Calle Pico de los Artilleros 78, 3C','653999552','adrianpachecoteran@gmail.com','recoger','asd','Recibido','2024-04-09 16:59:59'),(3,'Pedro','picapiedra','asd','653999552','pedropica@gmail.com','recoger','asdad','Procesado','2024-04-09 17:45:34');
/*!40000 ALTER TABLE `Pedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Productos`
--

DROP TABLE IF EXISTS `Productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Productos` (
  `ID_Producto` int NOT NULL AUTO_INCREMENT,
  `NombreProducto` varchar(255) NOT NULL,
  `Precio` decimal(10,2) NOT NULL,
  `Imagen` varchar(255) DEFAULT NULL,
  `Tags` varchar(255) DEFAULT NULL,
  `Descripcion` text,
  PRIMARY KEY (`ID_Producto`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Productos`
--

LOCK TABLES `Productos` WRITE;
/*!40000 ALTER TABLE `Productos` DISABLE KEYS */;
INSERT INTO `Productos` VALUES (1,'Lomo de vaca',19.99,'/Carpasan-21-SL/images/vaca.jpg','vacuno',''),(2,'Chuleton de buey',12.99,'/Carpasan-21-SL/images/chuleton.png','vacuno','Chuleton de buey gallego madurado 60 días'),(3,'Lomo de cerdo',11.99,'/Carpasan-21-SL/images/cerdo.jpg','cerdo',''),(4,'Chuletas de cerdo',10.99,'/Carpasan-21-SL/images/chuletacerdo.jpg','cerdo',''),(5,'Pechuga de pollo',9.99,'/Carpasan-21-SL/images/pechugaPollo.jpg','pollo',''),(6,'Alitas de pollo',1.99,'/Carpasan-21-SL/images/alitas.png','pollo',''),(7,'Chorizo dulce',120.99,'/Carpasan-21-SL/images/chorizoDulce.png','embutido',''),(8,'Chorizo picante',102.99,'/Carpasan-21-SL/images/chorizo.png','embutido',''),(9,'Salchichón Ibérico',25.99,'/Carpasan-21-SL/images/cerdo.jpg','Embutido','Salchichón ibérico de alta calidad, perfecto para tapas'),(10,'Paleta Ibérica',55.50,'/Carpasan-21-SL/images/cerdo.jpg','Especiales','Paleta ibérica de bellota, curada durante 24 meses'),(11,'Panceta curada',15.20,'/Carpasan-21-SL/images/cerdo.jpg','Cerdo','Panceta curada con hierbas aromáticas'),(12,'Costillas de cerdo BBQ',12.99,'/Carpasan-21-SL/images/cerdo.jpg','Cerdo','Costillas de cerdo marinadas en salsa BBQ'),(13,'Jamoneta',22.99,'/Carpasan-21-SL/images/cerdo.jpg','Cerdo','Jamoneta ahumada, jugosa y tierna'),(14,'Morcilla de Burgos',8.99,'/Carpasan-21-SL/images/cerdo.jpg','Embutido','Morcilla de Burgos, ideal para asar o cocinar con legumbres'),(15,'Lomo embuchado',29.99,'/Carpasan-21-SL/images/cerdo.jpg','Embutido','Lomo embuchado de cerdo, curado en condiciones óptimas'),(16,'Solomillo de cerdo',18.75,'/Carpasan-21-SL/images/cerdo.jpg','Cerdo','Solomillo de cerdo fresco, suave y jugoso');
/*!40000 ALTER TABLE `Productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Usuarios`
--

DROP TABLE IF EXISTS `Usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Usuario` varchar(255) NOT NULL,
  `Contraseña` varchar(255) NOT NULL,
  `rol` enum('usuario','gestorPedidos','admin') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Usuario` (`Usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Usuarios`
--

LOCK TABLES `Usuarios` WRITE;
/*!40000 ALTER TABLE `Usuarios` DISABLE KEYS */;
INSERT INTO `Usuarios` VALUES (1,'admin','$2b$10$XxaoZMddxi6o547ji3iiW.KoSiNFnMdBcd/qCROTuSwvhDPRIgFg.','admin'),(2,'pedidos','$2b$10$ZTWBQjqI8JnbstLwmpatpOhzE5jrFJtULfKtYHc2f/.WM0xohyNB6','gestorPedidos');
/*!40000 ALTER TABLE `Usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-04-09 19:52:50
