import { useEffect, useRef, useState, type ReactNode } from "react"
import { Minus, Plus } from "../components/icons"
import { domestic, groups, international, legal, pages } from "../mock/info"
import { useStore } from "../store"

function Questions({ page }: { page: keyof typeof pages }) {
  const { lang } = useStore()
  const content = pages[page]
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
      <header className="mx-auto max-w-3xl text-center">
        <h1 className="text-6xl tracking-tight md:text-7xl">{content.title[lang]}</h1>
        <p className="mt-5 text-2xl text-muted">{content.intro[lang]}</p>
      </header>
      <div className="mt-14 flex flex-col gap-12">
        {groups.map((group) => (
          <section key={group.title.ru}>
            <h2 className="text-4xl tracking-tight">{group.title[lang]}</h2>
            <div className="mt-4 border-t border-line">
              {group.items.map((item) => {
                const key = `${group.title.ru}:${item.q.ru}`
                const shown = open === key
                return (
                  <div key={key} className="border-b border-line">
                    <button
                      className="flex w-full items-center justify-between gap-6 py-5 text-left text-xl"
                      aria-expanded={shown}
                      onClick={() => setOpen(shown ? null : key)}
                    >
                      {item.q[lang]}
                      {shown ? <Minus size={16} className="shrink-0" /> : <Plus size={16} className="shrink-0" />}
                    </button>
                    <Answer open={shown}>
                      <p className="pb-5 text-lg leading-relaxed text-muted">{item.a[lang]}</p>
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
  rows: typeof domestic
}) {
  const { lang } = useStore()
  return (
    <article className="bg-[#f4f6f6] p-6 md:p-8">
      <h2 className="text-2xl tracking-tight">{title}</h2>
      <div className="mt-4">
        {rows.map((row) => (
          <div key={row.title.ru} className="flex items-start justify-between gap-6 border-b border-white py-4 last:border-0">
            <p>
              {row.title[lang]}
              <span className="mt-1 block text-muted">{row.time[lang]}</span>
            </p>
            <p className="shrink-0">{row.price[lang]}</p>
          </div>
        ))}
      </div>
    </article>
  )
}

function ShippingInfo() {
  const { tx } = useStore()
  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 md:px-8">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-5xl tracking-tight md:text-6xl">{tx("shipping.information")}</h1>
        <p className="mt-5 text-muted">
          {tx("the.piece.is.sent.so")}
        </p>
      </header>
      <div className="mt-12 grid gap-4 md:grid-cols-2">
        <RateCard title={tx("domestic")} rows={domestic} />
        <RateCard title={tx("international")} rows={international} />
      </div>
      <article className="mt-4 bg-[#f4f6f6] p-6 md:p-8">
        <h2 className="text-2xl tracking-tight">{tx("customs.and.duties")}</h2>
        <p className="mt-3 max-w-[78ch] leading-relaxed text-muted">
          {tx("outside.the.european.union.the")}
        </p>
      </article>
      <article className="mt-4 bg-[#f4f6f6] p-6 md:p-8">
        <h2 className="text-2xl tracking-tight">{tx("tracking")}</h2>
        <p className="mt-3 max-w-[78ch] leading-relaxed text-muted">
          {tx("the.shipment.is.insured.when")}
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
  const content = legal[page]
  return (
    <div className="mx-auto w-full max-w-3xl px-4 md:px-8">
      <header className="text-center">
        <h1 className="text-5xl tracking-tight md:text-6xl">{content.title[lang]}</h1>
        <p className="mt-4 text-sm text-muted">{content.updated[lang]}</p>
      </header>
      <div className="mt-12">
        {content.blocks.map((block) => (
          <section key={block.title.ru} className="border-b border-line py-8">
            <h2 className="text-2xl tracking-tight">{block.title[lang]}</h2>
            <p className="mt-3 text-base leading-relaxed text-muted">{block.body[lang]}</p>
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
