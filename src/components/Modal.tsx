import { motion, useReducedMotion } from "motion/react"
import { useEffect, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { X } from "./icons"

export function Modal({
  labelledBy,
  onClose,
  closeLabel,
  children,
}: {
  labelledBy: string
  onClose: () => void
  closeLabel: string
  children: ReactNode
}) {
  const reduce = useReducedMotion()

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = previous
    }
  }, [onClose])

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[60] flex overflow-y-auto bg-black/40 p-4"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0.01 : 0.25 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className="relative m-auto w-full max-w-4xl rounded-3xl bg-white px-4 py-6 md:px-8 md:py-8 lg:px-10 lg:py-10"
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: reduce ? 0.01 : 0.28, ease: [0.22, 1, 0.36, 1] }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="absolute top-8 right-6 md:right-10"
          aria-label={closeLabel}
          onClick={onClose}
        >
          <X size={22} />
        </button>
        {children}
      </motion.div>
    </motion.div>,
    document.body,
  )
}
