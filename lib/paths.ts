// Centralized path management for basePath support
// Always use /ponder for both local and production (ensures dev/prod parity)
export const BASE_PATH = '/ponder';

export function appPath(path: string): string {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_PATH}${normalizedPath}`;
}

export function getAppUrl(path: string = ''): string {
  if (typeof window === 'undefined') {
    // Server-side: use environment variable or default
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return `${baseUrl}${appPath(path)}`;
  }
  // Client-side: use current origin
  return `${window.location.origin}${appPath(path)}`;
}
