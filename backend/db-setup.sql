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
    approved BIT DEFAULT 0,
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
	("GNU AGPL", "3.0", "2017-10-01", "2017-10-01", "https://www.gnu.org/licenses/agpl-3.0.en.html", "GNU Affero General Public License", "Open source license"),
    ("GNU GPL", "3.0", "2017-10-05", "2017-10-05", "https://www.gnu.org/licenses/gpl-3.0.en.html", "GNU General Public License", "Open source license"),
    ("GNU LGPL", "3.0", "2017-10-10", "2017-10-10", "https://www.gnu.org/licenses/lgpl-3.0.en.html", "GNU Lesser General Public License", "Open source license"),
    ("Mozilla Public License", "2.0", "2017-10-15", "2017-10-15", "https://www.mozilla.org/en-US/MPL/2.0/", NULL, "Open source license"),
    ("Apache License", "2.0", "2017-10-20", "2017-10-15", "https://www.mozilla.org/en-US/MPL/2.0/", NULL, "Open source license"),
    ("MIT License", "1.0", "2017-10-20", "2017-10-20", "https://opensource.org/licenses/MIT/", NULL, "Open source license"),
    ("CMU License", "1.0", "2017-10-25", "2017-10-25", "https://spdx.org/licenses/MIT-CMU.html", NULL, "Open source license"),
    ("SIL OFL", "1.1", "2017-10-30", "2017-10-30", "http://scripts.sil.org/OFL", NULL, "Open source license"),
    ("BSD 3-clause", "1.0", "2017-11-01", "2017-11-01", "https://opensource.org/licenses/BSD-3-Clause", NULL, "Open source license"),
    ("The Unlicense", "1.0", "2017-10-25", "2017-10-25", "https://choosealicense.com/licenses/unlicense/", NULL, "Open source license");

/* Components */
INSERT INTO components (componentName, componentVersion, dateCreated, lastEdited, comment, approved, approvedBy) VALUES
    ("vue", "2.5.2", "2017-11-01", "2017-11-01", "The Progressive JavaScript Framework.", "1", "Nils Nilsson"),
    ("node", "9.2.0", "2017-11-03", "2017-11-03", "The Progressive JavaScript Framework.", "1", "Nils Nilsson"),
    ("axios", "0.17.0", "2017-11-04", "2017-11-04", "Promise based HTTP client for the browser and node.js.", "1", "Nils Nilsson"),
    ("bulma", "0.6.0", "2017-11-05", "2017-11-05", "Modern CSS framework based on Flexbox.", "1", "Nils Nilsson"),
    ("cors", "2.8.4", "2017-11-06", "2017-11-06", "CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.", "1", "Nils Nilsson"),
    ("es6-promise", "4.1.1", "2017-11-07", "2017-11-07", "A polyfill for ES6-style Promises.", "1", "Nils Nilsson"),
    ("font-awesome", "4.7.0", "2017-11-08", "2017-11-08", "The iconic font and CSS toolkit.", "1", "Nils Nilsson"),
    ("npm-watch", "0.3.0", "2017-11-09", "2017-11-09", "Run scripts from package.json when files change.", "1", "Nils Nilsson"),
    ("polyfill-io-feature-detection", "1.1.14", "2017-11-10", "2017-11-10", "Feature detection in the browser before loading polyfill using services like polyfill.io.", "1", "Nils Nilsson"),
    ("sqlite3", "3.1.13", "2017-11-11", "2017-11-11", "Asynchronous, non-blocking SQLite3 bindings for Node.js.", "0", "Nils Nilsson"),
    ("vue-axios", "2.0.2", "2017-11-12", "2017-11-12", "A small wrapper for integrating axios to Vuejs", "0", "Nils Nilsson"),
    ("vue-router", "3.0.1", "2017-11-13", "2017-11-13", "This is vue-router, the official router for Vue.js. It deeply integrates with Vue.js core to make building Single Page Applications with Vue.js a breeze.", "0", "Nils Nilsson");

/* Products */
INSERT INTO products
    (productName, productVersion, dateCreated, lastEdited, comment, approved, approvedBy) VALUES
    ("Third-Party License Management REST API", "1.0", "2017-11-20", "2017-11-20", "Third party handler Rest API for handling licenses.", "1", "Nils Nilsson"),
    ("Third-Party License Management WUI", "1.0", "2017-11-20", "2017-11-20", "Third party handler Rest API for handling licenses.", "1", "Nils Nilsson");

/* Projects */
INSERT INTO projects
    (projectName, projectVersion, dateCreated, lastEdited, comment, approved, approvedBy) VALUES
    ("3PP Management Tool", "1.0", "2017-11-21", "2017-11-21", "License manager solution for SAAB.", "1", "Nils Nilsson");

/* License Log */
INSERT INTO licenseLog (licenseID, dateLogged, note) VALUES
    (1, 0, "License created."),
    (2, 0, "License created."),
	  (3, 0, "License created."),
	  (4, 0, "License created."),
	  (5, 0, "License created."),
	  (6, 0, "License created."),
	  (7, 0, "License created."),
	  (8, 0, "License created."),
	  (9, 0, "License created."),
	  (10, 0, "License created.");

/* Component Log */
INSERT INTO componentLog (componentID, dateLogged, note) VALUES
    (1, 0, "Component created."),
    (2, 0, "Component created."),
    (3, 0, "Component created."),
    (4, 0, "Component created."),
    (5, 0, "Component created."),
    (6, 0, "Component created."),
    (7, 0, "Component created."),
    (9, 0, "Component created."),
    (9, 0, "Component created."),
    (10, 0, "Component created."),
    (11, 0, "Component created."),
    (12, 0, "Component created.");

/* Product Log */
INSERT INTO productLog (productID, dateLogged, note) VALUES
    (1, 0, "Product created."),
    (2, 0, "Product created.");

/* Project Log */
INSERT INTO projectLog (projectID, dateLogged, note) VALUES
    (1, 0, "Project created.");

INSERT INTO licensesInComponents (licenseID, componentID) VALUES
    (6, 1),
    (6, 2),
    (7, 2),
    (6, 3),
    (6, 4),
    (6, 5),
    (6, 6),
    (8, 7),
    (6, 8),
    (6, 9),
    (9, 10),
    (6, 11),
    (6, 12);

INSERT INTO componentsInProducts (componentID, productID) VALUES
    (2, 1),
    (8, 1),
    (10, 1),
    (1, 2),
    (2, 2),
    (3, 2),
    (4, 2),
    (5, 2),
    (6, 2),
    (7, 2),
    (8, 2),
    (9, 2),
    (11, 2),
    (12, 2);

INSERT INTO productsInProjects (productID, projectID) VALUES
    (1, 1),
    (2, 1);
