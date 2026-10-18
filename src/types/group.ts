export interface Group {
  id: string;
  name: string;
  description?: string;
  memberCount?: number;
  /** Currency label used for display, e.g. "NGN". */
  currency?: string;
  /** Recurring contribution amount per member. */
  contributionAmount?: number;
  tag?: string;
  saved?: number;
  target?: number;
  nextDate?: string;
  avatars?: string[];
}
