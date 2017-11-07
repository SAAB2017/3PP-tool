/* Drop tables */
DROP TABLE IF EXISTS productsInProjects;
DROP TABLE IF EXISTS componentsInProducts;
DROP TABLE IF EXISTS licensesInComponents;
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
CREATE TABLE "Accounts" (
    accountID TEXT PRIMARY KEY UNIQUE,
    password TEXT NOT NULL,
    name TEXT,
    email TEXT
    );

CREATE TABLE "licenses" (
    id INTEGER,
    licenseName TEXT NOT NULL,
    licenseVersion TEXT NOT NULL,
    dateCreated DATE,
    lastEdited DATETIME,
    URL TEXT,
    comment TEXT,
    licenseType TEXT,
    UNIQUE(licenseName, licenseVersion) ON CONFLICT ABORT
    PRIMARY KEY (id)
    );

CREATE TABLE "licensesInComponents" (
    id INTEGER,
    licenseID INTEGER NOT NULL,
    componentID INTEGER NOT NULL,
    UNIQUE(licenseID, componentID) ON CONFLICT ABORT,
    PRIMARY KEY (id),
    FOREIGN KEY (licenseID) REFERENCES licenses(id) ON DELETE CASCADE,
    FOREIGN KEY (componentID) REFERENCES components(id) ON DELETE CASCADE
    );

CREATE TABLE "components" (
    id INTEGER,
    componentName TEXT NOT NULL,
    componentVersion TEXT NOT NULL,
    dateCreated DATE,
    lastEdited DATETIME,
    comment TEXT,
    approved BIT,
    approvedBy TEXT,
    UNIQUE(componentName, componentVersion) ON CONFLICT ABORT
    PRIMARY KEY (id)
    );

CREATE TABLE "componentsInProducts" (
    id INTEGER,
    componentID INTEGER NOT NULL,
    productID INTEGER NOT NULL,
    UNIQUE(componentID, productID) ON CONFLICT ABORT,
    PRIMARY KEY (id),
    FOREIGN KEY (componentID) REFERENCES components(id) ON DELETE CASCADE,
    FOREIGN KEY (productID) REFERENCES products(id) ON DELETE CASCADE
    );

CREATE TABLE "products" (
    id INTEGER,
    productName TEXT NOT NULL,
    productVersion TEXT NOT NULL,
    dateCreated DATE,
    lastEdited DATETIME,
    comment TEXT,
    approved BIT,
    approvedBy TEXT,
    UNIQUE(productName, productVersion) ON CONFLICT ABORT,
    PRIMARY KEY (id)
    );

CREATE TABLE "productsInProjects" (
    id INTEGER,
    productID INTEGER NOT NULL,
    projectID INTEGER NOT NULL,
    UNIQUE(productID, projectID) ON CONFLICT ABORT,
    PRIMARY KEY (id),
    FOREIGN KEY (productID) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (projectID) REFERENCES projects(id) ON DELETE CASCADE
    );

CREATE TABLE "projects" (
    id INTEGER,
    projectName TEXT NOT NULL,
    projectVersion TEXT NOT NULL,
    dateCreated DATE,
    lastEdited DATETIME,
    comment TEXT,
    approved BIT,
    approvedBy TEXT,
    UNIQUE(projectName, projectVersion) ON CONFLICT ABORT,
    PRIMARY KEY (id)
    );

CREATE TABLE "licenseLog" (
    id INTEGER,
    licenseID INTEGER NOT NULL,
    dateLogged DATE,
    note TEXT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (licenseID) REFERENCES licenses(id) ON DELETE CASCADE
    );

CREATE TABLE "componentLog" (
    id INTEGER,
    componentID INTEGER NOT NULL,
    dateLogged DATE,
    note TEXT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (componentID) REFERENCES components(id) ON DELETE CASCADE
    );

CREATE TABLE "productLog" (
    id INTEGER,
    productID INTEGER NOT NULL,
    dateLogged DATE,
    note TEXT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (productID) REFERENCES products(id) ON DELETE CASCADE
    );

CREATE TABLE "projectLog" (
    id INTEGER,
    projectID INTEGER NOT NULL,
    dateLogged DATE,
    note TEXT NOT NULL,
    PRIMARY KEY (id),
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
    (componentName, componentVersion, dateCreated, lastEdited, comment) VALUES
    ("Test Components", "1.0", 0, 0, "component comment");

/* Products */
INSERT INTO products
    (productName, productVersion,
    dateCreated, lastEdited, comment) VALUES
    ("Test Products", "1.0", 0, 0, "product comment");

/* Projects */
INSERT INTO projects
    (projectName, projectVersion,
    dateCreated, lastEdited, comment) VALUES
    ("Test Projects", "1.0", 0, 0, "project comment");

/* License Log */
INSERT INTO licenseLog (licenseID, dateLogged, note) VALUES
    (1, 0, "License created."),
    (2, 0, "License created."),
	  (3, 0, "License created."),
	  (4, 0, "License created.");

/* Component Log */
INSERT INTO componentLog (componentID, dateLogged, note) VALUES
    (1, 0, "Component created.");

/* Product Log */
INSERT INTO productLog (productID, dateLogged, note) VALUES
    (1, 0, "Product created.");

/* Project Log */
INSERT INTO projectLog (projectID, dateLogged, note) VALUES
    (1, 0, "Project created.");

INSERT INTO licensesInComponents (licenseID, componentID) VALUES
    (1, 1);

INSERT INTO componentsInProducts (componentID, productID) VALUES
    (1, 1);

INSERT INTO productsInProjects (productID, projectID) VALUES
    (1, 1);
