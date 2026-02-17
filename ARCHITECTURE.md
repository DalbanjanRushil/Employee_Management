# System Architecture

## Overview
This application is a **Next.js 14+ (App Router)** based admin panel designed for mobile-first usage. It utilizes **SQLite** for local data persistence, ensuring zero-latency operations and full data ownership without cloud dependencies initially.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Mobile-optimized utility classes)
- **Database**: SQLite (via `better-sqlite3`)
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Key Modules

### 1. Database Layer (`src/lib/db.ts`)
- Uses `better-sqlite3` for synchronous, high-performance local queries.
- **Singleton Pattern**: Ensures only one database connection is active during development hot-reloading.
- **Initialization**: `scripts/init-db.js` handles table creation (Workers, WorkOrders, Materials).

### 2. Data Access (`src/lib/data.ts`)
- Contains all **Server-Side** data fetching logic.
- Uses **Prepared Statements** for security and performance.
- Directly returns typed objects to React Server Components.

### 3. Mutations (`src/lib/actions.ts`)
- **Server Actions**: All form submissions and state updates (e.g., `createWorker`, `markWorkStatus`) happen via Server Actions.
- **Revalidation**: Automatic cache invalidation (`revalidatePath`) ensures UI is always in sync with DB.

### 4. UI Components (`src/components/*`)
- **BottomNav**: Persistent mobile navigation.
- **WorkStatusUpdater**: Client component for interactive status toggling with optimistic UI patterns.
- **Tailwind**: Used for all styling, focusing on touch targets (44px+) and readable typography.

## Mobile-First Design Principles
- **Touch Targets**: All buttons and inputs are sized for thumbs.
- **Navigation**: Bottom tab bar for easy one-handed access.
- **Visual Hierarchy**: Critical numbers (Profit, Pending) are large and high-contrast.
- **Input Optimization**: `type="number"` and specific input modes are used for mobile keyboards.

## Future Scaling (SaaS)
To scale this to a multi-tenant SaaS:
1. **Database**: Migrate from SQLite to **PostgreSQL** (e.g., Supabase/Neon).
   - Change `lib/db.ts` to use `Prisma` or `Drizzle` with Postgres connection pooling.
2. **Auth**: Add **Clerk** or **NextAuth** for user management.
3. **Tenant Isolation**: Add `organization_id` column to all tables.
4. **API**: Expose `route.ts` endpoints for a mobile app (React Native) if needed later.
