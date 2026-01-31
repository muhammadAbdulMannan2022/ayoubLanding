# Project Structure

```
ayoubLanding/
├── server/                          # Backend API Server
│   ├── index.js                    # Main server entry point
│   ├── package.json                # Server dependencies
│   ├── nodemon.json               # Nodemon configuration
│   ├── .env                       # Environment variables (DO NOT COMMIT)
│   ├── .gitignore                 # Git ignore rules
│   ├── README.md                  # Server documentation
│   ├── QUICKSTART.md              # Quick start guide
│   ├── Ayoub_Landing_API.postman_collection.json  # Postman collection
│   │
│   ├── routes/                    # API Routes
│   │   ├── auth.js               # Authentication routes
│   │   ├── bookings.js           # Booking management routes
│   │   └── jobber.js             # Jobber API routes
│   │
│   ├── services/                  # Business Logic
│   │   └── jobberService.js      # Jobber API integration service
│   │
│   ├── middleware/                # Express Middleware
│   │   └── auth.js               # Authentication middleware
│   │
│   ├── utils/                     # Utility Functions
│   │   └── tokenStore.js         # Token management utility
│   │
│   └── examples/                  # Integration Examples
│       └── frontendIntegration.js # Frontend integration guide
│
├── src/                           # Frontend React Application
│   ├── main.jsx                  # React entry point
│   ├── App.jsx                   # Main App component
│   ├── Route.jsx                 # Route configuration
│   │
│   ├── pages/                    # Page Components
│   │   ├── Home.jsx             # Home page
│   │   ├── ThankYou.jsx         # Success/Thank you page
│   │   └── Error.jsx            # Error page
│   │
│   └── parts/                    # Reusable Components
│       ├── Navbar.jsx           # Navigation bar
│       ├── Hero.jsx             # Hero section
│       ├── ProjectConfigurator.jsx  # Project configuration tool
│       ├── FloorDetailsForm.jsx     # Floor details form
│       ├── BookingModal.jsx         # Booking modal
│       ├── QuoteUnlockModal.jsx     # Quote unlock modal
│       ├── PreConfigModal.jsx       # Pre-configuration modal
│       ├── FlooringQuizModal.jsx    # Flooring quiz
│       ├── FlooringComparisonModal.jsx  # Material comparison
│       ├── Testimonials.jsx         # Customer testimonials
│       ├── TrustSection.jsx         # Trust indicators
│       ├── HowItWorks.jsx          # Process explanation
│       ├── CTA.jsx                 # Call to action
│       └── Footer.jsx              # Footer
│
├── public/                        # Static Assets
│   └── ...
│
├── dist/                          # Production Build (generated)
│
├── node_modules/                  # Frontend Dependencies
│
├── package.json                   # Frontend dependencies
├── vite.config.js                # Vite configuration
├── eslint.config.js              # ESLint configuration
├── index.html                    # HTML template
├── .gitignore                    # Git ignore rules
└── README.md                     # Project documentation
```

## Key Files Explained

### Server Files

#### `server/index.js`
Main Express server with middleware setup, route registration, and error handling.

#### `server/services/jobberService.js`
Core service for interacting with Jobber API:
- OAuth authentication
- GraphQL queries
- Client management
- Visit/appointment scheduling
- Quote generation

#### `server/routes/auth.js`
Authentication endpoints:
- `/api/auth/login` - Get OAuth URL
- `/api/auth/callback` - OAuth callback
- `/api/auth/refresh` - Refresh token
- `/api/auth/status` - Check auth status

#### `server/routes/bookings.js`
Booking management endpoints:
- `/api/bookings/create` - Create booking with client and visit
- `/api/bookings/quote` - Generate quote
- `/api/bookings/list` - List all bookings

#### `server/routes/jobber.js`
Direct Jobber API operations:
- Client CRUD operations
- Visit management
- Quote creation
- Custom GraphQL queries

#### `server/.env`
Environment configuration (NEVER commit this file):
```env
PORT=5000
NODE_ENV=development
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
JOBBER_API_URL=https://api.getjobber.com/api/graphql
REDIRECT_URI=http://localhost:5000/api/auth/callback
FRONTEND_URL=http://localhost:5173
```

### Frontend Files

#### `src/parts/ProjectConfigurator.jsx`
Main project configuration component with:
- Project type selection (stairs/floor/both)
- Dynamic forms for details
- Real-time price calculation
- Integration points for booking/quote creation

#### `src/parts/BookingModal.jsx`
Booking form modal for scheduling free consultations.
**Integration point**: Should call `/api/bookings/create`

#### `src/parts/QuoteUnlockModal.jsx`
Quote request modal for getting detailed pricing.
**Integration point**: Should call `/api/bookings/quote`

#### `src/pages/ThankYou.jsx`
Success page shown after booking/quote creation.

## Data Flow

### Booking Flow
```
User fills BookingModal
    ↓
Frontend calls POST /api/bookings/create
    ↓
Server creates/finds client in Jobber
    ↓
Server creates visit/appointment
    ↓
Server returns confirmation
    ↓
Frontend redirects to /thank-you
```

### Quote Flow
```
User completes ProjectConfigurator
    ↓
User clicks "Get Quote" in QuoteUnlockModal
    ↓
Frontend calls POST /api/bookings/quote
    ↓
Server creates client (if needed)
    ↓
Server creates detailed quote in Jobber
    ↓
Server returns quote details
    ↓
Frontend shows success message
```

## Environment Setup

### Development
1. **Frontend**: `npm run dev` (port 5173)
2. **Backend**: `cd server && npm run dev` (port 5000)

### Production
1. **Frontend**: `npm run build` → deploy `dist/` folder
2. **Backend**: `cd server && npm start` → deploy to server

## API Integration Points

### Required Changes in Frontend

1. **Create API utility file** (`src/api/jobberApi.js`):
   - Copy from `server/examples/frontendIntegration.js`
   - Update API_BASE_URL if needed

2. **Update BookingModal.jsx**:
   - Import `createBooking` function
   - Call API on form submit
   - Handle success/error states

3. **Update QuoteUnlockModal.jsx**:
   - Import `createQuote` function
   - Call API when user unlocks quote
   - Handle success/error states

4. **Store access token**:
   - Implement OAuth flow or
   - Use a pre-authorized token for development

## Security Considerations

### Current Setup (Development)
- Access token passed in request body
- No authentication on frontend
- In-memory token storage

### Production Requirements
- Implement proper session management
- Store tokens in secure database
- Use HTTPS for all communications
- Add rate limiting
- Implement CSRF protection
- Add input validation
- Use environment-specific configs

## Testing

### Backend Testing
1. Use Postman collection: `server/Ayoub_Landing_API.postman_collection.json`
2. Test with curl commands (see QUICKSTART.md)
3. Check server logs for errors

### Frontend Testing
1. Test booking flow end-to-end
2. Verify quote generation
3. Check success page redirection
4. Test error handling

## Deployment

### Backend
- Deploy to: Heroku, Railway, DigitalOcean, AWS, etc.
- Set environment variables
- Use production database for tokens
- Enable HTTPS

### Frontend
- Deploy to: Vercel, Netlify, Cloudflare Pages, etc.
- Update API_BASE_URL to production backend
- Build with `npm run build`

## Support Resources

- **Jobber API Docs**: https://developer.getjobber.com
- **Express Docs**: https://expressjs.com
- **React Router**: https://reactrouter.com
- **Vite Docs**: https://vitejs.dev
