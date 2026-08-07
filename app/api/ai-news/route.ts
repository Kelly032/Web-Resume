import { NextResponse } from "next/server"

export const revalidate = 1800

type NewsItem = {
  title: string
  link: string
  source?: string
  pubDate?: string
}

const AI_KEYWORDS = /AI|人工智能|大模型|ChatGPT|Agent|LLM|智能体|机器学习|DeepSeek|OpenAI/i

function decodeEntities(text: string) {
  return text
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]+>/g, "")
    .trim()
}

function parseRSS(xml: string, sourceName: string): NewsItem[] {
  const items: NewsItem[] = []
  const blocks = xml.match(/<item[\s\S]*?<\/item>/g) ?? []

  for (const block of blocks) {
    const title =
      block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] ??
      block.match(/<title>(.*?)<\/title>/)?.[1]
    const link =
      block.match(/<link><!\[CDATA\[(.*?)\]\]><\/link>/)?.[1] ??
      block.match(/<link>(.*?)<\/link>/)?.[1]
    const pubDate = block.match(/<pubDate>(.*?)<\/pubDate>/)?.[1]

    if (title && link) {
      items.push({
        title: decodeEntities(title),
        link: decodeEntities(link),
        source: sourceName,
        pubDate,
      })
    }
  }

  return items
}

async function fetchGNews(): Promise<NewsItem[]> {
  const apiKey = process.env.GNEWS_API_KEY
  if (!apiKey) return []

  const queries = ["AI人工智能", "大模型", "ChatGPT"]
  const query = queries[Math.floor(Math.random() * queries.length)]
  const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=zh&max=10&apikey=${apiKey}`

  const response = await fetch(url, { next: { revalidate: 1800 } })
  if (!response.ok) return []

  const data = await response.json()
  return (data.articles ?? []).map(
    (article: { title: string; url: string; publishedAt?: string; source?: { name?: string } }) => ({
      title: article.title,
      link: article.url,
      source: article.source?.name ?? "GNews",
      pubDate: article.publishedAt,
    })
  )
}

async function fetchNewsAPI(): Promise<NewsItem[]> {
  const apiKey = process.env.NEWS_API_KEY
  if (!apiKey) return []

  const queries = ["AI", "大模型", "人工智能"]
  const query = queries[Math.floor(Math.random() * queries.length)]
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=zh&sortBy=publishedAt&pageSize=10&apiKey=${apiKey}`

  const response = await fetch(url, { next: { revalidate: 1800 } })
  if (!response.ok) return []

  const data = await response.json()
  return (data.articles ?? []).map(
    (article: { title: string; url: string; publishedAt?: string; source?: { name?: string } }) => ({
      title: article.title,
      link: article.url,
      source: article.source?.name ?? "NewsAPI",
      pubDate: article.publishedAt,
    })
  )
}

async function fetchHackerNews(): Promise<NewsItem[]> {
  const queries = ["AI product", "LLM", "GPT", "machine learning", "AI agent"]
  const query = queries[Math.floor(Math.random() * queries.length)]
  const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=20`

  const response = await fetch(url, { next: { revalidate: 1800 } })
  if (!response.ok) return []

  const data = await response.json()
  return (data.hits ?? [])
    .filter((hit: { title?: string; url?: string }) => hit.title && hit.url)
    .map((hit: { title: string; url: string; created_at?: string }) => ({
      title: hit.title,
      link: hit.url,
      source: "Hacker News",
      pubDate: hit.created_at,
    }))
}

async function fetch36Kr(): Promise<NewsItem[]> {
  const response = await fetch("https://www.36kr.com/feed", {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; ResumeBot/1.0)" },
    next: { revalidate: 1800 },
  })
  if (!response.ok) return []

  const xml = await response.text()
  return parseRSS(xml, "36氪").filter((item) => AI_KEYWORDS.test(item.title))
}

async function fetchGoogleNews(): Promise<NewsItem[]> {
  const queries = ["AI人工智能", "大模型", "ChatGPT"]
  const query = queries[Math.floor(Math.random() * queries.length)]
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=zh-CN&gl=CN&ceid=CN:zh-Hans`

  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; ResumeBot/1.0)" },
    next: { revalidate: 1800 },
  })
  if (!response.ok) return []

  const xml = await response.text()
  return parseRSS(xml, "Google 资讯")
}

function pickRandom<T>(items: T[]): T | null {
  if (items.length === 0) return null
  return items[Math.floor(Math.random() * items.length)]
}

export async function GET() {
  const hasApiKey = Boolean(process.env.GNEWS_API_KEY || process.env.NEWS_API_KEY)
  const providers = hasApiKey
    ? [fetchGNews, fetchNewsAPI, fetch36Kr, fetchHackerNews, fetchGoogleNews]
    : [fetch36Kr, fetchHackerNews, fetchGoogleNews]

  for (const provider of providers) {
    try {
      const items = await provider()
      const item = pickRandom(items.slice(0, 15))
      if (item) {
        return NextResponse.json({ success: true, item, source: provider.name })
      }
    } catch {
      continue
    }
  }

  return NextResponse.json({
    success: false,
    item: null,
    needsApiKey: !hasApiKey,
  })
}
