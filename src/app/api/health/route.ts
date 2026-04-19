import { NextResponse } from "next/server"
import { APP_CONFIG } from "@/lib/utils/constants"
import { shouldUseMemoryStore } from "@/lib/db"

export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      app: APP_CONFIG.APP_NAME,
      version: APP_CONFIG.VERSION,
      storage: shouldUseMemoryStore ? "memory" : "database",
    },
    { status: 200 }
  )
}
