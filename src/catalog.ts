import { useEffect, useSyncExternalStore } from "react"
import { api } from "./api"
import type { Gender, Kind, Product, ProductColor } from "./data"
import { products as fallback } from "./mock/catalog"

type ApiText = { en?: string; ru?: string }

type ApiColor = {
  id?: string
  name?: ApiText
  hex?: string
}

type ApiProduct = {
  id?: string
  name?: ApiText
  note?: ApiText
  price?: number
  shipping?: number
  gender?: string
  category?: string
  kind?: string
  material?: string
  color?: ApiColor | string
  sizes?: string[]
  stock?: Record<string, number>
  in_stock?: boolean
  image?: string | null
  images?: string[]
}

export type FilterOption = {
  id: string
  name: { en: string; ru: string }
}

export type FilterCategory = FilterOption & {
  image: string
  sizes: string[]
  materials: FilterOption[]
  colors: (FilterOption & { hex: string })[]
}

export type CatalogFilters = {
  genders: FilterOption[]
  categories: FilterCategory[]
}

export type CatalogQuery = {
  category?: string
  gender?: string | string[]
  material?: string | string[]
  color?: string | string[]
  size?: string | string[]
  inStock?: boolean
  sort?: string
  search?: string
  page?: number
  limit?: number
}

const kinds = new Set<Kind>(["jackets", "sneakers", "bags", "belts"])
const genders = new Set<Gender>(["women", "men", "unisex"])

function text(value: ApiText | undefined, spare?: { en: string; ru: string }) {
  const en = value?.en || spare?.en || ""
  return { en, ru: value?.ru || spare?.ru || en }
}

function colorOf(value: ApiProduct["color"], spare?: ProductColor): ProductColor | null {
  if (!value || typeof value !== "object" || !value.id || !value.hex) return null
  return {
    id: value.id,
    name: text(value.name, spare?.id === value.id ? spare.name : undefined),
    hex: value.hex,
  }
}

function toProduct(item: ApiProduct): Product | null {
  if (!item.id || !item.image) return null
  const category = (item.category || item.kind) as Kind
  const gender = item.gender as Gender
  const known = fallback.find((product) => product.id === item.id)
  const color = colorOf(item.color, known?.color)
  if (!kinds.has(category) || !genders.has(gender) || !color) return null
  const stock = item.stock ?? {}
  return {
    id: item.id,
    name: text(item.name, known?.name),
    price: item.price ?? known?.price ?? 0,
    shipping: item.shipping ?? 0,
    gender,
    category,
    material: item.material || known?.material || "",
    color,
    sizes: item.sizes ?? [],
    stock,
    inStock: item.in_stock ?? Object.values(stock).some((qty) => qty > 0),
    image: item.image,
    images: Array.isArray(item.images) && item.images.length > 0 ? item.images : known?.images,
    note: text(item.note, known?.note),
  }
}

function mapProducts(items: ApiProduct[] | undefined) {
  return (items ?? []).flatMap((item) => {
    const product = toProduct(item)
    return product ? [product] : []
  })
}

let products = fallback
const listeners = new Set<() => void>()
let loaded = false

export function getProducts() {
  return products
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function loadProducts() {
  if (loaded) return
  loaded = true
  api<{ products?: ApiProduct[] }>("/products?locale=all&limit=100", { auth: false })
    .then((data) => {
      const next = mapProducts(data.products)
      if (next.length === 0) return
      products = next
      listeners.forEach((listener) => listener())
    })
    .catch(() => {
      loaded = false
    })
}

export function useProducts() {
  return useSyncExternalStore(subscribe, getProducts, getProducts)
}

function queryString(query: CatalogQuery) {
  const params = new URLSearchParams({
    locale: "all",
    limit: String(query.limit ?? 12),
    page: String(query.page ?? 1),
  })
  if (query.category) params.set("category", query.category)
  if (typeof query.gender === "string" && query.gender) params.set("gender", query.gender)
  if (typeof query.material === "string" && query.material) params.set("material", query.material)
  if (typeof query.color === "string" && query.color) params.set("color", query.color)
  if (typeof query.size === "string" && query.size) params.set("size", query.size)
  if (query.inStock) params.set("in_stock", "true")
  if (query.sort) params.set("sort", query.sort)
  if (query.search) params.set("search", query.search)
  return params.toString()
}

function fetchPage(query: CatalogQuery) {
  return api<{
    products?: ApiProduct[]
    page?: number
    totalDocs?: number
    totalPages?: number
    hasNextPage?: boolean
    hasPrevPage?: boolean
  }>(`/products?${queryString(query)}`, { auth: false }).then((data) => ({
    products: mapProducts(data.products),
    page: data.page ?? query.page ?? 1,
    totalDocs: data.totalDocs ?? 0,
    totalPages: data.totalPages ?? 1,
    hasNextPage: Boolean(data.hasNextPage),
    hasPrevPage: Boolean(data.hasPrevPage),
  }))
}

function values(value: string | string[] | undefined) {
  if (!value) return []
  return (Array.isArray(value) ? value : [value]).filter(Boolean)
}

function combinations(query: CatalogQuery) {
  const axes = [values(query.gender), values(query.material), values(query.color), values(query.size)].map((items) =>
    items.length ? items : [undefined],
  )
  const combos: CatalogQuery[] = []
  for (const gender of axes[0]) {
    for (const material of axes[1]) {
      for (const color of axes[2]) {
        for (const size of axes[3]) {
          combos.push({ ...query, gender, material, color, size })
        }
      }
    }
  }
  return combos
}

export function fetchCatalog(query: CatalogQuery) {
  const combos = combinations(query)
  if (combos.length <= 1) return fetchPage(combos[0] ?? query)
  const limit = query.limit ?? 12
  const page = query.page ?? 1
  return Promise.all(combos.map((combo) => fetchPage({ ...combo, page: 1, limit: 100 }))).then((pages) => {
    const seen = new Map<string, Product>()
    for (const result of pages) {
      for (const product of result.products) seen.set(product.id, product)
    }
    const all = [...seen.values()]
    const start = (page - 1) * limit
    return {
      products: all.slice(start, start + limit),
      page,
      totalDocs: all.length,
      totalPages: Math.max(1, Math.ceil(all.length / limit)),
      hasNextPage: start + limit < all.length,
      hasPrevPage: page > 1,
    }
  })
}

let filters: CatalogFilters | null = null
const filterListeners = new Set<() => void>()
let filtersLoaded = false

function subscribeFilters(listener: () => void) {
  filterListeners.add(listener)
  return () => filterListeners.delete(listener)
}

function loadFilters() {
  if (filtersLoaded) return
  filtersLoaded = true
  api<CatalogFilters>("/catalog/filters?locale=all", { auth: false })
    .then((data) => {
      filters = {
        genders: data.genders ?? [],
        categories: data.categories ?? [],
      }
      filterListeners.forEach((listener) => listener())
    })
    .catch(() => {
      filtersLoaded = false
    })
}

export function useFilters() {
  const value = useSyncExternalStore(subscribeFilters, () => filters, () => null)
  useEffect(() => {
    loadFilters()
  }, [])
  return value
}
