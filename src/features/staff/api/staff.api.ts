const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const staffApi = {
  async getStaff(restaurantId: number) {
    const response = await fetch(`${BASE_URL}/restaurants/${restaurantId}/staff`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch staff');
    return response.json();
  },

  async createStaff(restaurantId: number, data: any) {
    const response = await fetch(`${BASE_URL}/restaurants/${restaurantId}/staff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to create staff');
    return response.json();
  },

  async updateStaff(restaurantId: number, staffId: string, data: any) {
    const response = await fetch(`${BASE_URL}/restaurants/${restaurantId}/staff/${staffId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to update staff');
    return response.json();
  },

  async deleteStaff(restaurantId: number, staffId: string) {
    const response = await fetch(`${BASE_URL}/restaurants/${restaurantId}/staff/${staffId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to delete staff');
    return response.json();
  }
};