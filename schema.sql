-- 1. Create a MySQL Database called `bamazon`.

DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

-- 2. Then create a Table inside of that database called `products`.
-- 3. The products table should have each of the following columns:
--  	* item_id (unique id for each product)
-- 		* product_name (Name of product)
--   	* department_name
--   	* price (cost to customer)
-- 		* stock_quantity (how much of the product is available in stores)
-- 		Challenge #3: Supervisor View (Final Level)
-- 			2. Modify the products table so that there's a product_sales column

CREATE TABLE products (
	id INT NOT NULL AUTO_INCREMENT,
	product_name VARCHAR(100) NOT NULL,
	department_name VARCHAR (50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
	stock_quantity INT(10) NOT NULL,
    product_sales DECIMAL(10,2) NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
);

-- 4. Populate this database with around 10 different products. (i.e. Insert "mock" data rows into this database and table).

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("The Venture Bros. Seasons 1-6 DVD" , "DVD/Blu-ray" , 109.99 , 7);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Go Team Venture!: The Art And Making Of The Venture Bros." , "Books" , 39.99 , 8);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Star Wars - The Complete Saga Episodes I-VI Blu-ray" , "DVD/Blu-ray" , 67.99 , 3);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("The Making Of Star Wars: The Definitive Story Behind The Original Film" , "Books" , 81.25 , 5);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Star Wars: A New Hope (Original Motion Picture Soundtrack) Vinyl" , "Vinyl Albums" , 79.12 , 4);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Solid State by Matt Fraction" , "Books" , 27.54 , 9);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Solid State by Jonathan Coulton" , "Vinyl Albums" , 28.49 , 2);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Dungeons And Dragons Art And Arcana: A Visual History" , "Books" , 50.00 , 7);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Dungeons And Dragons: The Complete Animated Series DVD" , "DVD/Blu-ray" , 22.99 , 11);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Led Zeppelin IV Remastered Original" , "Vinyl Albums" , 23.80 , 15);

SELECT * FROM products;

-- Challenge #3: Supervisor View (Final Level)

-- 1. Create a new MySQL table called `departments`. Your table should include the following columns:
--   	* department_id
--   	* department_name
--   	* over_head_costs (A dummy number you set for each department)

CREATE TABLE departments (
	id INT NOT NULL AUTO_INCREMENT,
	department_name VARCHAR (50) NOT NULL,
    over_head_costs DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("DVD/Blu-ray" , 1000);
INSERT INTO departments (department_name, over_head_costs)
VALUES ("Books" , 1500);
INSERT INTO departments (department_name, over_head_costs)
VALUES ("Vinyl Albums" , 900);

SELECT * FROM departments;