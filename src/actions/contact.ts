"use server";

import { sendEmail } from "../services/mailServices";

export async function sendContactEmail(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) {
  const { firstName, lastName, email, phone, subject, message } = data;
  const html = `
    <p>Prénom: ${firstName}</p>
    <p>Nom: ${lastName}</p>
    <p>Email: ${email}</p>
    <p>Numéro de téléphone: ${phone}</p>
    <p>Sujet: ${subject}</p>
    <p>Message: ${message}</p>
  `;
  await sendEmail({
    to: "danmuamba81@gmail.com",
    subject: "Formulaire de contact",
    html,
  });
}
