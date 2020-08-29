-- CREATE TABLES 
CREATE TABLE essential_nutrient_group (
	id_essengroup SERIAL PRIMARY KEY,
	group_name VARCHAR(100) NOT NULL);

SELECT * FROM essential_nutrient_group;

CREATE TABLE food_category (
	id_category SERIAL PRIMARY KEY,
	desc_category VARCHAR(100) NOT NULL);

SELECT * FROM food_category;

CREATE TABLE essential_nutrients (
	id_nutrient SERIAL PRIMARY KEY,
	id_essengroup INT NOT NULL,
	nutrient_Name VARCHAR(50) NOT NULL,
	FOREIGN KEY (id_essengroup) REFERENCES essential_nutrient_group(id_essengroup));

SELECT * FROM essential_nutrients;

CREATE TABLE interesting_facts (
	id_nutrient INT NOT NULL,
	int_fact VARCHAR(5000) NOT NULL,
	FOREIGN KEY (id_nutrient) REFERENCES essential_nutrients(id_nutrient));

SELECT * FROM interesting_facts;

CREATE TABLE food_catalog (
	id_food SERIAL PRIMARY KEY,
	food_desc VARCHAR(200) NOT NULL);

CREATE TABLE food_tbl (
	id_foodtbl SERIAL PRIMARY KEY,
	id_food INT NOT NULL,
	id_category INT NOT NULL,
	id_nutrient INT NOT NULL,
	nutrient_amount FLOAT,
	FOREIGN KEY (id_category) REFERENCES food_category(id_category),
	FOREIGN KEY (id_food) REFERENCES food_catalog(id_food),
	FOREIGN KEY (id_nutrient) REFERENCES essential_nutrients(id_nutrient));
	


SELECT * FROM food_tbl;



