CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
item_id INT AUTO_INCREMENT NOT NULL,
product_name VARCHAR(30) NOT NULL,
department_name VARCHAR(30) NOT NULL,
price INT NOT NULL,
stock_quantity INT NOT NULL,
PRIMARY KEY (item_id));

SELECT * FROM products;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("TV", "Electronics", 500, 100),
("Fridge", "Appliances", 500, 100),
("Washer", "Appliances", 600, 100),
("Dryer", "Appliances", 600, 100),
("Playstation", "Gaming", 300, 100),
("Xbox", "Gaming", 300, 100),
("Nintendo Switch", "Gaming", 200, 100),
("Laptop", "Electronics", 500, 100),
("Cell Phone", "Electronics", 600, 100),
("Power Bank", "Electronics", 50, 100);