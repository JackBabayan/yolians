import { ArrowLeft, CardLogo } from "./icons"
import { type FormEvent, useState } from "react"
import { Link } from "react-router-dom"
import { colorName, countriesBy, formatShipping, money, productById } from "../data"
import { useStore, type CartLine } from "../store"

function lineId(line: CartLine) {
  return `${line.productId}:${line.size}`
}
import { SelectField, TextField } from "./form"
import { Modal } from "./Modal"

const cardBrands = [
  ["mir", "MIR"],
  ["visa", "Visa"],
  ["mastercard", "Mastercard"],
  ["arca", "ArCa"],
] as const

type CardBrand = (typeof cardBrands)[number][0]

function cardDigits(value: string) {
  return value.replace(/\D/g, "")
}

function formatCardNumber(value: string) {
  return cardDigits(value)
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
}

function formatExpiry(value: string) {
  const digits = cardDigits(value).slice(0, 4)
  if (digits.length < 3) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

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
  const { lang, tx, placeOrder } = useStore()
  const subtotal = lines.reduce((sum, line) => sum + (productById(line.productId)?.price ?? 0) * line.qty, 0)
  const shipping = lines.reduce((sum, line) => sum + (productById(line.productId)?.shipping ?? 0) * line.qty, 0)
  const due = subtotal + shipping
  const [step, setStep] = useState<"ship" | "pay" | "done">("ship")
  const [error, setError] = useState("")
  const [orderId, setOrderId] = useState("")
  const [ship, setShip] = useState(emptyShip)
  const [card, setCard] = useState({
    brand: "" as "" | CardBrand,
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  })


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

  function submitPay(event: FormEvent) {
    event.preventDefault()
    const expiryOk = /^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry)
    const ready =
      card.brand && card.name.trim() && cardDigits(card.number).length === 16 && expiryOk && card.cvc.length === 3
    if (!ready) {
      setError(
        tx("choose.a.card.and.check"),
      )
      return
    }
    setOrderId(placeOrder(lines, due))
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
                    const color = colorName[product.color][lang]
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
            <form onSubmit={submitPay} className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <p>{tx("card.details")}</p>
                <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                  {cardBrands.map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      aria-label={label}
                      className="grid h-14 w-full place-items-center rounded-full bg-white shadow-[inset_0_0_0_1px_var(--color-line)] data-[active=true]:shadow-[inset_0_0_0_2px_var(--color-accent)]"
                      data-active={card.brand === id ? "true" : undefined}
                      aria-pressed={card.brand === id}
                      onClick={() => setCard((current) => ({ ...current, brand: id }))}
                    >
                      <CardLogo brand={id} />
                    </button>
                  ))}
                </div>
              </div>
              <TextField label={tx("name.on.card")} autoComplete="cc-name" value={card.name} onChange={(event) => setCard((current) => ({ ...current, name: event.target.value }))} />
              <TextField
                label={tx("card.number")}
                autoComplete="cc-number"
                inputMode="numeric"
                placeholder="0000 0000 0000 0000"
                value={card.number}
                onChange={(event) => setCard((current) => ({ ...current, number: formatCardNumber(event.target.value) }))}
              />
              <TextField
                label={tx("expiry")}
                autoComplete="cc-exp"
                inputMode="numeric"
                placeholder="MM/YY"
                value={card.expiry}
                onChange={(event) => setCard((current) => ({ ...current, expiry: formatExpiry(event.target.value) }))}
              />
              <TextField
                label={tx("code")}
                autoComplete="cc-csc"
                inputMode="numeric"
                placeholder="000"
                value={card.cvc}
                onChange={(event) => setCard((current) => ({ ...current, cvc: cardDigits(event.target.value).slice(0, 3) }))}
              />
              {error ? <p className="text-base text-[#8f2d2d] md:col-span-2 lg:text-xl">{error}</p> : null}
              <button type="submit" className="btn w-full md:col-span-2">
                {tx("pay")} {money(due)}
              </button>
            </form>
            </div>
            ) : null}

            {step === "done" ? (
            <div className="mt-8">
              <p>{tx("thank.you.we.will.write")}</p>
              <p className="mt-3 text-muted">
                {tx("order")} {orderId}
              </p>
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
