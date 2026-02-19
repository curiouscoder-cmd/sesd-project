import { SignJWT, jwtVerify } from "jose"
import { AuthPayload } from "@/lib/types"

const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "fallback-secret-key")

export async function signToken(payload: AuthPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret)
}

export async function verifyToken(token: string): Promise<AuthPayload> {
  const { payload } = await jwtVerify(token, secret)
  return {
    userId: payload.userId as number,
    email: payload.email as string,
  }
}
