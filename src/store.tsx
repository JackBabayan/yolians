import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
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
  user: User | null
  users: User[]
  orders: Order[]
}

type Store = State & {
  cards: SavedCard[]
  setLang: (lang: Lang) => void
  tx: (key: MessageKey) => string
  addToCart: (productId: string, size: string, qty?: number) => void
  setQty: (productId: string, size: string, qty: number) => void
  removeLine: (productId: string, size: string) => void
  register: (user: User) => string | null
  login: (email: string, password: string) => string | null
  updateProfile: (profile: { firstName: string; lastName: string; email: string; phone: string }) => string | null
  logout: () => void
  placeOrder: (lines: CartLine[], total: number) => string
  addAddress: (address: Omit<SavedAddress, "id" | "primary">) => void
  removeAddress: (id: string) => void
  setPrimaryAddress: (id: string) => void
  addCard: (card: Omit<SavedCard, "id" | "primary">) => void
  removeCard: (id: string) => void
  setPrimaryCard: (id: string) => void
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

function dropPrimary<T extends { id: string; primary: boolean }>(items: T[], id: string) {
  return withOnePrimary(items.filter((item) => item.id !== id))
}

const empty: State = {
  lang: "en",
  cart: [],
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
      register: (user) => {
        const email = user.email.trim().toLowerCase()
        const existing = state.users.find((item) => item.email === email)
        if (existing && existing.password !== "") {
          return tx("this.email.is.already.used")
        }
        const next = { ...user, email }
        setState((current) => ({
          ...current,
          users: existing
            ? current.users.map((item) => (item.email === email ? next : item))
            : [...current.users, next],
          user: next,
        }))
        return null
      },
      login: (email, password) => {
        const found = state.users.find((item) => item.email === email.trim().toLowerCase())
        if (!found || (found.password !== "" && found.password !== password)) {
          return tx("wrong.email.or.password")
        }
        if (found.password === "") {
          return tx("passwords.are.not.kept.between")
        }
        setState((current) => ({ ...current, user: found }))
        return null
      },
      updateProfile: (profile) => {
        if (!state.user) return null
        const firstName = profile.firstName.trim()
        const lastName = profile.lastName.trim()
        const email = profile.email.trim().toLowerCase()
        const phone = profile.phone.trim()
        if (!firstName || !lastName || !email || !phone) return tx("profile.fields.required")
        const previous = state.user.email
        if (state.users.some((item) => item.email === email && item.email !== previous)) {
          return tx("this.email.is.already.used")
        }
        setState((current) => {
          if (!current.user) return current
          return replaceUser(current, { ...current.user, firstName, lastName, email, phone }, previous)
        })
        return null
      },
      logout: () => setState((current) => ({ ...current, user: null })),
      placeOrder: (lines, total) => {
        const id = `YL-${Date.now().toString().slice(-6)}`
        setState((current) => {
          const bought = new Set(lines.map((line) => `${line.productId}:${line.size}`))
          return {
            ...current,
            cart: current.cart.filter((line) => !bought.has(`${line.productId}:${line.size}`)),
            orders: [
              {
                id,
                createdAt: new Date().toISOString(),
                items: lines,
                total,
              },
              ...current.orders,
            ],
          }
        })
        return id
      },
      addAddress: (address) =>
        setState((current) => {
          if (!current.user) return current
          const next = {
            ...current.user,
            addresses: [
              ...current.user.addresses,
              { ...address, id: `addr-${Date.now()}`, primary: current.user.addresses.length === 0 },
            ],
          }
          return replaceUser(current, next, current.user.email)
        }),
      removeAddress: (id) =>
        setState((current) => {
          if (!current.user) return current
          return replaceUser(
            current,
            { ...current.user, addresses: dropPrimary(current.user.addresses, id) },
            current.user.email,
          )
        }),
      setPrimaryAddress: (id) =>
        setState((current) => {
          if (!current.user) return current
          return replaceUser(
            current,
            {
              ...current.user,
              addresses: current.user.addresses.map((item) => ({ ...item, primary: item.id === id })),
            },
            current.user.email,
          )
        }),
      addCard: (card) =>
        setState((current) => {
          if (!current.user) return current
          const next = {
            ...current.user,
            cards: [
              ...current.user.cards,
              { ...card, id: `card-${Date.now()}`, primary: current.user.cards.length === 0 },
            ],
          }
          return replaceUser(current, next, current.user.email)
        }),
      removeCard: (id) =>
        setState((current) => {
          if (!current.user) return current
          return replaceUser(
            current,
            { ...current.user, cards: dropPrimary(current.user.cards, id) },
            current.user.email,
          )
        }),
      setPrimaryCard: (id) =>
        setState((current) => {
          if (!current.user) return current
          return replaceUser(
            current,
            {
              ...current.user,
              cards: current.user.cards.map((item) => ({ ...item, primary: item.id === id })),
            },
            current.user.email,
          )
        }),
    }
  }, [state])

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export function useStore() {
  const store = useContext(StoreContext)
  if (!store) throw new Error("Store missing")
  return store
}
