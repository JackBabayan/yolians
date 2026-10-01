import { ArrowLeft, ArrowRight, CaretDown, Minus, Plus } from "../components/icons"
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react"
import { Link, useParams } from "react-router-dom"
import { ProductRail } from "../components/ProductRail"
import { colorHex, colorName, formatShipping, inStock, money, productById, products, type Kind } from "../data"
import type { MessageKey } from "../i18n"
import { useStore } from "../store"

const clothes = [
  ["XS", "84", "64"],
  ["S", "88", "68"],
  ["M", "96", "76"],
  ["L", "104", "84"],
  ["XL", "112", "92"],
]

const shoes = [
  ["36", "6", "23"],
  ["37", "6.5", "23.5"],
  ["38", "7.5", "24"],
  ["39", "8.5", "24.5"],
  ["40", "9", "25"],
  ["41", "9.5", "26"],
  ["42", "10.5", "26.5"],
  ["43", "11", "27.5"],
  ["44", "12", "28"],
]

export function Product() {
  const { id } = useParams()
  const product = productById(id ?? "")
  const { lang, tx, cart, addToCart } = useStore()
  const [picked, setPicked] = useState({ id: id ?? "", size: null as string | null, qty: 1 })
  const [error, setError] = useState("")

  if (product && picked.id !== product.id) {
    setPicked({ id: product.id, size: null, qty: 1 })
    setError("")
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-16">
        <p>{tx("piece.not.found")}</p>
      </div>
    )
  }

  const size = picked.size
  const qty = picked.qty
  const inBag = size !== null && cart.some((line) => line.productId === product.id && line.size === size)
  const soldOut = !inStock(product)
  const selectedQty = size ? product.stock[size] ?? 0 : 0
  const madeToOrder = soldOut || (size !== null && selectedQty === 0)
  const byColor = new Map(
    products
      .filter((item) => item.kind === product.kind && item.gender === product.gender)
      .map((item) => [item.color, item] as const),
  )
  byColor.set(product.color, product)
  const siblings = [...byColor.values()]
  const outfit = [
    ...products.filter((item) => item.id !== product.id && item.kind !== product.kind),
    ...products.filter((item) => item.id !== product.id && item.kind === product.kind),
  ].slice(0, 4)

  function add() {
    if (!size) {
      setError(tx("choose.a.size"))
      return
    }
    const available = product?.stock[size] ?? 0
    const already = cart.find((line) => line.productId === product!.id && line.size === size)?.qty ?? 0
    if (already > 0) {
      addToCart(product!.id, size, 1)
      return
    }
    if (available < 1) return
    addToCart(product!.id, size, Math.min(qty, available))
  }

  const photos = [product.image, ...(product.images ?? []).filter((src) => src !== product.image)]

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-8 md:px-8 md:py-12">
      <Link to="/catalog" className="mb-8 inline-flex items-center gap-2 text-xl text-muted hover:text-ink">
        <ArrowLeft size={18} />
        {tx("catalog")}
      </Link>
      <div className="grid gap-10 md:grid-cols-2 md:items-start">
        <Gallery key={product.id} images={photos} name={product.name[lang]} />
        <div>
          <h1 className="text-4xl tracking-tight">{product.name[lang]}</h1>
          <p className="mt-3 text-xl">{money(product.price)}</p>
          <p className="mt-1 text-sm text-muted">
            {tx("nav.shipping")} {formatShipping(product.shipping, lang).toLowerCase()}
          </p>
          <p className="mt-4 max-w-[48ch] leading-relaxed text-muted">{product.note[lang]}</p>

          <p className="mt-8 text-xl tracking-[0.14em] uppercase">{tx("select.size")}</p>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {product.sizes.map((item) => {
              const available = (product.stock[item] ?? 0) > 0
              const active = size === item
              return (
                <button
                  key={item}
                  data-active={active ? "true" : undefined}
                  onClick={() => {
                    setPicked((current) => ({ ...current, size: item, qty: 1 }))
                    setError("")
                  }}
                  className={`chip ${!available && !active ? "text-muted line-through" : ""}`}
                >
                  {item === "One" ? tx("one.2") : item}
                </button>
              )
            })}
          </div>
          {error ? <p className="mt-3 text-xl text-[#8f2d2d]">{error}</p> : null}

          <p className="mt-8 text-xl tracking-[0.14em] uppercase">{tx("colour")}</p>
          <div className="mt-3 flex flex-wrap gap-4">
            {siblings.map((item) => {
              const label = colorName[item.color][lang]
              const dot = (
                <span
                  style={{
                    background: colorHex[item.color],
                    boxShadow: item.color === "white" ? "inset 0 0 0 1px #e4e8ea" : undefined,
                  }}
                />
              )
              return (
                <div key={item.id} className="flex flex-col items-center gap-2">
                  {item.id === product.id ? (
                    <span className="swatch" data-active="true" aria-current="true" aria-label={label}>
                      {dot}
                    </span>
                  ) : (
                    <Link to={`/product/${item.id}`} className="swatch" aria-label={label}>
                      {dot}
                    </Link>
                  )}
                  <span className="text-xl text-muted">{label}</span>
                </div>
              )
            })}
          </div>

          {madeToOrder ? null : (
            <div className="mt-8">
              <p className="text-xl tracking-[0.14em] uppercase">{tx("quantity")}</p>
              <div className="mt-3 inline-flex items-center border border-line">
                <button
                  aria-label={tx("less")}
                  className="grid h-12 w-12 place-items-center"
                  onClick={() =>
                    setPicked((current) => ({ ...current, qty: Math.max(1, current.qty - 1) }))
                  }
                >
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center tabular-nums">{qty}</span>
                <button
                  aria-label={tx("more")}
                  className="grid h-12 w-12 place-items-center"
                  onClick={() =>
                    setPicked((current) => ({
                      ...current,
                      qty: size ? Math.min(selectedQty || 1, current.qty + 1) : current.qty + 1,
                    }))
                  }
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          )}

          {madeToOrder ? (
            <Link to={`/tailoring?product=${product.id}`} className="btn mt-8 w-full">
              {tx("order.tailoring")}
            </Link>
          ) : (
            <button onClick={add} className={inBag ? "btn btn-line mt-8 w-full" : "btn mt-8 w-full"}>
              {inBag ? tx("already.in.bag") : tx("add.to.bag")}
            </button>
          )}

          <div className="mt-6 border border-line p-5">
            <p className="text-xl">{tx("looking.for.a.custom.fit")}</p>
            <p className="mt-2 max-w-[42ch] text-xl leading-relaxed text-muted">
              {tx("we.can.make.this.piece")}
            </p>
            <Link
              to={`/tailoring?product=${product.id}`}
              className="mt-4 inline-flex items-center gap-2 text-xl"
            >
              {tx("contact.for.custom.fit")}
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="mt-8 border-t border-line">
            <Fold title={tx("size.chart")}>
              <SizeChart kind={product.kind} sizes={product.sizes} tx={tx} />
              <Link to="/size-guide" className="mt-4 inline-flex text-xl text-accent">
                {tx("full.size.guide")}
              </Link>
            </Fold>
            <Fold title={tx("how.to.determine.your.size")}>
              <p>
                {tx("for.clothing.measure.the.body")}
              </p>
            </Fold>
            <Fold title={tx("materials")}>
              <p>
                {tx("leather.2")} {colorName[product.color][lang]}.
              </p>
            </Fold>
            <Fold title={tx("shipping.and.returns")}>
              <p>
                {tx("we.ship.after.the.order")}
              </p>
              <div className="mt-3 flex gap-4">
                <Link to="/shipping-info" className="text-accent">
                  {tx("nav.shipping")}
                </Link>
                <Link to="/returns" className="text-accent">
                  {tx("nav.returns")}
                </Link>
              </div>
            </Fold>
          </div>
        </div>
      </div>

      <ProductRail title={tx("complete.your.outfit")} products={outfit} />
    </div>
  )
}

function Gallery({ images, name }: { images: string[]; name: string }) {
  const [index, setIndex] = useState(0)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const suppressClick = useRef(false)
  const stopDrag = useRef<(() => void) | null>(null)
  const current = images[index] ?? images[0]

  useEffect(() => {
    const scroller = scrollerRef.current
    const track = trackRef.current
    const thumb = thumbRef.current
    if (!scroller || !track || !thumb) return

    function placeThumb() {
      if (!scroller || !track || !thumb) return
      const overflow = scroller.scrollWidth - scroller.clientWidth
      const canScroll = overflow > 1
      track.hidden = !canScroll
      scroller.style.setProperty("--fade-left", canScroll && scroller.scrollLeft > 1 ? "0.75rem" : "0px")
      scroller.style.setProperty("--fade-right", canScroll && scroller.scrollLeft < overflow - 1 ? "0.75rem" : "0px")
      if (!canScroll) return
      const width = Math.max(28, (scroller.clientWidth / scroller.scrollWidth) * track.clientWidth)
      const travel = Math.max(track.clientWidth - width, 1)
      thumb.style.width = `${width}px`
      thumb.style.transform = `translateX(${(scroller.scrollLeft / overflow) * travel}px)`
    }

    placeThumb()
    const observer = new ResizeObserver(placeThumb)
    observer.observe(scroller)
    scroller.addEventListener("scroll", placeThumb, { passive: true })
    return () => {
      observer.disconnect()
      scroller.removeEventListener("scroll", placeThumb)
      stopDrag.current?.()
    }
  }, [images])

  function onStripPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return
    const scroller = scrollerRef.current
    if (!scroller) return
    const startX = event.clientX
    const startScroll = scroller.scrollLeft
    let moved = false

    function move(ev: globalThis.PointerEvent) {
      if (ev.pointerId !== event.pointerId) return
      const delta = ev.clientX - startX
      if (!moved && Math.abs(delta) < 6) return
      moved = true
      scroller!.scrollLeft = startScroll - delta
    }

    function end(ev: globalThis.PointerEvent) {
      if (ev.pointerId !== event.pointerId) return
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerup", end)
      window.removeEventListener("pointercancel", end)
      stopDrag.current = null
      if (!moved) return
      suppressClick.current = true
      requestAnimationFrame(() => {
        suppressClick.current = false
      })
    }

    stopDrag.current?.()
    stopDrag.current = () => end(new PointerEvent("pointercancel", { pointerId: event.pointerId }))
    window.addEventListener("pointermove", move)
    window.addEventListener("pointerup", end)
    window.addEventListener("pointercancel", end)
  }

  function onThumbPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return
    event.preventDefault()
    const scroller = scrollerRef.current
    const track = trackRef.current
    const thumb = thumbRef.current
    if (!scroller || !track || !thumb) return
    const startX = event.clientX
    const startScroll = scroller.scrollLeft

    function move(ev: globalThis.PointerEvent) {
      if (ev.pointerId !== event.pointerId) return
      const overflow = scroller!.scrollWidth - scroller!.clientWidth
      const travel = Math.max(track!.clientWidth - thumb!.offsetWidth, 1)
      scroller!.scrollLeft = startScroll + ((ev.clientX - startX) / travel) * overflow
    }

    function end(ev: globalThis.PointerEvent) {
      if (ev.pointerId !== event.pointerId) return
      thumb!.removeEventListener("pointermove", move)
      thumb!.removeEventListener("pointerup", end)
      thumb!.removeEventListener("pointercancel", end)
    }

    thumb.addEventListener("pointermove", move)
    thumb.addEventListener("pointerup", end)
    thumb.addEventListener("pointercancel", end)
    try {
      thumb.setPointerCapture(event.pointerId)
    } catch {
      // The pointer can end before capture is available.
    }
  }

  return (
    <div className="md:sticky md:top-[calc(var(--chrome)+1.5rem)]">
      <img src={current} alt={name} className="aspect-square w-full bg-white object-contain" />
      {images.length > 1 ? (
        <>
          <div
            ref={scrollerRef}
            className={`mt-3 flex cursor-grab touch-pan-y gap-3 overflow-x-auto select-none active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${images.length > 4 ? "gallery-strip" : ""}`}
            onPointerDown={onStripPointerDown}
            onClickCapture={(event) => {
              if (!suppressClick.current) return
              event.preventDefault()
              event.stopPropagation()
              suppressClick.current = false
            }}
          >
            {images.map((src, item) => (
              <button
                key={`${src}-${item}`}
                type="button"
                aria-label={`${item + 1}`}
                aria-pressed={item === index}
                onClick={() => setIndex(item)}
                className={`aspect-square shrink-0 border bg-white ${images.length > 4 ? "w-[calc((100%-3rem)/4.5)]" : "w-[calc((100%-2.25rem)/4)]"} ${item === index ? "border-ink" : "border-line"}`}
              >
                <img src={src} alt="" draggable={false} className="pointer-events-none h-full w-full object-contain" />
              </button>
            ))}
          </div>
          <div ref={trackRef} className="relative mt-3 h-4">
            <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line" />
            <div
              ref={thumbRef}
              className="absolute top-0 h-4 cursor-grab touch-none active:cursor-grabbing"
              onPointerDown={onThumbPointerDown}
            >
              <span className="pointer-events-none absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-ink" />
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

function SizeChart({
  kind,
  sizes,
  tx,
}: {
  kind: Kind
  sizes: string[]
  tx: (key: MessageKey) => string
}) {
  if (kind === "sneakers") {
    const rows = shoes.filter((row) => sizes.includes(row[0]))
    return (
      <ul className="grid gap-2">
        {rows.map(([eu, us, cm]) => (
          <li key={eu} className="flex justify-between gap-4">
            <span>EU {eu}</span>
            <span className="text-muted">US {us} · {cm} cm</span>
          </li>
        ))}
      </ul>
    )
  }

  if (kind === "jackets") {
    const rows = clothes.filter((row) => sizes.includes(row[0]))
    return (
      <ul className="grid gap-2">
        {rows.map(([size, chest, waist]) => (
          <li key={size} className="flex justify-between gap-4">
            <span>{size}</span>
            <span className="text-muted">
              {tx("chest")} {chest} · {tx("waist")} {waist}
            </span>
          </li>
        ))}
      </ul>
    )
  }

  if (kind === "belts") {
    return (
      <p>
        {tx("belt.length.in.centimetres")}
        {sizes.join(", ")}.
      </p>
    )
  }

  return <p>{tx("one.size")}</p>
}

function Fold({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-line">
      <button
        className="flex w-full items-center justify-between gap-4 py-4 text-left text-xl tracking-[0.08em] uppercase"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {title}
        <CaretDown size={16} className={open ? "rotate-180" : ""} />
      </button>
      {open ? <div className="pb-4 text-xl leading-relaxed text-muted">{children}</div> : null}
    </div>
  )
}
