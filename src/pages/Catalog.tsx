import { Funnel, X } from "../components/icons"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useSearchParams } from "react-router-dom"
import { fetchCatalog, useFilters, type FilterCategory, type FilterOption } from "../catalog"
import { Loader } from "../components/Loader"
import { ProductCard } from "../components/ProductCard"
import type { Lang, Product } from "../data"
import type { MessageKey } from "../i18n"
import { useStore } from "../store"

const LIMIT = 12

function unique<T extends { id: string }>(items: T[]) {
  const seen = new Map<string, T>()
  for (const item of items) seen.set(item.id, item)
  return [...seen.values()]
}

const drawings: Record<string, string> = {
  jackets: "/media/kind-jacket.png",
  sneakers: "/media/kind-sneaker.png",
  bags: "/media/kind-bag.png",
  belts: "/media/kind-belt.png",
}

type PageState = {
  key: string
  products: Product[]
  page: number
  totalDocs: number
  hasNextPage: boolean
}

export function Catalog() {
  const { lang, tx } = useStore()
  const filters = useFilters()
  const [params, setParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const reduce = useReducedMotion()
  const slide = { duration: reduce ? 0.01 : 0.4, ease: [0.22, 1, 0.36, 1] as const }
  const request = useRef(0)

  const gendersSelected = params.getAll("gender")
  const category = params.get("category") || params.get("kind")
  const materialsSelected = params.getAll("material")
  const colorsSelected = params.getAll("color")
  const sizesSelected = params.getAll("size")
  const onlyStock = params.get("in_stock") === "true" || params.get("stock") === "1"
  const queryKey = [
    category,
    gendersSelected.join(","),
    materialsSelected.join(","),
    colorsSelected.join(","),
    sizesSelected.join(","),
    onlyStock ? "1" : "",
  ].join("|")

  const [state, setState] = useState<PageState>({
    key: "",
    products: [],
    page: 0,
    totalDocs: 0,
    hasNextPage: false,
  })
  const [loading, setLoading] = useState(true)
  const ready = state.key === queryKey
  const visible = ready ? state.products : []
  const pending = loading || !ready
  const revealed = state.key !== ""

  const sentinel = useRef<HTMLDivElement>(null)
  const kindsRef = useRef<HTMLDivElement>(null)
  const [kindsOverflow, setKindsOverflow] = useState(false)

  const selected = filters?.categories.find((item) => item.id === category)
  const materials = selected?.materials ?? unique(filters?.categories.flatMap((item) => item.materials) ?? [])
  const colors = selected?.colors ?? unique(filters?.categories.flatMap((item) => item.colors) ?? [])
  const sizes = selected?.sizes ?? []

  useEffect(() => {
    const id = ++request.current
    setLoading(true)
    fetchCatalog({
      category: category || undefined,
      gender: gendersSelected,
      material: materialsSelected,
      color: colorsSelected,
      size: sizesSelected,
      inStock: onlyStock,
      page: 1,
      limit: LIMIT,
    })
      .then((result) => {
        if (id !== request.current) return
        setState({
          key: queryKey,
          products: result.products,
          page: result.page,
          totalDocs: result.totalDocs,
          hasNextPage: result.hasNextPage,
        })
        setLoading(false)
      })
      .catch(() => {
        if (id !== request.current) return
        setState({ key: queryKey, products: [], page: 1, totalDocs: 0, hasNextPage: false })
        setLoading(false)
      })
  }, [queryKey, category, onlyStock])

  useEffect(() => {
    const node = sentinel.current
    if (!node || !ready || !state.hasNextPage || loading) return
    const observer = new IntersectionObserver((entries) => {
      if (!entries[0]?.isIntersecting) return
      observer.disconnect()
      const id = ++request.current
      const nextPage = state.page + 1
      setLoading(true)
      fetchCatalog({
        category: category || undefined,
        gender: gendersSelected,
        material: materialsSelected,
        color: colorsSelected,
        size: sizesSelected,
        inStock: onlyStock,
        page: nextPage,
        limit: LIMIT,
      })
        .then((result) => {
          if (id !== request.current) return
          setState((current) => ({
            key: queryKey,
            products: [...current.products, ...result.products],
            page: result.page,
            totalDocs: result.totalDocs,
            hasNextPage: result.hasNextPage,
          }))
          setLoading(false)
        })
        .catch(() => {
          if (id === request.current) setLoading(false)
        })
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [ready, state.hasNextPage, state.page, loading, queryKey, category, onlyStock])

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
  }, [filters])

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

  function toggle(key: string, value: string) {
    const next = new URLSearchParams(params)
    const legacy = next.get("kind")
    if (legacy) {
      next.delete("kind")
      if (!next.get("category")) next.set("category", legacy)
    }
    if (key === "gender" || key === "material" || key === "color" || key === "size") {
      const selected = next.getAll(key)
      next.delete(key)
      const values = selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]
      for (const item of values) next.append(key, item)
      setParams(next)
      return
    }
    if (next.get(key) === value) next.delete(key)
    else next.set(key, value)
    if (key === "category") {
      next.delete("size")
      next.delete("material")
      next.delete("color")
    }
    setParams(next)
  }

  function clear() {
    setParams(new URLSearchParams())
  }

  const activeCount =
    gendersSelected.length + materialsSelected.length + colorsSelected.length + sizesSelected.length + (onlyStock ? 1 : 0)

  return (
    <div className={`mx-auto w-full max-w-[1400px] min-h-[80vh] px-4 py-8 md:px-8 md:py-12 ${revealed ? "" : "flex flex-col"}`}>
      <div className="flex items-end justify-between gap-4">
        <div>
          <SwapTitle text={selected ? selected.name[lang] : tx("catalog")} />
          {revealed ? (
            <p className="mt-2 text-sm text-muted" aria-busy={ready ? undefined : true}>
              {tx("found")} {ready ? state.totalDocs : <CountDots />}
            </p>
          ) : null}
        </div>
        {revealed ? (
          <button
            className="inline-flex items-center gap-2 text-xl"
            onClick={() => setFiltersOpen(true)}
          >
            <Funnel size={20} />
            {tx("filters")}
            {activeCount > 0 ? <span>{activeCount}</span> : null}
          </button>
        ) : null}
      </div>

      {revealed && (filters?.categories.length ?? 0) > 0 ? (
      <div className="relative mt-8">
        <div
          ref={kindsRef}
          className="overflow-x-auto border-b border-line [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex w-max gap-8 pb-5">
            {(filters?.categories ?? []).map((item) => {
              const active = category === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => toggle("category", item.id)}
                  className={`flex w-24 shrink-0 flex-col items-center gap-3 ${active ? "text-accent" : "text-[#b5b5b5]"}`}
                >
                  <span
                    className="kind-icon"
                    style={{ "--kind": `url("${item.image || drawings[item.id]}")` }}
                  />
                  <span className="text-[11px] tracking-[0.16em] uppercase">{item.name[lang]}</span>
                </button>
              )
            })}
          </div>
        </div>
        {kindsOverflow ? (
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent" />
        ) : null}
      </div>
      ) : null}
      {revealed ? null : (
        <div className="grid flex-1 place-items-center">
          <Loader label={tx("loading")} />
        </div>
      )}

      {revealed && pending && visible.length === 0 ? <Loader label={tx("loading")} className="py-16" /> : null}
      {revealed && !pending && visible.length === 0 ? (
        <div className="py-20">
          <p className="max-w-[36ch] text-xl">{tx("nothing.matched.clear.the.filter")}</p>
          <button className="mt-6 text-xl text-accent" onClick={clear}>
            {tx("clear")}
          </button>
        </div>
      ) : null}
      {visible.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : null}
      {pending && visible.length > 0 ? <Loader label={tx("loading")} className="py-10" /> : null}
      <div ref={sentinel} className="h-8" />

      {createPortal(
        <AnimatePresence>
          {filtersOpen ? (
            <motion.button
              key="filter-shade"
              type="button"
              className="fixed inset-0 z-[60] bg-black/40"
              aria-label={tx("close.filters")}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0.01 : 0.25 }}
              onClick={() => setFiltersOpen(false)}
            />
          ) : null}
          {filtersOpen ? (
            <motion.div
              key="filters"
              role="dialog"
              aria-modal="true"
              aria-label={tx("filters")}
              className="fixed top-0 right-0 z-[60] flex h-dvh w-[min(100%,320px)] flex-col overflow-y-auto bg-white px-8 py-10 text-xl tracking-tight text-ink"
              initial={reduce ? false : { x: "100%" }}
              animate={{ x: 0 }}
              exit={reduce ? { opacity: 0 } : { x: "100%" }}
              transition={slide}
            >
              <div className="flex justify-end">
                <button aria-label={tx("close.filters")} onClick={() => setFiltersOpen(false)}>
                  <X size={22} />
                </button>
              </div>
              <div className="mt-8">
                <FilterRow
                  genders={filters?.genders ?? []}
                  materials={materials}
                  colors={colors}
                  sizes={sizes}
                  gender={gendersSelected}
                  material={materialsSelected}
                  color={colorsSelected}
                  size={sizesSelected}
                  onlyStock={onlyStock}
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

const letterStep = 45
const letterMs = 280

function SwapTitle({ text }: { text: string }) {
  const reduce = useReducedMotion()
  const [shown, setShown] = useState(text)
  const [phase, setPhase] = useState<"in" | "out" | "idle">("idle")

  useEffect(() => {
    if (text === shown) return
    if (reduce) {
      setShown(text)
      return
    }
    setPhase("out")
    const count = Math.max([...shown].length, 1)
    const wait = (count - 1) * letterStep + letterMs
    const id = window.setTimeout(() => {
      setShown(text)
      setPhase("in")
    }, wait)
    return () => window.clearTimeout(id)
  }, [text, shown, reduce])

  return (
    <h1 className="text-4xl tracking-tight md:text-5xl" aria-label={text}>
      <span aria-hidden="true">
        {[...shown].map((letter, index) => (
          <span
            key={`${shown}-${index}`}
            className={phase === "out" ? "title-out" : phase === "in" ? "title-in" : undefined}
            style={phase === "idle" ? undefined : { animationDelay: `${index * letterStep}ms` }}
          >
            {letter === " " ? "\u00a0" : letter}
          </span>
        ))}
      </span>
    </h1>
  )
}

function CountDots() {
  return (
    <span className="count-dots" aria-hidden="true">
      {"......".split("").map((dot, index) => (
        <span key={index} style={{ animationDelay: `${index * 0.14}s` }}>
          {dot}
        </span>
      ))}
    </span>
  )
}

function FilterRow({
  genders,
  materials,
  colors,
  sizes,
  gender,
  material,
  color,
  size,
  onlyStock,
  lang,
  tx,
  toggle,
  clear,
}: {
  genders: FilterOption[]
  materials: FilterOption[]
  colors: FilterCategory["colors"]
  sizes: string[]
  gender: string[]
  material: string[]
  color: string[]
  size: string[]
  onlyStock: boolean
  lang: Lang
  tx: (key: MessageKey) => string
  toggle: (key: string, value: string) => void
  clear: () => void
}) {
  return (
    <div className="flex flex-col items-start gap-3">
      {genders.map((item) => (
        <button
          key={item.id}
          data-active={gender.includes(item.id) ? "true" : undefined}
          className="chip"
          onClick={() => toggle("gender", item.id)}
        >
          {item.name[lang]}
        </button>
      ))}
      {materials.map((item) => (
        <button
          key={item.id}
          data-active={material.includes(item.id) ? "true" : undefined}
          className="chip"
          onClick={() => toggle("material", item.id)}
        >
          {item.name[lang]}
        </button>
      ))}
      {colors.length > 0 ? (
        <div className="flex flex-wrap gap-3 py-1">
          {colors.map((item) => (
            <button
              key={item.id}
              aria-label={item.name[lang]}
              data-active={color.includes(item.id) ? "true" : undefined}
              className="swatch"
              onClick={() => toggle("color", item.id)}
            >
              <span
                style={{
                  background: item.hex,
                  boxShadow: item.id === "white" ? "inset 0 0 0 1px #e4e8ea" : undefined,
                }}
              />
            </button>
          ))}
        </div>
      ) : null}
      {sizes.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {sizes.map((value) => (
            <button
              key={value}
              data-active={size.includes(value) ? "true" : undefined}
              className="chip"
              onClick={() => toggle("size", value)}
            >
              {value === "One" ? tx("one.2") : value}
            </button>
          ))}
        </div>
      ) : null}
      <button
        data-active={onlyStock ? "true" : undefined}
        className="chip"
        onClick={() => toggle("in_stock", "true")}
      >
        {tx("in.stock")}
      </button>
      <button className="text-xl text-muted" onClick={clear}>
        {tx("clear")}
      </button>
    </div>
  )
}
