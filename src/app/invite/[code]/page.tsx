import type { Metadata } from "next";
import { InviteConfirm } from "@/components/groups/InviteConfirm";

/**
 * Metadata for the invite landing route (/invite/[code]).
 *
 * Design Decision:
 * Invite codes are resolved on the client side (in InviteConfirm via groupsService / localStorage
 * in the current prototype). Because specific savings group details (group name, contribution amount)
 * cannot be determined on the server without client state or server-side session persistence, this route
 * defines deliberate, invitation-focused metadata with OpenGraph and Twitter card previews.
 *
 * This ensures that when an invite link is shared on WhatsApp, Telegram, or other social platforms:
 * 1. The preview explicitly explains that it is an invitation to join a Kolo savings circle on Stellar.
 * 2. Unresolved or expired invite codes still present a clear, sensible preview rather than
 *    falling back to generic root marketing metadata.
 */
export const metadata: Metadata = {
  title: "Join a Savings Circle — Kolo",
  description:
    "You have been invited to join a community savings circle on Kolo. Coordinate contributions and rotating payouts on Stellar.",
  openGraph: {
    title: "Join a Savings Circle — Kolo",
    description:
      "You have been invited to join a community savings circle on Kolo. Coordinate contributions and rotating payouts on Stellar.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Join a Savings Circle — Kolo",
    description:
      "You have been invited to join a community savings circle on Kolo. Coordinate contributions and rotating payouts on Stellar.",
  },
};

// In Next.js 16, dynamic route `params` is a Promise and must be awaited.
export default async function InvitePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  return <InviteConfirm code={code} />;
}
