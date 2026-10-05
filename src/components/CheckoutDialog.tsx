import { ArrowLeft } from "./icons"
import { type FormEvent, useState } from "react"
import { Link } from "react-router-dom"
import { countriesBy, formatShipping, money, productById } from "../data"
import { useStore, type CartLine } from "../store"

function lineId(line: CartLine) {
  return `${line.productId}:${line.size}`
}
import { SelectField, TextField } from "./form"
import { Loader } from "./Loader"
import { Modal } from "./Modal"

const emptyShip = {
  first: "",
  last: "",
  country: "",
  street: "",
  apartment: "",
  postal: "",
  city: "",
  region: "",
  phone: "",
  note: "",
}

export function CheckoutDialog({
  lines,
  onClose,
}: {
  lines: CartLine[]
  onClose: () => void
}) {
  const { lang, tx, placeOrder, user } = useStore()
  const subtotal = lines.reduce((sum, line) => sum + (productById(line.productId)?.price ?? 0) * line.qty, 0)
  const shipping = lines.reduce((sum, line) => sum + (productById(line.productId)?.shipping ?? 0) * line.qty, 0)
  const due = subtotal + shipping
  const [step, setStep] = useState<"ship" | "pay" | "done">("ship")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [ship, setShip] = useState(emptyShip)


  function setShipField(key: keyof typeof ship, value: string) {
    setShip((current) => ({ ...current, [key]: value }))
  }

  function submitShip(event: FormEvent) {
    event.preventDefault()
    const ready =
      ship.first.trim() &&
      ship.last.trim() &&
      ship.country &&
      ship.street.trim() &&
      ship.postal.trim() &&
      ship.city.trim() &&
      ship.region.trim() &&
      ship.phone.trim()
    if (!ready) {
      setError(
        tx("fill.in.name.country.street"),
      )
      return
    }
    setError("")
    setStep("pay")
  }

  async function submitPay(event: FormEvent) {
    event.preventDefault()
    if (!user) {
      setError(tx("sign.in"))
      return
    }
    setBusy(true)
    const message = await placeOrder(lines, ship)
    setBusy(false)
    if (message) {
      if (message !== "redirect") setError(message)
      return
    }
    setError("")
    setStep("done")
  }

  const title =
    step === "ship"
      ? tx("nav.shipping")
      : step === "pay"
        ? tx("payment")
        : tx("order.placed")

  return (
    <Modal labelledBy="checkout-title" onClose={onClose} closeLabel={tx("close")}>
        <div key={step} className="checkout-step">
            <div className="flex items-center gap-4 pr-10">
              {step === "pay" ? (
                <button
                  type="button"
                  aria-label={tx("back")}
                  onClick={() => {
                    setError("")
                    setStep("ship")
                  }}
                >
                  <ArrowLeft size={22} />
                </button>
              ) : null}
              <h2 id="checkout-title" className="text-4xl tracking-tight">
                {title}
              </h2>
            </div>
            {step === "ship" ? (
            <form
              onSubmit={submitShip}
              className="mt-6 grid gap-4 md:grid-cols-2"
            >
              <TextField label={tx("first.name")} autoComplete="given-name" value={ship.first} onChange={(event) => setShipField("first", event.target.value)} />
              <TextField label={tx("last.name")} autoComplete="family-name" value={ship.last} onChange={(event) => setShipField("last", event.target.value)} />
              <SelectField label={tx("country")} autoComplete="country" value={ship.country} onChange={(event) => setShipField("country", event.target.value)}>
                <option value="">{tx("choose.a.country")}</option>
                {countriesBy(lang).map(({ code, name }) => (
                  <option key={code} value={code}>
                    {name[lang]}
                  </option>
                ))}
              </SelectField>
              <TextField label={tx("phone")} autoComplete="tel" inputMode="tel" value={ship.phone} onChange={(event) => setShipField("phone", event.target.value)} />
              <TextField label={tx("street.and.number")} autoComplete="address-line1" value={ship.street} onChange={(event) => setShipField("street", event.target.value)} />
              <TextField label={tx("apartment.floor.if.any")} autoComplete="address-line2" value={ship.apartment} onChange={(event) => setShipField("apartment", event.target.value)} />
              <TextField label={tx("postal.code")} autoComplete="postal-code" value={ship.postal} onChange={(event) => setShipField("postal", event.target.value)} />
              <TextField label={tx("city")} autoComplete="address-level2" value={ship.city} onChange={(event) => setShipField("city", event.target.value)} />
              <TextField label={tx("region")} autoComplete="address-level1" value={ship.region} onChange={(event) => setShipField("region", event.target.value)} />
              <TextField label={tx("note.if.any")} value={ship.note} onChange={(event) => setShipField("note", event.target.value)} />
              {error ? <p className="text-base text-[#8f2d2d] md:col-span-2 lg:text-xl">{error}</p> : null}
              <button type="submit" className="btn w-full md:col-span-2">
                {tx("continue")}
              </button>
            </form>
            ) : null}

            {step === "pay" ? (
            <div className="mt-8">
              <section className="border-b border-line pb-6 text-base">
                <h3 className="text-sm text-muted">{tx("your.order")}</h3>
                <ul className="mt-4 flex flex-col gap-4">
                  {lines.map((line) => {
                    const product = productById(line.productId)
                    if (!product) return null
                    const color = product.color.name[lang]
                    const size = line.size === "One" ? tx("one") : line.size
                    return (
                      <li key={lineId(line)} className="grid grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-3">
                        <img src={product.image} alt="" className="aspect-square w-full object-contain" />
                        <div>
                          <p className="tracking-tight">{product.name[lang]}</p>
                          <p className="mt-0.5 text-sm text-muted">
                            {tx("leather")} · {color}
                          </p>
                          <p className="text-sm text-muted">
                            {tx("size")} {size} · {line.qty} {tx("pcs")}
                          </p>
                          <p className="text-sm text-muted">
                            {tx("nav.shipping")} {formatShipping(product.shipping * line.qty, lang).toLowerCase()}
                          </p>
                        </div>
                        <p>{money(product.price * line.qty)}</p>
                      </li>
                    )
                  })}
                </ul>
                <dl className="mt-4 space-y-2 border-t border-line pt-4">
                  <div className="flex items-baseline justify-between gap-6">
                    <dt className="text-muted">{tx("subtotal")}</dt>
                    <dd>{money(subtotal)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-6">
                    <dt className="text-muted">{tx("nav.shipping")}</dt>
                    <dd>{formatShipping(shipping, lang)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-6">
                    <dt className="text-muted">{tx("duties.taxes")}</dt>
                    <dd className="text-muted">{tx("calculated.at.checkout")}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-6 pt-2">
                    <dt>{tx("total")}</dt>
                    <dd>{money(due)}</dd>
                  </div>
                </dl>
              </section>
            <form onSubmit={submitPay} className="mt-6 grid gap-4">
              {user ? null : (
                <p className="text-xl">
                  <Link to="/login" className="text-accent">{tx("sign.in")}</Link>
                </p>
              )}
              {error ? <p className="text-base text-[#8f2d2d] lg:text-xl">{error}</p> : null}
              {busy ? <Loader label={tx("loading")} /> : null}
              <button type="submit" className="btn w-full" disabled={busy || !user}>
                {tx("pay")} {money(due)}
              </button>
            </form>
            </div>
            ) : null}

            {step === "done" ? (
            <div className="mt-8">
              <p>{tx("thank.you.we.will.write")}</p>
              <p className="mt-3 text-muted">{tx("order")}</p>
              <button type="button" className="btn mt-8 w-full" onClick={onClose}>
                {tx("close")}
              </button>
              <Link to="/account" className="mt-4 inline-flex text-xl text-muted" onClick={onClose}>
                {tx("account")}
              </Link>
            </div>
            ) : null}
        </div>
    </Modal>
  )
}
