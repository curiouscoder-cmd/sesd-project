import { NextResponse } from "next/server"
import { APP_CONFIG } from "@/lib/utils/constants"

export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      app: APP_CONFIG.APP_NAME,
      version: APP_CONFIG.VERSION,
      storage: (process.env.DATABASE_URL ?? "file:./dev.db") ? "database" : "memory",
    },
    { status: 200 }
  )
}
