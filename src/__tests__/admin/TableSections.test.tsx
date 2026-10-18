import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  GroupsSection,
  groupColumns,
} from "@/components/admin/sections/GroupsSection";
import {
  TransactionsSection,
  transactionColumns,
} from "@/components/admin/sections/TransactionsSection";
import {
  UsersSection,
  userColumns,
} from "@/components/admin/sections/UsersSection";
import type {
  AdminUserRecord,
  SavingsGroupRecord,
  TransactionRecord,
} from "@/types/admin";

describe("Admin table sections column definitions and rendering", () => {
  it("defines column definitions as static module-level arrays", () => {
    expect(Array.isArray(userColumns)).toBe(true);
    expect(userColumns.length).toBeGreaterThan(0);

    expect(Array.isArray(groupColumns)).toBe(true);
    expect(groupColumns.length).toBeGreaterThan(0);

    expect(Array.isArray(transactionColumns)).toBe(true);
    expect(transactionColumns.length).toBeGreaterThan(0);
  });

  it("renders UsersSection without crashing using module-level columns", () => {
    const dummyUsers: AdminUserRecord[] = [
      {
        id: "u1",
        name: "Ada Lovelace",
        email: "ada@example.com",
        role: "admin",
        status: "active",
        country: "GB",
        groupsCount: 2,
        totalSaved: 5000,
        joinedAt: "2026-01-01T00:00:00Z",
        lastActiveAt: "2026-01-02T00:00:00Z",
      },
    ];

    render(<UsersSection users={dummyUsers} />);
    expect(screen.getByText("User Management")).toBeDefined();
    expect(screen.getByText("Ada Lovelace")).toBeDefined();
    expect(screen.getByText("ada@example.com")).toBeDefined();
  });

  it("renders GroupsSection without crashing using module-level columns", () => {
    const dummyGroups: SavingsGroupRecord[] = [
      {
        id: "g1",
        name: "Alpha Savers",
        status: "active",
        members: 5,
        savedAmount: 2500,
        targetAmount: 5000,
        contributionCycle: "monthly",
        nextPayoutAt: "2026-11-01T00:00:00Z",
        createdAt: "2026-01-01T00:00:00Z",
      },
    ];

    render(<GroupsSection groups={dummyGroups} />);
    expect(screen.getByText("Active Savings Groups")).toBeDefined();
    expect(screen.getByText("Alpha Savers")).toBeDefined();
  });

  it("renders TransactionsSection without crashing using module-level columns", () => {
    const dummyTransactions: TransactionRecord[] = [
      {
        id: "tx1",
        hash: "0x1234567890abcdef1234567890abcdef12345678",
        type: "deposit",
        amount: 250,
        asset: "USDC",
        status: "success",
        user: "Ada",
        group: "Alpha",
        createdAt: "2026-01-01T00:00:00Z",
      },
    ];

    render(<TransactionsSection transactions={dummyTransactions} />);
    expect(screen.getByText("Transaction Analytics")).toBeDefined();
    expect(screen.getByText("Ada")).toBeDefined();
  });
});
