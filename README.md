# Embroidery Production Manager

A mobile-first admin dashboard for tracking embroidery production, worker wages, and business profit.

## Quick Start

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Initialize Database**
    Creates the local `embroidery.db` file and tables.
    ```bash
    node scripts/init-db.js
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) on your mobile or desktop.

## Features

- **Dashboard**: Real-time overview of today's production & profit.
- **Workers**: Manage staff and track their individual performance.
- **Work Orders**: Assign jobs, track status (Pending -> Completed), and calculate labour costs.
- **Materials**: Log material usage (Thread, Oil, etc.) to automatically deduct from worker pay.
- **Ledger**: One-click monthly report for Business Profit and Net Payable Salaries.

## Development Notes

- **Database**: The app uses `better-sqlite3`. The database file `embroidery.db` is created in the project root.
- **Backup**: Simply copy `embroidery.db` to back up your data.
- **Reset**: Delete `embroidery.db` and run `node scripts/init-db.js` to start fresh.

## Project Structure

- `src/app`: Next.js App Router pages.
- `src/lib/db.ts`: Database connection.
- `src/lib/actions.ts`: Server Actions (Mutations).
- `src/lib/data.ts`: Data Fetching.
