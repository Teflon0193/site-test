import { auth } from "./auth"; // path to your Better Auth server instance
import { headers } from "next/headers";

export const getSession = async () => {
  return await auth.api.getSession({ headers: await headers() });
};

export const getUser = async () => {
  const session = await getSession();
  return session?.user;
};
