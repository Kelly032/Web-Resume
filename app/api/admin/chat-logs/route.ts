import { NextResponse } from "next/server"
import { getChatLogStorageMode, getLocalLogFilePath, listChatLogs } from "@/lib/chat-logger"

export const runtime = "nodejs"

function isAuthorized(request: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) return false

  const headerPassword = request.headers.get("x-admin-password")
  return headerPassword === adminPassword
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "未授权访问" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const limit = Number(searchParams.get("limit") ?? "100")

  const logs = await listChatLogs(Number.isFinite(limit) ? Math.min(limit, 500) : 100)

  return NextResponse.json({
    storage: getChatLogStorageMode(),
    localPath: getChatLogStorageMode() === "local" ? getLocalLogFilePath() : null,
    count: logs.length,
    logs,
  })
}
