# Receipt Generator Application

## Overview

This is a full-stack web application for generating digital receipts. The application allows users to create, preview, and manage receipts with features including signature upload, PDF generation, and Google Drive integration. It's built with a modern tech stack using React for the frontend, Express.js for the backend, and PostgreSQL with Drizzle ORM for data persistence.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with CSS variables for theming

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **File Upload**: Multer for handling signature image uploads
- **Development**: Hot reloading with Vite integration

### Database Architecture
- **Database**: SQLite with better-sqlite3 (perfect for mobile webapp deployment)
- **Storage**: File-based database in `data/receipts.db`
- **Features**: WAL mode for performance, prepared statements for security
- **Migration**: Automatic table creation on startup

## Key Components

### Data Models
- **Users**: Authentication and user management (id, username, password)
- **Receipts**: Core receipt data including amount (stored in cents), payer/recipient names, timestamps, and file references

### Core Features
- **Receipt Creation**: Form-based receipt generation with validation
- **Signature Upload**: File upload with image format validation (PNG/JPEG, 2MB limit)
- **PDF Generation**: Client-side PDF creation using jsPDF
- **Google Drive Integration**: Automatic backup of generated receipts
- **Real-time Preview**: Live preview of receipt as user types
- **PWA Support**: Progressive Web App with offline functionality, mobile installation, and native app experience

### UI Components
- **Shadcn/ui**: Modern, accessible component library
- **File Upload**: Drag-and-drop interface with validation
- **Form Validation**: Zod schemas for client and server-side validation
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Toast Notifications**: User feedback for operations

## Data Flow

1. **Receipt Creation Flow**:
   - User fills out receipt form (amount, payer, recipient)
   - Optional signature upload with file validation
   - Real-time preview updates as user types
   - Form validation using Zod schemas
   - API call to create receipt record

2. **PDF Generation Flow**:
   - Client-side PDF generation using jsPDF
   - Receipt data formatted into professional layout
   - Signature image embedded if provided
   - PDF saved locally and optionally to Google Drive

3. **File Upload Flow**:
   - Drag-and-drop or click to upload signature
   - Client-side validation (file type, size)
   - Server-side storage in uploads directory
   - File path stored in database

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form
- **UI Libraries**: Radix UI primitives, shadcn/ui components
- **State Management**: TanStack Query for server state
- **Form Validation**: Zod for schema validation
- **PDF Generation**: jsPDF for client-side PDF creation
- **File Upload**: react-dropzone for drag-and-drop uploads
- **Styling**: Tailwind CSS, class-variance-authority

### Backend Dependencies
- **Express.js**: Web framework with middleware
- **File Upload**: Multer for multipart form handling
- **Database**: better-sqlite3 for SQLite operations
- **Validation**: Zod for request validation
- **Development**: tsx for TypeScript execution

### Development Tools
- **Build**: Vite with React plugin
- **TypeScript**: Full type safety across the stack
- **Database**: Drizzle Kit for migrations
- **Linting**: ESLint configuration
- **Hot Reload**: Vite dev server integration

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations applied via `db:push` command

### Environment Configuration
- **Development**: Local development with hot reloading
- **Production**: Single-file deployment with static asset serving
- **Database**: Environment-based DATABASE_URL configuration

### File Structure
```
├── client/          # React frontend
├── server/          # Express backend
├── shared/          # Shared types and schemas
├── uploads/         # File upload storage
├── migrations/      # Database migrations
└── dist/           # Build output
```

## Mobile App Configuration

### Capacitor Native App Setup
- **Android Project**: Configured in `android/` directory with Capacitor
- **App ID**: com.recibos.app
- **Build Directory**: dist/public (configured in capacitor.config.ts)
- **Icons**: Created 192x192 and 512x512 PNG icons from SVG
- **Splash Screen**: Blue themed with app branding

### Distribution Options
1. **PWA Installation**: Direct browser installation (already working)
2. **Android APK**: Native app compilation via Android Studio + Capacitor
3. **Paid Services**: Appilix ($69/year), MobiLoud ($350+/month), Median.co (custom pricing)

### Files Created for Mobile
- `capacitor.config.ts` - Capacitor configuration with app ID com.recibos.app
- `android/` - Complete native Android project with Gradle build system
- `build-mobile.js` - ES module script to prepare web assets for Capacitor
- `scripts/build-android.sh` - Complete build script for Android compilation
- `MOBILE_APP_GUIDE.md` - Complete deployment guide for all platforms
- `ANDROID_BUILD_INSTRUCTIONS.md` - Detailed Android compilation instructions
- `client/public/manifest.json` - PWA manifest
- `client/public/sw.js` - Service Worker

### Build Environment
- **Java**: OpenJDK 17 installed and configured
- **Gradle**: 8.11.1 (downloading dependencies)
- **Android SDK**: Available through Android Studio
- **Package Name**: com.recibos.app
- **App Name**: Generador de Recibos

## Changelog

```
Changelog:
- July 03, 2025. Initial setup with React/TypeScript frontend and Express backend
- July 03, 2025. Added SQLite database with better-sqlite3 for mobile webapp deployment
- July 03, 2025. Implemented floating navigation UI with modern design
- July 03, 2025. Added receipt history with persistent storage
- July 03, 2025. Implemented PWA (Progressive Web App) functionality with Service Worker, manifest, and mobile icons
- July 03, 2025. Configured Capacitor for native Android app development and created complete mobile deployment guide
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```