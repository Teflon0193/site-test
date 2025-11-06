import { auth } from "./auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export const getSession = async () => {
  return await auth.api.getSession({ headers: await headers() });
};

export const getUser = async () => {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) return null;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      email: true,
      emailVerified: true,
      name: true,
      image: true,
      role: true,
      isApproved: true,
      newsletterOptIn: true,
    },
  });
  return user;
};

export const isAdmin = async () => {
  const user = await getUser();
  return user?.role === "ADMIN";
};
