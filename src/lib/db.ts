import Database from 'better-sqlite3';

// Singleton pattern for database connection to avoid multiple instances in dev
let db: Database.Database;

// Check if we are in production or not
if (process.env.NODE_ENV === 'production') {
    db = new Database('embroidery.db');
} else {
    // In development, attach to global object
    if (!(global as any).db) {
        (global as any).db = new Database('embroidery.db');
    }
    db = (global as any).db;
}

export default db;
