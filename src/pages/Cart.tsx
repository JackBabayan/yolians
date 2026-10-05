import { X } from "../components/icons"
import { AnimatePresence } from "motion/react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { CheckoutDialog } from "../components/CheckoutDialog"
import { ProductRail } from "../components/ProductRail"
import { formatShipping, money, productById, useProducts } from "../data"
import { bagLine } from "../i18n"
import { useStore, type CartLine } from "../store"

function lineId(line: CartLine) {
  return `${line.productId}:${line.size}`
}

export function Cart() {
  const { lang, tx, cart, setQty, removeLine } = useStore()
  const products = useProducts()
  const [off, setOff] = useState<string[]>([])
  const [error, setError] = useState("")
  const [checkout, setCheckout] = useState<{ lines: CartLine[] } | null>(null)
  const lines = cart
    .map((line) => ({ line, product: productById(line.productId) }))
    .filter((item) => item.product)
  const chosen = lines.filter(({ line }) => !off.includes(lineId(line)))
  const total = chosen.reduce((sum, item) => sum + item.product!.price * item.line.qty, 0)
  const shipping = chosen.reduce((sum, item) => sum + item.product!.shipping * item.line.qty, 0)
  const count = lines.reduce((sum, item) => sum + item.line.qty, 0)
  const inCart = new Set(lines.map((item) => item.line.productId))
  const kindsInCart = new Set(lines.map((item) => item.product!.category))
  const suggestions = [
    ...products.filter((item) => !inCart.has(item.id) && !kindsInCart.has(item.category)),
    ...products.filter((item) => !inCart.has(item.id) && kindsInCart.has(item.category)),
  ].slice(0, 4)

  function toggle(line: CartLine) {
    const id = lineId(line)
    setOff((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
    setError("")
  }

  function pay() {
    if (chosen.length === 0) {
      setError(tx("choose.the.pieces.you.want"))
      return
    }
    setError("")
    setCheckout({ lines: chosen.map(({ line }) => line) })
  }

  const qtyControl = (line: CartLine) => {
    const max = productById(line.productId)?.stock[line.size] ?? 0
    return (
      <div className="flex items-center gap-3 text-xl">
        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-full shadow-[inset_0_0_0_1px_var(--color-line)]"
          onClick={() => setQty(line.productId, line.size, line.qty - 1)}
          aria-label={tx("less")}
        >
          −
        </button>
        <span>{line.qty}</span>
        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-full shadow-[inset_0_0_0_1px_var(--color-line)] disabled:text-muted"
          disabled={line.qty >= max}
          onClick={() => setQty(line.productId, line.size, line.qty + 1)}
          aria-label={tx("more")}
        >
          +
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-12 md:px-10 md:py-20">
      <h1 className="text-4xl tracking-tight md:text-5xl">{tx("shopping.bag")}</h1>
      {lines.length === 0 ? (
        <div className="mt-8">
          <p className="text-muted">{tx("your.bag.is.empty")}</p>
          <Link to="/catalog" className="btn mt-8">
            {tx("shop")}
          </Link>
        </div>
      ) : (
        <>
          <p className="mt-3 text-muted">{bagLine(count, lang)}</p>
          <div className="mt-8 border-t border-line lg:grid lg:grid-cols-[minmax(0,1fr)_440px] lg:items-start lg:gap-12">
            <div>
              <div className="hidden grid-cols-[auto_104px_minmax(0,1fr)_auto_6.5rem_auto] items-center gap-x-6  py-4 text-xl text-muted md:grid">
                <span className="col-span-3">{tx("product.details")}</span>
                <span className="text-center">{tx("quantity")}</span>
                <span className="text-right">{tx("total.2")}</span>
                <span />
              </div>
              <ul>
                {lines.map(({ line, product }) => {
                  const on = !off.includes(lineId(line))
                  const color = product!.color.name[lang]
                  const remove = (
                    <button
                      type="button"
                      className="text-muted"
                      aria-label={tx("remove")}
                      onClick={() => removeLine(line.productId, line.size)}
                    >
                      <X size={16} />
                    </button>
                  )
                  return (
                    <li key={lineId(line)} className="border-t border-line py-8 md:py-10">
                      <div className="grid grid-cols-[auto_88px_minmax(0,1fr)] items-start gap-4 md:grid-cols-[auto_104px_minmax(0,1fr)_auto_6.5rem_auto] md:items-center md:gap-x-6">
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() => toggle(line)}
                          aria-label={product!.name[lang]}
                          className="mt-2 h-5 w-5 accent-accent md:mt-0"
                        />
                        <img src={product!.image} alt="" className="aspect-square w-full object-contain" />
                        <div>
                          <p className="text-xl tracking-tight">{product!.name[lang]}</p>
                          <p className="mt-1 text-xl text-muted">
                            {tx("leather")} · {color}
                          </p>
                          <p className="mt-1 text-xl text-muted">
                            {tx("size")} {line.size === "One" ? tx("one") : line.size}
                          </p>
                        </div>
                        <div className="hidden justify-self-center md:block">{qtyControl(line)}</div>
                        <p className="hidden text-right text-xl md:block">{money(product!.price * line.qty)}</p>
                        <div className="hidden justify-self-end md:block">{remove}</div>
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-4 md:hidden">
                        {qtyControl(line)}
                        <div className="flex items-center gap-4">
                          <p className="text-xl">{money(product!.price * line.qty)}</p>
                          {remove}
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
            <aside className="mt-10 border-t border-line pt-10 lg:sticky lg:top-[calc(var(--chrome)+1.5rem)] lg:mt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
              <h2 className="text-3xl tracking-tight">{tx("summary")}</h2>
              <dl className="mt-6 space-y-4 text-xl">
                <div className="flex items-baseline justify-between gap-6">
                  <dt className="text-muted">{tx("subtotal")}</dt>
                  <dd>{money(total)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-6">
                  <dt className="text-muted">{tx("estimated.shipping")}</dt>
                  <dd>{formatShipping(shipping, lang)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-6">
                  <dt className="text-muted">{tx("duties.taxes")}</dt>
                  <dd className="text-right text-muted">{tx("calculated.at.checkout")}</dd>
                </div>
              </dl>
              <div className="mt-6 flex items-baseline justify-between gap-4 border-t border-line pt-6 text-xl">
                <span>{tx("total")}</span>
                <span>{money(total + shipping)}</span>
              </div>
              <button type="button" className="btn mt-8 w-full" onClick={pay}>
                {tx("proceed.to.checkout")}
              </button>
              {error ? <p className="mt-4 text-xl text-[#8f2d2d]">{error}</p> : null}
              <p className="mt-4 text-center text-sm leading-relaxed text-muted">
                {tx("by.continuing.i.declare.that")}
                <Link to="/terms" className="underline">
                  {tx("purchase.conditions")}
                </Link>
                {tx("and.understand.the")}
                <Link to="/privacy" className="underline">
                  {tx("privacy.policy.2")}
                </Link>.
              </p>
            </aside>
          </div>
        </>
      )}

      <ProductRail title={tx("you.may.also.like")} products={suggestions} />
      <AnimatePresence>
        {checkout ? (
          <CheckoutDialog
            key="checkout"
            lines={checkout.lines}
            onClose={() => setCheckout(null)}
          />
        ) : null}
      </AnimatePresence>
    </div>
  )
}
