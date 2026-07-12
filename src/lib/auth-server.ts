import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key"
);

export interface AuthServerUser {
  id: number;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  name: string;
  phone: string | null;
  image: string | null;
  email_verified: boolean;
  emailVerified: boolean;
}

export async function getUser(): Promise<AuthServerUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);

    const firstName =
      typeof payload.first_name === "string" ? payload.first_name : "";
    const lastName =
      typeof payload.last_name === "string" ? payload.last_name : "";
    const email = typeof payload.email === "string" ? payload.email : "";
    const verifiedValue = payload.email_verified ?? payload.emailVerified ?? true;
    const emailVerified =
      verifiedValue === true || verifiedValue === 1 || verifiedValue === "1";

    return {
      id: Number(payload.id),
      email,
      role: typeof payload.role === "string" ? payload.role : "MEMBER",
      first_name: firstName,
      last_name: lastName,
      name: `${firstName} ${lastName}`.trim() || email,
      phone: typeof payload.phone === "string" ? payload.phone : null,
      image: typeof payload.image === "string" ? payload.image : null,
      email_verified: emailVerified,
      emailVerified,
    };
  } catch {
    return null;
  }
}

export async function isAdmin(): Promise<boolean> {
  const user = await getUser();
  return user?.role === "ADMIN";
}

export async function getSession() {
  const user = await getUser();
  return user ? { user } : null;
}
