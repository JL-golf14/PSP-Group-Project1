
CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	name VARCHAR(120) NOT NULL,
	email VARCHAR(120) NOT NULL,
	address VARCHAR(120),
	likes VARCHAR(800),
	loves VARCHAR(800),
	flags VARCHAR(800),
	active BOOLEAN,
	

);