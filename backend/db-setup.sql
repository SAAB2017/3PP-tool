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
    (id INTEGER, licenseName TEXT NOT NULL, licenseVersion TEXT NOT NULL, dateCreated DATE, lastEdited DATETIME, URL TEXT,
    comment TEXT, licenseType TEXT, UNIQUE(licenseName, licenseVersion) ON CONFLICT ABORT
    PRIMARY KEY (id)
    );
CREATE TABLE "components"
    (id INTEGER, componentName TEXT NOT NULL, componentVersion TEXT NOT NULL, licenseID INTEGER NOT NULL,
	dateCreated DATE, lastEdited DATETIME, comment TEXT, approved INTEGER, approvedBy TEXT, UNIQUE(componentName, componentVersion, licenseID) ON CONFLICT ABORT
    PRIMARY KEY (id),
    FOREIGN KEY (licenseID) REFERENCES licenses(id) ON DELETE CASCADE
    );
CREATE TABLE "products"
    (id INTEGER, productName TEXT NOT NULL, productVersion TEXT NOT NULL, componentID INTEGER NOT NULL,
    dateCreated DATE, lastEdited DATETIME, comment TEXT, approved BIT, approvedBy TEXT, UNIQUE(productName, productVersion, componentID) ON CONFLICT ABORT,
    PRIMARY KEY (id),
    FOREIGN KEY (componentID) REFERENCES components(id) ON DELETE CASCADE
    );
CREATE TABLE "projects"
    (id INTEGER, projectName TEXT, projectVersion TEXT, productID INTEGER NOT NULL,
    dateCreated DATE, lastEdited DATETIME, comment TEXT, approved BIT, approvedBy TEXT, UNIQUE(projectName, projectVersion, productID) ON CONFLICT ABORT,
    PRIMARY KEY (id),
    FOREIGN KEY (productID) REFERENCES products(id) ON DELETE CASCADE
    );
CREATE TABLE "licenseLog"
    (licenseID INTEGER, dateLogged DATE, note TEXT NOT NULL,
    PRIMARY KEY (licenseID),
    FOREIGN KEY (licenseID) REFERENCES licenses(id) ON DELETE CASCADE
    );
CREATE TABLE "componentLog"
    (componentID INTEGER, dateLogged DATE, note TEXT NOT NULL,
    PRIMARY KEY (componentID),
    FOREIGN KEY (componentID) REFERENCES components(id) ON DELETE CASCADE
    );
CREATE TABLE "productLog"
    (productID INTEGER, dateLogged DATE, note TEXT NOT NULL,
    PRIMARY KEY (productID),
    FOREIGN KEY (productID) REFERENCES products(id) ON DELETE CASCADE
    );
CREATE TABLE "projectLog"
    (projectID INTEGER, dateLogged DATE, note TEXT NOT NULL,
    PRIMARY KEY (projectID),
    FOREIGN KEY (projectID) REFERENCES projects(id) ON DELETE CASCADE
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
    (componentName, componentVersion, licenseID, dateCreated, lastEdited, comment,
    approved, approvedBy) VALUES
    ("Test Components", "1.0", 1, 0, 0, "component comment", 1, "component approved by"),
	("Test Components", "1.0", 3, 0, 0, "component comment", 1, "component approved by");
	
/* Products */
INSERT INTO products
    (productName, productVersion, componentID,
    dateCreated, lastEdited, comment, approved, approvedBy) VALUES
    ("Test Products", "1.0", 1, 0, 0, "product comment", 1, "product approved by");

/* Projects */
INSERT INTO projects
    (projectName, projectVersion, productID,
    dateCreated, lastEdited, comment, approved, approvedBy) VALUES
    ("Test Projects", "1.0", 1, 0, 0, "project comment", 1, "project approved by");

/* License Log */
INSERT INTO licenseLog (licenseID, dateLogged, note) VALUES
    (1, 0, "License created");

/* Component Log */
INSERT INTO componentLog (componentID, dateLogged, note) VALUES
    (1, 0, "Component created");

/* Product Log */
INSERT INTO productLog (productID, dateLogged, note) VALUES
    (1, 0, "Product created");

/* Project Log */
INSERT INTO projectLog (projectID, dateLogged, note) VALUES
    (1, 0, "Project created");
	
select * from projects
