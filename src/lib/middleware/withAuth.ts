import { NextRequest } from "next/server"
import { verifyToken } from "@/lib/utils/jwt"
import { AuthPayload } from "@/lib/types"

export async function withAuth(req: NextRequest): Promise<AuthPayload> {
  const token = req.cookies.get("token")?.value

  if (!token) {
    throw new Error("Not authenticated")
  }

  try {
    const payload = await verifyToken(token)
    return payload
  } catch {
    throw new Error("Invalid or expired token")
  }
}
