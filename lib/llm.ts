export type ChatRole = "system" | "user" | "assistant"

export type ChatMessage = {
  role: ChatRole
  content: string
}

type ChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string
    }
  }>
  error?: {
    message?: string
  }
}

export async function createChatCompletion(
  messages: ChatMessage[],
  options?: { maxTokens?: number; temperature?: number },
): Promise<string> {
  const apiKey = process.env.LLM_API_KEY
  const baseUrl = (process.env.LLM_BASE_URL ?? "https://api.deepseek.com/v1").replace(/\/$/, "")
  const model = process.env.LLM_MODEL ?? "deepseek-chat"
  const maxTokens = options?.maxTokens ?? 300
  const temperature = options?.temperature ?? 0.5

  if (!apiKey) {
    const hint =
      process.env.VERCEL === "1"
        ? "请在 Vercel → Settings → Environment Variables 添加 LLM_API_KEY，保存后重新 Deploy。"
        : "请在项目根目录 .env.local 中设置 LLM_API_KEY，保存后重启 npm run dev。"
    throw new Error(`未配置 LLM_API_KEY。${hint}`)
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  })

  const data = (await response.json()) as ChatCompletionResponse

  if (!response.ok) {
    throw new Error(data.error?.message ?? `LLM 请求失败 (${response.status})`)
  }

  const content = data.choices?.[0]?.message?.content?.trim()
  if (!content) {
    throw new Error("LLM 未返回有效内容")
  }

  return content
}
