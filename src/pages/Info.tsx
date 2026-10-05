import { useEffect, useRef, useState, type ReactNode } from "react"
import { Minus, Plus } from "../components/icons"
import { useContent } from "../content"
import { domestic, groups, international, legal, pages } from "../mock/info"
import { useStore } from "../store"

type FaqCopy = {
  faqTitle: string
  faqIntro: string
  returnsTitle: string
  returnsIntro: string
  sections?: { categoryTitle: string; items: { question: string; answer: string }[] }[]
}

type ShippingCopy = {
  title: string
  intro: string
  domesticRows?: { service: string; cost: string; timeframe: string }[]
  internationalRows?: { service: string; cost: string; timeframe: string }[]
  customsNote?: string
  trackingNote?: string
}

type PolicyCopy = { title: string; updated: string; sections: { title: string; body: string }[] }

function Questions({ page }: { page: keyof typeof pages }) {
  const { lang } = useStore()
  const content = useContent<FaqCopy>("/content/faq")
  const copy = content?.[lang] ?? content?.en
  const fallback = pages[page]
  const title = copy ? (page === "faq" ? copy.faqTitle : copy.returnsTitle) : fallback.title[lang]
  const intro = copy ? (page === "faq" ? copy.faqIntro : copy.returnsIntro) : fallback.intro[lang]
  const sections = copy?.sections?.length
    ? copy.sections.map((section) => ({
        title: section.categoryTitle,
        items: section.items.map((item) => ({ q: item.question, a: item.answer })),
      }))
    : groups.map((group) => ({
        title: group.title[lang],
        items: group.items.map((item) => ({ q: item.q[lang], a: item.a[lang] })),
      }))
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
      <header className="mx-auto max-w-3xl text-center">
        <h1 className="text-6xl tracking-tight md:text-7xl">{title}</h1>
        <p className="mt-5 text-2xl text-muted">{intro}</p>
      </header>
      <div className="mt-14 flex flex-col gap-12">
        {sections.map((group) => (
          <section key={group.title}>
            <h2 className="text-4xl tracking-tight">{group.title}</h2>
            <div className="mt-4 border-t border-line">
              {group.items.map((item) => {
                const key = `${group.title}:${item.q}`
                const shown = open === key
                return (
                  <div key={key} className="border-b border-line">
                    <button
                      className="flex w-full items-center justify-between gap-6 py-5 text-left text-xl"
                      aria-expanded={shown}
                      onClick={() => setOpen(shown ? null : key)}
                    >
                      {item.q}
                      {shown ? <Minus size={16} className="shrink-0" /> : <Plus size={16} className="shrink-0" />}
                    </button>
                    <Answer open={shown}>
                      <p className="pb-5 text-lg leading-relaxed text-muted">{item.a}</p>
                    </Answer>
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}


function RateCard({
  title,
  rows,
}: {
  title: string
  rows: { title: string; time: string; price: string }[]
}) {
  return (
    <article className="bg-[#f4f6f6] p-6 md:p-8">
      <h2 className="text-2xl tracking-tight">{title}</h2>
      <div className="mt-4">
        {rows.map((row) => (
          <div key={row.title} className="flex items-start justify-between gap-6 border-b border-white py-4 last:border-0">
            <p>
              {row.title}
              <span className="mt-1 block text-muted">{row.time}</span>
            </p>
            <p className="shrink-0">{row.price}</p>
          </div>
        ))}
      </div>
    </article>
  )
}

function ShippingInfo() {
  const { tx, lang } = useStore()
  const content = useContent<ShippingCopy>("/content/shipping")
  const copy = content?.[lang] ?? content?.en
  const homeRows = copy?.domesticRows?.length
    ? copy.domesticRows.map((row) => ({ title: row.service, time: row.timeframe, price: row.cost }))
    : domestic.map((row) => ({ title: row.title[lang], time: row.time[lang], price: row.price[lang] }))
  const worldRows = copy?.internationalRows?.length
    ? copy.internationalRows.map((row) => ({ title: row.service, time: row.timeframe, price: row.cost }))
    : international.map((row) => ({ title: row.title[lang], time: row.time[lang], price: row.price[lang] }))
  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 md:px-8">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-5xl tracking-tight md:text-6xl">{copy?.title || tx("shipping.information")}</h1>
        <p className="mt-5 text-muted">
          {copy?.intro || tx("the.piece.is.sent.so")}
        </p>
      </header>
      <div className="mt-12 grid gap-4 md:grid-cols-2">
        <RateCard title={tx("domestic")} rows={homeRows} />
        <RateCard title={tx("international")} rows={worldRows} />
      </div>
      <article className="mt-4 bg-[#f4f6f6] p-6 md:p-8">
        <h2 className="text-2xl tracking-tight">{tx("customs.and.duties")}</h2>
        <p className="mt-3 max-w-[78ch] leading-relaxed text-muted">
          {copy?.customsNote || tx("outside.the.european.union.the")}
        </p>
      </article>
      <article className="mt-4 bg-[#f4f6f6] p-6 md:p-8">
        <h2 className="text-2xl tracking-tight">{tx("tracking")}</h2>
        <p className="mt-3 max-w-[78ch] leading-relaxed text-muted">
          {copy?.trackingNote || tx("the.shipment.is.insured.when")}
        </p>
      </article>
    </div>
  )
}


function Answer({ open, children }: { open: boolean; children: ReactNode }) {
  const inner = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    setHeight(open ? (inner.current?.scrollHeight ?? 0) : 0)
  }, [open])

  return (
    <div
      className="overflow-hidden transition-[height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
      style={{ height }}
    >
      <div ref={inner}>{children}</div>
    </div>
  )
}

function Legal({ page }: { page: keyof typeof legal }) {
  const { lang } = useStore()
  const policies = useContent<{ privacy: PolicyCopy; terms: PolicyCopy }>("/content/policies")
  const remote = policies?.[lang]?.[page] ?? policies?.en?.[page]
  const content = legal[page]
  const blocks = remote?.sections?.length
    ? remote.sections
    : content.blocks.map((block) => ({ title: block.title[lang], body: block.body[lang] }))
  return (
    <div className="mx-auto w-full max-w-3xl px-4 md:px-8">
      <header className="text-center">
        <h1 className="text-5xl tracking-tight md:text-6xl">{remote?.title || content.title[lang]}</h1>
        <p className="mt-4 text-sm text-muted">{remote?.updated || content.updated[lang]}</p>
      </header>
      <div className="mt-12">
        {blocks.map((block) => (
          <section key={block.title} className="border-b border-line py-8">
            <h2 className="text-2xl tracking-tight">{block.title}</h2>
            <p className="mt-3 text-base leading-relaxed text-muted">{block.body}</p>
          </section>
        ))}
      </div>
    </div>
  )
}

export function Info({ page }: { page: "faq" | "returns" | "shipping" | "privacy" | "terms" }) {
  if (page === "faq" || page === "returns") return <Questions page={page} />
  if (page === "shipping") return <ShippingInfo />
  return <Legal page={page} />
}
