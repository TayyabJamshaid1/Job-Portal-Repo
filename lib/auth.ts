import { cookies } from "next/headers";
import { validateSessionAndGetUser } from "@/app/api/auth/use-cases/sessions";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) return null;

  const sessionData = await validateSessionAndGetUser(session);

  if (!sessionData) return null;

 return {
  sessionId: sessionData._id.toString(),
  sessionToken: sessionData.sessionToken,
  userAgent: sessionData.userAgent,
  ip: sessionData.ip,
  expiresAt: sessionData.expiresAt,
  createdAt: sessionData.createdAt,

  user: {
    id: sessionData.userId._id.toString(),
    email: sessionData.userId.email,
    name: sessionData.userId.name,
    role: sessionData.userId.role,
    provider: sessionData.userId.provider,
    phoneNumber: sessionData.userId.phoneNumber,
    userName: sessionData.userId.userName,
    createdAt: sessionData.userId.createdAt,
    updatedAt: sessionData.userId.updatedAt,
  },
};

}
