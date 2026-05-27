import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  aksessifyErrorResponse,
  createFundraisingDonation,
  getAppBaseUrl,
} from "@/lib/aksessify";

export const runtime = "nodejs";

const createDonationSchema = z.object({
  amount: z.number().positive(),
  payment_method: z.enum(["card", "paypal", "mobile_money"]),
  client_request_id: z.string().uuid(),
  donor: z.object({
    name: z.string().trim().min(1).max(160),
    email: z.string().trim().email().max(254),
    phone: z.string().trim().max(40).optional(),
  }),
});

const paymentMethodMap = {
  card: "stripe",
  paypal: "paypal",
  mobile_money: "pawapay",
} as const;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const result = createDonationSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        error: {
          code: "invalid_request",
          message: "Les informations du don sont invalides.",
          details: result.error.flatten().fieldErrors,
        },
      },
      { status: 400 }
    );
  }

  if (
    result.data.payment_method === "mobile_money" &&
    !result.data.donor.phone
  ) {
    return NextResponse.json(
      {
        error: {
          code: "missing_phone",
          message:
            "Indiquez votre numero de telephone pour recevoir la demande de paiement.",
          param: "donor.phone",
        },
      },
      { status: 400 }
    );
  }

  const appBaseUrl = getAppBaseUrl();
  const idempotencyKey = `ccapac-donation-${result.data.client_request_id}`;
  const isMobileMoney = result.data.payment_method === "mobile_money";

  try {
    const donation = await createFundraisingDonation(
      {
        amount: result.data.amount,
        payment_method: paymentMethodMap[result.data.payment_method],
        donor: {
          name: result.data.donor.name,
          email: result.data.donor.email,
          phone: result.data.donor.phone || undefined,
          is_anonymous: false,
        },
        success_url: `${appBaseUrl}/don-merci?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appBaseUrl}/?don=cancelled#fundraising`,
        pawapay: isMobileMoney ? {} : undefined,
        metadata: {
          source: "ccapac_homepage",
          client_request_id: result.data.client_request_id,
        },
      },
      idempotencyKey
    );

    if (!isMobileMoney && !donation.checkout_url) {
      return NextResponse.json(
        {
          error: {
            code: "missing_checkout_url",
            message: "Le paiement ne peut pas etre demarre pour le moment.",
          },
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      donation_id: donation.id,
      checkout_url: donation.checkout_url,
      status: donation.status,
      provider_instructions: donation.provider_instructions || null,
      pawapay: donation.pawapay || null,
    });
  } catch (error) {
    const response = aksessifyErrorResponse(error);
    return NextResponse.json(response.body, { status: response.status });
  }
}
