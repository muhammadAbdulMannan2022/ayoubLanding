import tokenStore from '../utils/tokenStore.js';

/**
 * Middleware to verify access token
 */
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = req.body.accessToken || req.query.accessToken || (authHeader && authHeader.split(' ')[1]);

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token is required'
    });
  }

  // Attach token to request for use in routes
  req.accessToken = token;
  next();
};

/**
 * Middleware to extract user ID from request
 */
export const extractUserId = (req, res, next) => {
  // In a real application, you would extract this from JWT or session
  // For now, we'll use a default user ID
  req.userId = req.body.userId || req.query.userId || 'default_user';
  next();
};

/**
 * Middleware to check if token is expired and refresh if needed
 */
export const refreshTokenIfNeeded = async (req, res, next) => {
  const userId = req.userId || 'default_user';
  
  if (tokenStore.isTokenExpired(userId)) {
    const refreshToken = tokenStore.getRefreshToken(userId);
    
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'Token expired and no refresh token available. Please re-authenticate.'
      });
    }

    try {
      // Refresh the token
      const jobberService = (await import('../services/jobberService.js')).default;
      const newTokenData = await jobberService.refreshAccessToken(refreshToken);
      
      // Store new tokens
      tokenStore.setTokens(
        userId,
        newTokenData.access_token,
        newTokenData.refresh_token,
        newTokenData.expires_in
      );

      // Update request with new token
      req.accessToken = newTokenData.access_token;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Failed to refresh token. Please re-authenticate.'
      });
    }
  } else {
    next();
  }
};

/**
 * Error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Jobber API errors
  if (err.response && err.response.data) {
    return res.status(err.response.status || 500).json({
      success: false,
      error: err.response.data.message || 'Jobber API error',
      details: err.response.data
    });
  }

  // GraphQL errors
  if (err.graphQLErrors) {
    return res.status(400).json({
      success: false,
      error: 'GraphQL error',
      details: err.graphQLErrors
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
};

/**
 * Request logger middleware
 */
export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  
  if (Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  
  next();
};

/**
 * Validate required fields middleware
 */
export const validateFields = (requiredFields) => {
  return (req, res, next) => {
    const missingFields = [];
    
    for (const field of requiredFields) {
      if (!req.body[field] && !req.query[field]) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    next();
  };
};
