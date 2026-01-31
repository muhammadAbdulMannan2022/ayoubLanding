/**
 * API Integration Example for Frontend
 * 
 * This file shows how to integrate the backend API with your React frontend.
 * Copy these functions to your frontend project and use them in your components.
 */

const API_BASE_URL = 'http://localhost:5000/api';

// Store access token (you can use localStorage, sessionStorage, or state management)
let accessToken = null;

/**
 * Set access token
 */
export const setAccessToken = (token) => {
  accessToken = token;
  // Optionally store in localStorage
  localStorage.setItem('jobber_access_token', token);
};

/**
 * Get access token
 */
export const getAccessToken = () => {
  if (!accessToken) {
    accessToken = localStorage.getItem('jobber_access_token');
  }
  return accessToken;
};

/**
 * Initialize Jobber OAuth
 * Call this when user wants to connect to Jobber
 */
export const initializeJobberAuth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`);
    const data = await response.json();
    
    if (data.success) {
      // Open authorization URL in new window
      window.open(data.authUrl, '_blank');
      return data;
    }
    
    throw new Error(data.error);
  } catch (error) {
    console.error('Auth initialization error:', error);
    throw error;
  }
};

/**
 * Create a booking
 * Use this in your BookingModal component
 */
export const createBooking = async (bookingData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...bookingData,
        accessToken: getAccessToken()
      })
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    console.error('Booking creation error:', error);
    throw error;
  }
};

/**
 * Create a quote
 * Use this in your QuoteUnlockModal component
 */
export const createQuote = async (quoteData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/quote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...quoteData,
        accessToken: getAccessToken()
      })
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    console.error('Quote creation error:', error);
    throw error;
  }
};

/**
 * Example: Integration with BookingModal
 */
export const exampleBookingModalIntegration = `
// In your BookingModal.jsx component

import { createBooking } from './api/jobberIntegration';

const BookingModal = ({ isOpen, onClose, initialData }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    date: '',
    time: '',
    projectType: initialData?.type || '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Create booking via API
      const result = await createBooking({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: {
          street1: formData.address,
          city: formData.city || '',
          province: formData.state || 'FL',
          postalCode: formData.zip || ''
        },
        date: formData.date,
        time: formData.time,
        projectType: formData.projectType,
        notes: formData.notes
      });

      console.log('Booking created:', result);
      
      // Redirect to thank you page
      navigate('/thank-you');
      onClose();
    } catch (error) {
      console.error('Failed to create booking:', error);
      alert('Failed to create booking. Please try again.');
    }
  };

  return (
    // Your modal JSX
  );
};
`;

/**
 * Example: Integration with QuoteUnlockModal
 */
export const exampleQuoteModalIntegration = `
// In your QuoteUnlockModal.jsx component

import { createQuote, createBooking } from './api/jobberIntegration';

const QuoteUnlockModal = ({ isOpen, onClose, projectData }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  const handleUnlock = async () => {
    try {
      // First, create a client and get clientId
      const bookingResult = await createBooking({
        firstName: name.split(' ')[0],
        lastName: name.split(' ')[1] || '',
        email: email,
        phone: phone,
        projectType: projectData.type,
        notes: 'Quote request from website'
      });

      const clientId = bookingResult.data.client.id;

      // Then create the quote
      const quoteResult = await createQuote({
        clientId: clientId,
        projectType: projectData.type,
        stairDetails: projectData.stairDetails,
        floorDetails: projectData.floorDetails,
        totalEstimate: calculateTotal(projectData)
      });

      console.log('Quote created:', quoteResult);
      
      // Show success message or download PDF
      alert('Quote created successfully! Check your email.');
      onClose();
    } catch (error) {
      console.error('Failed to create quote:', error);
      alert('Failed to create quote. Please try again.');
    }
  };

  return (
    // Your modal JSX
  );
};
`;

/**
 * Check server health
 */
export const checkServerHealth = async () => {
  try {
    const response = await fetch('http://localhost:5000/health');
    const data = await response.json();
    return data.status === 'OK';
  } catch (error) {
    console.error('Server health check failed:', error);
    return false;
  }
};

/**
 * List all bookings
 */
export const listBookings = async (limit = 10) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/bookings/list?accessToken=${getAccessToken()}&limit=${limit}`
    );

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error);
    }

    return data.data;
  } catch (error) {
    console.error('Failed to list bookings:', error);
    throw error;
  }
};

export default {
  setAccessToken,
  getAccessToken,
  initializeJobberAuth,
  createBooking,
  createQuote,
  checkServerHealth,
  listBookings
};
