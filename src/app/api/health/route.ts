import { NextResponse } from "next/server"
import { APP_CONFIG } from "@/lib/utils/constants"

export async function GET() {
  return NextResponse.json(
    { status: "ok", app: APP_CONFIG.APP_NAME, version: APP_CONFIG.VERSION },
    { status: 200 }
  )
}
