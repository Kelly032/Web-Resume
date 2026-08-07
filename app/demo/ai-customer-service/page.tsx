import Link from "next/link"
import type { Metadata } from "next"
import { ArrowLeft, MessageCircle, Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: "AI智能客服 · 视频演示 | 成凯丽",
  description: "AI智能客服系统产品交互 Demo 录屏演示",
}

const highlights = [
  "RAG 知识库构建",
  "Agent 工作流设计",
  "Function Calling",
  "用户记忆机制",
  "智能客服产品设计",
]

export default function AiCustomerServiceDemoPage() {
  return (
    <div className="min-h-screen text-foreground relative overflow-hidden">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 18% 14%, rgba(199, 138, 225, 0.34), transparent 28rem), radial-gradient(circle at 82% 18%, rgba(80, 64, 160, 0.42), transparent 32rem), linear-gradient(180deg, #1d1046 0%, #24145b 38%, #403090 100%)",
        }}
      />

      <header className="relative z-10 border-b border-white/15 backdrop-blur-xl bg-white/5">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/#portfolio"
            className="inline-flex items-center gap-2 text-sm resume-body-copy-soft hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回项目经历
          </Link>
          <span className="text-sm resume-body-copy-soft">Demo 演示页</span>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-10 md:py-14">
        <div className="flex items-start gap-4 mb-8">
          <div className="glass-icon p-4 rounded-2xl">
            <MessageCircle className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm resume-body-copy-soft mb-2">AI 产品项目</p>
            <h1 className="text-[clamp(28px,4vw,40px)] font-bold resume-text-glow mb-2">
              AI智能客服 · 视频演示
            </h1>
            <p className="text-lg resume-body-copy max-w-3xl leading-relaxed">
              基于 RAG 与 Agent 智能工作流的客服系统 Demo，覆盖产品咨询、订单查询、优惠检索与售后流程等高频场景。
            </p>
          </div>
        </div>

        <div className="glass-panel rounded-2xl overflow-hidden border border-white/20 shadow-[0_24px_80px_rgba(10,4,28,0.45)]">
          <video
            className="w-full aspect-video bg-black/40"
            controls
            preload="metadata"
            playsInline
          >
            <source src="/videos/ai-customer-service-demo.mp4" type="video/mp4" />
            您的浏览器不支持视频播放
          </video>
        </div>

        <div className="glass-highlight mt-6 p-5 rounded-2xl">
          <div className="flex items-center gap-2 text-white mb-3">
            <Sparkles className="w-4 h-4" />
            <span className="text-lg font-medium">核心能力</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {highlights.map((item) => (
              <span
                key={item}
                className="glass-chip px-4 py-2 rounded-full text-sm resume-body-copy"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
