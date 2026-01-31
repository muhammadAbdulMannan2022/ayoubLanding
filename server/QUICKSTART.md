# Quick Start Guide - Jobber Integration

## 🚀 Server is Running!

Your backend server is now running on **http://localhost:5000**

## ✅ What's Been Set Up

1. **Express Server** with Nodemon for auto-reload
2. **Jobber API Integration** with OAuth 2.0
3. **REST API Endpoints** for bookings, quotes, and scheduling
4. **GraphQL Support** for custom Jobber queries
5. **Security & Logging** with Helmet and Morgan

## 📋 Next Steps

### Step 1: Authenticate with Jobber

Before you can create bookings, you need to authenticate with Jobber:

1. **Get the authorization URL:**
   ```bash
   curl http://localhost:5000/api/auth/login
   ```

2. **Visit the URL** returned in the response in your browser

3. **Authorize the app** - You'll be redirected back with an access token

4. **Save the access token** - You'll need it for all API calls

### Step 2: Test Creating a Booking

Once you have an access token, test creating a booking:

```bash
curl -X POST http://localhost:5000/api/bookings/create \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "555-0123",
    "address": {
      "street1": "123 Test St",
      "city": "Miami",
      "province": "FL",
      "postalCode": "33101"
    },
    "projectType": "Floor Only",
    "notes": "Test booking from API",
    "accessToken": "YOUR_ACCESS_TOKEN_HERE"
  }'
```

### Step 3: Integrate with Frontend

#### Option A: Quick Test (Manual)

1. Open your browser to http://localhost:5173 (your frontend)
2. Fill out the booking form
3. The form should now send data to the backend

#### Option B: Full Integration

Copy the integration code from `examples/frontendIntegration.js` to your frontend:

```javascript
// In your src/api/ folder, create jobberApi.js
import { createBooking, createQuote } from './jobberIntegration';

// Then use in your components
const handleBooking = async (formData) => {
  const result = await createBooking(formData);
  navigate('/thank-you');
};
```

## 🔧 Available Endpoints

### Health Check
```bash
GET http://localhost:5000/health
```

### Authentication
```bash
GET  http://localhost:5000/api/auth/login
GET  http://localhost:5000/api/auth/callback
POST http://localhost:5000/api/auth/refresh
GET  http://localhost:5000/api/auth/status
```

### Bookings
```bash
POST http://localhost:5000/api/bookings/create
POST http://localhost:5000/api/bookings/quote
GET  http://localhost:5000/api/bookings/list
```

### Jobber Operations
```bash
POST http://localhost:5000/api/jobber/client/create
GET  http://localhost:5000/api/jobber/client/search
POST http://localhost:5000/api/jobber/visit/create
GET  http://localhost:5000/api/jobber/visits
POST http://localhost:5000/api/jobber/quote/create
POST http://localhost:5000/api/jobber/graphql
```

## 🎯 Integration Points

### 1. BookingModal Component

When a user submits the booking form, send data to:
```
POST /api/bookings/create
```

This will:
- Create or find the client in Jobber
- Schedule a visit/appointment
- Return confirmation

### 2. QuoteUnlockModal Component

When a user requests a quote, send data to:
```
POST /api/bookings/quote
```

This will:
- Create a detailed quote in Jobber
- Include all project details
- Return quote information

### 3. Success Page

After successful booking/quote creation, redirect to:
```
/thank-you
```

Your existing ThankYou component will display the success message.

## 🔐 Important Notes

### Access Token Management

The access token is required for all Jobber API calls. You have two options:

**Option 1: Server-side storage (Recommended for production)**
- Store tokens in a database
- Use sessions to manage user authentication
- Never expose tokens to the client

**Option 2: Client-side storage (Quick setup)**
- Store token in localStorage after OAuth
- Send token with each API request
- Less secure, but easier for development

### Current Setup

Currently, the token is passed with each request. For production:

1. Implement proper session management
2. Store tokens securely in a database
3. Use HTTPS for all communications
4. Add rate limiting
5. Implement proper error handling

## 🧪 Testing

### Test Server Health
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2026-01-31T..."
}
```

### Test Authentication
```bash
curl http://localhost:5000/api/auth/login
```

Expected response:
```json
{
  "success": true,
  "authUrl": "https://api.getjobber.com/api/oauth/authorize?...",
  "message": "Redirect to this URL to authorize with Jobber"
}
```

## 📚 Documentation

- Full API documentation: `server/README.md`
- Frontend integration examples: `server/examples/frontendIntegration.js`
- Jobber API docs: https://developer.getjobber.com

## 🐛 Troubleshooting

### Server won't start
- Check if port 5000 is in use
- Verify Node.js version (v16+)
- Check .env file exists and has correct values

### OAuth errors
- Verify CLIENT_ID and CLIENT_SECRET in .env
- Check REDIRECT_URI matches Jobber app settings
- Ensure app has correct scopes enabled

### API errors
- Check access token is valid
- Verify request body format
- Check server logs for detailed errors

## 🎉 You're All Set!

Your server is ready to handle:
- ✅ Client management
- ✅ Appointment scheduling
- ✅ Quote generation
- ✅ Jobber API integration

Start integrating with your frontend and test the booking flow!

---

**Need Help?**
- Check the logs in the terminal
- Review the README.md for detailed documentation
- Test endpoints with curl or Postman
