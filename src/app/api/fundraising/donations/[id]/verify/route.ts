import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import {
  type AksessifyDonation,
  aksessifyErrorResponse,
  verifyFundraisingDonation,
} from "@/lib/aksessify";
import { sendFundraisingDonationSucceededEmail } from "@/services/mailServices";

export const runtime = "nodejs";

const paramsSchema = z.object({
  id: z.string().uuid(),
});

const ADMIN_EMAIL =
  process.env.FUNDRAISING_ADMIN_EMAIL || process.env.ADMIN_EMAIL;

function paymentMethodLabel(method: AksessifyDonation["payment_method"]) {
  const labels: Record<AksessifyDonation["payment_method"], string> = {
    stripe: "Carte bancaire",
    paypal: "PayPal",
    pawapay: "Mobile Money",
  };

  return labels[method];
}

async function notifyAdminOnce(donation: AksessifyDonation) {
  if (donation.status !== "succeeded" || !ADMIN_EMAIL) return;

  const existing = await prisma.fundraisingDonationNotification.findUnique({
    where: { donationId: donation.id },
  });

  if (
    existing?.notificationStatus === "sent" ||
    existing?.notificationStatus === "sending"
  ) {
    return;
  }

  if (!existing) {
    await prisma.fundraisingDonationNotification.create({
      data: {
        donationId: donation.id,
        status: donation.status,
        amount: donation.amount,
        currency: donation.currency,
        paymentMethod: donation.payment_method,
        donorName: donation.donor.name,
        donorEmail: donation.donor.email,
        donorPhone: donation.donor.phone || null,
        notificationStatus: "sending",
      },
    });
  } else {
    const locked = await prisma.fundraisingDonationNotification.updateMany({
      where: {
        donationId: donation.id,
        notificationStatus: "failed",
      },
      data: {
        notificationStatus: "sending",
        status: donation.status,
      },
    });

    if (locked.count === 0) return;
  }

  try {
    await sendFundraisingDonationSucceededEmail(ADMIN_EMAIL, {
      donationId: donation.id,
      donorName: donation.donor.name,
      donorEmail: donation.donor.email,
      donorPhone: donation.donor.phone,
      amount: donation.amount,
      currency: donation.currency,
      paymentMethod: paymentMethodLabel(donation.payment_method),
      succeededAt: donation.succeeded_at,
    });

    await prisma.fundraisingDonationNotification.update({
      where: { donationId: donation.id },
      data: {
        notificationStatus: "sent",
        notifiedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("[Fundraising] Echec notification admin:", error);

    await prisma.fundraisingDonationNotification.update({
      where: { donationId: donation.id },
      data: {
        notificationStatus: "failed",
      },
    });
  }
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const result = paramsSchema.safeParse(resolvedParams);

  if (!result.success) {
    return NextResponse.json(
      {
        error: {
          code: "invalid_donation_id",
          message: "Ce don ne peut pas etre retrouvé.",
        },
      },
      { status: 400 }
    );
  }

  try {
    const donation = await verifyFundraisingDonation(result.data.id);
    await notifyAdminOnce(donation);

    return NextResponse.json({
      id: donation.id,
      status: donation.status,
      amount: donation.amount,
      currency: donation.currency,
      payment_method: donation.payment_method,
      provider_instructions: donation.provider_instructions || null,
      pawapay: donation.pawapay || null,
      succeeded_at: donation.succeeded_at || null,
    });
  } catch (error) {
    const response = aksessifyErrorResponse(error);
    return NextResponse.json(response.body, { status: response.status });
  }
}
