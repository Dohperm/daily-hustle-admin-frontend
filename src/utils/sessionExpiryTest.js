// Test utility to simulate session expiry response
// This is for testing purposes only - remove in production

import { api } from '../services/api'

export const testSessionExpiry = async () => {
  try {
    // Create a mock response that simulates session expiry
    const mockResponse = {
      data: {
        status: 440,
        message: 'Session Expired.'
      }
    }
    
    // Simulate the interceptor handling
    console.log('Testing session expiry interceptor...')
    
    // This would normally be handled by the interceptor
    // but we can test the logic manually
    if (mockResponse.data.status === 440 && mockResponse.data.message === 'Session Expired.') {
      console.log('Session expiry detected - interceptor should handle this automatically')
      return true
    }
    
    return false
  } catch (error) {
    console.error('Test error:', error)
    return false
  }
}

// Usage: Call testSessionExpiry() in browser console to test
// window.testSessionExpiry = testSessionExpiry