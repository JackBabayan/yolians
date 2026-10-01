import { motion, useReducedMotion } from "motion/react"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { slideLabel } from "../i18n"
import { useStore } from "../store"

export type HeroSlide = {
  kind: "image" | "video"
  src: string
}

const holdMs = 7000

export function Hero({
  slides,
  align = "end",
  scrim = "bg-gradient-to-b from-black/55 via-black/10 to-black/70",
  children,
}: {
  slides: readonly HeroSlide[]
  align?: "end" | "center"
  scrim?: string
  children: (dots: ReactNode) => ReactNode
}) {
  const { lang } = useStore()
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const videos = useRef(new Map<number, HTMLVideoElement>())

  useEffect(() => {
    if (reduce || slides.length < 2) return
    const id = window.setTimeout(() => {
      setIndex((current) => (current + 1) % slides.length)
    }, holdMs)
    return () => window.clearTimeout(id)
  }, [reduce, index, slides.length])

  useEffect(() => {
    const stops: Array<() => void> = []
    for (const [slideIndex, video] of videos.current) {
      video.muted = true
      video.controls = false
      if (slideIndex !== index) {
        video.pause()
        continue
      }
      const start = () => {
        video.play().catch(() => {})
      }
      video.currentTime = 0
      if (video.readyState >= 2) start()
      else {
        video.addEventListener("canplay", start, { once: true })
        stops.push(() => video.removeEventListener("canplay", start))
      }
    }
    return () => {
      for (const stop of stops) stop()
    }
  }, [index])

  const dots = (
    <div className="flex items-center gap-2">
      {slides.map((slide, slideIndex) => (
        <button
          key={`${slide.kind}-${slide.src}`}
          type="button"
          aria-label={slideLabel(slideIndex + 1, lang)}
          aria-current={slideIndex === index ? "true" : undefined}
          onClick={() => setIndex(slideIndex)}
          className={`h-1.5 rounded-full ${slideIndex === index ? "w-8 bg-white" : "w-1.5 bg-white/45"}`}
        />
      ))}
    </div>
  )

  const frame =
    align === "center"
      ? "relative flex min-h-[100dvh] items-center justify-center px-4 text-center"
      : "relative mx-auto flex min-h-[100dvh] w-full max-w-[1400px] flex-col justify-end px-4 pt-24 pb-10 md:px-8 md:pb-14"

  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-ink text-white" aria-roledescription="carousel">
      {slides.map((slide, slideIndex) => {
        const active = slideIndex === index
        const shown = active ? "opacity-100" : "opacity-0"
        if (slide.kind === "video") {
          return (
            <video
              key={`${slide.src}-${slideIndex}`}
              ref={(node) => {
                if (node) videos.current.set(slideIndex, node)
                else videos.current.delete(slideIndex)
              }}
              src={slide.src}
              muted
              loop
              playsInline
              preload="auto"
              tabIndex={-1}
              aria-hidden={!active}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${shown}`}
            />
          )
        }
        return (
          <img
            key={`${slide.src}-${slideIndex}`}
            src={slide.src}
            alt=""
            aria-hidden={!active}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${shown} ${active ? "hero-still" : ""}`}
          />
        )
      })}
      <div className={`absolute inset-0 ${scrim}`} />
      <motion.div
        className={frame}
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 18 }}
      >
        {children(dots)}
      </motion.div>
    </section>
  )
}
