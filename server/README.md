# Ayoub Landing - Backend Server

Backend API server for Ayoub Landing page with Jobber API integration for scheduling and client management.

## Features

- ✅ Express.js REST API
- ✅ Jobber API Integration (OAuth 2.0)
- ✅ Client Management
- ✅ Appointment/Visit Scheduling
- ✅ Quote Generation
- ✅ GraphQL Support
- ✅ CORS enabled
- ✅ Security headers (Helmet)
- ✅ Request logging (Morgan)
- ✅ Auto-reload with Nodemon

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Jobber Developer Account
- Jobber App Credentials (Client ID & Secret)

## Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env` file (already set up)

## Environment Variables

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Jobber API Configuration
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
JOBBER_API_URL=https://api.getjobber.com/api/graphql

# OAuth Configuration
REDIRECT_URI=http://localhost:5000/api/auth/callback
FRONTEND_URL=http://localhost:5173
```

## Running the Server

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Authentication
- `GET /api/auth/login` - Get Jobber OAuth authorization URL
- `GET /api/auth/callback` - OAuth callback endpoint
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/status` - Check authentication status

### Bookings
- `POST /api/bookings/create` - Create new booking with client and visit
- `POST /api/bookings/quote` - Generate quote for project
- `GET /api/bookings/list` - List all bookings

### Jobber Operations
- `POST /api/jobber/client/create` - Create new client
- `GET /api/jobber/client/search` - Search client by email
- `POST /api/jobber/visit/create` - Create new visit
- `GET /api/jobber/visits` - List visits
- `POST /api/jobber/quote/create` - Create quote
- `POST /api/jobber/graphql` - Execute custom GraphQL query

## Usage Examples

### 1. Authenticate with Jobber

First, get the authorization URL:
```bash
curl http://localhost:5000/api/auth/login
```

Visit the returned URL in your browser to authorize the app. You'll be redirected back with an access token.

### 2. Create a Booking

```bash
curl -X POST http://localhost:5000/api/bookings/create \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "555-1234",
    "address": {
      "street1": "123 Main St",
      "city": "Miami",
      "province": "FL",
      "postalCode": "33101"
    },
    "date": "2026-02-15",
    "time": "14:00",
    "projectType": "Floor & Stairs",
    "notes": "Interested in LVP flooring",
    "accessToken": "your_access_token"
  }'
```

### 3. Create a Quote

```bash
curl -X POST http://localhost:5000/api/bookings/quote \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "client_id_from_jobber",
    "projectType": "both",
    "stairDetails": {
      "steps": 12,
      "landings": 1,
      "boxSteps": 0,
      "material": "LVP 5mm"
    },
    "floorDetails": {
      "sqft": 500,
      "roomCount": 3,
      "material": "LVP",
      "removal": "carpet"
    },
    "totalEstimate": 4500,
    "accessToken": "your_access_token"
  }'
```

## Project Structure

```
server/
├── index.js                 # Main server file
├── package.json            # Dependencies
├── nodemon.json           # Nodemon configuration
├── .env                   # Environment variables
├── routes/
│   ├── auth.js           # Authentication routes
│   ├── bookings.js       # Booking routes
│   └── jobber.js         # Jobber API routes
└── services/
    └── jobberService.js  # Jobber API service
```

## Integration with Frontend

The frontend can call these endpoints to:

1. **Create bookings** when users submit the booking modal
2. **Generate quotes** when users complete the project configurator
3. **Manage clients** automatically when new users book appointments

Example frontend integration:

```javascript
// In your BookingModal component
const handleBookingSubmit = async (formData) => {
  try {
    const response = await fetch('http://localhost:5000/api/bookings/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        accessToken: 'your_stored_access_token'
      })
    });

    const result = await response.json();
    
    if (result.success) {
      // Redirect to thank you page
      navigate('/thank-you');
    }
  } catch (error) {
    console.error('Booking failed:', error);
  }
};
```

## Security Notes

⚠️ **Important for Production:**

1. **Token Storage**: Currently, tokens are passed in requests. In production, implement:
   - Secure session management
   - Database storage for tokens
   - Token encryption

2. **HTTPS**: Use HTTPS in production
3. **Rate Limiting**: Add rate limiting middleware
4. **Input Validation**: Add comprehensive input validation
5. **Error Messages**: Don't expose sensitive error details to clients

## Troubleshooting

### Server won't start
- Check if port 5000 is already in use
- Verify all environment variables are set
- Check Node.js version (should be v16+)

### OAuth errors
- Verify CLIENT_ID and CLIENT_SECRET are correct
- Check REDIRECT_URI matches your Jobber app settings
- Ensure your Jobber app has the correct scopes enabled

### GraphQL errors
- Check access token is valid and not expired
- Verify GraphQL query syntax
- Check Jobber API version compatibility

## Support

For Jobber API documentation, visit:
- [Jobber Developer Docs](https://developer.getjobber.com)
- [Jobber GraphQL API](https://developer.getjobber.com/docs/graphql)

## License

ISC
