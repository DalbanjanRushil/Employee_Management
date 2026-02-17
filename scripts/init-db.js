const Database = require('better-sqlite3');
const db = new Database('embroidery.db');

console.log('Initializing database...');

// Workers Table
db.exec(`
  CREATE TABLE IF NOT EXISTS workers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    labour_rate REAL NOT NULL DEFAULT 6.0,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active INTEGER DEFAULT 1
  )
`);

// Work Orders
// status: 'PENDING', 'COMPLETED', 'CHECKED'
db.exec(`
  CREATE TABLE IF NOT EXISTS work_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    worker_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    selling_price REAL NOT NULL,
    labour_rate REAL NOT NULL,
    status TEXT DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    FOREIGN KEY(worker_id) REFERENCES workers(id)
  )
`);

// Materials
db.exec(`
  CREATE TABLE IF NOT EXISTS materials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    worker_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    cost REAL NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(worker_id) REFERENCES workers(id)
  )
`);

console.log('Tables created successfully.');
db.close();
