import { FacebookLogo, InstagramLogo, TelegramLogo, YoutubeLogo } from "../components/icons"
import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { Hero, type HeroSlide } from "../components/Hero"
import { productById } from "../data"
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

export function Tailoring() {
  const { lang, tx } = useStore()
  const [params] = useSearchParams()
  const product = productById(params.get("product") ?? "")
  const [messengersOpen, setMessengersOpen] = useState(false)

  useEffect(() => {
    if (!messengersOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMessengersOpen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [messengersOpen])

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
              {tx("nav.tailoring")}
            </h1>
            <p className="mx-auto mt-5 max-w-[42ch] text-xl leading-relaxed">
              {tx("we.make.the.piece.to")}
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
          {steps.map((step) => (
            <li key={step.n} className="bg-white p-8">
              <p className="text-xl text-accent">{step.n}</p>
              <h3 className="mt-6 text-3xl tracking-tight">{step.title[lang]}</h3>
              <p className="mt-3 leading-relaxed text-muted">{step.body[lang]}</p>
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
            <Link to="/contact" className="btn mt-8">
              {tx("contact.us")}
            </Link>
          </div>
          <ul className="border-t border-line">
            {contacts.map((item) => (
              <li key={item.href} className="flex flex-col gap-4 border-b border-line py-6 sm:flex-row sm:items-center sm:justify-between sm:py-7">
                <div>
                  <p className="text-sm tracking-[0.14em] text-muted uppercase">{item.label[lang]}</p>
                  <a
                    href={item.href}
                    {...("external" in item ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="mt-2 inline-block text-xl font-medium"
                  >
                    {item.value}
                  </a>
                </div>
                <a
                  href={item.href}
                  {...("external" in item ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="inline-flex h-12 min-w-40 items-center justify-center border border-accent px-6 text-base text-accent"
                >
                  {item.action[lang]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
