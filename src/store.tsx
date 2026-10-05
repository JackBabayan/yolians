import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { ApiError, api, getToken, setToken } from "./api"
import { productById } from "./data"
import { languages, messages, type Lang, type MessageKey } from "./i18n"

export type CartLine = { productId: string; size: string; qty: number }

export type SavedAddress = {
  id: string
  country: string
  street: string
  apartment: string
  postal: string
  city: string
  region: string
  phone: string
  primary: boolean
}

export type SavedCard = {
  id: string
  brand: string
  last4: string
  expiry: string
  name: string
  primary: boolean
}

export type User = {
  firstName: string
  lastName: string
  email: string
  password: string
  phone: string
  addresses: SavedAddress[]
  cards: SavedCard[]
}

export type Order = {
  id: string
  createdAt: string
  items: CartLine[]
  total: number
}

type State = {
  lang: Lang
  cart: CartLine[]
  token: string | null
  user: User | null
  users: User[]
  orders: Order[]
}

type ShipAddress = {
  first: string
  last: string
  country: string
  street: string
  apartment: string
  postal: string
  city: string
  region: string
  phone: string
}

type Store = State & {
  cards: SavedCard[]
  setLang: (lang: Lang) => void
  tx: (key: MessageKey) => string
  addToCart: (productId: string, size: string, qty?: number) => void
  setQty: (productId: string, size: string, qty: number) => void
  removeLine: (productId: string, size: string) => void
  register: (user: User) => Promise<string | null>
  login: (email: string, password: string) => Promise<string | null>
  updateProfile: (profile: { firstName: string; lastName: string; email: string; phone: string }) => Promise<string | null>
  logout: () => void
  placeOrder: (lines: CartLine[], ship: ShipAddress) => Promise<string | null>
  addAddress: (address: Omit<SavedAddress, "id" | "primary">) => Promise<string | null>
  removeAddress: (id: string) => Promise<string | null>
  setPrimaryAddress: (id: string) => Promise<string | null>
  addCard: (card: Omit<SavedCard, "id" | "primary">) => Promise<string | null>
  removeCard: (id: string) => Promise<string | null>
  setPrimaryCard: (id: string) => Promise<string | null>
}

const KEY = "yolians-v1"

function stockOf(productId: string, size: string) {
  return productById(productId)?.stock[size] ?? 0
}

function clampCart(cart: CartLine[]) {
  return cart.flatMap((line) => {
    const max = stockOf(line.productId, line.size)
    if (max < 1 || line.qty < 1) return []
    return [line]
  })
}

function withoutPassword(user: User): User {
  return { ...user, password: "" }
}

function withOnePrimary<T extends { primary: boolean }>(items: T[]) {
  if (items.length === 0 || items.some((item) => item.primary)) return items
  return items.map((item, index) => ({ ...item, primary: index === 0 }))
}

function readAddresses(value: unknown): SavedAddress[] {
  if (!Array.isArray(value)) return []
  const addresses = value.flatMap((item) => {
    if (!item || typeof item !== "object") return []
    const address = item as Partial<SavedAddress>
    if (typeof address.id !== "string") return []
    return [{
      id: address.id,
      country: address.country ?? "",
      street: address.street ?? "",
      apartment: address.apartment ?? "",
      postal: address.postal ?? "",
      city: address.city ?? "",
      region: address.region ?? "",
      phone: address.phone ?? "",
      primary: Boolean(address.primary),
    }]
  })
  return withOnePrimary(addresses)
}

function readCards(value: unknown): SavedCard[] {
  if (!Array.isArray(value)) return []
  const cards = value.flatMap((item) => {
    if (!item || typeof item !== "object") return []
    const card = item as Partial<SavedCard>
    if (typeof card.id !== "string" || typeof card.last4 !== "string") return []
    return [{
      id: card.id,
      brand: card.brand ?? "",
      last4: card.last4,
      expiry: card.expiry ?? "",
      name: card.name ?? "",
      primary: Boolean(card.primary),
    }]
  })
  return withOnePrimary(cards)
}

function normalizeUser(value: unknown, fallbackCards: SavedCard[]): User | null {
  if (!value || typeof value !== "object") return null
  const user = value as Partial<User>
  if (typeof user.email !== "string") return null
  return withoutPassword({
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    email: user.email,
    password: user.password ?? "",
    phone: user.phone ?? "",
    addresses: readAddresses(user.addresses),
    cards: Array.isArray(user.cards) ? readCards(user.cards) : fallbackCards,
  })
}

function replaceUser(current: State, next: User, previousEmail: string): State {
  return {
    ...current,
    user: next,
    users: current.users.map((item) => (item.email === previousEmail ? next : item)),
  }
}

function text(value: unknown) {
  return typeof value === "string" ? value : ""
}

function mapApiAddress(value: unknown): SavedAddress | null {
  if (!value || typeof value !== "object") return null
  const item = value as Record<string, unknown>
  const id = text(item.id)
  if (!id) return null
  return {
    id,
    country: text(item.country),
    street: text(item.streetAddress) || text(item.address) || text(item.street),
    apartment: text(item.apartment),
    postal: text(item.postalCode) || text(item.postal),
    city: text(item.city),
    region: text(item.region) || text(item.state),
    phone: text(item.phone),
    primary: Boolean(item.primary ?? item.isDefault ?? item.is_default),
  }
}

function mapApiCard(value: unknown): SavedCard | null {
  if (!value || typeof value !== "object") return null
  const item = value as Record<string, unknown>
  const id = text(item.id)
  const last4 = text(item.last4) || text(item.number).replace(/\D/g, "").slice(-4)
  if (!id || !last4) return null
  return {
    id,
    brand: text(item.brand) || text(item.card_brand),
    last4,
    expiry: text(item.expiry) || text(item.expiry_date) || text(item.exp),
    name: text(item.name),
    primary: Boolean(item.primary ?? item.isDefault ?? item.is_default),
  }
}

type AccountPayload = {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  addresses?: unknown[]
  cards?: unknown[]
  orders?: unknown[]
}

function accountUser(account: AccountPayload): User {
  return withoutPassword({
    firstName: account.firstName ?? "",
    lastName: account.lastName ?? "",
    email: account.email ?? "",
    password: "",
    phone: account.phone ?? "",
    addresses: withOnePrimary((account.addresses ?? []).flatMap((item) => {
      const address = mapApiAddress(item)
      return address ? [address] : []
    })),
    cards: withOnePrimary((account.cards ?? []).flatMap((item) => {
      const card = mapApiCard(item)
      return card ? [card] : []
    })),
  })
}

function accountOrders(value: unknown): Order[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return []
    const order = item as Record<string, unknown>
    const id = order.id ?? order.orderId ?? order.order_id
    if (typeof id !== "string" && typeof id !== "number") return []
    const items = Array.isArray(order.items)
      ? order.items.flatMap((line) => {
          if (!line || typeof line !== "object") return []
          const row = line as Record<string, unknown>
          const productId = text(row.productId) || text(row.slug) || text(row.product)
          const size = text(row.size)
          const qty = typeof row.quantity === "number" ? row.quantity : typeof row.qty === "number" ? row.qty : 1
          if (!productId || !size) return []
          return [{ productId, size, qty }]
        })
      : []
    return [{
      id: String(id),
      createdAt: text(order.createdAt) || text(order.created_at) || new Date().toISOString(),
      items,
      total: typeof order.total === "number" ? order.total : 0,
    }]
  })
}

function applyAccount(current: State, account: AccountPayload, token: string | null): State {
  const user = accountUser(account)
  return {
    ...current,
    token,
    user,
    users: current.user
      ? current.users.map((item) => (item.email === (current.user?.email ?? user.email) ? user : item))
      : current.users,
    orders: accountOrders(account.orders),
  }
}

const empty: State = {
  lang: "en",
  cart: [],
  token: null,
  user: null,
  users: [],
  orders: [],
}

const StoreContext = createContext<Store | null>(null)

function readState(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return empty
    const parsed = JSON.parse(raw) as Partial<State> & { cards?: unknown }
    const legacyCards = readCards(parsed.cards)
    const user = normalizeUser(parsed.user, legacyCards)
    const users = Array.isArray(parsed.users)
      ? parsed.users.flatMap((item) => {
          const next = normalizeUser(item, [])
          return next ? [next] : []
        })
      : []
    return {
      lang: languages.find((item) => item.id === parsed.lang)?.id ?? "en",
      cart: clampCart(Array.isArray(parsed.cart) ? parsed.cart : []),
      token: getToken(),
      user,
      users: user ? users.map((item) => (item.email === user.email ? user : item)) : users,
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
    }
  } catch {
    return empty
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(readState)

  useEffect(() => {
    const saved = {
      ...state,
      user: state.user ? withoutPassword(state.user) : null,
      users: state.users.map(withoutPassword),
    }
    localStorage.setItem(KEY, JSON.stringify(saved))
    document.documentElement.lang = state.lang
  }, [state])

  useEffect(() => {
    const token = getToken()
    if (!token) return
    let gone = false
    api<AccountPayload>("/account", { token })
      .then((account) => {
        if (!gone) setState((current) => applyAccount(current, account, token))
      })
      .catch(() => {
        if (gone) return
        setToken(null)
        setState((current) => ({ ...current, token: null, user: null, orders: [] }))
      })
    return () => {
      gone = true
    }
  }, [])

  const store = useMemo<Store>(() => {
    const tx = (key: MessageKey) => messages[key][state.lang]

    return {
      ...state,
      cards: state.user?.cards ?? [],
      setLang: (lang) => setState((current) => ({ ...current, lang })),
      tx,
      addToCart: (productId, size, qty = 1) =>
        setState((current) => {
          const max = stockOf(productId, size)
          const amount = Math.max(1, qty)
          const existing = current.cart.find(
            (line) => line.productId === productId && line.size === size,
          )
          if (existing) {
            return {
              ...current,
              cart: current.cart.map((line) =>
                line === existing ? { ...line, qty: line.qty + amount } : line,
              ),
            }
          }
          if (max < 1) return current
          return { ...current, cart: [...current.cart, { productId, size, qty: Math.min(max, amount) }] }
        }),
      setQty: (productId, size, qty) =>
        setState((current) => {
          const next = qty < 1 ? 0 : qty
          return {
            ...current,
            cart:
              next < 1
                ? current.cart.filter(
                    (line) => !(line.productId === productId && line.size === size),
                  )
                : current.cart.map((line) =>
                    line.productId === productId && line.size === size ? { ...line, qty: next } : line,
                  ),
          }
        }),
      removeLine: (productId, size) =>
        setState((current) => ({
          ...current,
          cart: current.cart.filter(
            (line) => !(line.productId === productId && line.size === size),
          ),
        })),
      register: async (user) => {
        try {
          const created = await api<{ token: string }>("/auth/register", {
            method: "POST",
            auth: false,
            body: {
              firstName: user.firstName.trim(),
              lastName: user.lastName.trim(),
              email: user.email.trim().toLowerCase(),
              password: user.password,
            },
          })
          setToken(created.token)
          const account = await api<AccountPayload>("/account", { token: created.token })
          setState((current) => applyAccount(current, account, created.token))
          return null
        } catch (error) {
          if (error instanceof ApiError && /already|exists|used/i.test(error.message)) {
            return tx("this.email.is.already.used")
          }
          return error instanceof Error ? error.message : tx("first.name.last.name.email")
        }
      },
      login: async (email, password) => {
        try {
          const session = await api<{ token: string }>("/auth/login", {
            method: "POST",
            auth: false,
            body: { email: email.trim().toLowerCase(), password },
          })
          setToken(session.token)
          const account = await api<AccountPayload>("/account", { token: session.token })
          setState((current) => applyAccount(current, account, session.token))
          return null
        } catch (error) {
          if (error instanceof ApiError && error.status === 401) return tx("wrong.email.or.password")
          return error instanceof Error ? error.message : tx("wrong.email.or.password")
        }
      },
      updateProfile: async (profile) => {
        if (!state.token) return tx("profile.fields.required")
        const firstName = profile.firstName.trim()
        const lastName = profile.lastName.trim()
        const email = profile.email.trim().toLowerCase()
        const phone = profile.phone.trim()
        if (!firstName || !lastName || !email || !phone) return tx("profile.fields.required")
        try {
          await api("/account", {
            method: "PATCH",
            token: state.token,
            body: { first_name: firstName, last_name: lastName, phone, email },
          })
          const account = await api<AccountPayload>("/account", { token: state.token })
          setState((current) => applyAccount(current, account, state.token))
          return null
        } catch (error) {
          return error instanceof Error ? error.message : tx("profile.fields.required")
        }
      },
      logout: () => {
        const token = state.token
        setToken(null)
        setState((current) => ({ ...current, token: null, user: null, orders: [] }))
        if (token) void api("/auth/logout", { method: "POST", token }).catch(() => undefined)
      },
      placeOrder: async (lines, ship) => {
        if (!state.token) return tx("sign.in")
        try {
          const created = await api<{ id?: string; order_id?: string; orderId?: string }>("/orders", {
            method: "POST",
            token: state.token,
            body: {
              items: lines.map((line) => {
                const product = productById(line.productId)
                return {
                  product: line.productId,
                  title: product?.name.en ?? line.productId,
                  slug: line.productId,
                  quantity: line.qty,
                  size: line.size,
                  color: product?.color.id ?? "",
                  price: product?.price ?? 0,
                }
              }),
              shipping_address: {
                recipient_name: `${ship.first.trim()} ${ship.last.trim()}`.trim(),
                street: ship.street.trim(),
                apartment: ship.apartment.trim(),
                city: ship.city.trim(),
                state: ship.region.trim(),
                postalCode: ship.postal.trim(),
                country: ship.country,
                phone: ship.phone.trim(),
              },
              payment_method: "online_card",
            },
          })
          const orderId = created.order_id ?? created.orderId ?? created.id
          const card = state.user?.cards.find((item) => item.primary) ?? state.user?.cards[0]
          const payment = await api<{ payment_url?: string }>("/orders/initiate-payment", {
            method: "POST",
            token: state.token,
            body: {
              order_id: orderId,
              payment_gateway: "ameria",
              ...(card ? { saved_card_id: card.id } : {}),
            },
          })
          const bought = new Set(lines.map((line) => `${line.productId}:${line.size}`))
          setState((current) => ({
            ...current,
            cart: current.cart.filter((line) => !bought.has(`${line.productId}:${line.size}`)),
          }))
          if (payment.payment_url) {
            window.location.assign(payment.payment_url)
            return "redirect"
          }
          if (orderId) {
            setState((current) => ({
              ...current,
              orders: [
                {
                  id: String(orderId),
                  createdAt: new Date().toISOString(),
                  items: lines,
                  total: lines.reduce((sum, line) => sum + (productById(line.productId)?.price ?? 0) * line.qty, 0),
                },
                ...current.orders,
              ],
            }))
          }
          return null
        } catch (error) {
          return error instanceof Error ? error.message : tx("sign.in")
        }
      },
      addAddress: async (address) => {
        if (!state.token || !state.user) return tx("sign.in")
        try {
          const saved = await api<{ addresses?: unknown[] }>("/account/addresses", {
            method: "POST",
            token: state.token,
            body: {
              recipient_name: `${state.user.firstName} ${state.user.lastName}`.trim(),
              phone: address.phone,
              street: address.street,
              apartment: address.apartment,
              city: address.city,
              state: address.region,
              region: address.region,
              postalCode: address.postal,
              country: address.country,
              is_default: state.user.addresses.length === 0,
            },
          })
          const addresses = (saved.addresses ?? []).flatMap((item) => {
            const next = mapApiAddress(item)
            return next ? [next] : []
          })
          setState((current) => {
            if (!current.user) return current
            return replaceUser(current, { ...current.user, addresses: withOnePrimary(addresses) }, current.user.email)
          })
          return null
        } catch (error) {
          return error instanceof Error ? error.message : tx("enter.street")
        }
      },
      removeAddress: async (id) => {
        if (!state.token) return tx("sign.in")
        try {
          const saved = await api<{ addresses?: unknown[] }>("/account/addresses", {
            method: "DELETE",
            token: state.token,
            body: { id },
          })
          const addresses = (saved.addresses ?? []).flatMap((item) => {
            const next = mapApiAddress(item)
            return next ? [next] : []
          })
          setState((current) => {
            if (!current.user) return current
            return replaceUser(current, { ...current.user, addresses: withOnePrimary(addresses) }, current.user.email)
          })
          return null
        } catch (error) {
          return error instanceof Error ? error.message : tx("sign.in")
        }
      },
      setPrimaryAddress: async (id) => {
        if (!state.token) return tx("sign.in")
        try {
          const saved = await api<{ addresses?: unknown[] }>("/account/addresses", {
            method: "PATCH",
            token: state.token,
            body: { id, is_default: true },
          })
          const addresses = (saved.addresses ?? []).flatMap((item) => {
            const next = mapApiAddress(item)
            return next ? [next] : []
          })
          setState((current) => {
            if (!current.user) return current
            return replaceUser(current, { ...current.user, addresses: withOnePrimary(addresses) }, current.user.email)
          })
          return null
        } catch (error) {
          return error instanceof Error ? error.message : tx("sign.in")
        }
      },
      addCard: async (card) => {
        if (!state.token || !state.user) return tx("sign.in")
        try {
          const saved = await api<{ cards?: unknown[] }>("/account/cards", {
            method: "POST",
            token: state.token,
            body: {
              name: card.name,
              brand: card.brand,
              card_brand: card.brand,
              last4: card.last4,
              expiry_date: card.expiry,
              is_default: state.user.cards.length === 0,
            },
          })
          const cards = (saved.cards ?? []).flatMap((item) => {
            const next = mapApiCard(item)
            return next ? [next] : []
          })
          setState((current) => {
            if (!current.user) return current
            return replaceUser(current, { ...current.user, cards: withOnePrimary(cards) }, current.user.email)
          })
          return null
        } catch (error) {
          return error instanceof Error ? error.message : tx("choose.a.card")
        }
      },
      removeCard: async (id) => {
        if (!state.token) return tx("sign.in")
        try {
          const saved = await api<{ cards?: unknown[] }>("/account/cards", {
            method: "DELETE",
            token: state.token,
            body: { id },
          })
          const cards = (saved.cards ?? []).flatMap((item) => {
            const next = mapApiCard(item)
            return next ? [next] : []
          })
          setState((current) => {
            if (!current.user) return current
            return replaceUser(current, { ...current.user, cards: withOnePrimary(cards) }, current.user.email)
          })
          return null
        } catch (error) {
          return error instanceof Error ? error.message : tx("sign.in")
        }
      },
      setPrimaryCard: async (id) => {
        if (!state.token) return tx("sign.in")
        try {
          const saved = await api<{ cards?: unknown[] }>("/account/cards", {
            method: "PATCH",
            token: state.token,
            body: { id, is_default: true },
          })
          const cards = (saved.cards ?? []).flatMap((item) => {
            const next = mapApiCard(item)
            return next ? [next] : []
          })
          setState((current) => {
            if (!current.user) return current
            return replaceUser(current, { ...current.user, cards: withOnePrimary(cards) }, current.user.email)
          })
          return null
        } catch (error) {
          return error instanceof Error ? error.message : tx("sign.in")
        }
      },
    }
  }, [state])

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export function useStore() {
  const store = useContext(StoreContext)
  if (!store) throw new Error("Store missing")
  return store
}
