"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion"
import { 
  ArrowRight, 
  Mail, 
  Phone, 
  Sparkles,
  Code2,
  FileSearch,
  Scale,
  Users,
  GraduationCap,
  Building2,
  FlaskConical,
  Award,
  Bot,
  Heart,
  MapPin,
  Brain,
  Target,
  ArrowUpRight,
  Sparkle,
  MessageCircle,
  Loader2,
  ExternalLink,
  Play
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ContactChat } from "@/components/contact-chat"

const quotes = [
  "来自地理学的观察：地球的生态修复需要时间，优秀的产品也是。让我们一起做些改变。",
  "逻辑能把我们带向结论，但同理心才能把我们带向用户。",
  "数据是理性的骨架，而温度是产品的灵魂。",
  "好的AI产品，是让技术学会倾听。"
]

const skills = [
  "Python", "SPSS", "AHP层次分析", "大模型工作流", "RAG", 
  "提示词工程", "Cursor/v0辅助开发"
]

// Crystal Planet — glassmorphism hero visual
function CrystalPlanet({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`crystal-planet relative ${className}`}
      animate={{ y: [0, -12, 0], scale: [1, 1.03, 1] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
    />
  )
}

// Portfolio section backdrop — planet + orbital rings only
function PortfolioPlanetBackdrop() {
  return (
    <div
      className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 w-[min(520px,85vw)] aspect-square pointer-events-none z-0"
      aria-hidden
    >
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400" fill="none">
        <circle cx="200" cy="200" r="178" stroke="rgba(254,254,253,0.10)" strokeWidth="0.75" />
        <circle cx="200" cy="200" r="142" stroke="rgba(215,195,248,0.14)" strokeWidth="0.65" />
        <circle cx="200" cy="200" r="108" stroke="rgba(254,254,253,0.10)" strokeWidth="0.55" />
        <ellipse cx="68" cy="198" rx="2.8" ry="5.2" fill="rgba(254,254,253,0.28)" transform="rotate(-18 68 198)" />
        <ellipse cx="198" cy="48" rx="2.2" ry="4.2" fill="rgba(254,254,253,0.22)" />
        <ellipse cx="332" cy="205" rx="2.5" ry="4.8" fill="rgba(215,195,248,0.26)" />
        <ellipse cx="285" cy="320" rx="2" ry="3.8" fill="rgba(254,254,253,0.20)" />
      </svg>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="crystal-planet w-[clamp(100px,16vw,170px)] aspect-square opacity-75"
          animate={{ y: [0, -6, 0], scale: [1, 1.02, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  )
}

// Floating cherry blossom petals — organic petal shapes
const PETAL_CONFIGS = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${4 + (i * 4.7) % 92}%`,
  delay: (i * 0.55) % 6,
  duration: 11 + (i % 5) * 2.4,
  size: 11 + (i % 4) * 5,
  rotate: (i * 47) % 360,
  sway: 18 + (i % 6) * 12,
  opacity: 0.35 + (i % 3) * 0.18,
  color: ["#fce7f3", "#f9a8d4", "#fbcfe8", "#e9d5ff"][i % 4],
  drift: i % 2 === 0 ? 1 : -1,
}))

function CherryPetal({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size * 1.25}
      viewBox="0 0 20 26"
      fill="none"
      aria-hidden
      className="drop-shadow-[0_0_6px_rgba(252,231,243,0.45)]"
    >
      <path
        d="M10 1.2 C6.2 4.8 3.2 9.2 10 23.5 C16.8 9.2 13.8 4.8 10 1.2 Z"
        fill={color}
        fillOpacity={0.82}
      />
      <path
        d="M10 3.5 C8.2 7.5 7.2 11 10 20.5 C12.8 11 11.8 7.5 10 3.5 Z"
        fill="white"
        fillOpacity={0.22}
      />
      <path d="M10 4 L10 19" stroke="white" strokeOpacity={0.18} strokeWidth={0.4} />
    </svg>
  )
}

function FloatingPetals() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[2]">
      {PETAL_CONFIGS.map((p) => (
        <motion.div
          key={p.id}
          className="absolute will-change-transform"
          style={{ left: p.left, top: "-6%" }}
          animate={{
            y: ["-5vh", "108vh"],
            x: [0, p.sway * p.drift, -p.sway * 0.55 * p.drift, p.sway * 0.35 * p.drift, 0],
            rotate: [p.rotate, p.rotate + 120, p.rotate + 240, p.rotate + 360],
            opacity: [0, p.opacity, p.opacity, p.opacity * 0.55, 0],
            scale: [0.85, 1, 0.92, 1.05, 0.8],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.15, 0.55, 0.85, 1],
          }}
        >
          <CherryPetal size={p.size} color={p.color} />
        </motion.div>
      ))}
    </div>
  )
}

// Character portrait — cutout blended with purple scene
function CharacterPortrait({ className = "", hero = false }: { className?: string; hero?: boolean }) {
  const motionProps = hero
    ? {
        initial: { opacity: 0, x: 48, scale: 0.96 },
        animate: { opacity: 1, x: 0, scale: 1 },
        transition: { duration: 1, delay: 0.25, ease: [0.25, 0.1, 0.25, 1] as const },
      }
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] as const },
      }

  return (
    <motion.div
      className={`character-stage relative ${className}`}
      {...motionProps}
    >
      {/* Scene backdrop */}
      <div className="absolute inset-x-[-8%] inset-y-[-4%] rounded-[40%] bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,rgba(91,33,182,0.32)_0%,rgba(46,26,71,0.18)_45%,transparent_72%)] blur-[2px]" />

      {/* Soft halo behind head */}
      <div className="absolute top-[4%] left-1/2 -translate-x-1/2 w-[90%] h-[50%] rounded-full bg-[radial-gradient(circle_at_50%_55%,rgba(196,168,232,0.18)_0%,rgba(91,33,182,0.10)_40%,transparent_72%)] blur-[24px] pointer-events-none" />

      <div className="relative z-[3] w-full">
        <Image
          src="/character-integrated.png"
          alt="成凯丽"
          width={490}
          height={680}
          className="character-cutout w-full h-auto object-contain object-bottom"
          priority
        />
      </div>

      {/* Bottom fade — only blend feet area */}
      <div className="absolute bottom-0 left-0 right-0 h-[12%] bg-gradient-to-t from-[#2e1a47]/90 to-transparent pointer-events-none z-[4]" />
    </motion.div>
  )
}

// Fluid Sand Background — "Deep-sea flowing sand + AI fluid energy field"
function FluidSandBackground() {
  // Extremely subtle mouse parallax (spring-smoothed)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const px = useSpring(mx, { stiffness: 40, damping: 20, mass: 1 })
  const py = useSpring(my, { stiffness: 40, damping: 20, mass: 1 })

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      // normalize to a small offset range
      mx.set((e.clientX / window.innerWidth - 0.5) * 40)
      my.set((e.clientY / window.innerHeight - 0.5) * 40)
    }
    window.addEventListener("mousemove", handleMove)
    return () => window.removeEventListener("mousemove", handleMove)
  }, [mx, my])

  // derived slower parallax layers
  const px2 = useTransform(px, (v) => v * -0.5)
  const py2 = useTransform(py, (v) => v * -0.5)
  const px3 = useTransform(px, (v) => v * 0.3)
  const py3 = useTransform(py, (v) => v * 0.3)

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* 1. Fluid sand layer — ultra-slow flowing gradient, ink-in-water */}
      <motion.div
        className="absolute inset-[-20%]"
        style={{
          x: px3,
          y: py3,
          background: `
            radial-gradient(ellipse 60% 50% at 22% 26%, rgba(192, 72, 180, 0.18) 0%, transparent 58%),
            radial-gradient(ellipse 55% 45% at 76% 60%, rgba(124, 58, 237, 0.16) 0%, transparent 58%),
            radial-gradient(ellipse 52% 56% at 54% 46%, rgba(67, 56, 202, 0.10) 0%, transparent 62%)
          `,
        }}
        animate={{
          scale: [1, 1.06, 1.02, 1],
          rotate: [0, 1.2, -0.8, 0],
          x: [0, 30, -20, 0],
          y: [0, -25, 20, 0],
        }}
        transition={{ duration: 46, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 2. Ambient glow — large blurred clouds drifting with parallax */}
      <motion.div
        className="absolute top-[-25%] left-[-15%] w-[850px] h-[850px] rounded-full blur-[180px]"
        style={{
          x: px,
          y: py,
          background:
            "radial-gradient(circle, rgba(192, 72, 180, 0.22) 0%, rgba(124, 58, 237, 0.12) 48%, transparent 72%)",
        }}
        animate={{ x: [0, 45, 0], y: [0, 30, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-25%] right-[-15%] w-[800px] h-[800px] rounded-full blur-[170px]"
        style={{
          x: px2,
          y: py2,
          background:
            "radial-gradient(circle, rgba(67, 56, 202, 0.26) 0%, rgba(46, 26, 71, 0.12) 50%, transparent 72%)",
        }}
        animate={{ x: [0, -40, 0], y: [0, -45, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 52, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[35%] right-[12%] w-[500px] h-[500px] rounded-full blur-[150px]"
        style={{
          x: px3,
          y: py3,
          background:
            "radial-gradient(circle, rgba(255, 255, 255, 0.18) 0%, rgba(216, 180, 254, 0.12) 34%, transparent 72%)",
        }}
        animate={{ x: [0, 40, 0], y: [0, -35, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 3. AI fluid texture — barely visible dune/ink diffusion */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 600 600' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='fluid'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.006' numOctaves='5' seed='7'/%3E%3CfeColorMatrix values='0 0 0 0 0.56 0 0 0 0 0.28 0 0 0 0 0.91 0 0 0 0.55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23fluid)'/%3E%3C/svg%3E")`,
          backgroundSize: "cover",
        }}
      />
    </div>
  )
}

// Vignette Overlay — soft cosmic depth
function VignetteOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{
        background:
          "radial-gradient(ellipse 85% 75% at 50% 45%, transparent 45%, rgba(20, 16, 58, 0.38) 100%)",
      }}
    />
  )
}

// Grid Texture Overlay
function GridTexture() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none opacity-[0.02]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.10) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.10) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }}
    />
  )
}

// AI Network Visual Component
function AINetworkVisual() {
  return (
    <div className="relative w-full h-full">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 300">
        <defs>
          <linearGradient id="nodeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5F3FF" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#C4B5FD" stopOpacity="0.42" />
          </linearGradient>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="50%" stopColor="#E9D5FF" stopOpacity="0.52" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Bezier curve connections */}
        <motion.path
          d="M 80 150 Q 150 80 220 150"
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
        <motion.path
          d="M 100 200 Q 150 130 200 200"
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="0.8"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, delay: 0.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
        <motion.path
          d="M 120 100 Q 150 170 180 100"
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="0.6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3.5, delay: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
        
        {/* Nodes with breathing animation */}
        {[
          { cx: 80, cy: 150, r: 4, delay: 0 },
          { cx: 220, cy: 150, r: 5, delay: 0.3 },
          { cx: 150, cy: 100, r: 3, delay: 0.6 },
          { cx: 100, cy: 200, r: 3.5, delay: 0.9 },
          { cx: 200, cy: 200, r: 4, delay: 1.2 },
          { cx: 150, cy: 150, r: 6, delay: 0 },
        ].map((node, i) => (
          <motion.circle
            key={i}
            cx={node.cx}
            cy={node.cy}
            r={node.r}
            fill="url(#nodeGrad)"
            filter="url(#glow)"
            animate={{
              r: [node.r, node.r * 1.3, node.r],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 4,
              delay: node.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        
        {/* Energy flow particles */}
        <motion.circle
          cx="0"
          cy="0"
          r="2"
          fill="#F5F3FF"
          opacity="0.8"
          animate={{
            cx: [80, 150, 220],
            cy: [150, 100, 150],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>
      
      {/* Soft glow background */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-fuchsia-300/18 via-violet-300/12 to-sky-300/10 blur-3xl" />
    </div>
  )
}

// Skill Marquee with hover pause
function SkillMarquee() {
  const [isPaused, setIsPaused] = useState(false)
  const doubledSkills = [...skills, ...skills]
  
  return (
    <div 
      className="relative overflow-hidden py-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <motion.div 
        className="flex gap-4"
        animate={{
          x: isPaused ? 0 : [0, -50 * skills.length],
        }}
        transition={{
          x: {
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      >
        {doubledSkills.map((skill, index) => (
          <motion.span 
            key={index}
            className="hoverable glass-chip flex-shrink-0 px-5 py-2.5 rounded-full resume-body-copy text-lg font-medium whitespace-nowrap cursor-default"
            whileHover={{ 
              scale: 1.05, 
              borderColor: "rgba(255, 255, 255, 0.46)",
              boxShadow: "0 0 26px rgba(216, 180, 254, 0.24)",
            }}
            transition={{ duration: 0.3 }}
          >
            {skill}
          </motion.span>
        ))}
      </motion.div>
    </div>
  )
}

// Animated Section Wrapper
function AnimatedSection({ children, className = "", id }: { children: React.ReactNode, className?: string, id?: string }) {
  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.section>
  )
}

// Glass Card Component
function GlassCard({ children, className = "", hover = true }: { children: React.ReactNode, className?: string, hover?: boolean }) {
  return (
    <motion.div
      className={`hoverable glass-panel rounded-2xl overflow-hidden ${className}`}
      whileHover={hover ? { 
        y: -4,
        borderColor: "rgba(255, 255, 255, 0.42)",
        boxShadow: "0 24px 70px rgba(10, 4, 28, 0.46), 0 0 56px rgba(216, 180, 254, 0.18)",
      } : {}}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

// Typewriter Effect Component
function TypewriterText({ text, isVisible }: { text: string, isVisible: boolean }) {
  const [displayedText, setDisplayedText] = useState("")
  
  useEffect(() => {
    if (!isVisible) {
      setDisplayedText("")
      return
    }
    
    let index = 0
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1))
        index++
      } else {
        clearInterval(interval)
      }
    }, 30)
    
    return () => clearInterval(interval)
  }, [text, isVisible])
  
  return <span>{displayedText}</span>
}

export default function Home() {
  const [blindBoxOpen, setBlindBoxOpen] = useState(false)
  const [blindBoxLoading, setBlindBoxLoading] = useState(false)
  const [blindBoxNews, setBlindBoxNews] = useState<{
    title: string
    link: string
    source?: string
    pubDate?: string
  } | null>(null)
  const [fallbackIndex, setFallbackIndex] = useState(0)
  const [useFallback, setUseFallback] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  const handleBlindBoxClick = async () => {
    setBlindBoxOpen(true)
    setBlindBoxLoading(true)
    setBlindBoxNews(null)
    setUseFallback(false)

    try {
      const response = await fetch("/api/ai-news")
      const data = await response.json()

      if (data.success && data.item) {
        setBlindBoxNews(data.item)
      } else {
        setFallbackIndex((prev) => (prev + 1) % quotes.length)
        setUseFallback(true)
      }
    } catch {
      setFallbackIndex((prev) => (prev + 1) % quotes.length)
      setUseFallback(true)
    } finally {
      setBlindBoxLoading(false)
    }
  }

  // Track active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: 'home', el: 'hero' },
        { id: 'portfolio', el: 'portfolio' },
        { id: 'research', el: 'research' },
        { id: 'about', el: 'about' },
        { id: 'contact', el: 'contact' },
      ]
      const scrollPosition = window.scrollY + 200

      for (const section of sections) {
        const element = document.getElementById(section.el)
        if (element) {
          const offsetTop = element.offsetTop
          const height = element.offsetHeight
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
            setActiveSection(section.id)
            return
          }
        }
      }
      if (window.scrollY < 300) setActiveSection('home')
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      {/* Background Effects */}
      <FluidSandBackground />
      <FloatingPetals />
      <GridTexture />
      <VignetteOverlay />
      
      {/* Noise Texture */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.012]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Header — centered pill nav */}
      <header className="fixed top-5 left-0 right-0 z-50 px-4 sm:px-6 flex justify-center pointer-events-none">
        <nav className="nav-pill pointer-events-auto w-[92%] max-w-[1120px] h-[52px] rounded-full flex items-center justify-end px-6 sm:px-10">
          <div className="flex items-center gap-4 sm:gap-7 lg:gap-9">
            {[
              { id: 'home', label: '首页', href: '#' },
              { id: 'about', label: '关于我', href: '#about' },
              { id: 'portfolio', label: '项目作品', href: '#portfolio' },
              { id: 'research', label: '科研经历', href: '#research' },
              { id: 'contact', label: '联系我', href: '#contact' },
            ].map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={`nav-pill-link relative text-[17px] font-semibold ${activeSection === item.id ? 'active' : ''}`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      </header>

      {/* ====== Section 1: Hero ====== */}
      <section id="hero" className="min-h-screen flex items-center pt-24 pb-16 px-6 relative overflow-hidden">
        {/* Hero ambient glow */}
        <div className="absolute right-[-5%] top-[10%] w-[55vw] h-[70vh] pointer-events-none bg-[radial-gradient(ellipse_at_60%_40%,rgba(199,138,225,0.35)_0%,rgba(80,64,160,0.15)_45%,transparent_70%)] blur-[2px]" />
        <div className="absolute left-[5%] bottom-[15%] w-[40vw] h-[50vh] pointer-events-none bg-[radial-gradient(circle,rgba(64,48,144,0.25)_0%,transparent_70%)]" />

        <div className="max-w-7xl mx-auto w-full relative z-[4]">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-4 items-center min-h-[calc(100vh-120px)]">
            {/* Left: Welcome copy */}
            <motion.div
              className="relative z-[4] order-2 lg:order-1"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="hero-main-title-wrap mb-6">
                <motion.h1
                  className="text-[clamp(36px,5.2vw,62px)] leading-[1.15] hero-main-title"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.15 }}
                >
                  欢迎来到我的简历空间
                </motion.h1>
              </div>

              <motion.div
                className="mb-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.25 }}
              >
                <p className="text-[clamp(13px,1.6vw,16px)] hero-subtitle leading-relaxed flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span>北京师范大学地理学硕士</span>
                  <span className="hidden sm:inline w-px h-4 bg-white/35" />
                  <span>专注 AI 智能体与全自动化工作流落地</span>
                </p>
                <div className="mt-3 h-px w-full max-w-[420px] bg-gradient-to-r from-white/50 via-white/20 to-transparent" />
              </motion.div>

              <motion.p
                className="text-[clamp(26px,3.6vw,40px)] hero-name mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.35 }}
              >
                成凯丽
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-3 mb-10 max-w-[520px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.45 }}
              >
                {["AI智能客服", "AI PM刷题", "交互式科研数据分析", "AI文件智能检索"].map((tag, index) => (
                  <motion.span
                    key={tag}
                    className="hoverable glass-chip px-4 py-2.5 rounded-full text-[17px] font-bold text-white"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.08 }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </motion.div>

              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.65 }}
              >
                <Button
                  size="lg"
                  className="hoverable glass-chip bg-white/12 hover:bg-white/18 text-white gap-2 px-8 h-13 text-[18px] font-bold border-white/45 rounded-full"
                  asChild
                >
                  <a href="#portfolio">
                    查看项目
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
                <Button
                  size="lg"
                  className="hoverable glass-chip bg-white/12 hover:bg-white/18 text-white gap-2 px-8 h-13 text-[18px] font-bold border-white/45 rounded-full"
                  asChild
                >
                  <a href="#contact">
                    联系我
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
                <Button
                  size="lg"
                  className="hoverable glass-chip bg-white/18 hover:bg-white/24 text-white gap-2 px-8 h-13 text-[18px] font-bold border-white/55 rounded-full shadow-[0_0_24px_rgba(216,180,254,0.22)]"
                  asChild
                >
                  <a href="#ai-chat">
                    与我的 AI 助手对话
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </Button>
              </motion.div>
            </motion.div>

            {/* Right: Character illustration */}
            <div className="relative flex justify-center lg:justify-end lg:pr-4 order-1 lg:order-2">
              <CharacterPortrait
                hero
                className="w-[clamp(240px,34vw,420px)] -translate-x-3 lg:-translate-x-10 xl:-translate-x-14"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ====== Section 2: About Me ====== */}
      <AnimatedSection id="about" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4 resume-text-glow">
              关于我
            </h2>
          </motion.div>

          {/* Education + Interest — two columns */}
          <motion.div 
            id="research"
            className="mb-16 scroll-mt-28"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
              {/* Left: Education Timeline */}
              <div className="lg:pr-8 lg:border-r lg:border-white/15">
                <h3 className="text-xl font-semibold resume-text-glow mb-8 flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-white/90" />
                  教育经历
                </h3>
                <div className="relative">
                  <motion.div 
                    className="absolute left-[7px] top-3 bottom-3 w-[2px] hidden md:block"
                    style={{
                      background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.58), rgba(216, 180, 254, 0.12))",
                    }}
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                  
                  <div className="space-y-6">
                    {[
                      { school: "北京师范大学", time: "2022.09 - 2025.06", major: "全球环境变化（地理学） | 理学硕士", delay: 0 },
                      { school: "河南大学", time: "2018.09 - 2022.06", major: "地理信息科学 | 理学学士", delay: 0.2 },
                    ].map((edu, index) => (
                      <motion.div 
                        key={index}
                        className="flex gap-6 items-start"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: edu.delay }}
                      >
                        <motion.div 
                          className="w-4 h-4 rounded-full bg-white/45 border-2 border-white/70 flex-shrink-0 mt-1.5 hidden md:block"
                          animate={{
                            boxShadow: [
                              "0 0 0 0 rgba(216, 180, 254, 0.42)",
                              "0 0 0 8px rgba(216, 180, 254, 0)",
                            ],
                          }}
                          transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                        />
                        <GlassCard className="flex-1 p-6">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                            <h4 className="font-semibold text-lg text-foreground">{edu.school}</h4>
                            <span className="text-lg resume-body-copy-soft">{edu.time}</span>
                          </div>
                          <p className="text-lg resume-body-copy">{edu.major}</p>
                        </GlassCard>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Interest & Personality */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.15 }}
              >
                <h3 className="text-xl font-semibold resume-text-glow mb-8 flex items-center gap-3">
                  <Brain className="w-5 h-5 text-white/90" />
                  兴趣性格
                </h3>
                <GlassCard className="interest-personality-card relative p-6 lg:p-7 overflow-hidden" hover={false}>
                  {/* Corner glow flare */}
                  <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-white/25 blur-[28px] pointer-events-none" />
                  <div className="absolute top-0 left-0 w-24 h-[2px] bg-gradient-to-r from-white/90 via-white/40 to-transparent pointer-events-none" />
                  <div className="absolute top-0 left-0 w-[2px] h-16 bg-gradient-to-b from-white/80 via-white/30 to-transparent pointer-events-none" />

                  <div className="relative z-[2] space-y-4 max-w-[88%]">
                    {[
                      "动手落地能力强，勇于尝试新事物。",
                      "持续探究心理学知识，擅长洞察用户心理。",
                      "抗压抗挫，目标感强，能够持续付出行动，稳步实现既定目标。",
                    ].map((line) => (
                      <p key={line} className="text-[17px] md:text-[18px] resume-body-copy font-medium leading-[1.75] m-0">
                        {line}
                      </p>
                    ))}
                  </div>

                  {/* Decorative icons — reference style */}
                  <div className="absolute right-5 top-[22%] text-white/35 pointer-events-none">
                    <Sparkle className="w-5 h-5" />
                  </div>
                  <div className="absolute right-6 top-[48%] text-white/30 pointer-events-none">
                    <Target className="w-5 h-5" />
                  </div>
                  <div className="absolute right-5 bottom-[18%] text-white/35 pointer-events-none">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </motion.div>

          {/* Student Work */}
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-lg font-semibold resume-text-glow mb-8 flex items-center gap-3">
              <Users className="w-5 h-5 text-white/90" />
              学生工作经历
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "院学生会办公室主任 & 班学习委员", desc: "统筹跨部门协同，策划举办10余次大型活动，管理61位同学日常事务。具备强大的多干系人管理与抗压能力。" },
                { title: "新媒体运营中心技术部委员", desc: "参与官方QQ\"树洞\"后台值班，成功策划公众号发表推文2篇。" },
              ].map((work, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <GlassCard className="p-6 h-full">
                    <h4 className="font-semibold text-lg text-foreground mb-3">{work.title}</h4>
                    <p className="resume-body-copy text-lg leading-relaxed">{work.desc}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Skills Marquee */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-xl font-semibold resume-text-glow mb-6 flex items-center gap-3">
              <Code2 className="w-5 h-5 text-white/90" />
              技能
            </h3>
            <SkillMarquee />
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ====== Section 3: Portfolio ====== */}
      <AnimatedSection id="portfolio" className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          <motion.div 
            className="text-center mb-16 relative z-[4]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[clamp(44px,6vw,76px)] font-black mb-4 resume-text-glow">
              项目经历
            </h2>
            <p className="text-lg resume-body-text font-semibold max-w-xl mx-auto">
              期待与你创建下一个项目
            </p>
          </motion.div>

          {/* AI Projects — planet element as decorative backdrop */}
          <motion.div 
            className="mb-20 relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <PortfolioPlanetBackdrop />

            <div className="relative z-[4]">
            <h3 className="text-xl font-semibold resume-text-glow mb-8 flex items-center gap-2">
              <Bot className="w-5 h-5 text-white/90" />
              AI 产品项目
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                {
                  icon: MessageCircle,
                  title: "AI智能客服",
                  subtitle: "AI智能客服系统",
                  desc: "面向客服场景，设计并搭建基于 RAG与Agent智能工作流 的AI客服系统，解决传统客服知识检索效率低、服务同质化等问题。通过构建知识库，实现产品咨询、订单查询、优惠信息检索、售后流程等高频业务场景的自动化处理；结合Agent任务规划能力，支持多工具调用与复杂业务流程编排。同时设计用户记忆模块，沉淀用户历史行为与偏好信息，使客服能够提供连续化、个性化的对话体验，提升用户满意度与服务效率。",
                  highlight: "RAG知识库构建｜Agent工作流设计｜Function Calling｜用户记忆机制｜智能客服产品设计",
                  demoHref: "/demo/ai-customer-service",
                },
                {
                  icon: Brain,
                  title: "AI面试刷题助手",
                  subtitle: "AI 学习产品",
                  desc: "面向AI行业转型求职人群，设计并开发AI面试刷题助手，解决传统面试准备方式缺乏反馈、学习路径不清晰等问题。通过构建结构化AI产品经理面试知识库，结合大模型能力实现用户回答智能评测，从内容完整性、技术理解、表达逻辑等维度提供针对性反馈，帮助用户从标准化刷题转向个性化能力提升。同时基于历史答题数据构建用户成长曲线，追踪能力变化趋势，让用户直观看到学习效果并持续优化面试表现。",
                  highlight: "LLM智能评测｜Prompt设计｜知识库构建｜用户成长体系｜AI学习产品设计",
                },
                {
                  icon: Scale,
                  title: "企业法务智能审核工作流",
                  subtitle: "AI Workflow",
                  desc: "基于 LLM + RAG，搭建企业法务审核场景的 AI Workflow 原型，实现合同/制度文档的自动风险识别与条款校验。\n\n构建多Agent协同架构，实现\"文件解析 → 法规检索 → 风险判断 → 审核建议输出\"的自动化流程。",
                  highlight: "企业制度、合同文本、法律法例等可进行结构化整理，探索企业知识库在审核场景中的应用方式。",
                },
                {
                  icon: FileSearch,
                  title: "AI 文件智能检索系统",
                  subtitle: "Vibe Coding Demo",
                  desc: "利用 Cursor 快速完成全栈原型开发。基于知识切片与关键词+向量检索，实现\"提问-内容检索-答案生成-引用展示\"的完整交互。\n\n支持 PDF / Word 等多类型文档解析。",
                  highlight: "提升企业内部知识查询效率，支持基于自然语言的文档内容定位与信息提取。",
                },
              ].map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                >
                  <GlassCard className="p-8 h-full group relative overflow-hidden">
                    {/* Subtle scan line effect */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: "linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.08) 50%, transparent 100%)",
                        backgroundSize: "100% 200%",
                      }}
                      animate={{
                        backgroundPosition: ["0% 0%", "0% 100%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    
                    <div className="relative">
                      <div className="flex items-start justify-between gap-4 mb-6">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                        <motion.div 
                          className="glass-icon p-4 rounded-2xl shrink-0"
                          whileHover={{ 
                            boxShadow: "0 0 30px rgba(216, 180, 254, 0.24)",
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <project.icon className="w-7 h-7" />
                        </motion.div>
                        <div className="min-w-0">
                          <motion.h4 
                            className="hoverable font-semibold text-xl text-foreground mb-3 relative inline-block"
                            whileHover={{ color: "rgb(245, 243, 255)" }}
                          >
                            {project.title}
                          </motion.h4>
                          <p className="text-base resume-body-copy-soft">{project.subtitle}</p>
                        </div>
                        </div>
                        {"demoHref" in project && project.demoHref && (
                          <a
                            href={project.demoHref}
                            className="demo-video-pill hoverable inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all shrink-0 self-start mt-1"
                          >
                            <Play className="w-4 h-4" />
                            视频 Demo
                          </a>
                        )}
                      </div>
                      
                      <p className="resume-body-copy leading-relaxed text-lg mb-4">
                        {project.desc}
                      </p>

                      <div className="glass-highlight p-4 rounded-xl">
                        <div className="flex items-center gap-2 text-white mb-2">
                          <Sparkles className="w-4 h-4" />
                          <span className="text-lg font-medium">核心优势</span>
                        </div>
                        <p className="text-lg resume-body-copy">
                          {project.highlight}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
            </div>
          </motion.div>

          {/* Work & Research Projects */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-xl font-semibold resume-text-glow mb-8 flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-white/90" />
              工作与科研项目
            </h3>
            <div className="space-y-6">
              {[
                {
                  icon: Building2,
                  title: "助理规划师",
                  location: "广州城市规划设计有限公司",
                  desc: "基于地图 API 搭建空间数据采集工具，批量结构化处理地理坐标，提升外业调研数据整理效率。",
                },
                {
                  icon: FlaskConical,
                  title: "国家级研发与基金项目",
                  sections: [
                    {
                      title: "主要工作",
                      desc: "围绕多源环境数据融合分析与环境变化机制研究开展工作。针对站点、遥感、模型模拟等多源异构数据，基于 Python 完成数据清洗、格式统一、时空尺度匹配及异常值处理，并结合 Bias、RMSE、EOF 等方法开展数据质量评估与时空变化分析。同时研究气象、土壤水热、植被等环境要素之间的影响机制，分析区域差异与滞后效应，为环境变化风险预警提供数据支撑。",
                    },
                    {
                      title: "气象数据交互式分析工具",
                      desc: "针对传统科研分析流程依赖代码、使用门槛高的问题，基于 Python + Streamlit 开发气象数据交互式分析工具，将数据读取、处理、统计分析及可视化流程模块化封装。支持多源 NetCDF 数据自动识别、参数配置、区域选择和结果可视化展示，实现复杂科研分析流程产品化，提升数据处理效率与分析标准化能力。",
                    },
                  ],
                },
                {
                  icon: Award,
                  title: "国家级大创项目",
                  desc: "独立检索分析80余篇古籍与文献，运用 AHP 层次分析法构建多维价值评价体系，撰写万字报告。",
                },
              ].map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <GlassCard className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="glass-icon p-3 rounded-xl">
                        <project.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                          <h4 className="font-semibold text-lg text-foreground">{project.title}</h4>
                          {project.location && (
                            <span className="text-lg resume-body-copy-soft flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {project.location}
                            </span>
                          )}
                        </div>
                        {project.sections ? (
                          <div className="space-y-5">
                            {project.sections.map((section, sectionIndex) => (
                              <div key={sectionIndex}>
                                <h5 className="font-medium text-foreground mb-2">{section.title}</h5>
                                <p className="resume-body-copy text-lg leading-relaxed">
                                  {section.desc}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="resume-body-copy text-lg leading-relaxed">
                            {project.desc}
                          </p>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ====== Section 4: Contact ====== */}
      <AnimatedSection id="contact" className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(29,16,70,0.3)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-10 lg:gap-12 items-stretch">
            <motion.div
              className="flex flex-col justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-[clamp(44px,6vw,76px)] font-black mb-4 resume-text-glow">
                联系我
              </h2>
              <p className="text-lg resume-body-text font-semibold mb-8">
                期待与你创建下一个项目
              </p>

              <GlassCard className="p-6 mb-8" hover={false}>
                <h3 className="text-xl font-bold mb-4">联系方式</h3>
                <motion.a 
                  href="tel:17303785323" 
                  className="hoverable flex items-center gap-3 text-white hover:text-white transition-colors group mb-4"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="glass-icon p-3 rounded-xl">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-lg">17303785323</span>
                </motion.a>
                <motion.a 
                  href="mailto:ChengKaili@mail.bnu.edu.cn" 
                  className="hoverable flex items-center gap-3 text-white hover:text-white transition-colors group"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="glass-icon p-3 rounded-xl">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-lg">ChengKaili@mail.bnu.edu.cn</span>
                </motion.a>
              </GlassCard>

              <CrystalPlanet className="w-[clamp(160px,22vw,240px)] aspect-square opacity-80" />
            </motion.div>

            <motion.div 
              id="ai-chat"
              className="relative z-[4] scroll-mt-28"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <ContactChat />
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* AI Blind Box - Fixed Bottom Right */}
      <motion.div 
        className="fixed bottom-8 right-8 z-40"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <motion.div 
          className="hoverable relative cursor-pointer"
          onClick={handleBlindBoxClick}
          onMouseLeave={() => setBlindBoxOpen(false)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div 
            className="glass-chip px-5 py-3 rounded-full resume-body-copy text-lg flex items-center gap-2 shadow-lg"
            animate={{
              boxShadow: [
                "0 0 20px rgba(216, 180, 254, 0.14)",
                "0 0 34px rgba(244, 114, 182, 0.20)",
                "0 0 20px rgba(216, 180, 254, 0.14)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Heart className="w-4 h-4 text-white" />
            <span>今日 AI 盲盒</span>
          </motion.div>
          
          {/* Quote Tooltip */}
          <AnimatePresence>
            {blindBoxOpen && (
              <motion.div 
                className="absolute bottom-full right-0 mb-3 w-[22rem] p-5 rounded-xl glass-panel shadow-2xl"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {blindBoxLoading ? (
                  <div className="flex items-center gap-2 text-lg resume-body-copy">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>正在搜索 AI 最新资讯...</span>
                  </div>
                ) : useFallback ? (
                  <p className="text-lg resume-body-copy leading-relaxed italic">
                    &quot;<TypewriterText text={quotes[fallbackIndex]} isVisible={blindBoxOpen} />&quot;
                  </p>
                ) : blindBoxNews ? (
                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-wider text-violet-200/80">今日 AI 资讯</p>
                    <p className="text-lg resume-body-copy leading-relaxed font-medium">
                      {blindBoxNews.title}
                    </p>
                    {(blindBoxNews.source || blindBoxNews.pubDate) && (
                      <p className="text-sm resume-body-copy-soft">
                        {[blindBoxNews.source, blindBoxNews.pubDate].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    <a
                      href={blindBoxNews.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-violet-100 hover:text-white transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      查看原文
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10 relative">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-lg resume-body-copy-soft">
            &copy; 2026 成凯丽 · AI 产品经理
          </p>
        </div>
      </footer>
    </div>
  )
}
