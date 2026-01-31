/**
 * Token Storage Utility
 * 
 * In production, you should use a database or secure session storage.
 * This is a simple in-memory storage for development purposes.
 */

class TokenStore {
  constructor() {
    this.tokens = new Map();
  }

  /**
   * Store access token and refresh token
   */
  setTokens(userId, accessToken, refreshToken, expiresIn) {
    this.tokens.set(userId, {
      accessToken,
      refreshToken,
      expiresAt: Date.now() + (expiresIn * 1000)
    });
  }

  /**
   * Get access token for a user
   */
  getAccessToken(userId) {
    const tokenData = this.tokens.get(userId);
    
    if (!tokenData) {
      return null;
    }

    // Check if token is expired
    if (Date.now() >= tokenData.expiresAt) {
      return null;
    }

    return tokenData.accessToken;
  }

  /**
   * Get refresh token for a user
   */
  getRefreshToken(userId) {
    const tokenData = this.tokens.get(userId);
    return tokenData ? tokenData.refreshToken : null;
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(userId) {
    const tokenData = this.tokens.get(userId);
    
    if (!tokenData) {
      return true;
    }

    return Date.now() >= tokenData.expiresAt;
  }

  /**
   * Remove tokens for a user
   */
  removeTokens(userId) {
    this.tokens.delete(userId);
  }

  /**
   * Clear all tokens
   */
  clearAll() {
    this.tokens.clear();
  }
}

export default new TokenStore();
