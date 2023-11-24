CREATE DATABASE IF NOT EXISTS volkosfooddb;
USE volkosfooddb;
CREATE TABLE food (
    id INT(11) NOT NULL AUTO_INCREMENT,
    name VARCHAR(45) NOT NULL,
    image VARCHAR(300),
    quantity INT(100) NOT NULL,
    market VARCHAR(20) NOT NULL,
    storage VARCHAR(20) NOT NULL,
    type VARCHAR(20) NOT NULL,
    taste VARCHAR(20) NOT NULL,
    healthy BOOLEAN NOT NULL,
    few_left BOOLEAN NOT NULL,
    due_date DATE,
    market_limit INT(10) NOT NULL,
    diet_limit INT(10),
    PRIMARY KEY (id)
);
DESCRIBE food;
INSERT INTO food
VALUES (
        1,
        'manzana verde',
        'green-apple.png',
        1,
        'verduleria',
        'heladera',
        'fruta',
        'dulce',
        1,
        1,
        null,
        1,
        null
    ),
    (
        2,
        'zanahoria',
        'carrot.png',
        2,
        'verduleria',
        'heladera',
        'verdura',
        'salado',
        1,
        0,
        null,
        0,
        null
    ),
    (
        3,
        'tomate',
        'tomato.png',
        3,
        'verduleria',
        'heladera',
        'verdura',
        'salado',
        1,
        0,
        null,
        1,
        null
    );