/* Drop tables */
DROP TABLE IF EXISTS projectLog;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS productLog;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS componentLog;
DROP TABLE IF EXISTS components;
DROP TABLE IF EXISTS licenseLog;
DROP TABLE IF EXISTS licenses;
DROP TABLE IF EXISTS Accounts;

/* Create tables */
CREATE TABLE "Accounts"
	(accountID TEXT PRIMARY KEY UNIQUE, password TEXT NOT NULL, name TEXT, email TEXT);
CREATE TABLE "licenses"
    (licenseName TEXT, licenseVersion TEXT, dateCreated DATE, lastEdited DATETIME, URL TEXT,
    comment TEXT, licenseType TEXT,
    PRIMARY KEY (licenseName, licenseVersion)
    );
CREATE TABLE "components"
    (componentName TEXT, componentVersion TEXT, licenseName TEXT UNIQUE, licenseVersion TEXT UNIQUE,
    dateCreated DATE, lastEdited DATETIME, comment TEXT, approved BIT, approvedBy TEXT,
    PRIMARY KEY (componentName, componentVersion),
    FOREIGN KEY (licenseName, licenseVersion) REFERENCES licenses(licenseName, licenseVersion) ON DELETE CASCADE
    );
CREATE TABLE "products"
    (productName TEXT, productVersion TEXT, componentName TEXT UNIQUE, componentVersion TEXT UNIQUE,
    dateCreated DATE, lastEdited DATETIME, comment TEXT, approved BIT, approvedBy TEXT,
    PRIMARY KEY (productName, productVersion),
    FOREIGN KEY (componentName, componentVersion) REFERENCES components(componentName, componentVersion) ON DELETE CASCADE
    );
CREATE TABLE "projects"
    (projectName TEXT, projectVersion TEXT, productName TEXT UNIQUE, productVersion TEXT UNIQUE,
    dateCreated DATE, lastEdited DATETIME, comment TEXT, approved BIT, approvedBy TEXT,
    PRIMARY KEY (projectName, projectVersion),
    FOREIGN KEY (productName, productVersion) REFERENCES products(productName, productVersion) ON DELETE CASCADE
    );
CREATE TABLE "licenseLog"
    (licenseName TEXT, licenseVersion TEXT, dateLogged DATE, note TEXT NOT NULL,
    PRIMARY KEY (licenseName, licenseVersion),
    FOREIGN KEY (licenseName, licenseVersion) REFERENCES licenses(licenseName, licenseVersion) ON DELETE CASCADE
    );
CREATE TABLE "componentLog"
    (componentName TEXT, componentVersion TEXT, dateLogged DATE, note TEXT NOT NULL,
    PRIMARY KEY (componentName, componentVersion),
    FOREIGN KEY (componentName, componentVersion) REFERENCES components(componentName, componentVersion) ON DELETE CASCADE
    );
CREATE TABLE "productLog"
    (productName TEXT, productVersion TEXT, dateLogged DATE, note TEXT NOT NULL,
    PRIMARY KEY (productName, productVersion),
    FOREIGN KEY (productName, productVersion) REFERENCES products(productName, productVersion) ON DELETE CASCADE
    );
CREATE TABLE "projectLog"
    (projectName TEXT, projectVersion TEXT, dateLogged DATE, note TEXT NOT NULL,
    PRIMARY KEY (projectName, projectVersion),
    FOREIGN KEY (projectName, projectVersion) REFERENCES projects(projectName, projectVersion) ON DELETE CASCADE
    );

/* Accounts */
INSERT INTO Accounts (accountID, password, name, email) VALUES
	("admin", "admin", "admin", "admin@admin.com"),
	("markus", "markus", "markus", "nat13msk@student.lu.se");

/* Licenses */
INSERT INTO licenses (licenseName, licenseVersion, dateCreated, lastEdited, URL, comment, licenseType) VALUES
	("Test License", "1.01", 0, 0, "www.detfungerar.com", "hello world!", "License type"),
    ("Test License1", "1.1", 0, 0, "www.detfungerar.com", "hello world!", "License type1"),
    ("Test License1", "1.2", 0, 0, "www.detfungerar.com", "hello world!", "License type1"),
    ("Test License2", "1.1", 0, 0, "www.detfungerar.com", "hello world!", "License type");

/* Components */
INSERT INTO components
    (componentName, componentVersion, licenseName, licenseVersion, dateCreated, lastEdited, comment,
    approved, approvedBy) VALUES
    ("Test Components", "1.0", "Test License", "1.01", 0, 0, "component comment", 1, "component approved by");

/* Products */
INSERT INTO products
    (productName, productVersion, componentName, componentVersion,
    dateCreated, lastEdited, comment, approved, approvedBy) VALUES
    ("Test Products", "1.0", "Test Components", "1.0", 0, 0, "product comment", 1, "product approved by");

/* Projects */
INSERT INTO projects
    (projectName, projectVersion, productName, productVersion,
    dateCreated, lastEdited, comment, approved, approvedBy) VALUES
    ("Test Projects", "1.0", "Test Products", "1.0", 0, 0, "project comment", 1, "project approved by");

/* License Log */
INSERT INTO licenseLog (licenseName, licenseVersion, dateLogged, note) VALUES
    ("Test License", "1.01", 0, "License created");

/* Component Log */
INSERT INTO componentLog (componentName, componentVersion, dateLogged, note) VALUES
    ("Test Components", "1.0", 0, "Component created");

/* Product Log */
INSERT INTO productLog (productName, productVersion, dateLogged, note) VALUES
    ("Test Products", "1.0", 0, "Product created");

/* Project Log */
INSERT INTO projectLog (projectName, projectVersion, dateLogged, note) VALUES
    ("Test Projects", "1.0", 0, "Project created");
