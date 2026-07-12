import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

export async function getUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.id as number,
      email: payload.email as string,
      role: payload.role as string,
      first_name: payload.first_name as string,
      last_name: payload.last_name as string,
    };
  } catch (error) {
    return null;
  }
}

export async function isAdmin() {
  const user = await getUser();
  return user?.role === 'ADMIN';
}

// If you need a session-like object for compatibility
export async function getSession() {
  const user = await getUser();
  if (!user) return null;
  return { user };
}