import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/features/auth/server";
import { DashboardContent } from "@/features/tasks/components/dashboardContent";

export const instant = false;

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");

  return (
    <DashboardContent
      userName={session.user.name}
      userEmail={session.user.email}
      userImage={session.user.image ?? null}
    />
  );
}
