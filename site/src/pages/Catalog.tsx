import { Funnel, X } from "../components/icons"
import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { ProductCard } from "../components/ProductCard"
import {
  colorHex,
  colorName,
  inStock,
  kinds,
  products,
  type ColorId,
  type Gender,
  type Kind,
  type Lang,
} from "../data"
import type { MessageKey } from "../i18n"
import { useStore } from "../store"

const PAGE = 4

const kindLabel: Record<Kind, MessageKey> = {
  jackets: "kind.jackets",
  sneakers: "kind.sneakers",
  bags: "nav.bags",
  belts: "kind.belts",
}

const pageTitle: Record<Kind, MessageKey> = {
  jackets: "nav.ready",
  sneakers: "nav.shoes",
  bags: "nav.bags",
  belts: "nav.accessories",
}

const materials = ["leather"] as const
const colors: ColorId[] = ["black", "cognac", "white", "emerald"]
const letterSizes = ["XS", "S", "M", "L", "XL"]

function compareSize(a: string, b: string) {
  const an = Number(a)
  const bn = Number(b)
  if (Number.isFinite(an) && Number.isFinite(bn)) return an - bn
  return letterSizes.indexOf(a) - letterSizes.indexOf(b)
}

export function Catalog() {
  const { lang, tx } = useStore()
  const [params, setParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const filterKey = params.toString()
  const [view, setView] = useState({ filterKey, count: PAGE })
  if (view.filterKey !== filterKey) setView({ filterKey, count: PAGE })

  const gender = params.get("gender")
  const kind = params.get("kind")
  const material = params.get("material")
  const color = params.get("color")
  const size = params.get("size")
  const onlyStock = params.get("stock") === "1"

  const filtered = products.filter((product) => {
    if (gender && product.gender !== gender) return false
    if (kind && product.kind !== kind) return false
    if (material && product.material !== material) return false
    if (color && product.color !== color) return false
    if (size && !product.sizes.includes(size)) return false
    if (onlyStock && !inStock(product)) return false
    return true
  })

  const visible = filtered.slice(0, view.count)
  const sentinel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = sentinel.current
    if (!node || view.count >= filtered.length) return
    const observer = new IntersectionObserver((entries) => {
      if (!entries[0]?.isIntersecting) return
      setView((current) =>
        current.filterKey !== filterKey
          ? current
          : { filterKey, count: Math.min(current.count + PAGE, filtered.length) },
      )
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [filterKey, filtered.length, view.count])

  function toggle(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (next.get(key) === value) next.delete(key)
    else next.set(key, value)
    setParams(next)
  }

  function clear() {
    setParams(new URLSearchParams())
  }

  const sizes = kind
    ? [
        ...new Set(
          products
            .filter((product) => product.kind === kind)
            .flatMap((product) => product.sizes),
        ),
      ].sort(compareSize)
    : []

  const selectedKind = kinds.find((item) => item.id === kind)?.id

  const activeCount = [gender, material, color, size, onlyStock ? "1" : null].filter(Boolean).length

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-8 md:px-8 md:py-12">
      <div className="flex items-end justify-between gap-4">
        <h1 className="text-4xl tracking-tight md:text-5xl">
          {selectedKind ? tx(pageTitle[selectedKind]) : tx("catalog")}
        </h1>
        <button
          className="inline-flex items-center gap-2 text-xl"
          onClick={() => setFiltersOpen(true)}
        >
          <Funnel size={20} />
          {tx("filters")}
          {activeCount > 0 ? <span>{activeCount}</span> : null}
        </button>
      </div>

      <div className="mt-12 overflow-x-auto border-b border-line [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-14 pb-8 md:gap-20">
          {kinds.map((item) => {
            const active = kind === item.id
            return (
              <button
                key={item.id}
                onClick={() => toggle("kind", item.id)}
                className={`flex w-36 shrink-0 flex-col items-center gap-5 ${active ? "text-ink" : "text-[#b5b5b5]"}`}
              >
                <img src={categoryDrawings[item.id]} alt="" className="h-24 w-full object-contain" />
                <span className="text-[11px] tracking-[0.16em] uppercase">
                  {tx(kindLabel[item.id])}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="py-20">
          <p className="max-w-[36ch] text-xl">
            {tx("nothing.matched.clear.the.filter")}
          </p>
          <button className="mt-6 text-xl text-accent" onClick={clear}>
            {tx("clear")}
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      <div ref={sentinel} className="h-8" />

      {filtersOpen ? (
        <>
          <button
            className="fixed inset-0 top-[var(--chrome)] z-30 bg-black/40"
            aria-label={tx("close.filters")}
            onClick={() => setFiltersOpen(false)}
          />
          <aside className="fixed top-[var(--chrome)] right-0 z-30 flex h-[calc(100dvh-var(--chrome))] w-[min(100%,320px)] flex-col overflow-y-auto bg-white px-8 py-10 text-ink">
            <div className="flex items-center justify-between">
              <h2 className="text-xl tracking-tight">{tx("filters")}</h2>
              <button aria-label={tx("close.filters")} onClick={() => setFiltersOpen(false)}>
                <X size={22} />
              </button>
            </div>
            <div className="mt-8">
              <FilterRow
                gender={gender}
                material={material}
                color={color}
                size={size}
                onlyStock={onlyStock}
                sizes={sizes}
                lang={lang}
                tx={tx}
                toggle={toggle}
                clear={clear}
              />
            </div>
          </aside>
        </>
      ) : null}
    </div>
  )
}

const categoryDrawings = {
  jackets: "/media/kind-jacket.png",
  sneakers: "/media/kind-sneaker.png",
  loafers: "/media/kind-loafer.png",
  boots: "/media/kind-boot.png",
  bags: "/media/kind-bag.png",
  belts: "/media/kind-belt.png",
} as const

function FilterRow({
  gender,
  material,
  color,
  size,
  onlyStock,
  sizes,
  lang,
  tx,
  toggle,
  clear,
}: {
  gender: string | null
  material: string | null
  color: string | null
  size: string | null
  onlyStock: boolean
  sizes: string[]
  lang: Lang
  tx: (key: MessageKey) => string
  toggle: (key: string, value: string) => void
  clear: () => void
}) {
  return (
    <div className="flex flex-col items-start gap-3">
      {(["women", "men"] as Gender[]).map((value) => (
        <button
          key={value}
          data-active={gender === value ? "true" : undefined}
          className="chip"
          onClick={() => toggle("gender", value)}
        >
          {value === "women" ? tx("nav.women") : tx("nav.men")}
        </button>
      ))}
      {materials.map((value) => (
        <button
          key={value}
          data-active={material === value ? "true" : undefined}
          className="chip"
          onClick={() => toggle("material", value)}
        >
          {tx("leather")}
        </button>
      ))}
      <div className="flex flex-wrap gap-3 py-1">
        {colors.map((value) => (
          <button
            key={value}
            aria-label={colorName[value][lang]}
            data-active={color === value ? "true" : undefined}
            className="swatch"
            onClick={() => toggle("color", value)}
          >
            <span
              style={{
                background: colorHex[value],
                boxShadow: value === "white" ? "inset 0 0 0 1px #e4e8ea" : undefined,
              }}
            />
          </button>
        ))}
      </div>
      {sizes.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {sizes.map((value) => (
            <button
              key={value}
              data-active={size === value ? "true" : undefined}
              className="chip"
              onClick={() => toggle("size", value)}
            >
              {value === "One" ? tx("one.2") : value}
            </button>
          ))}
        </div>
      )}
      <button
        data-active={onlyStock ? "true" : undefined}
        className="chip"
        onClick={() => toggle("stock", "1")}
      >
        {tx("in.stock")}
      </button>
      <button className="text-xl text-muted" onClick={clear}>
        {tx("clear")}
      </button>
    </div>
  )
}
