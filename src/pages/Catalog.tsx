import { Funnel, X } from "../components/icons"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
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
  const reduce = useReducedMotion()
  const slide = { duration: reduce ? 0.01 : 0.4, ease: [0.22, 1, 0.36, 1] as const }
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
  const kindsRef = useRef<HTMLDivElement>(null)
  const [kindsOverflow, setKindsOverflow] = useState(false)

  useEffect(() => {
    const node = kindsRef.current
    if (!node) return
    const update = () => {
      const more = node.scrollLeft + node.clientWidth < node.scrollWidth - 4
      setKindsOverflow((current) => (current === more ? current : more))
    }
    update()
    node.addEventListener("scroll", update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(node)
    return () => {
      node.removeEventListener("scroll", update)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!filtersOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFiltersOpen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener("keydown", onKey)
    }
  }, [filtersOpen])

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

      <div className="relative mt-8">
        <div
          ref={kindsRef}
          className="overflow-x-auto border-b border-line [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex w-max gap-8 pb-5">
            {kinds.map((item) => {
              const active = kind === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => toggle("kind", item.id)}
                  className={`flex w-24 shrink-0 flex-col items-center gap-3 ${active ? "text-ink" : "text-[#b5b5b5]"}`}
                >
                  <img src={categoryDrawings[item.id]} alt="" className="h-16 w-full object-contain" />
                  <span className="text-[11px] tracking-[0.16em] uppercase">
                    {tx(kindLabel[item.id])}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
        {kindsOverflow ? (
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent" />
        ) : null}
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

      {createPortal(
        <AnimatePresence>
          {filtersOpen ? (
            <motion.div
              key="filters"
              role="dialog"
              aria-modal="true"
              aria-label={tx("filters")}
              className="fixed inset-0 z-[60] overflow-y-auto bg-white px-4 py-8 text-ink md:px-8 md:py-12"
              initial={reduce ? false : { x: "100%" }}
              animate={{ x: 0 }}
              exit={reduce ? { opacity: 0 } : { x: "100%" }}
              transition={slide}
            >
              <div className="mx-auto flex w-full max-w-[1400px]  justify-end">
                <button aria-label={tx("close.filters")} onClick={() => setFiltersOpen(false)}>
                  <X size={22} />
                </button>
              </div>
              <div className="mx-auto mt-8 w-full max-w-[1400px]">
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
            </motion.div>
          ) : null}
        </AnimatePresence>,
        document.body,
      )}
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
