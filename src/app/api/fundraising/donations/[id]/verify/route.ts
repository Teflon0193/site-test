import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  aksessifyErrorResponse,
  verifyFundraisingDonation,
} from "@/lib/aksessify";

export const runtime = "nodejs";

const paramsSchema = z.object({
  id: z.string().uuid(),
});

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
          message: "Ce don ne peut pas etre retrouve.",
        },
      },
      { status: 400 }
    );
  }

  try {
    const donation = await verifyFundraisingDonation(result.data.id);

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
