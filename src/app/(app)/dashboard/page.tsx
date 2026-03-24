"use client";

import { DashboardScreen } from "./_components/DashboardScreen";

export default function Dashboard() {
  return <DashboardScreen includeUserId={true} isAdminDashboard={false} />;
}
