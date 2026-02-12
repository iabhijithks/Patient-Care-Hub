# MediFlow Connect

## Overview

MediFlow Connect is a hospital patient-care coordination web application with role-based dashboards. It provides a unified platform connecting Patients, Doctors, Nurses, Lab technicians, and Pharmacy staff — all revolving around shared patient records. The app features a role selection home screen that routes users to their respective dashboards, where they can manage appointments, prescriptions, lab tests, vitals, and care timelines.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side router)
- **State/Data Fetching**: TanStack React Query for server state management
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming (medical blue/teal palette)
- **Fonts**: Plus Jakarta Sans (headings), Inter (body text)
- **Build Tool**: Vite
- **Path Aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Pages / Dashboards
- **Home** (`/`): Role selection cards for Doctor, Patient, Nurse, Pharmacy, Lab
- **Doctor Dashboard** (`/dashboard/doctor`): Patient queue, prescriptions, lab test requests, appointment management
- **Patient Dashboard** (`/dashboard/patient`): View medical records, prescriptions, lab results, care timeline
- **Nurse Dashboard** (`/dashboard/nurse`): Monitor and update patient vitals
- **Pharmacy Dashboard** (`/dashboard/pharmacy`): Process prescriptions, track dispensing
- **Lab Dashboard** (`/dashboard/lab`): Manage lab test requests, update results

### Backend
- **Runtime**: Node.js with TypeScript (tsx for dev, esbuild for production)
- **Framework**: Express 5
- **API Pattern**: RESTful JSON API under `/api/` prefix
- **API Route Definitions**: Centralized in `shared/routes.ts` with Zod schemas for request/response validation
- **Dev Server**: Vite dev server middleware integrated with Express (HMR support)
- **Production**: Static files served from `dist/public`, SPA fallback to `index.html`

### Database
- **Database**: PostgreSQL (required via `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with `drizzle-zod` for schema-to-validation integration
- **Schema Location**: `shared/schema.ts` (shared between client and server)
- **Migrations**: Generated via `drizzle-kit push` (stored in `./migrations`)
- **Connection**: `pg` Pool via `server/db.ts`

### Database Schema (key tables)
- **doctors**: id, name, qualification, specialization, experience, department, imageUrl
- **patients**: id, name, age, gender, condition, history, vitals (JSONB), status, admissionDate
- **appointments**: id, patientId, doctorId, time, status
- **prescriptions**: id, patientId, doctorId, medicines (JSONB array), status
- **labTests**: id, patientId, doctorId, test details, status, results
- **timeline**: id, patientId, event tracking for care coordination

### Storage Layer
- `server/storage.ts` defines an `IStorage` interface and `DatabaseStorage` implementation
- CRUD operations for all entities (doctors, patients, appointments, prescriptions, lab tests, timeline events)
- Database is seeded with sample data on first run (checked in `server/routes.ts`)

### Shared Code
- `shared/schema.ts`: Drizzle table definitions + Zod insert schemas (used by both client and server)
- `shared/routes.ts`: API route definitions with method, path, and Zod response schemas

### Build Process
- **Dev**: `tsx server/index.ts` with Vite middleware for HMR
- **Build**: `script/build.ts` runs Vite build (client) then esbuild (server), output to `dist/`
- **Production**: `node dist/index.cjs`

## External Dependencies

### Database
- **PostgreSQL**: Required. Connection string via `DATABASE_URL` environment variable. Used with `pg` driver and Drizzle ORM.
- **connect-pg-simple**: Available for session storage (Express sessions backed by PostgreSQL)

### Key NPM Packages
- **drizzle-orm** + **drizzle-kit**: Database ORM and migration tooling
- **zod** + **drizzle-zod**: Schema validation and type-safe API contracts
- **@tanstack/react-query**: Async state management for API calls
- **wouter**: Lightweight client-side routing
- **shadcn/ui** (Radix UI primitives): Full component library (accordion, dialog, tabs, table, select, etc.)
- **date-fns**: Date formatting for timelines and appointments
- **recharts**: Dashboard analytics and vital signs charts
- **lucide-react**: Icon library
- **class-variance-authority** + **clsx** + **tailwind-merge**: Utility-first styling helpers

### Replit-Specific
- **@replit/vite-plugin-runtime-error-modal**: Error overlay in development
- **@replit/vite-plugin-cartographer**: Replit integration (dev only)
- **@replit/vite-plugin-dev-banner**: Dev environment banner (dev only)