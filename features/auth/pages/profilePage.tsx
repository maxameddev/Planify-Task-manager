import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ProfileSettings } from "@/features/auth/components/profileSettings";
import { auth } from "@/features/auth/server";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  return (
    <ProfileSettings
      initialName={session.user.name}
      initialEmail={session.user.email}
      initialPhoneNumber={session.user.phoneNumber ?? ""}
      initialImage={session.user.image ?? null}
      initialPlanningMode={session.user.planningMode ?? "basic"}
      initialTimeZone={session.user.timeZone ?? "Africa/Mogadishu"}
    />
  );
}
