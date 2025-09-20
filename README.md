# Alma Leads Application

A Next.js application for managing leads with dynamic form handling and state management.

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm

### Installation & Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
- Navigate to [http://localhost:3000](http://localhost:3000) for the lead form
- Navigate to [http://localhost:3000/admin](http://localhost:3000/admin) for the lead CRM

### Available Scripts

- `npm run dev` - Start development server with debugging and turbopack
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run Jest tests
- `npm run test:watch` - Run Jest tests in watch mode

### Technology Stack

- **Framework:** Next.js 15.5.3 with App Router
- **UI:** React 19.1.0 with Tailwind CSS 4
- **State Management:** Redux Toolkit
- **Forms:** JSONForms
- **Icons:** Lucide React
- **Testing:** Jest with Testing Library

### Documentation

📋 **[System Design Document](./SYSTEM_DESIGN.md)** - Detailed architecture and implementation decisions

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
