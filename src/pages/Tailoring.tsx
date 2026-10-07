import { FacebookLogo, InstagramLogo, TelegramLogo, YoutubeLogo } from "../components/icons"
import { type FormEvent, useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { api } from "../api"
import { Hero, type HeroSlide } from "../components/Hero"
import { TextAreaField, TextField } from "../components/form"
import { Loader } from "../components/Loader"
import { useContent } from "../content"
import { productById, useProducts } from "../data"
import { phrase } from "../i18n"
import { useStore } from "../store"

const heroSlides: HeroSlide[] = [
  { kind: "image", src: "/media/leather-craft.jpg" },
  { kind: "video", src: "/media/hero-film.mp4" },
  { kind: "image", src: "/media/hero-walk.jpg" },
]

const steps = [
  {
    n: "01",
    title: phrase({ ru: "Консультация", en: "Consultation" }),
    body: phrase({ ru: "Обсуждаем вещь, кожу и посадку. Можно начать с модели из каталога.", en: "We talk through the piece, the leather and the fit. A catalog model is a fine place to start." }),
  },
  {
    n: "02",
    title: phrase({ ru: "Мерки", en: "Measurement" }),
    body: phrase({ ru: "Снимаем мерки в ателье или у вас. Замерщик приезжает по записи.", en: "We measure at the atelier or at your place. The fitter comes by appointment." }),
  },
  {
    n: "03",
    title: phrase({ ru: "Пошив", en: "Crafting" }),
    body: phrase({ ru: "Кроим и шьём в миланском ателье. Срок называем после мерок.", en: "We cut and sew in the Milan atelier. The date comes after the measurements." }),
  },
  {
    n: "04",
    title: phrase({ ru: "Примерка", en: "Fitting" }),
    body: phrase({ ru: "Примеряете готовую вещь. Если нужно, поправляем посадку.", en: "You try the finished piece. If it needs a change, we adjust the fit." }),
  },
] as const

const contacts = [
  {
    label: phrase({ ru: "Звонки в ателье", en: "Phone enquiries" }),
    value: "+1 (800) 965-4267",
    href: "tel:+18009654267",
    action: phrase({ ru: "Позвонить", en: "Call Atelier" }),
  },
  {
    label: phrase({ ru: "Почта пошива", en: "Bespoke assistance email" }),
    value: "tailoring@yolians.com",
    href: "mailto:tailoring@yolians.com",
    action: phrase({ ru: "Написать", en: "Write Email" }),
  },
  {
    label: phrase({ ru: "Мессенджер", en: "Instant chat messenger" }),
    value: "@yolians.atelier",
    href: "https://t.me/yolians",
    action: phrase({ ru: "Чат", en: "Chat Now" }),
    external: true,
  },
] as const

const messengers = [
  { href: "https://instagram.com/yolians", label: "Instagram", icon: InstagramLogo },
  { href: "https://facebook.com/yolians", label: "Facebook", icon: FacebookLogo },
  { href: "https://t.me/yolians", label: "Telegram", icon: TelegramLogo },
  { href: "https://youtube.com/@yolians", label: "YouTube", icon: YoutubeLogo },
]

type TailoringCopy = {
  heroHeadline?: string
  heroSubheadline?: string
  journeySteps?: { stepNumber: string; title: string; body: string }[]
  contactMethods?: { value: string; href: string; label: string; action: string }[]
}

export function Tailoring() {
  const { lang, tx } = useStore()
  useProducts()
  const content = useContent<TailoringCopy>("/content/tailoring")
  const page = content?.[lang] ?? content?.en
  const [params] = useSearchParams()
  const product = productById(params.get("product") ?? "")
  const [messengersOpen, setMessengersOpen] = useState(false)
  const [inquiry, setInquiry] = useState({ name: "", email: "", phone: "", notes: "" })
  const [sent, setSent] = useState(false)
  const [inquiryError, setInquiryError] = useState("")
  const [busy, setBusy] = useState(false)
  const journey = page?.journeySteps?.length
    ? page.journeySteps.map((step) => ({ n: step.stepNumber, title: step.title, body: step.body }))
    : steps.map((step) => ({ n: step.n, title: step.title[lang], body: step.body[lang] }))
  const lines = page?.contactMethods?.length
    ? page.contactMethods
    : contacts.map((item) => ({
        value: item.value,
        href: item.href,
        label: item.label[lang],
        action: item.action[lang],
        external: "external" in item,
      }))

  useEffect(() => {
    if (!messengersOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMessengersOpen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [messengersOpen])

  async function submitInquiry(event: FormEvent) {
    event.preventDefault()
    if (!inquiry.name.trim() || !inquiry.email.trim() || !inquiry.phone.trim()) {
      setInquiryError(tx("fill.in.name.email.and"))
      return
    }
    setBusy(true)
    try {
      await api("/tailoring/inquiries", {
        method: "POST",
        auth: false,
        body: {
          name: inquiry.name.trim(),
          email: inquiry.email.trim(),
          phone: inquiry.phone.trim(),
          notes: [product ? `${tx("for.this.piece")}: ${product.name[lang]}` : "", inquiry.notes.trim()]
            .filter(Boolean)
            .join("\n"),
        },
      })
      setSent(true)
      setInquiryError("")
    } catch (error) {
      setInquiryError(error instanceof Error ? error.message : tx("fill.in.name.email.and"))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <Hero
        slides={heroSlides}
        align="center"
        scrim="bg-gradient-to-b from-black/55 via-black/40 to-black/60"
      >
        {(dots) => (
          <>
          <div>
            <h1 className="text-5xl tracking-tight md:text-7xl">
              {page?.heroHeadline || tx("nav.tailoring")}
            </h1>
            <p className="mx-auto mt-5 max-w-[42ch] text-xl leading-relaxed">
              {page?.heroSubheadline || tx("we.make.the.piece.to")}
            </p>
            {product ? (
              <p className="mt-4 text-xl">
                {tx("for.this.piece")}: {product.name[lang]}
              </p>
            ) : null}
            <div className="mt-8 flex flex-col items-center gap-4">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  className="btn btn-on-dark"
                  aria-expanded={messengersOpen}
                  onClick={() => setMessengersOpen((open) => !open)}
                >
                  {tx("contact.via.messenger")}
                </button>
                <a href="#fitter" className="btn">
                  {tx("call.a.fitter")}
                </a>
              </div>
              {messengersOpen ? (
                <div className="flex flex-wrap justify-center gap-3">
                  {messengers.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-on-dark"
                    >
                      <item.icon size={18} />
                      {item.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
          <div className="absolute right-4 bottom-8 md:right-8 md:bottom-14">{dots}</div>
          </>
        )}
      </Hero>

      <section className="mx-auto w-full max-w-[1400px] px-4 py-20 md:px-8 md:py-28">
        <h2 className="text-center text-4xl tracking-tight md:text-5xl">
          {tx("the.tailoring.journey")}
        </h2>
        <ol className="mt-12 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {journey.map((step) => (
            <li key={step.n} className="bg-white p-8">
              <p className="text-xl text-accent">{step.n}</p>
              <h3 className="mt-6 text-3xl tracking-tight">{step.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="fitter" className="border-t border-line">
        <div className="mx-auto grid w-full max-w-[1400px] items-center gap-14 px-4 py-20 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-24 md:px-8 md:py-28">
          <div>
            <h2 className="text-5xl tracking-tight md:text-6xl">
              {tx("connect.with.us")}
            </h2>
            <p className="mt-6 max-w-[38ch] leading-relaxed text-muted">
              {tx("whether.you.wish.to.start")}
            </p>
            {sent ? (
              <p className="mt-8 text-xl">{tx("thank.you.we.will.write")}</p>
            ) : (
              <form onSubmit={submitInquiry} className="mt-8 flex flex-col gap-4">
                <TextField label={tx("full.name")} value={inquiry.name} onChange={(event) => setInquiry({ ...inquiry, name: event.target.value })} />
                <TextField label="Email" type="email" value={inquiry.email} onChange={(event) => setInquiry({ ...inquiry, email: event.target.value })} />
                <TextField label={tx("phone")} inputMode="tel" value={inquiry.phone} onChange={(event) => setInquiry({ ...inquiry, phone: event.target.value })} />
                <TextAreaField label={tx("message")} value={inquiry.notes} onChange={(event) => setInquiry({ ...inquiry, notes: event.target.value })} />
                {inquiryError ? <p className="text-xl text-[#8f2d2d]">{inquiryError}</p> : null}
                {busy ? <Loader label={tx("loading")} /> : null}
                <button type="submit" className="btn" disabled={busy}>{tx("contact.us")}</button>
              </form>
            )}
          </div>
          <ul className="border-t border-line">
            {lines.map((item) => (
              <li key={item.href} className="flex flex-col gap-4 border-b border-line py-6 sm:flex-row sm:items-center sm:justify-between sm:py-7">
                <div>
                  <p className="text-sm tracking-[0.14em] text-muted uppercase">{item.label}</p>
                  <a
                    href={item.href}
                    {...(item.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="mt-2 inline-block text-xl font-medium"
                  >
                    {item.value}
                  </a>
                </div>
                <a
                  href={item.href}
                  {...(item.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="inline-flex h-12 min-w-40 items-center justify-center border border-accent px-6 text-base text-accent"
                >
                  {item.action}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
