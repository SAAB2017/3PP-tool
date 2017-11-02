/* Drop tables */
DROP TABLE IF EXISTS components;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS projects;

/* Create tables */
CREATE TABLE "components"
	(id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE, component TEXT NOT NULL, version TEXT NOT NULL);
CREATE TABLE "products"
	(id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE, product TEXT NOT NULL, version TEXT NOT NULL);
CREATE TABLE "projects"
	(id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE, project TEXT NOT NULL, version TEXT NOT NULL);

/* Components */
INSERT INTO components (component, version) VALUES
    ("AJAX Control Toolkit", "16.1.0.0"),
    ("Spectrum Colorpicker", "1.8.0"),
	("Leaflet", "0.5");

/* Products */
INSERT INTO products (product, version) VALUES
    ("AKKA", "6.0"),
	("WISE", "6.0");

/* Projets */
INSERT INTO projects (project, version) VALUES
    ("ATSsim", "1.0");
