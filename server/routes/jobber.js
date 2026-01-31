import express from 'express';
import jobberService from '../services/jobberService.js';

const router = express.Router();

/**
 * POST /api/jobber/client/create
 * Create a new client in Jobber
 */
router.post('/client/create', async (req, res) => {
  try {
    const { clientData, accessToken } = req.body;

    if (!clientData || !accessToken) {
      return res.status(400).json({ 
        success: false,
        error: 'Client data and access token are required' 
      });
    }

    const client = await jobberService.createClient(clientData, accessToken);

    res.status(201).json({ 
      success: true,
      message: 'Client created successfully',
      data: client
    });

  } catch (error) {
    console.error('Client creation error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to create client'
    });
  }
});

/**
 * GET /api/jobber/client/search
 * Search for a client by email
 */
router.get('/client/search', async (req, res) => {
  try {
    const { email, accessToken } = req.query;

    if (!email || !accessToken) {
      return res.status(400).json({ 
        success: false,
        error: 'Email and access token are required' 
      });
    }

    const client = await jobberService.getClientByEmail(email, accessToken);

    if (!client) {
      return res.status(404).json({ 
        success: false,
        message: 'Client not found'
      });
    }

    res.json({ 
      success: true,
      data: client
    });

  } catch (error) {
    console.error('Client search error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to search client'
    });
  }
});

/**
 * POST /api/jobber/visit/create
 * Create a new visit/appointment
 */
router.post('/visit/create', async (req, res) => {
  try {
    const { visitData, accessToken } = req.body;

    if (!visitData || !accessToken) {
      return res.status(400).json({ 
        success: false,
        error: 'Visit data and access token are required' 
      });
    }

    const visit = await jobberService.createVisit(visitData, accessToken);

    res.status(201).json({ 
      success: true,
      message: 'Visit created successfully',
      data: visit
    });

  } catch (error) {
    console.error('Visit creation error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to create visit'
    });
  }
});

/**
 * GET /api/jobber/visits
 * Get list of visits
 */
router.get('/visits', async (req, res) => {
  try {
    const { accessToken, limit = 10 } = req.query;

    if (!accessToken) {
      return res.status(400).json({ 
        success: false,
        error: 'Access token is required' 
      });
    }

    const visits = await jobberService.listVisits(accessToken, parseInt(limit));

    res.json({ 
      success: true,
      data: visits
    });

  } catch (error) {
    console.error('List visits error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to list visits'
    });
  }
});

/**
 * POST /api/jobber/quote/create
 * Create a quote
 */
router.post('/quote/create', async (req, res) => {
  try {
    const { quoteData, accessToken } = req.body;

    if (!quoteData || !accessToken) {
      return res.status(400).json({ 
        success: false,
        error: 'Quote data and access token are required' 
      });
    }

    const quote = await jobberService.createQuote(quoteData, accessToken);

    res.status(201).json({ 
      success: true,
      message: 'Quote created successfully',
      data: quote
    });

  } catch (error) {
    console.error('Quote creation error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to create quote'
    });
  }
});

/**
 * POST /api/jobber/graphql
 * Execute custom GraphQL query
 */
router.post('/graphql', async (req, res) => {
  try {
    const { query, variables, accessToken } = req.body;

    if (!query || !accessToken) {
      return res.status(400).json({ 
        success: false,
        error: 'GraphQL query and access token are required' 
      });
    }

    const result = await jobberService.makeGraphQLRequest(query, variables, accessToken);

    res.json({ 
      success: true,
      data: result
    });

  } catch (error) {
    console.error('GraphQL execution error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to execute GraphQL query'
    });
  }
});

export default router;
