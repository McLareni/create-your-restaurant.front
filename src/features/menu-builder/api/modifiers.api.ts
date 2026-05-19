const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const modifiersApi = {
  async getGroups(restaurantId: number) {
    const response = await fetch(`${BASE_URL}/restaurants/${restaurantId}/modifiers`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch modifiers');
    return response.json();
  },

  async createGroup(restaurantId: number, data: any) {
    const response = await fetch(`${BASE_URL}/restaurants/${restaurantId}/modifiers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to create modifier group');
    return response.json();
  },

  async updateGroup(restaurantId: number, groupId: string, data: any) {
    const response = await fetch(`${BASE_URL}/restaurants/${restaurantId}/modifiers/${groupId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to update modifier group');
    return response.json();
  },

  async deleteGroup(restaurantId: number, groupId: string) {
    const response = await fetch(`${BASE_URL}/restaurants/${restaurantId}/modifiers/${groupId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to delete modifier group');
    return response.json();
  }
};