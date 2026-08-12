export const dynamic = "force-dynamic";

import AdminShell from "./admin-shell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}