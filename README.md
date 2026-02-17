# Embroidery Production Manager

A mobile-first admin dashboard for tracking embroidery production, worker wages, and business profit.

## Quick Start

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Initialize Database (Local SQLite)**
    Creates the local `embroidery.db` file and tables.
    ```bash
    node scripts/init-db.js
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000).

## ⚠️ Important Note
This application currently uses **SQLite** for local development.
To switch to **MongoDB**:
1.  Update `.env` with your full `MONGODB_URI` (currently missing the Cluster URL).
2.  Install Mongoose: `npm install mongoose`.
3.  Update `src/lib/db.ts` to use Mongoose connection.

## Features

- **Dashboard**: Real-time overview of today's production & profit.
- **Workers**: Manage staff and track their individual performance.
- **Work Orders**: Assign jobs, track status (Pending -> Completed), and calculate labour costs.
- **Materials**: Log material usage (Thread, Oil, etc.) to automatically deduct from worker pay.
- **Ledger**: One-click monthly report for Business Profit and Net Payable Salaries.
