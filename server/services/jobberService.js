import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TOKEN_FILE = path.join(__dirname, "../tokens.json");

// Prevent multiple simultaneous token refresh attempts
let tokenRefreshPromise = null;

class JobberService {
  constructor() {
    this.apiUrl = process.env.JOBBER_API_URL;
    this.clientId = process.env.CLIENT_ID;
    this.clientSecret = process.env.CLIENT_SECRET;
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;

    // Load tokens on initialization
    this.loadTokens();

    // Auto-refresh expired tokens on startup
    this.checkAndRefreshTokensOnStartup();
  }

  /**
   * Ensure token is fresh before making API requests
   * This runs silently and automatically refreshes if token expires in < 5 minutes
   */
  async ensureTokenFresh() {
    // If no tokens at all, we can't proceed
    if (!this.accessToken || !this.refreshToken) {
      throw new Error(
        "❌ No authentication tokens found. Please authenticate at /api/auth/login",
      );
    }

    const now = Date.now();
    const timeUntilExpiry = this.tokenExpiry - now;

    // Token is still valid for > 5 minutes, no need to refresh
    if (timeUntilExpiry > 5 * 60 * 1000) {
      return;
    }

    // Token is expiring soon, need to refresh
    console.log("🔄 Token expiring soon, auto-refreshing...");

    // Prevent multiple simultaneous refresh attempts
    if (tokenRefreshPromise) {
      return tokenRefreshPromise;
    }

    tokenRefreshPromise = (async () => {
      try {
        await this.refreshAccessToken(this.refreshToken);
        console.log("✅ Token auto-refreshed successfully");
        tokenRefreshPromise = null;
      } catch (error) {
        tokenRefreshPromise = null;
        console.error("❌ Auto-refresh failed:", error.message);
        throw new Error(
          "Token refresh failed - re-authentication may be required",
        );
      }
    })();

    return tokenRefreshPromise;
  }

  async checkAndRefreshTokensOnStartup() {
    try {
      if (!this.accessToken || !this.refreshToken) {
        console.warn(
          "⚠️  No tokens found. Please authenticate: /api/auth/login",
        );
        return;
      }

      const now = Date.now();
      const timeUntilExpiry = this.tokenExpiry - now;
      const hoursUntilExpiry = timeUntilExpiry / (1000 * 60 * 60);

      // If token expires within 1 hour, refresh it
      if (timeUntilExpiry < 3600000) {
        console.log(
          `⏰ Token expires in ${Math.floor(hoursUntilExpiry)} hours. Attempting auto-refresh...`,
        );
        try {
          await this.refreshAccessToken(this.refreshToken);
          console.log("✅ Tokens auto-refreshed on startup!");
        } catch (err) {
          console.warn("⚠️  Auto-refresh failed on startup:", err.message);
        }
      } else {
        console.log(
          `✅ Tokens valid for ${Math.floor(hoursUntilExpiry)} hours`,
        );
      }
    } catch (error) {
      console.error("Error checking tokens on startup:", error.message);
    }
  }

  loadTokens() {
    try {
      if (fs.existsSync(TOKEN_FILE)) {
        const data = fs.readFileSync(TOKEN_FILE, "utf8");
        const tokens = JSON.parse(data);
        this.accessToken = tokens.access_token;
        this.refreshToken = tokens.refresh_token;
        this.tokenExpiry = tokens.expiry;
        console.log("✅ Loaded Jobber tokens from file");
      }
    } catch (error) {
      console.error("Failed to load access tokens:", error.message);
    }
  }

  saveTokens(data) {
    try {
      const tokens = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expiry: Date.now() + data.expires_in * 1000,
      };

      this.accessToken = tokens.access_token;
      this.refreshToken = tokens.refresh_token;
      this.tokenExpiry = tokens.expiry;

      fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2));
      console.log("✅ Jobber tokens saved to file");
    } catch (error) {
      console.error("Failed to save access tokens:", error.message);
    }
  }

  /**
   * Get OAuth authorization URL
   */
  getAuthorizationUrl() {
    const redirectUri = process.env.REDIRECT_URI;
    const scope =
      "client:read,client:write,job:read,job:write,visit:read,visit:write,quote:read,quote:write";

    return `https://api.getjobber.com/api/oauth/authorize?client_id=${this.clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async getAccessToken(authorizationCode) {
    try {
      const response = await axios.post(
        "https://api.getjobber.com/api/oauth/token",
        {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code: authorizationCode,
          grant_type: "authorization_code",
          redirect_uri: process.env.REDIRECT_URI,
        },
      );

      this.saveTokens(response.data);

      return response.data;
    } catch (error) {
      console.error(
        "Error getting access token:",
        error.response?.data || error.message,
      );
      throw new Error("Failed to get access token");
    }
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshToken) {
    try {
      const response = await axios.post(
        "https://api.getjobber.com/api/oauth/token",
        {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: refreshToken || this.refreshToken,
          grant_type: "refresh_token",
        },
      );

      this.saveTokens(response.data);

      return response.data;
    } catch (error) {
      console.error(
        "Error refreshing access token:",
        error.response?.data || error.message,
      );
      throw new Error("Failed to refresh access token");
    }
  }

  /**
   * Make GraphQL request to Jobber API
   * Automatically ensures token is fresh before each request
   */
  async makeGraphQLRequest(query, variables = {}, token = null) {
    // Ensure token is fresh before making the request (automatic refresh if needed)
    if (!token) {
      await this.ensureTokenFresh();
    }

    const authToken = token || this.accessToken;

    if (!authToken) {
      throw new Error(
        "❌ No access token available. Please authenticate at /api/auth/login",
      );
    }

    console.log(`📡 Sending Jobber Request to: '${this.apiUrl}'`);

    try {
      const response = await axios.post(
        this.apiUrl,
        {
          query,
          variables,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
            "X-JOBBER-GRAPHQL-VERSION": "2023-11-15",
          },
        },
      );

      if (response.data.errors) {
        console.error("GraphQL Errors:", response.data.errors);
        throw new Error(response.data.errors[0].message);
      }

      return response.data.data;
    } catch (error) {
      // Check for 401 Unauthorized (expired token)
      const is401 = error.response?.status === 401;
      const isExpiredToken =
        error.message &&
        (error.message.includes("Access token expired") ||
          error.message.includes("401"));

      if ((is401 || isExpiredToken) && this.refreshToken && !token) {
        console.log("🔄 Token expired (401), forcing refresh...");
        try {
          await this.refreshAccessToken(this.refreshToken);
          const retryToken = this.accessToken;

          // Retry request with new token
          console.log("🔄 Retrying request with new token...");
          const retryResponse = await axios.post(
            this.apiUrl,
            { query, variables },
            {
              headers: {
                Authorization: `Bearer ${retryToken}`,
                "Content-Type": "application/json",
                "X-JOBBER-GRAPHQL-VERSION": "2023-11-15",
              },
            },
          );

          if (retryResponse.data.errors) {
            console.error(
              "GraphQL Errors on retry:",
              retryResponse.data.errors,
            );
            throw new Error(retryResponse.data.errors[0].message);
          }

          return retryResponse.data.data;
        } catch (refreshErr) {
          console.error("Failed to refresh and retry:", refreshErr.message);
          throw refreshErr;
        }
      }

      console.error(
        "GraphQL Request Error:",
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  /**
   * Create a new client in Jobber
   */
  async createClient(clientData, token) {
    const mutation = `
      mutation CreateClient($input: ClientCreateInput!) {
        clientCreate(input: $input) {
          client {
            id
            name
            firstName
            lastName
            emails {
              address
            }
            phones {
              number
            }
            billingAddress {
              street1
              street2
              city
              province
              postalCode
              country
            }
          }
          userErrors {
            message
            path
          }
        }
      }
    `;

    const variables = {
      input: {
        firstName: clientData.firstName,
        lastName: clientData.lastName,
        companyName: clientData.companyName || null,
        emails: clientData.email
          ? [{ address: clientData.email, primary: true }]
          : [],
        phones: clientData.phone
          ? [{ number: clientData.phone, primary: true }]
          : [],
        billingAddress: clientData.address
          ? {
              street1: clientData.address.street1,
              street2: clientData.address.street2 || null,
              city: clientData.address.city,
              province: clientData.address.province,
              postalCode: clientData.address.postalCode,
              country: clientData.address.country || "US",
            }
          : null,
      },
    };

    const result = await this.makeGraphQLRequest(mutation, variables, token);

    if (result.clientCreate.userErrors.length > 0) {
      throw new Error(result.clientCreate.userErrors[0].message);
    }

    return result.clientCreate.client;
  }

  /**
   * Create a visit/appointment in Jobber
   */
  async createVisit(visitData, token) {
    // 1. Get client's property (required for Request)
    // Fix: Inline the ID to bypass strict variable typing issues (String vs EncodedId)
    console.log("visitData", visitData, "\n", token);
    const propQuery = `
      query {
        client(id: "${visitData.clientId}") {
          properties {
            id
            address {
              street1
              city
            }
          }
        }
      }
    `;

    // No variables needed for inlined query
    const propResult = await this.makeGraphQLRequest(propQuery, {}, token);

    // Handle both list structure or single object structure just in case
    let properties =
      propResult.client?.properties?.nodes || propResult.client?.properties;
    let propertyId = Array.isArray(properties)
      ? properties[0]?.id
      : properties?.id;

    if (Array.isArray(properties)) {
      propertyId = properties[0]?.id;
    } else if (properties?.nodes) {
      propertyId = properties.nodes[0]?.id;
    } else if (properties?.id) {
      propertyId = properties.id;
    } else if (properties && typeof properties === "object") {
      // If it's a single object without ID at top but maybe inside (unlikely)
      // But based on error, properties is likely a LIST or Single Object.
      // It seems properties IS the property object or list of them.
      // Let's assume list if keys like '0' exist
      propertyId = properties.id;
    }

    if (!propertyId) {
      console.log(
        "⚠️  No property found. Continuing without property for this visit...",
      );
      // PropertyCreateInput doesn't support address fields in Jobber's current API
      // We'll proceed without a property - Job can be created without propertyId
      propertyId = null;
    }
    // 2. Create Request (booking/job for the client)
    // Using 'requestCreate' to create a booking request
    const mutation = `
      mutation CreateRequest($input: RequestCreateInput!) {
        requestCreate(input: $input) {
          request {
            id
            title
            isScheduled
            client {
              id
              name
            }
          }
          userErrors {
            message
            path
          }
        }
      }
    `;

    const requestInput = {
      clientId: visitData.clientId,
      title: visitData.title || "Free In-Home Consultation",
    };

    const variables = {
      input: requestInput,
    };

    const result = await this.makeGraphQLRequest(mutation, variables, token);

    console.log(
      "📋 Request creation response:",
      JSON.stringify(result, null, 2),
    );

    // Handle the response
    if (!result) {
      throw new Error("No response from Jobber API");
    }

    // Check if requestCreate exists in the response
    if (!result.requestCreate) {
      console.error("Unexpected response structure:", result);
      throw new Error(
        "Failed to create request - unexpected response structure from Jobber",
      );
    }

    // Check for user errors
    if (
      result.requestCreate.userErrors &&
      result.requestCreate.userErrors.length > 0
    ) {
      throw new Error(result.requestCreate.userErrors[0].message);
    }

    // Extract request data
    if (!result.requestCreate.request) {
      throw new Error("Request created but no request data returned");
    }

    const request = result.requestCreate.request;
    console.log("✅ Jobber Request Created:", request.id);

    return {
      id: request.id,
      title: request.title,
      isScheduled: request.isScheduled,
      client: request.client,
    };
  }

  /**
   * Create a quote in Jobber
   */
  async createQuote(quoteData, token) {
    const mutation = `
      mutation CreateQuote($input: QuoteCreateInput!) {
        quoteCreate(input: $input) {
          quote {
            id
            quoteNumber
            title
            subject
            message
            total
            client {
              id
              name
            }
          }
          userErrors {
            message
            path
          }
        }
      }
    `;

    const variables = {
      input: {
        clientId: quoteData.clientId,
        title: quoteData.title,
        subject: quoteData.subject || "Flooring Project Quote",
        message: quoteData.message || quoteData.notes || null,
        lineItems: quoteData.lineItems || [],
      },
    };

    const result = await this.makeGraphQLRequest(mutation, variables, token);

    if (result.quoteCreate.userErrors.length > 0) {
      throw new Error(result.quoteCreate.userErrors[0].message);
    }

    return result.quoteCreate.quote;
  }

  /**
   * Get client by email
   */
  async getClientByEmail(email, token) {
    if (!email) return null;

    const query = `
      query GetClients($first: Int) {
        clients(first: $first) {
          nodes {
            id
            name
            firstName
            lastName
            emails {
              address
            }
            phones {
              number
            }
          }
        }
      }
    `;

    const variables = { first: 100 }; // Increase to 200 if needed; most accounts have <100 clients

    const result = await this.makeGraphQLRequest(query, variables, token);

    const nodes = result.clients?.nodes || [];

    const lowerEmail = email.toLowerCase().trim();

    // Find client with exact email match (case-insensitive)
    const matchingClient = nodes.find((client) =>
      client.emails?.some(
        (emailObj) => emailObj.address?.toLowerCase().trim() === lowerEmail,
      ),
    );

    return matchingClient || null;
  }

  /**
   * List all visits
   */
  async listVisits(token, limit = 10) {
    const query = `
      query ListVisits($first: Int) {
        visits(first: $first) {
          nodes {
            id
            title
            startAt
            endAt
            anytime
            client {
              id
              name
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `;

    const variables = { first: limit };
    const result = await this.makeGraphQLRequest(query, variables, token);
    return result.visits;
  }
}

export default new JobberService();
