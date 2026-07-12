import { getUser } from "@/lib/auth-server";
import type { User } from "@/services/auth";
import Header from "./header/Header";

export default async function HeaderWrapper() {
  const authenticatedUser = await getUser();

  const user: User | null = authenticatedUser
    ? {
        id: authenticatedUser.id,
        email: authenticatedUser.email,
        first_name: authenticatedUser.first_name,
        last_name: authenticatedUser.last_name,
        phone: authenticatedUser.phone,
        role: authenticatedUser.role,
        email_verified: authenticatedUser.email_verified,
      }
    : null;

  return <Header user={user} />;
}
