import { POST } from './route';
import { NextRequest } from 'next/server';

jest.mock('@/shared/api/base-url', () => ({
  getApiBaseUrl: jest.fn(() => 'http://localhost:3001'),
}));

// Mock fetch globally
global.fetch = jest.fn();

describe('Request Login Code API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call backend and return success', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/auth/request', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com' }),
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({ message: 'auth.code_sent' }),
    });

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3001/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com' }),
    });

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('should forward backend error status', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/auth/request', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com' }),
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: async () => 'Bad Request',
    });
    
    // Spy to suppress console.error in tests
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.errorCode).toBe('serverError');
    
    consoleSpy.mockRestore();
  });

  it('should return 500 on fetch failure', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/auth/request', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com' }),
    });

    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Fetch failed'));
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.errorCode).toBe('serverError');
    
    consoleSpy.mockRestore();
  });
});
