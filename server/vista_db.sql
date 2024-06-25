CREATE DATABASE  IF NOT EXISTS `vista_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `vista_db`;
-- MySQL dump 10.13  Distrib 8.0.36, for macos14 (arm64)
--
-- Host: 127.0.0.1    Database: vista_db
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `data_types`
--

DROP TABLE IF EXISTS `data_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `data_types` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `data_type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data_types`
--

LOCK TABLES `data_types` WRITE;
/*!40000 ALTER TABLE `data_types` DISABLE KEYS */;
INSERT INTO `data_types` VALUES (1,'Chest Xray');
/*!40000 ALTER TABLE `data_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `diagnosis`
--

DROP TABLE IF EXISTS `diagnosis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `diagnosis` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `diagnosis` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diagnosis`
--

LOCK TABLES `diagnosis` WRITE;
/*!40000 ALTER TABLE `diagnosis` DISABLE KEYS */;
INSERT INTO `diagnosis` VALUES (1,'Normal'),(2,'COVID-19'),(3,'Viral Pneumonia'),(4,'Lung Opacity');
/*!40000 ALTER TABLE `diagnosis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `main`
--

DROP TABLE IF EXISTS `main`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `main` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `patient_ID` int DEFAULT NULL,
  `date` date DEFAULT NULL,
  `diagnosis_ID` int DEFAULT NULL,
  `data_type_ID` int DEFAULT NULL,
  `image` varchar(250) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `fk_patient_id` (`patient_ID`),
  KEY `fk_diagnosis_id` (`diagnosis_ID`),
  KEY `fk_data_type_id` (`data_type_ID`),
  CONSTRAINT `fk_data_type_id` FOREIGN KEY (`data_type_ID`) REFERENCES `data_types` (`ID`),
  CONSTRAINT `fk_diagnosis_id` FOREIGN KEY (`diagnosis_ID`) REFERENCES `diagnosis` (`ID`),
  CONSTRAINT `fk_patient_id` FOREIGN KEY (`patient_ID`) REFERENCES `patients` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `main`
--

LOCK TABLES `main` WRITE;
/*!40000 ALTER TABLE `main` DISABLE KEYS */;
INSERT INTO `main` VALUES (5,2,'2024-04-14',NULL,1,'',''),(6,2,'2024-04-14',NULL,1,'',''),(7,2,'2024-04-14',NULL,1,'',''),(8,2,'2024-04-14',NULL,1,'',''),(26,13,'2024-04-20',4,1,'image-1713608653209.png','clear'),(27,9,'2024-04-20',4,1,'image-1713611795522.png',''),(28,9,'2024-04-20',4,1,'image-1713611813092.png','Poor picture.'),(29,9,'2024-04-20',4,1,'image-1713611822219.png','Poor picture.'),(31,14,'2024-04-20',1,1,'image-1713618940279.png',''),(32,5,'2024-04-20',1,1,'image-1713647831308.png','No pathologies found.'),(34,1,'2024-04-21',4,1,'image-1713688023584.png','sdfsafsaf'),(35,9,'2024-04-21',1,1,'image-1713695596458.png',''),(37,5,'2024-04-21',2,1,'image-1713725256455.png',''),(38,5,'2024-04-21',2,1,'image-1713726274886.png',''),(39,5,'2024-02-21',2,1,'image-1713726298268.png',''),(40,5,'2024-02-21',2,1,'image-1713726321448.png',''),(41,5,'2024-04-21',2,1,'image-1713726337127.png',''),(43,5,'2024-04-21',2,1,'image-1713726743928.png',''),(44,3,'2024-04-21',2,1,'image-1713727505683.png',''),(45,3,'2024-04-21',3,1,'image-1713727538458.png',''),(46,4,'2024-04-21',1,1,'image-1713727955122.png',''),(48,5,'2024-04-23',1,1,'image-1713900594921.png',''),(49,14,'2024-04-23',1,1,'image-1713904506694.png','mental abuse'),(50,4,'2024-04-28',3,1,'image-1714322868115.png',''),(51,11,'2024-04-28',2,1,'image-1714323127642.png',''),(52,11,'2024-04-28',3,1,'image-1714324750429.png',''),(53,11,'2024-04-28',3,1,'image-1714324851868.png',''),(54,13,'2024-06-12',2,1,'image-1718195533789.jpeg',''),(57,4,'2024-06-14',3,1,'image-1718362143491.png',''),(60,4,'2024-06-14',3,1,'image-1718384629651.png',''),(62,2,'2024-06-15',2,1,'image-1718404090403.jpeg','sfdsfbsdkjfbjsdbdskbfksbfdkjbskjfbjksbfkjsab\\jkbaj\\sfbjksabflkjas'),(63,2,'2024-06-15',2,1,'image-1718404406303.jpeg',''),(64,3,'2024-06-15',2,1,'image-1718405555609.jpeg',''),(65,2,'2024-06-15',2,1,'image-1718446386542.jpeg',''),(70,4,'2024-06-18',1,1,'image-1718741664701.png','fvehdfbelsajn lůs§m§ks'),(71,12,'2024-06-20',3,1,'image-1718876534839.png',''),(72,19,'2024-06-20',3,1,'image-1718897702804.png',''),(73,22,'2024-06-20',3,1,'image-1718899881350.png',''),(74,22,'2024-06-20',3,1,'image-1718899890781.png',''),(75,22,'2024-06-20',3,1,'image-1718899905849.png',''),(76,22,'2024-06-20',3,1,'image-1718900030827.png',''),(77,3,'2024-06-20',3,1,'image-1718900725513.png',''),(78,3,'2024-06-20',3,1,'image-1718900815911.png',''),(81,1,'2024-06-20',3,1,'image-1718901813698.png','cdsfdsad'),(82,1,'2024-06-20',3,1,'image-1718901863369.png',''),(83,1,'2024-06-20',4,1,'image-1718905741807.png','Changed '),(84,19,'2024-06-21',3,1,'image-1718921895037.png','adewd'),(85,2,'2024-06-21',3,1,'image-1718921947857.png','');
/*!40000 ALTER TABLE `main` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patients`
--

DROP TABLE IF EXISTS `patients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patients` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `gender` enum('Male','Female') DEFAULT NULL,
  `id_right` int DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `fk_patients_rights` (`id_right`),
  CONSTRAINT `fk_patients_rights` FOREIGN KEY (`id_right`) REFERENCES `rights` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patients`
--

LOCK TABLES `patients` WRITE;
/*!40000 ALTER TABLE `patients` DISABLE KEYS */;
INSERT INTO `patients` VALUES (1,'John','Doe','1990-05-15','Male',7),(2,'Jane','Smith','1985-08-20','Female',4),(3,'Michael','Johnson','1978-11-10','Male',5),(4,'Emily','Davis','1995-03-25','Female',NULL),(5,'Robert','Brown','1982-07-18','Male',NULL),(6,'Sarah','Wilson','1989-09-12','Female',NULL),(8,'Jessica','Martinez','1992-06-08','Female',NULL),(9,'Christopher','Anderson','1984-10-30','Male',NULL),(10,'Amanda','Thomas','1987-12-05','Female',NULL),(11,'James','Hernandez','1980-04-22','Male',NULL),(12,'Michelle','Young','1993-11-15','Female',NULL),(13,'Daniel','Garcia','1979-08-03','Male',NULL),(14,'Ashley','Lopez','1986-01-17','Female',NULL),(16,'Emily','Chang','1995-02-01','Female',NULL),(19,'A','Chang','2024-06-01','Female',2),(20,'A','csd','2024-06-01','Male',2),(21,'ds','sfcsdafcds','2024-05-04','Male',2),(22,'Anna','Karenina','1952-03-05','Male',6),(23,'a','b','2024-05-03','Female',3),(24,'A','Chang','1995-02-11','Female',3),(25,'df','hiohoerw','2024-06-06','Female',2),(26,'A','f','2024-06-08','Female',8),(28,'a','e','2024-06-02','Male',9);
/*!40000 ALTER TABLE `patients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rights`
--

DROP TABLE IF EXISTS `rights`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rights` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `is_department` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rights`
--

LOCK TABLES `rights` WRITE;
/*!40000 ALTER TABLE `rights` DISABLE KEYS */;
INSERT INTO `rights` VALUES (1,'ALL_RIGHTS',NULL),(2,'ALL_DEPART',1),(3,'PULM',1),(4,'PULM_1',1),(5,'PULM_2',1),(6,'CARD',1),(7,'PULM_7',1),(8,'PULM_8',1),(9,'PULM_8',1),(10,'',1);
/*!40000 ALTER TABLE `rights` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_rights`
--

DROP TABLE IF EXISTS `user_rights`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_rights` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `id_right` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`id_user`),
  KEY `right_id` (`id_right`),
  CONSTRAINT `user_rights_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`),
  CONSTRAINT `user_rights_ibfk_2` FOREIGN KEY (`id_right`) REFERENCES `rights` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_rights`
--

LOCK TABLES `user_rights` WRITE;
/*!40000 ALTER TABLE `user_rights` DISABLE KEYS */;
INSERT INTO `user_rights` VALUES (4,1,3),(6,1,4),(7,1,5),(19,2,4),(20,2,5),(21,2,6),(25,2,1),(26,4,3),(28,1,7),(36,1,1),(37,1,2),(38,2,2),(39,4,6),(40,4,7),(41,4,8);
/*!40000 ALTER TABLE `user_rights` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin','Admin','admin@vista.com','123'),(2,'Admin','Admin','aadmin@vista.com','$2a$10$VPTU5fmEJ8u1rEEYtA44SeSX1YqmlU7KrltBrp9FiZ7/1IU8xvMdy'),(4,'random','dude','random@dude.com','$2a$10$NFQV0cayGE1SiD28/6WrV.CgqkUg3xNDB2SVYRp1tC2.SYxvy0VDS'),(9,'Medical','Personnel','mpersonnel@vista.com','$2a$10$kw3aWspKgh3e4pmXnlIpKecxXqvws44ha4bHdNr4erPYcvVo9Y12e');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-24 22:08:30
