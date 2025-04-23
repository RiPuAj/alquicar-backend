
USE alquicardb;

DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS incidences;
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS vehicles;
DROP TABLE IF EXISTS vehicles_models;
DROP TABLE IF EXISTS vehicles_brands;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS users;
DROP TABLE IF exists vehicles_models;
DROP TABLE IF exists vehicles_brands;



CREATE TABLE users(
	id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(72) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(9) NOT NULL UNIQUE,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW(),
    dni VARCHAR(9) NOT NULL UNIQUE
    );

    -- Crear tabla de sesiones
    CREATE TABLE sessions (
    sessionid VARCHAR(512) NOT NULL,              -- jwebtoken, suele ser una cadena larga
    user_id BINARY(16) NOT NULL,                     -- id del usuario, referencia a otra tabla
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- fecha de creación automática
    expires_at DATETIME NOT NULL,             -- fecha de caducidad

    PRIMARY KEY (sessionid),                      -- asumiendo que el token es único
    FOREIGN KEY (user_id) REFERENCES users(id) -- referencia a la tabla de usuarios
);
    CREATE INDEX idx_sessions_sessionid ON sessions (sessionid);


CREATE TABLE vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id BINARY(16) NOT NULL,
    brand VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    latitude DECIMAL(8,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    year YEAR NOT NULL,
    type ENUM('Sedan', 'SUV', 'Truck', 'Sports', 'Hatchback', 'Convertible') NOT NULL,
    transmission ENUM('Manual', 'Automatic') NOT NULL,
    fuel_type ENUM('Gasoline', 'Diesel', 'Electric', 'Hybrid') NOT NULL,
    capacity INT NOT NULL,
    num_doors INT NOT NULL,
    daily_price DECIMAL(10,2) NOT NULL,
    deposit DECIMAL (10,2),
    availability BOOLEAN DEFAULT TRUE, 
    registration_date TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (brand_id) REFERENCES vehicles_brands(id) ON DELETE CASCADE,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (model_id) REFERENCES vehicles_models(id) ON DELETE CASCADE
);

  CREATE TABLE sessions (
    sessionid VARCHAR(512) NOT NULL,              -- jwebtoken, suele ser una cadena larga
    user_id BINARY(16) NOT NULL,                     -- id del usuario, referencia a otra tabla
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- fecha de creación automática
    expires_at DATETIME NOT NULL,             -- fecha de caducidad

    PRIMARY KEY (sessionid),                      -- asumiendo que el token es único
    FOREIGN KEY (user_id) REFERENCES users(id) -- referencia a la tabla de usuarios
);
    CREATE INDEX idx_sessions_sessionid ON sessions (sessionid);
    
CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    customer_id BINARY(16) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status ENUM('Pending', 'Confirmed', 'Cancelled', 'Completed') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE incidences (
	id INT AUTO_INCREMENT PRIMARY KEY,
    from_id BINARY(16) NOT NULL,
    to_id BINARY(16) NULL,
    reservation_id INT NULL,
    description TEXT NOT NULL,
    type ENUM('USER', 'PLATFORM') NOT NULL,
    status ENUM('Pending', 'In Review', 'Resolved', 'Dismissed') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (from_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (to_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE
);

CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    from_id BINARY(16) NOT NULL,
    to_id BINARY(16) NOT NULL,
    content TEXT NOT NULL,
    status ENUM('Sent', 'Delivered', 'Read') DEFAULT 'Sent',
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (from_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (to_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reservation_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL, -- Monto del pago
    payment_method ENUM('Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer', 'Cash') NOT NULL, -- Método de pago
    payment_status ENUM('Pending', 'Completed', 'Failed', 'Refunded') DEFAULT 'Pending', -- Estado del pago
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transaction_id VARCHAR(255) NULL,
    FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE
);

-- Insertar valores marcas de coche
INSERT INTO vehicles_brands (name) VALUES 
('Toyota'),
('Ford'),
('BMW'),
('Honda'),
('Chevrolet'),
('Mercedes-Benz'),
('Audi'),
('Nissan'),
('Volkswagen'),
('Hyundai'),
('Kia'),
('Peugeot'),
('Mazda'),
('Subaru'),
('Renault'),
('Fiat'),
('Porsche'),
('Lexus'),
('Chrysler'),
('Dodge'),
('Jeep'),
('Tesla'),
('Land Rover'),
('Jaguar'),
('Ferrari'),
('Lamborghini'),
('Aston Martin'),
('Maserati'),
('Bentley'),
('Rolls-Royce'),
('McLaren');


-- INSERTAR VALORES DE ALGUNAS MARCAS
-- Insertar Modelos para la Marca 'Toyota' (brand_id = 1)
INSERT INTO vehicles_models (model, brand_id) VALUES
('Corolla', 1),
('Camry', 1),
('RAV4', 1),
('Mustang', 2),
('F-150', 2),
('Explorer', 2),
('X5', 3),
('3 Series', 3),
('M3', 3),
('Civic', 4),
('Accord', 4),
('CR-V', 4),
('Camaro', 5),
('Tahoe', 5),
('Equinox', 5);



-- Insertar usuarios
use alquicardb;
INSERT INTO users (id, name, email, password, address, phone, role, dni) 
VALUES (UUID_TO_BIN('123e4567-e89b-12d3-a456-426614174000'),'John Doe', 'john.doe@example.com','1234', '123 Main St, Cityville', '123456790', 'user', '12345678B'),
(UUID_TO_BIN('234e4567-e89b-12d3-a456-426614174111'),'Alice Smith', 'alice.smith@example.com','4567', '456 Oak Ave, Townsville', '098765321', 'admin', '23456789A'),
(UUID_TO_BIN('345e4567-e89b-12d3-a456-426614174222'),'Bob Johnson', 'bob.johnson@example.com','124421', '789 Pine Rd, Villagetown', '112334455', 'user', '34567890J');

-- Insertar vehiculos

<<<<<<< HEAD
INSERT INTO vehicles (owner_id, brand, model, latitude, longitude, year, type, transmission, fuel_type, capacity, num_doors, daily_price, availability) 
VALUES 
(UUID_TO_BIN('123e4567-e89b-12d3-a456-426614174000'), 'Hyundai', 'Tucson', 12.3856, -45.9273, 2022, 'Sedan', 'Automatic', 'Gasoline', 5, 3, 45.00, TRUE),
(UUID_TO_BIN('234e4567-e89b-12d3-a456-426614174111'), 'Citroën', 'Saxo', -33.7421, 151.1194, 2006, 'Sports', 'Manual', 'Gasoline', 2, 4, 80.00, TRUE),
(UUID_TO_BIN('345e4567-e89b-12d3-a456-426614174222'), 'Nissan', 'Qashqai', 48.2163, 16.4027, 2023, 'SUV', 'Automatic', 'Diesel', 7, 5,120.00, TRUE);
=======
INSERT INTO vehicles (owner_id, brand_id, model_id, year, type, transmission, fuel_type, capacity, num_doors, daily_price, availability) 
VALUES 
(UUID_TO_BIN('123e4567-e89b-12d3-a456-426614174000'), 1, 1, 2022, 'Sedan', 'Automatic', 'Gasoline', 5, 3, 45.00, TRUE),
(UUID_TO_BIN('234e4567-e89b-12d3-a456-426614174111'), 2, 4, 2021, 'Sports', 'Manual', 'Gasoline', 2, 4, 80.00, TRUE),
(UUID_TO_BIN('345e4567-e89b-12d3-a456-426614174222'), 3, 7, 2023, 'SUV', 'Automatic', 'Diesel', 7, 5,120.00, TRUE);
>>>>>>> c76247e801906379cf3ca87c4ea91e2120c7a9d3

-- INSERTAR RESERVAS
INSERT INTO reservations (vehicle_id, customer_id, start_date, end_date, total_price, status) 
VALUES 
(1, UUID_TO_BIN('123e4567-e89b-12d3-a456-426614174000'), '2023-04-01 10:00:00', '2023-04-07 10:00:00', 315.00, 'Confirmed'),
(2, UUID_TO_BIN('234e4567-e89b-12d3-a456-426614174111'), '2023-05-10 09:00:00', '2023-05-12 09:00:00', 240.00, 'Pending'),
(3, UUID_TO_BIN('345e4567-e89b-12d3-a456-426614174222'), '2023-06-15 14:00:00', '2023-06-20 14:00:00', 600.00, 'Cancelled');

-- Insertar Sesion para probar
INSERT INTO Sesion (vehicle_id, customer_id, start_date, end_date, total_price, status) 
VALUES 
(1, UUID_TO_BIN('123e4567-e89b-12d3-a456-426614174000'), '2023-04-01 10:00:00', '2023-04-07 10:00:00', 315.00, 'Confirmed'),
(2, UUID_TO_BIN('234e4567-e89b-12d3-a456-426614174111'), '2023-05-10 09:00:00', '2023-05-12 09:00:00', 240.00, 'Pending'),
(3, UUID_TO_BIN('345e4567-e89b-12d3-a456-426614174222'), '2023-06-15 14:00:00', '2023-06-20 14:00:00', 600.00, 'Cancelled');


-- Observamos que se han insertado bien
SELECT * FROM vehicles_brands;
SELECT * FROM vehicles_models;
SELECT * FROM users;
SELECT * FROM vehicles;
SELECT * FROM reservations;