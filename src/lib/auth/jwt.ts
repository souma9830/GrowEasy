import { SignJWT, jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'groweasy-super-secret-fallback-key-2024'
);

const COOKIE_NAME = 'groweasy_token';

export async function signToken(payload: { userId: string; name: string; email: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET);
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, SECRET);
  return payload as { userId: string; name: string; email: string };
}

export { COOKIE_NAME };
