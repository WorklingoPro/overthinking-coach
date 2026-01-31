const API_URL = '/api/coach';

class ApiService {
  async getCoaching(userInput, language) {
    try {
      const response = await fetch(`${API_URL}/api/coach`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInput,
          language
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get coaching response');
      }

      return data;
    } catch (error) {
      // Check if offline
      if (!navigator.onLine) {
        throw new Error('OFFLINE');
      }
      
      throw error;
    }
  }

  async healthCheck() {
    try {
      const response = await fetch(`${API_URL}/api/health`);
      return response.ok;
    } catch {
      return false;
    }
  }

  // PLACEHOLDER: Stripe checkout (future implementation)
  async createCheckout(priceId) {
    throw new Error('Payment integration not yet implemented');
    
    /* FUTURE IMPLEMENTATION:
    const response = await fetch(`${API_URL}/api/create-checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/cancel`
      })
    });
    
    const { sessionUrl } = await response.json();
    window.location.href = sessionUrl;
    */
  }
}

export default new ApiService();
