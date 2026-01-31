# Server Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│                     http://localhost:5173                        │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ BookingModal │  │ QuoteUnlock  │  │ Project      │         │
│  │              │  │ Modal        │  │ Configurator │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                  │                  │                  │
└─────────┼──────────────────┼──────────────────┼─────────────────┘
          │                  │                  │
          │ HTTP POST        │ HTTP POST        │ HTTP GET
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND SERVER (Express)                      │
│                     http://localhost:5000                        │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    API Routes Layer                         │ │
│  │                                                             │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │ │
│  │  │ /api/auth    │  │ /api/bookings│  │ /api/jobber  │    │ │
│  │  │              │  │              │  │              │    │ │
│  │  │ • login      │  │ • create     │  │ • client/*   │    │ │
│  │  │ • callback   │  │ • quote      │  │ • visit/*    │    │ │
│  │  │ • refresh    │  │ • list       │  │ • quote/*    │    │ │
│  │  │ • status     │  │              │  │ • graphql    │    │ │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │ │
│  └─────────┼──────────────────┼──────────────────┼───────────┘ │
│            │                  │                  │              │
│  ┌─────────┼──────────────────┼──────────────────┼───────────┐ │
│  │         │    Middleware Layer                 │           │ │
│  │         │                                     │           │ │
│  │  ┌──────▼───────┐  ┌──────────────┐  ┌──────▼────────┐  │ │
│  │  │ Auth         │  │ Error        │  │ Validation    │  │ │
│  │  │ Middleware   │  │ Handler      │  │ Middleware    │  │ │
│  │  └──────────────┘  └──────────────┘  └───────────────┘  │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                  Service Layer                            │ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │           JobberService                             │ │ │
│  │  │                                                     │ │ │
│  │  │  • OAuth Authentication                            │ │ │
│  │  │  • Token Management                                │ │ │
│  │  │  • GraphQL Client                                  │ │ │
│  │  │  • Client Operations (CRUD)                        │ │ │
│  │  │  • Visit/Appointment Management                    │ │ │
│  │  │  • Quote Generation                                │ │ │
│  │  └─────────────────┬───────────────────────────────────┘ │ │
│  └────────────────────┼─────────────────────────────────────┘ │
│                       │                                        │
│  ┌────────────────────┼─────────────────────────────────────┐ │
│  │  Utilities         │                                     │ │
│  │                    │                                     │ │
│  │  ┌─────────────────▼──────────┐  ┌──────────────────┐  │ │
│  │  │ TokenStore                 │  │ Other Utils      │  │ │
│  │  │ (In-memory token storage)  │  │                  │  │ │
│  │  └────────────────────────────┘  └──────────────────┘  │ │
│  └──────────────────────────────────────────────────────────┘ │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           │ HTTPS/GraphQL
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      JOBBER API                                  │
│              https://api.getjobber.com/api/graphql              │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Clients    │  │    Visits    │  │    Quotes    │         │
│  │   Database   │  │   Database   │  │   Database   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

## Request Flow Example: Create Booking

```
1. User fills booking form in BookingModal
   ↓
2. Frontend: POST /api/bookings/create
   {
     firstName: "John",
     lastName: "Doe",
     email: "john@example.com",
     phone: "555-1234",
     date: "2026-02-15",
     time: "14:00",
     projectType: "Floor Only",
     accessToken: "xxx"
   }
   ↓
3. Server: bookings.js route receives request
   ↓
4. Middleware: Validates required fields
   ↓
5. Service: jobberService.getClientByEmail(email)
   ├─ GraphQL Query to Jobber API
   └─ Returns existing client OR null
   ↓
6. If client doesn't exist:
   Service: jobberService.createClient(clientData)
   ├─ GraphQL Mutation to Jobber API
   └─ Returns new client object
   ↓
7. Service: jobberService.createVisit(visitData)
   ├─ GraphQL Mutation to Jobber API
   └─ Returns visit/appointment object
   ↓
8. Server: Returns success response
   {
     success: true,
     data: {
       client: {...},
       visit: {...}
     }
   }
   ↓
9. Frontend: Redirects to /thank-you page
```

## Data Models

### Client Object
```javascript
{
  id: "client_123",
  firstName: "John",
  lastName: "Doe",
  name: "John Doe",
  emails: [
    { address: "john@example.com", primary: true }
  ],
  phones: [
    { number: "555-1234", primary: true }
  ],
  billingAddress: {
    street1: "123 Main St",
    city: "Miami",
    province: "FL",
    postalCode: "33101",
    country: "US"
  }
}
```

### Visit Object
```javascript
{
  id: "visit_456",
  title: "Floor Only - Free In-Home Consultation",
  startAt: "2026-02-15T14:00:00Z",
  endAt: "2026-02-15T15:00:00Z",
  anytime: false,
  instructions: "Customer interested in flooring",
  client: {
    id: "client_123",
    name: "John Doe"
  }
}
```

### Quote Object
```javascript
{
  id: "quote_789",
  quoteNumber: "Q-001",
  title: "Floor Only Flooring Project Quote",
  subject: "Your Custom Flooring Quote",
  message: "Project details and pricing...",
  total: 4500.00,
  client: {
    id: "client_123",
    name: "John Doe"
  },
  lineItems: [
    {
      name: "Floor Installation",
      description: "LVP flooring - 500 sqft",
      quantity: 500,
      unitCost: 8.00
    }
  ]
}
```

## Authentication Flow

```
1. User/Admin initiates OAuth
   ↓
2. GET /api/auth/login
   ├─ Server generates authorization URL
   └─ Returns URL to frontend
   ↓
3. User visits authorization URL
   ├─ Redirects to Jobber login
   └─ User authorizes app
   ↓
4. Jobber redirects to callback URL
   GET /api/auth/callback?code=xxx
   ↓
5. Server exchanges code for tokens
   ├─ POST to Jobber OAuth endpoint
   └─ Receives access_token & refresh_token
   ↓
6. Server stores tokens
   ├─ TokenStore.setTokens()
   └─ Returns tokens to frontend
   ↓
7. Frontend stores access_token
   └─ Uses for all subsequent API calls
```

## Error Handling Flow

```
Request → Middleware → Route Handler → Service
                ↓           ↓            ↓
              Error       Error        Error
                ↓           ↓            ↓
            Error Handler Middleware
                      ↓
              Format Error Response
                      ↓
              Return to Client
              {
                success: false,
                error: "Error message",
                details: {...}
              }
```

## Security Layers

```
┌─────────────────────────────────────┐
│  1. CORS - Origin Validation        │
├─────────────────────────────────────┤
│  2. Helmet - Security Headers       │
├─────────────────────────────────────┤
│  3. Body Parser - Request Parsing   │
├─────────────────────────────────────┤
│  4. Auth Middleware - Token Check   │
├─────────────────────────────────────┤
│  5. Validation - Input Validation   │
├─────────────────────────────────────┤
│  6. Route Handler - Business Logic  │
├─────────────────────────────────────┤
│  7. Error Handler - Error Response  │
└─────────────────────────────────────┘
```

## Technology Stack

### Backend
- **Runtime**: Node.js (v16+)
- **Framework**: Express.js
- **HTTP Client**: Axios
- **Security**: Helmet, CORS
- **Logging**: Morgan
- **Dev Tools**: Nodemon
- **Environment**: dotenv

### Frontend Integration
- **Framework**: React 19
- **Router**: React Router 7
- **Styling**: Tailwind CSS 4
- **Build Tool**: Vite 7
- **Icons**: Lucide React

### External Services
- **Jobber API**: GraphQL endpoint
- **OAuth 2.0**: Authorization flow
- **API Version**: 2024-01-01

## File Sizes (Approximate)

```
server/
├── index.js                    ~2.5 KB
├── services/jobberService.js   ~8.5 KB
├── routes/auth.js              ~2.5 KB
├── routes/bookings.js          ~6.5 KB
├── routes/jobber.js            ~5.0 KB
├── middleware/auth.js          ~3.5 KB
├── utils/tokenStore.js         ~2.0 KB
└── Total                       ~30.5 KB
```

## Performance Considerations

1. **Token Caching**: Tokens stored in memory for fast access
2. **GraphQL Batching**: Multiple operations in single request
3. **Error Recovery**: Automatic token refresh on expiry
4. **Async Operations**: Non-blocking I/O for all API calls
5. **Logging**: Minimal overhead with Morgan

## Scalability Notes

### Current Setup (Development)
- Single server instance
- In-memory token storage
- No database required

### Production Recommendations
- Use Redis for token storage
- Implement rate limiting
- Add request queuing
- Use load balancer
- Implement caching layer
- Add monitoring/logging service
