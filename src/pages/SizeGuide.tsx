import { useContent } from "../content"
import { useProducts } from "../data"
import { useStore } from "../store"

type SizeCopy = {
  title?: string
  intro?: string
  footwearSizes?: { eu: string; us: string; cm: string; uk?: string }[]
  beltSizes?: { size: string; waistCm: string }[]
}

const shoes = [
  ["36", "6", "3.5", "23"],
  ["37", "6.5", "4", "23.5"],
  ["38", "7.5", "5", "24"],
  ["39", "8.5", "6", "24.5"],
  ["40", "9", "6.5", "25"],
  ["41", "9.5", "7.5", "26"],
  ["42", "10.5", "8", "26.5"],
  ["43", "11", "9", "27.5"],
  ["44", "12", "10", "28"],
]

export function SizeGuide() {
  const { tx, lang } = useStore()
  const products = useProducts()
  const guide = useContent<SizeCopy>("/content/size-guide")
  const copy = guide?.[lang] ?? guide?.en
  const belts = products.find((product) => product.category === "belts")?.sizes ?? []
  const bags = products.filter((product) => product.category === "bags")
  const footwear = copy?.footwearSizes?.length
    ? copy.footwearSizes
    : shoes.map(([eu, us, uk, cm]) => ({ eu, us, uk, cm }))
  const beltRows = copy?.beltSizes?.length
    ? copy.beltSizes
    : belts.map((size) => ({ size, waistCm: `${size} cm` }))

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-12 md:px-8">
      <h1 className="text-4xl tracking-tight md:text-5xl">
        {copy?.title || tx("nav.size")}
      </h1>
      <p className="mt-4 max-w-[46ch] text-muted">
        {copy?.intro || tx("shoes.belts.and.bags.are")}
      </p>

      <section className="mt-12">
        <h2 className="text-2xl tracking-tight">{tx("footwear")}</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {footwear.map((row) => (
            <div key={row.eu} className="border border-line p-4">
              <p className="text-2xl tracking-tight">EU {row.eu}</p>
              <p className="mt-3 text-xl text-muted">US {row.us}</p>
              {row.uk ? <p className="text-xl text-muted">UK {row.uk}</p> : null}
              <p className="text-xl text-muted">{row.cm} cm</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl tracking-tight">{tx("kind.belts")}</h2>
        <p className="mt-3 max-w-[52ch] text-muted">
          {tx("the.belt.size.is.the")}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {beltRows.map((row) => (
            <div key={row.size} className="bg-[#f4f6f6] p-4">
              <p className="text-2xl tracking-tight">{row.size}</p>
              <p className="mt-3 text-xl text-muted">{tx("waist")} {row.waistCm}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl tracking-tight">{tx("nav.bags")}</h2>
        <p className="mt-3 max-w-[52ch] text-muted">
          {tx("the.bags.in.the.catalog")}
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {bags.map((product) => (
            <div key={product.id} className="border border-line p-4">
              <p className="text-2xl tracking-tight">{product.name[lang]}</p>
              <p className="mt-3 text-xl text-muted">{tx("one.size.2")}</p>
              <p className="text-xl text-muted">{product.note[lang]}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
