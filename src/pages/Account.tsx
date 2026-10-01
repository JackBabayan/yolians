import { type FormEvent, type ReactNode, useState } from "react"
import { AnimatePresence } from "motion/react"
import { Link } from "react-router-dom"
import { SelectField, TextField } from "../components/form"
import { CardLogo } from "../components/icons"
import { Modal } from "../components/Modal"
import { ProductRail } from "../components/ProductRail"
import { countries, countriesBy, money, productById, products, type Lang } from "../data"
import { bagLine } from "../i18n"
import { useStore, type SavedAddress, type SavedCard } from "../store"

const pillLine = "inline-flex rounded-full border border-ink px-4 py-1.5 text-sm hover:bg-[#f4f6f6]"

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

function isCardBrand(value: string): value is CardBrand {
  return cardBrands.some(([id]) => id === value)
}

function brandName(brand: string) {
  return cardBrands.find(([id]) => id === brand)?.[1] ?? brand
}

export function Account() {
  const { lang, tx, user, logout, orders, cart } = useStore()
  const count = cart.reduce((sum, line) => sum + line.qty, 0)
  const picks = products.slice(0, 4)

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-10 md:px-8 md:py-14">
      <header className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl tracking-tight md:text-4xl">
            {user ? `${tx("welcome.back")} ${user.firstName}` : tx("profile")}
          </h1>
          {count > 0 ? <p className="mt-2 max-w-[46ch] text-sm text-muted">{bagLine(count, lang)}</p> : null}
        </div>
        {user ? (
          <button type="button" className={`${pillLine} shrink-0`} onClick={logout}>
            {tx("log.out")}
          </button>
        ) : (
          <Link to="/login" className={`${pillLine} shrink-0`}>
            {tx("sign.in")}
          </Link>
        )}
      </header>

      <div className={`mt-8 grid items-start gap-8 ${user ? "lg:grid-cols-3" : ""}`}>
        <ProfileSection />
        {user ? <PaymentSection /> : null}
        {user ? <AddressSection /> : null}
      </div>

      <section className="mt-10">
        <h2 className="text-3xl tracking-tight">{tx("order.history")}</h2>
        {orders.length === 0 ? (
          <div className="mt-4">
            <p className="text-md leading-relaxed">{tx("you.have.no.orders.yet")}</p>
            <Link to="/catalog" className={`btn mt-5`}>
              {tx("shop")}
            </Link>
          </div>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {orders.map((order) => {
              const lines = order.items.flatMap((item) => {
                const product = productById(item.productId)
                return product ? [{ item, product }] : []
              })
              const first = lines[0]
              return (
                <li key={order.id} className="flex items-center gap-3 bg-[#f4f6f6] px-4 py-3">
                  {first ? (
                    <img
                      src={first.product.image}
                      alt=""
                      className="size-16 shrink-0 bg-white object-contain p-1"
                    />
                  ) : (
                    <span className="size-16 shrink-0 bg-white" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">
                      <span className="font-medium">#{order.id}</span>
                      <span className="ml-3 text-muted">{orderDate(order.createdAt, lang)}</span>
                    </p>
                    {lines.map(({ item, product }) => (
                      <p key={`${item.productId}-${item.size}`} className="mt-1 text-sm text-muted">
                        {product.name[lang]} ({item.qty})
                      </p>
                    ))}
                  </div>
                  <p className="shrink-0 text-sm">{money(order.total)}</p>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <ProductRail title={tx("complete.your.outfit")} products={picks} />
    </div>
  )
}

function Section({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3">
        <h2 className="min-w-0 text-xl tracking-tight">{title}</h2>
        {action}
      </div>
      <div className="mt-3 flex-1 bg-[#f4f6f6] px-4 py-4">{children}</div>
    </section>
  )
}

function Meta({ label, children }: { label: string; children: ReactNode }) {
  return (
    <p>
      <span className="block text-xs tracking-[0.14em] text-muted uppercase">{label}</span>
      <span className="mt-1 block text-sm">{children}</span>
    </p>
  )
}

function EditButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" className={pillLine} onClick={onClick}>
      {label}
    </button>
  )
}

function ProfileSection() {
  const { tx, user } = useStore()
  const [open, setOpen] = useState(false)

  return (
    <Section
      title={tx("personal.information")}
      action={user ? <EditButton label={tx("edit")} onClick={() => setOpen(true)} /> : undefined}
    >
      {user ? (
        <div className="grid gap-4">
          <Meta label={tx("first.name")}>{user.firstName || "-"}</Meta>
          <Meta label={tx("last.name")}>{user.lastName || "-"}</Meta>
          <Meta label={tx("email")}>{user.email || "-"}</Meta>
          <Meta label={tx("phone")}>{user.phone || "-"}</Meta>
        </div>
      ) : (
        <Link to="/login" className="text-sm text-accent">{tx("sign.in")}</Link>
      )}
      <AnimatePresence>
        {open ? <ProfileDialog key="profile" onClose={() => setOpen(false)} /> : null}
      </AnimatePresence>
    </Section>
  )
}

function ProfileDialog({ onClose }: { onClose: () => void }) {
  const { tx, user, updateProfile } = useStore()
  const [form, setForm] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({})

  function setField(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  function save(event: FormEvent) {
    event.preventDefault()
    const next = {
      firstName: form.firstName.trim() ? undefined : tx("enter.first.name"),
      lastName: form.lastName.trim() ? undefined : tx("enter.last.name"),
      email: form.email.trim() ? undefined : tx("enter.email"),
      phone: form.phone.trim() ? undefined : tx("enter.phone"),
    }
    if (next.firstName || next.lastName || next.email || next.phone) {
      setErrors(next)
      return
    }
    const message = updateProfile(form)
    if (message) {
      setErrors({ email: message })
      return
    }
    onClose()
  }

  return (
    <Modal labelledBy="profile-title" onClose={onClose} closeLabel={tx("close")}>
      <h2 id="profile-title" className="pr-10 text-3xl tracking-tight">{tx("personal.information")}</h2>
      <form onSubmit={save} className="mt-6 grid gap-4 md:grid-cols-2">
        <TextField label={tx("first.name")} autoComplete="given-name" error={errors.firstName} value={form.firstName} onChange={(event) => setField("firstName", event.target.value)} />
        <TextField label={tx("last.name")} autoComplete="family-name" error={errors.lastName} value={form.lastName} onChange={(event) => setField("lastName", event.target.value)} />
        <TextField label={tx("email")} type="email" autoComplete="email" error={errors.email} value={form.email} onChange={(event) => setField("email", event.target.value)} />
        <TextField label={tx("phone")} autoComplete="tel" inputMode="tel" error={errors.phone} value={form.phone} onChange={(event) => setField("phone", event.target.value)} />
        <button type="submit" className="btn w-full md:col-span-2">{tx("save")}</button>
      </form>
    </Modal>
  )
}

function PaymentSection() {
  const { tx, cards } = useStore()
  const [open, setOpen] = useState(false)

  return (
    <Section title={tx("payment.methods")} action={<EditButton label={tx("edit")} onClick={() => setOpen(true)} />}>
      {cards.length === 0 ? (
        <p className="text-sm text-muted">{tx("no.saved.cards")}</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {cards.map((card) => (
            <CardRow key={card.id} card={card} />
          ))}
        </ul>
      )}
      <AnimatePresence>
        {open ? <PaymentDialog key="payment" onClose={() => setOpen(false)} /> : null}
      </AnimatePresence>
    </Section>
  )
}

function CardRow({ card }: { card: SavedCard }) {
  const { tx } = useStore()
  return (
    <li className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        {isCardBrand(card.brand) ? <CardLogo brand={card.brand} /> : null}
        <div>
          <p className="text-sm">{brandName(card.brand)} •••• {card.last4}</p>
          {card.name ? <p className="text-sm text-muted">{card.name}</p> : null}
          <p className="text-sm text-muted">{tx("expiry")} {card.expiry}</p>
        </div>
      </div>
      {card.primary ? <span className="text-sm text-accent">{tx("primary")}</span> : null}
    </li>
  )
}

function PaymentDialog({ onClose }: { onClose: () => void }) {
  const { tx, cards, addCard, removeCard, setPrimaryCard } = useStore()
  const [form, setForm] = useState({ brand: "" as "" | CardBrand, number: "", expiry: "", cvc: "", name: "" })
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({})

  function setField(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    const next = {
      brand: form.brand ? undefined : tx("choose.a.card"),
      name: form.name.trim() ? undefined : tx("enter.name.on.card"),
      number: cardDigits(form.number).length === 16 ? undefined : tx("card.number.digits"),
      expiry: /^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry) ? undefined : tx("expiry.format"),
      cvc: form.cvc.length === 3 ? undefined : tx("code.digits"),
    }
    if (next.brand || next.name || next.number || next.expiry || next.cvc) {
      setErrors(next)
      return
    }
    addCard({ brand: form.brand, last4: cardDigits(form.number).slice(-4), expiry: form.expiry, name: form.name.trim() })
    setForm({ brand: "", number: "", expiry: "", cvc: "", name: "" })
    setErrors({})
  }

  return (
    <Modal labelledBy="payment-title" onClose={onClose} closeLabel={tx("close")}>
      <h2 id="payment-title" className="pr-10 text-3xl tracking-tight">{tx("payment.methods")}</h2>
      {cards.length === 0 ? (
        <p className="mt-6 text-sm text-muted">{tx("no.saved.cards")}</p>
      ) : (
        <ul className="mt-6 flex flex-col">
          {cards.map((card) => (
            <li key={card.id} className="flex items-center justify-between gap-4 border-b border-line py-3 text-sm">
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="primary-card"
                  checked={card.primary}
                  onChange={() => setPrimaryCard(card.id)}
                />
                <span>
                  {brandName(card.brand)} •••• {card.last4}
                  {card.primary ? <span className="ml-2 text-accent">{tx("primary")}</span> : null}
                </span>
              </label>
              <button type="button" className="text-muted" onClick={() => removeCard(card.id)}>
                {tx("remove")}
              </button>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={submit} className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <p>{tx("card.details")}</p>
          <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
            {cardBrands.map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-label={label}
                className={`grid h-14 w-full place-items-center rounded-full bg-white data-[active=true]:shadow-[inset_0_0_0_2px_var(--color-accent)] ${errors.brand ? "shadow-[inset_0_0_0_1px_#8f2d2d]" : "shadow-[inset_0_0_0_1px_var(--color-line)]"}`}
                data-active={form.brand === id ? "true" : undefined}
                aria-pressed={form.brand === id}
                aria-invalid={errors.brand ? true : undefined}
                onClick={() => setField("brand", id)}
              >
                <CardLogo brand={id} />
              </button>
            ))}
          </div>
          {errors.brand ? <p className="mt-2 text-xl text-[#8f2d2d]">{errors.brand}</p> : null}
        </div>
        <TextField label={tx("name.on.card")} autoComplete="cc-name" error={errors.name} value={form.name} onChange={(event) => setField("name", event.target.value)} />
        <TextField
          label={tx("card.number")}
          autoComplete="cc-number"
          inputMode="numeric"
          placeholder="0000 0000 0000 0000"
          error={errors.number}
          value={form.number}
          onChange={(event) => setField("number", formatCardNumber(event.target.value))}
        />
        <TextField
          label={tx("expiry")}
          autoComplete="cc-exp"
          inputMode="numeric"
          placeholder="MM/YY"
          error={errors.expiry}
          value={form.expiry}
          onChange={(event) => setField("expiry", formatExpiry(event.target.value))}
        />
        <TextField
          label={tx("code")}
          autoComplete="cc-csc"
          inputMode="numeric"
          placeholder="000"
          error={errors.cvc}
          value={form.cvc}
          onChange={(event) => setField("cvc", cardDigits(event.target.value).slice(0, 3))}
        />
        <button type="submit" className="btn w-full md:col-span-2">{tx("save.card")}</button>
      </form>
    </Modal>
  )
}

function AddressSection() {
  const { lang, tx, user } = useStore()
  const [open, setOpen] = useState(false)
  const addresses = user?.addresses ?? []

  return (
    <Section title={tx("saved.addresses")} action={<EditButton label={tx("edit")} onClick={() => setOpen(true)} />}>
      {addresses.length === 0 ? (
        <p className="text-sm text-muted">{tx("no.saved.address")}</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {addresses.map((address) => (
            <li key={address.id} className="flex items-start justify-between gap-4">
              <address className="text-sm not-italic">
                {addressLines(address, lang).map((line) => (
                  <span key={line} className="block">{line}</span>
                ))}
              </address>
              {address.primary ? <span className="shrink-0 text-sm text-accent">{tx("primary")}</span> : null}
            </li>
          ))}
        </ul>
      )}
      <AnimatePresence>
        {open ? <AddressDialog key="address" onClose={() => setOpen(false)} /> : null}
      </AnimatePresence>
    </Section>
  )
}

function addressLines(address: SavedAddress, lang: Lang) {
  const country = countries.find((item) => item.code === address.country)?.name[lang] ?? address.country
  const street = [address.street, address.apartment].filter(Boolean).join(", ")
  const place = [address.city, address.region, address.postal].filter(Boolean).join(", ")
  return [street, place, country, address.phone].filter(Boolean)
}

const emptyAddress = {
  country: "",
  street: "",
  apartment: "",
  postal: "",
  city: "",
  region: "",
  phone: "",
}

function AddressDialog({ onClose }: { onClose: () => void }) {
  const { lang, tx, user, addAddress, removeAddress, setPrimaryAddress } = useStore()
  const addresses = user?.addresses ?? []
  const [form, setForm] = useState(emptyAddress)
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({})

  function setField(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    const next = {
      country: form.country ? undefined : tx("choose.a.country"),
      street: form.street.trim() ? undefined : tx("enter.street"),
      postal: form.postal.trim() ? undefined : tx("enter.postal.code"),
      city: form.city.trim() ? undefined : tx("enter.city"),
      region: form.region.trim() ? undefined : tx("enter.region"),
      phone: form.phone.trim() ? undefined : tx("enter.phone"),
    }
    if (next.country || next.street || next.postal || next.city || next.region || next.phone) {
      setErrors(next)
      return
    }
    addAddress({
      country: form.country,
      street: form.street.trim(),
      apartment: form.apartment.trim(),
      postal: form.postal.trim(),
      city: form.city.trim(),
      region: form.region.trim(),
      phone: form.phone.trim(),
    })
    setForm(emptyAddress)
    setErrors({})
  }

  return (
    <Modal labelledBy="address-title" onClose={onClose} closeLabel={tx("close")}>
      <h2 id="address-title" className="pr-10 text-3xl tracking-tight">{tx("saved.addresses")}</h2>
      {addresses.length === 0 ? (
        <p className="mt-6 text-sm text-muted">{tx("no.saved.address")}</p>
      ) : (
        <ul className="mt-6 flex flex-col">
          {addresses.map((address) => (
            <li key={address.id} className="flex items-start justify-between gap-4 border-b border-line py-3 text-sm">
              <label className="flex items-start gap-3">
                <input
                  type="radio"
                  className="mt-1"
                  name="primary-address"
                  checked={address.primary}
                  onChange={() => setPrimaryAddress(address.id)}
                />
                <span>
                  {addressLines(address, lang).join(", ")}
                  {address.primary ? <span className="ml-2 text-accent">{tx("primary")}</span> : null}
                </span>
              </label>
              <button type="button" className="shrink-0 text-muted" onClick={() => removeAddress(address.id)}>
                {tx("remove")}
              </button>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={submit} className="mt-6 grid gap-4 md:grid-cols-2">
        <SelectField label={tx("country")} autoComplete="country" error={errors.country} value={form.country} onChange={(event) => setField("country", event.target.value)}>
          <option value="">{tx("choose.a.country")}</option>
          {countriesBy(lang).map(({ code, name }) => (
            <option key={code} value={code}>{name[lang]}</option>
          ))}
        </SelectField>
        <TextField label={tx("phone")} autoComplete="tel" inputMode="tel" error={errors.phone} value={form.phone} onChange={(event) => setField("phone", event.target.value)} />
        <TextField label={tx("street.and.number")} autoComplete="address-line1" error={errors.street} value={form.street} onChange={(event) => setField("street", event.target.value)} />
        <TextField label={tx("apartment.floor.if.any")} autoComplete="address-line2" value={form.apartment} onChange={(event) => setField("apartment", event.target.value)} />
        <TextField label={tx("postal.code")} autoComplete="postal-code" error={errors.postal} value={form.postal} onChange={(event) => setField("postal", event.target.value)} />
        <TextField label={tx("city")} autoComplete="address-level2" error={errors.city} value={form.city} onChange={(event) => setField("city", event.target.value)} />
        <TextField label={tx("region")} autoComplete="address-level1" error={errors.region} value={form.region} onChange={(event) => setField("region", event.target.value)} />
        <button type="submit" className="btn w-full md:col-span-2">{tx("add.address")}</button>
      </form>
    </Modal>
  )
}

function orderDate(value: string, lang: Lang) {
  return new Intl.DateTimeFormat(lang, { month: "long", day: "numeric", year: "numeric" }).format(new Date(value))
}
