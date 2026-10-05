import { useEffect, useState } from "react"
import { Loader } from "./Loader"

const holdMs = 800

export function Preloader({ onDone }: { onDone: () => void }) {
  const [leaving, setLeaving] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let cancel = false
    const started = performance.now()
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const min = reduce ? 0 : holdMs

    const finish = () => {
      if (cancel) return
      const wait = Math.max(0, min - (performance.now() - started))
      window.setTimeout(() => {
        if (cancel) return
        setLeaving(true)
        onDone()
      }, wait)
    }

    const ready = document.readyState === "complete"
      ? Promise.resolve()
      : new Promise<void>((resolve) => {
          window.addEventListener("load", () => resolve(), { once: true })
        })

    void Promise.all([ready, document.fonts.ready]).then(finish)
    const cap = window.setTimeout(finish, 2500)

    return () => {
      cancel = true
      window.clearTimeout(cap)
    }
  }, [])

  useEffect(() => {
    if (!leaving) return
    const node = document.getElementById("preloader")
    if (!node) return
    const hide = () => setHidden(true)
    node.addEventListener("transitionend", hide)
    const cap = window.setTimeout(hide, 600)
    return () => {
      node.removeEventListener("transitionend", hide)
      window.clearTimeout(cap)
    }
  }, [leaving])

  if (hidden) return null

  return (
    <div id="preloader" className={leaving ? "preloader preloader-out" : "preloader"} aria-hidden="true">
      <div>
        <p>Yolians</p>
        <Loader className="mt-5" />
      </div>
    </div>
  )
}
