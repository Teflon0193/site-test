"use server";

import { sendContactFormEmail } from "@/services/mailServices";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "danmuamba81@gmail.com";

export async function sendContactEmail(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) {
  await sendContactFormEmail(ADMIN_EMAIL, data);
}
