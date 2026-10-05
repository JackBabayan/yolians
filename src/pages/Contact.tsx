import { type FormEvent, useState } from "react"
import { FacebookLogo, InstagramLogo, TelegramLogo, YoutubeLogo } from "../components/icons"
import { Link } from "react-router-dom"
import { TextAreaField, TextField } from "../components/form"
import { useContent } from "../content"
import { useStore } from "../store"

const social = [
  { href: "https://instagram.com/yolians", label: "Instagram", icon: InstagramLogo },
  { href: "https://facebook.com/yolians", label: "Facebook", icon: FacebookLogo },
  { href: "https://t.me/yolians", label: "Telegram", icon: TelegramLogo },
  { href: "https://youtube.com/@yolians", label: "YouTube", icon: YoutubeLogo },
]

export function Contact() {
  const { tx, lang } = useStore()
  const settings = useContent<{
    primaryPhone?: string
    contactEmail?: string
    atelierAddress?: string
    businessHours?: string
  }>("/content/settings")
  const studio = settings?.[lang] ?? settings?.en
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })

  const details = [
    {
      label: tx("email"),
      value: studio?.contactEmail || "hello@yolians.com",
      href: `mailto:${studio?.contactEmail || "hello@yolians.com"}`,
    },
    {
      label: tx("phone"),
      value: studio?.primaryPhone || "+1 (555) 123-4567",
      href: `tel:${(studio?.primaryPhone || "+15551234567").replace(/[^\d+]/g, "")}`,
    },
    {
      label: tx("address"),
      value: studio?.atelierAddress || "Yolians Atelier, Via Milano 12, 20121 Milan",
    },
    {
      label: tx("hours"),
      value: studio?.businessHours || tx("mon.fri.10.00.18"),
    },
  ]

  function submit(event: FormEvent) {
    event.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError(tx("fill.in.name.email.and"))
      return
    }
    setError("")
    setSent(true)
  }

  function set(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 md:px-8">
      <header>
        <h1 className="text-6xl tracking-tight md:text-7xl">{tx("contact.us")}</h1>
        <p className="mt-5 max-w-[34ch] text-2xl text-muted">
          {tx("write.about.a.piece.a")}
        </p>
      </header>

      <div className="frame-fade relative mt-12">
        <img
          src="/media/leather-craft.jpg"
          alt=""
          className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl"
        />
        <img
          src="/media/leather-craft.jpg"
          alt={tx("leather.being.cut.in.the")}
          className="relative aspect-[16/7] w-full object-cover"
        />
      </div>

      <div className="mt-16 grid items-start gap-16 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-24">
        <div>
          <h2 className="text-4xl tracking-tight">{tx("the.atelier.2")}</h2>
          <ul className="mt-8 border-t border-line">
            {details.map((item) => (
              <li key={item.label} className="border-b border-line py-6">
                <p className="text-sm tracking-[0.14em] text-muted uppercase">{item.label}</p>
                {item.href ? (
                  <a href={item.href} className="mt-2 inline-block text-xl font-medium">
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-2 text-xl font-medium">{item.value}</p>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            {social.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xl"
              >
                <item.icon size={18} />
                {item.label}
              </a>
            ))}
          </div>
        </div>

        {sent ? (
          <div>
            <h2 className="text-4xl tracking-tight">{tx("send.a.message")}</h2>
            <p className="mt-6 max-w-[36ch] text-xl">
              {tx("message.sent.we.reply.within")}
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-4">
            <h2 className="text-4xl tracking-tight">{tx("send.a.message")}</h2>
            <p className="mb-2 max-w-[42ch] text-xl text-muted">
              {tx("we.usually.reply.within.a")}
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField label={tx("full.name")} autoComplete="name" value={form.name} onChange={(event) => set("name", event.target.value)} />
              <TextField label="Email" type="email" autoComplete="email" value={form.email} onChange={(event) => set("email", event.target.value)} />
            </div>
            <TextField label={tx("subject")} value={form.subject} onChange={(event) => set("subject", event.target.value)} />
            <TextAreaField label={tx("message")} value={form.message} onChange={(event) => set("message", event.target.value)} />
            {error ? <p className="text-xl text-[#8f2d2d]">{error}</p> : null}
            <button type="submit" className="btn mt-2 w-full">{tx("send.message")}</button>
            <p className="text-muted">
              {tx("by.sending.this.message.you")}
              <Link to="/privacy" className="underline">{tx("privacy.policy.3")}</Link>.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
