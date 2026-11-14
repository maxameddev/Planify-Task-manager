import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ProfileSettings } from "@/features/auth/components/profileSettings";
import { auth } from "@/features/auth/server";

export const instant = false;

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  return (
    <ProfileSettings
      initialName={session.user.name}
      initialEmail={session.user.email}
      initialPhoneNumber={session.user.phoneNumber ?? ""}
      initialImage={session.user.image ?? null}
    />
  );
}
