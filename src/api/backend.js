/**
 * Backend API Integration
 * Handles all communication with the Express backend server
 */

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Create a booking
 * @param {Object} bookingData - Booking information
 * @returns {Promise<Object>} - API response
 */
export const createBooking = async (bookingData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData)
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to create booking');
    }

    return data;
  } catch (error) {
    console.error('Booking creation error:', error);
    throw error;
  }
};

/**
 * Create a quote and send email
 * @param {Object} quoteData - Quote information
 * @returns {Promise<Object>} - API response
 */
export const createQuote = async (quoteData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/quote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quoteData)
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to create quote');
    }

    return data;
  } catch (error) {
    console.error('Quote creation error:', error);
    throw error;
  }
};

/**
 * Check server health
 * @returns {Promise<boolean>} - Server status
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

export default {
  createBooking,
  createQuote,
  checkServerHealth
};
