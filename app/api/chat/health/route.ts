import { NextResponse } from "next/server"

export const runtime = "nodejs"

/** 供排查 Vercel 环境变量是否生效，不暴露 Key 内容 */
export async function GET() {
  return NextResponse.json({
    llmConfigured: Boolean(process.env.LLM_API_KEY?.trim()),
    runtime: process.env.VERCEL === "1" ? "vercel" : "local",
  })
}
