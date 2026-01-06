import { adminAuth } from './firebase-admin';

// Prefer server-only env var to avoid leaking admin email to clients
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'm.h.ratul18@gmail.com';

function getAuthHeader(request) {
  const header = request.headers.get('authorization') || '';
  if (!header.startsWith('Bearer ')) {
    throw new Error('Unauthorized');
  }
  return header.substring('Bearer '.length).trim();
}

export async function requireAuth(request) {
  if (!adminAuth) {
    throw new Error('Auth service unavailable');
  }
  const token = getAuthHeader(request);
  const decodedToken = await adminAuth.verifyIdToken(token);
  return {
    uid: decodedToken.uid,
    email: decodedToken.email || '',
    decodedToken
  };
}

export function assertSameUserOrAdmin(decodedToken, userId) {
  if (!userId) throw new Error('Missing userId');
  if (decodedToken.uid !== userId && (decodedToken.email || '').toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    throw new Error('Forbidden');
  }
}

export function assertAdmin(decodedToken) {
  if ((decodedToken.email || '').toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    throw new Error('Forbidden');
  }
}
