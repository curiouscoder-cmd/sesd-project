import { NextRequest } from "next/server"
import { verifyToken } from "@/lib/utils/jwt"
import { AuthPayload } from "@/lib/types"

import { UnauthorizedError } from "@/lib/utils/errors"

export async function withAuth(req: NextRequest): Promise<AuthPayload> {
  const token = req.cookies.get("token")?.value

  if (!token) {
    throw new UnauthorizedError("Not authenticated")
  }

  try {
    const payload = await verifyToken(token)
    return payload
  } catch {
    throw new UnauthorizedError("Invalid or expired token")
  }
}
