import { NextResponse } from "next/server"
import { apiHandler } from "@/lib/utils"

export const POST = apiHandler(async () => {
  const response = NextResponse.json({ success: true, message: "Logged out" })
  response.cookies.set("token", "", { maxAge: 0 })
  return response
})
