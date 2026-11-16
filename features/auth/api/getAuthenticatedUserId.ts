import "server-only";

import { auth } from "@/features/auth/server";
import { isValidTimeZone } from "@/features/tasks/time";

export async function getAuthenticatedUser(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return null;
  const candidateTimeZone: unknown = session.user.timeZone;
  return {
    id: session.user.id,
    timeZone: isValidTimeZone(candidateTimeZone) ? candidateTimeZone : "Africa/Mogadishu",
  };
}

export async function getAuthenticatedUserId(request: Request) {
  const user = await getAuthenticatedUser(request);
  return user?.id ?? null;
}
