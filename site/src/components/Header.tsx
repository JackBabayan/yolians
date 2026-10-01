import { Bag, CaretDown, List, User, X } from "./icons"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { languages, type Lang, type MessageKey } from "../i18n"
import { Logo } from "./Logo"
import { useStore } from "../store"

const catalogLinks: { to: string; label: MessageKey }[] = [
  { to: "/catalog?gender=women", label: "nav.women" },
  { to: "/catalog?gender=men", label: "nav.men" },
  { to: "/catalog?kind=jackets", label: "nav.ready" },
  { to: "/catalog?kind=sneakers", label: "nav.shoes" },
  { to: "/catalog?kind=bags", label: "nav.bags" },
  { to: "/catalog?kind=belts", label: "nav.accessories" },
]

const pageLinks: { to: string; label: MessageKey }[] = [
  { to: "/tailoring", label: "nav.tailoring" },
  { to: "/about", label: "nav.about" },
  { to: "/contact", label: "nav.contact" },
  { to: "/faq", label: "nav.faq" },
  { to: "/shipping-info", label: "nav.shipping" },
  { to: "/returns", label: "nav.returns" },
  { to: "/size-guide", label: "nav.size" },
]

export function Header() {
  const { lang, setLang, tx, cart, user } = useStore()
  const { pathname, search } = useLocation()
  const overlay = pathname === "/" || pathname === "/tailoring"
  const [solid, setSolid] = useState(!overlay)
  const [atTop, setAtTop] = useState(true)
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()
  const count = cart.reduce((sum, line) => sum + line.qty, 0)
  const slide = { duration: reduce ? 0.01 : 0.4, ease: [0.22, 1, 0.36, 1] as const }

  useEffect(() => {
    setOpen(false)
  }, [pathname, search])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const nextTop = y <= 0
      document.documentElement.dataset.top = nextTop ? "true" : "false"
      setAtTop((current) => (current === nextTop ? current : nextTop))
      if (!overlay) return
      const nextSolid = y > 40
      setSolid((current) => (current === nextSolid ? current : nextSolid))
    }
    if (!overlay) setSolid(true)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [overlay])

  const ink = solid || open
  const shipping = tx("free.shipping.on.all.orders")

  return (
    <>
    <div
      className={`fixed inset-x-0 top-0 z-40 h-6 overflow-hidden border-b border-line bg-white text-[10px] tracking-[0.12em] text-ink uppercase md:h-8 md:text-xs md:tracking-[0.16em] ${
        atTop ? "" : "hidden"
      }`}
      aria-label={shipping}
    >
      <div className="ticker-track flex h-full w-max" aria-hidden="true">
        {[0, 1].map((group) => (
          <div key={group} className="flex shrink-0 items-center">
            {Array.from({ length: 8 }, (_, index) => (
              <span key={index} className="px-8">
                {shipping}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
    <header
      className={`fixed inset-x-0 z-40 h-14 ${atTop ? "top-6 md:top-8" : "top-0"} ${
        ink ? "border-b border-line bg-white text-ink" : "bg-transparent text-white"
      }`}
    >
      <div className="relative mx-auto grid h-full w-full max-w-[1400px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 md:px-8">
        <button
          aria-label={open ? tx("close.menu") : tx("open.menu")}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} className="size-[18px] md:size-[22px]" /> : <List size={22} className="size-[18px] md:size-[22px]" />}
        </button>
        <Link to="/" aria-label="Yolians" className="justify-self-center">
          <Logo className="h-auto w-[5.25rem] max-w-full md:w-[150px]" />
        </Link>
        <div className="flex items-center gap-2.5 text-sm md:gap-4 md:text-xl">
          <LanguageMenu lang={lang} setLang={setLang} />
          <Link to={user ? "/account" : "/login"} aria-label={tx("account.2")}>
            <User size={22} className="size-[18px] md:size-[22px]" />
          </Link>
          <Link to="/cart" className="relative" aria-label={tx("cart")}>
            <Bag size={22} className="size-[18px] md:size-[22px]" />
            {count > 0 ? (
              <span className="absolute -top-2 -right-2 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] text-white">
                {count}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
      <AnimatePresence>
        {open ? (
          <motion.button
            key="menu-shade"
            type="button"
            className={`fixed inset-0 bg-black/40 ${atTop ? "top-20 md:top-[5.5rem]" : "top-14"}`}
            aria-label={tx("close.menu")}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0.01 : 0.25 }}
            onClick={() => setOpen(false)}
          />
        ) : null}
        {open ? (
          <motion.nav
            key="menu-drawer"
            className={`absolute top-14 left-0 flex w-[min(100%,320px)] flex-col overflow-y-auto bg-white px-8 py-10 text-xl tracking-tight text-ink ${atTop ? "h-[calc(100dvh-5rem)] md:h-[calc(100dvh-5.5rem)]" : "h-[calc(100dvh-3.5rem)]"}`}
            initial={reduce ? false : { x: "-100%" }}
            animate={{ x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: "-100%" }}
            transition={slide}
          >
            <div className="flex flex-col gap-5">
              {catalogLinks.map((link) => (
                <Link key={link.to} to={link.to}>
                  {tx(link.label)}
                </Link>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-4 border-t border-line pt-8 text-muted">
              {pageLinks.map((link) => (
                <Link key={link.to} to={link.to} className="hover:text-ink">
                  {tx(link.label)}
                </Link>
              ))}
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
    </>
  )
}

function LanguageMenu({ lang, setLang }: { lang: Lang; setLang: (lang: Lang) => void }) {
  const { tx } = useStore()
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("pointerdown", onPointer)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("pointerdown", onPointer)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <div ref={root} className="relative text-xs md:text-sm">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={tx("language")}
        className="flex items-center gap-1"
        onClick={() => setOpen((value) => !value)}
      >
        {lang.toUpperCase()}
        <CaretDown size={12} className={`size-2.5 md:size-3 ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <ul role="listbox" className="absolute top-full right-0 z-50 mt-3 min-w-16 border border-line bg-white py-1 text-ink">
          {languages.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                role="option"
                aria-selected={lang === item.id}
                className={`block w-full px-3 py-1.5 text-left ${lang === item.id ? "font-medium" : "text-muted"}`}
                onClick={() => {
                  setLang(item.id)
                  setOpen(false)
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
