import { POST } from './route';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

jest.mock('@/shared/api/base-url', () => ({
  getApiBaseUrl: jest.fn(() => 'http://localhost:3001'),
}));

// Mock fetch globally
global.fetch = jest.fn();

describe('Logout API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should clear gustio_session cookie and call backend logout', async () => {
    // Setup mock request with cookie
    const mockRequest = new NextRequest('http://localhost:3000/api/auth/logout', {
      method: 'POST',
    });
    mockRequest.cookies.set('gustio_session', 'test-session-token');

    // Setup fetch mock
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const response = await POST(mockRequest);

    // Verify fetch was called with the correct URL, method, and headers
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3001/users/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'gustio_session=test-session-token',
      },
    });

    // Verify response is successful
    const data = await response.json();
    expect(data.success).toBe(true);

    // Verify the response sets the cookie to empty and maxAge 0
    const setCookieHeader = response.headers.get('set-cookie');
    expect(setCookieHeader).toContain('gustio_session=;');
    expect(setCookieHeader).toContain('Max-Age=0');
  });

  it('should ignore backend fetch errors and still clear cookie', async () => {
    // Setup mock request with cookie
    const mockRequest = new NextRequest('http://localhost:3000/api/auth/logout', {
      method: 'POST',
    });
    mockRequest.cookies.set('gustio_session', 'test-session-token');

    // Setup fetch mock to reject (simulate network error)
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    // Spy on console.error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const response = await POST(mockRequest);

    // Verify response is still successful for the user
    const data = await response.json();
    expect(data.success).toBe(true);

    // Verify the cookie was still cleared
    const setCookieHeader = response.headers.get('set-cookie');
    expect(setCookieHeader).toContain('gustio_session=;');
    expect(setCookieHeader).toContain('Max-Age=0');
    
    // Verify error was logged
    expect(consoleSpy).toHaveBeenCalledWith('Failed to call backend logout:', expect.any(Error));
    
    consoleSpy.mockRestore();
  });

  it('should skip backend call if no token exists but still clear cookie', async () => {
    // Setup mock request WITHOUT cookie
    const mockRequest = new NextRequest('http://localhost:3000/api/auth/logout', {
      method: 'POST',
    });

    const response = await POST(mockRequest);

    // Verify fetch was NOT called
    expect(global.fetch).not.toHaveBeenCalled();

    // Verify the cookie was still cleared
    const setCookieHeader = response.headers.get('set-cookie');
    expect(setCookieHeader).toContain('gustio_session=;');
    expect(setCookieHeader).toContain('Max-Age=0');
  });
});
