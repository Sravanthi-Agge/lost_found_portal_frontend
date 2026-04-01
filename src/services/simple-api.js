// Simple API service without axios
const API_BASE_URL = 'http://localhost:8080/api';

export const simpleItemAPI = {
  add: async (itemData) => {
    try {
      console.log('Simple API - Adding item:', itemData);
      
      const response = await fetch(`${API_BASE_URL}/items/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(itemData),
      });
      
      console.log('Simple API - Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Simple API - Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Simple API - Success:', data);
      return { data };
    } catch (error) {
      console.error('Simple API - Network error:', error);
      throw error;
    }
  }
};
