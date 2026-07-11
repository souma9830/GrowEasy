import { cookies } from 'next/headers';
import { verifyToken, COOKIE_NAME } from './jwt';

/**
 * Get the current authenticated user's payload from the request cookie.
 * Returns null if not authenticated.
 */
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    return await verifyToken(token);
  } catch {
    return null;
  }
}
