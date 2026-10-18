export type MemberStatus =
  | "CONTRIBUTED"
  | "WAITING"
  | "PENDING"
  | "PAYOUT_RECEIVED"
  | "LATE";

export interface Member {
  id: string;
  name: string;
  role: string;
  status: MemberStatus;
  avatarUrl?: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  memberCount?: number;
  /** Currency label used for display, e.g. "NGN". */
  currency?: string;
  /** Recurring contribution amount per member. */
  contributionAmount?: number;
}
