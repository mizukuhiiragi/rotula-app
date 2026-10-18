import { type ColumnDef } from "@tanstack/react-table";

import type { AdminUserRecord } from "@/types/admin";
import { formatCurrency } from "@/utils/formatters/currency";
import { formatDate } from "@/utils/formatters/date";

import { DataTable } from "../DataTable";
import { SectionCard } from "../ui/SectionCard";
import { StatusBadge } from "../ui/StatusBadge";

export const userColumns: ColumnDef<AdminUserRecord>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-medium text-slate-800">
        {row.original.name}
      </span>
    ),
  },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <StatusBadge status={row.original.role} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  { accessorKey: "country", header: "Country" },
  { accessorKey: "groupsCount", header: "Groups" },
  {
    accessorKey: "totalSaved",
    header: "Total Saved",
    cell: ({ row }) => formatCurrency(row.original.totalSaved),
  },
  {
    accessorKey: "joinedAt",
    header: "Joined",
    cell: ({ row }) => formatDate(row.original.joinedAt),
  },
];

export const USER_COLUMNS = userColumns;

/** User-management tab: a sortable, filterable, paginated user table. */
export function UsersSection({ users }: { users: AdminUserRecord[] }) {
  return (
    <SectionCard
      title="User Management"
      description={`${users.length} registered members`}
    >
      <DataTable
        data={users}
        columns={userColumns}
        searchPlaceholder="Search by name, email, country…"
        initialPageSize={8}
      />
    </SectionCard>
  );
}
