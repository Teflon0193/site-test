import { NextRequest, NextResponse } from "next/server";
import type { AksessifyDonation } from "@/lib/aksessify";
import {
  aksessifyErrorResponse,
  getFundraisingCampaign,
  listFundraisingDonations,
} from "@/lib/aksessify";
import { getUser } from "@/lib/auth-server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

const donationStatuses: AksessifyDonation["status"][] = [
  "pending",
  "succeeded",
  "failed",
  "cancelled",
  "refunded",
];

function isDonationStatus(
  value: string | null
): value is AksessifyDonation["status"] {
  return donationStatuses.includes(value as AksessifyDonation["status"]);
}

function paymentMethodLabel(method: AksessifyDonation["payment_method"]) {
  const labels: Record<AksessifyDonation["payment_method"], string> = {
    stripe: "Carte bancaire",
    paypal: "PayPal",
    pawapay: "Mobile Money",
  };

  return labels[method];
}

export async function GET(req: NextRequest) {
  const user = await getUser();

  if (!user || user.role !== "ADMIN") {
    return new NextResponse("Non autorise", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const paymentMethod = searchParams.get("payment_method");
  const selectedStatus = isDonationStatus(status) ? status : undefined;

  try {
    const [campaignData, donationsList] = await Promise.all([
      getFundraisingCampaign(),
      listFundraisingDonations({ status: selectedStatus, limit: 100 }),
    ]);

    const filteredDonations =
      paymentMethod && paymentMethod !== "all"
        ? donationsList.data.filter(
            (donation) => donation.payment_method === paymentMethod
          )
        : donationsList.data;

    const donationIds = filteredDonations.map((donation) => donation.id);
    const notifications = donationIds.length
      ? await prisma.fundraisingDonationNotification.findMany({
          where: { donationId: { in: donationIds } },
          select: {
            donationId: true,
            notificationStatus: true,
            notifiedAt: true,
            donorNotificationStatus: true,
            donorNotifiedAt: true,
            donorIsMember: true,
          },
        })
      : [];
    const notificationByDonationId = new Map(
      notifications.map((notification) => [
        notification.donationId,
        notification,
      ])
    );

    return NextResponse.json({
      campaign: {
        id: campaignData.campaign.id,
        title: campaignData.campaign.title,
        status: campaignData.campaign.status,
        goal_amount: campaignData.campaign.goal_amount,
        currency: campaignData.campaign.currency,
      },
      stats: {
        raised_amount: campaignData.stats.raised_amount,
        progress_percent: campaignData.stats.progress_percent,
        succeeded_donations_count:
          campaignData.stats.succeeded_donations_count,
        unique_donors_count: campaignData.stats.unique_donors_count,
        pending_donations_count: campaignData.stats.pending_donations_count,
      },
      donations: filteredDonations.map((donation) => {
        const notification = notificationByDonationId.get(donation.id);

        return {
          id: donation.id,
          amount: donation.amount,
          currency: donation.currency,
          status: donation.status,
          payment_method: donation.payment_method,
          payment_method_label: paymentMethodLabel(donation.payment_method),
          donor: donation.donor,
          created_at: donation.created_at,
          updated_at: donation.updated_at,
          succeeded_at: donation.succeeded_at || null,
          notification_status: notification?.notificationStatus || "none",
          notified_at: notification?.notifiedAt?.toISOString() || null,
          donor_notification_status:
            notification?.donorNotificationStatus || "none",
          donor_notified_at:
            notification?.donorNotifiedAt?.toISOString() || null,
          donor_is_member: notification?.donorIsMember ?? null,
        };
      }),
      has_more: donationsList.has_more || false,
      next_cursor: donationsList.next_cursor || null,
    });
  } catch (error) {
    const response = aksessifyErrorResponse(error);
    return NextResponse.json(response.body, { status: response.status });
  }
}
