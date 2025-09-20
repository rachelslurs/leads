# System Design Document - Alma Leads Management System

## Overview

This document outlines the architecture and design decisions for the Alma Leads Management System, a web application for collecting and managing immigration consultation leads. The system was built using Next.js 15 and JSON Forms as specified in the requirements.

## Architecture

### Technology Stack
- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Redux Toolkit with RTK Query
- **Form Management**: JSON Forms with custom renderers
- **Storage**: In-memory storage (development only)

### System Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Public Form   │    │  Admin Dashboard│    │   API Routes    │
│                 │    │                 │    │                 │
│ - Lead capture  │    │ - Lead list     │    │ - POST /leads   │
│ - Validation    │    │ - Status update │    │ - GET /leads    │
│ - File upload   │    │ - Search/filter │    │ - PUT /leads/:id│
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │ In-Memory Store │
                    │                 │
                    │ - Lead data     │
                    │ - File handling │
                    └─────────────────┘
```

## Design Deviations from Mockups

### Visual Differences
- **Form Icons**: Used Lucide React icons instead of exact mockup icons
- **Color Palette**: Close approximation of Alma brand colors (may need fine-tuning)
- **Typography**: Using system fonts instead of potential brand fonts
- **Admin Table**: Added sorting indicators and hover states not shown in mockup and notifications
- **Thank You Page**: Took some styling liberties for better UX

## Key Design Decisions

### 1. JSON Forms Implementation
Since JSON Forms was required, I implemented custom renderers to match the design requirements:
- Custom renderers for text inputs, file uploads, and multi-select checkboxes
- Integrated with Tailwind CSS for consistent styling
- Form context for shared state management across renderers

### 2. State Management
Used Redux Toolkit with RTK Query for:
- Centralized state management
- Automatic caching and optimistic updates
- Consistent API error handling

### 3. In-Memory Storage
Chose in-memory storage for rapid development:
- Global variables for lead data persistence
- Simple file handling (validation only, no actual storage)
- Appropriate for MVP/prototype phase

### 4. Component Architecture
Organized components by feature:
- `components/forms/` - Form components and custom renderers
- `components/admin/` - Admin dashboard components
- `components/ui/` - Reusable UI components
- `lib/` - Business logic and utilities

## API Design

RESTful API with FormData support for file uploads:

```
POST   /api/leads       - Create new lead
GET    /api/leads       - List leads (paginated)
PUT    /api/leads/:id   - Update lead status
POST   /api/auth        - Login
DELETE /api/auth        - Logout
```

## Security Considerations

### Current Implementation
- Basic username/password authentication
- File type and size validation
- Client and server-side validation
- HTTP-only cookies for sessions

### Production Needs
- Proper authentication service
- Database with encryption
- File storage solution
- Rate limiting

## Performance Optimizations

- RTK Query caching and optimistic updates
- React.memo for expensive components
- Debounced search inputs
- Code splitting via Next.js

## Testing Strategy

### Tests Implemented
- **JsonLeadForm**: Form submission, validation, and error handling
- **Validators**: URL validation, email validation, and custom validation functions
- **Form Context**: State management and error propagation

### Tests I'd Like to Add
- **API Routes**: Lead creation, retrieval, and status updates
- **Admin Components**: LeadsTable, SearchAndFilter, and Pagination
- **Custom Renderers**: File upload, multi-select checkboxes, and text inputs
- **Redux Store**: Auth slice and RTK Query cache management
- **Integration Tests**: Complete user flows (form submission to admin view) 

## Future Enhancements

1. **Database Integration** - Replace in-memory storage with PostgreSQL
2. **File Storage** - Implement actual file upload to cloud storage
3. **Authentication** - Add proper auth service (NextAuth.js)
4. **Email Notifications** - Send confirmation emails
5. **Advanced Features** - Lead scoring, analytics dashboard

## Known Limitations

- Data lost on server restart (in-memory storage)
- Files not actually stored
- Basic authentication only
- No rate limiting

## Conclusion

The system successfully implements all required features using the specified technology stack. The architecture supports future enhancements while maintaining simplicity for the MVP phase. Key focus was on user experience with optimistic updates and comprehensive validation.