import { phrase, type Phrase } from "../i18n"
import type { ColorId, Gender, Kind, Product, ProductColor } from "../data"

const palette: Record<ColorId, ProductColor> = {
  black: { id: "black", name: phrase({ ru: "Чёрный", en: "Black" }), hex: "#14181c" },
  cognac: { id: "cognac", name: phrase({ ru: "Коньяк", en: "Cognac" }), hex: "#8a4b2f" },
  white: { id: "white", name: phrase({ ru: "Белый", en: "White" }), hex: "#ffffff" },
  emerald: { id: "emerald", name: phrase({ ru: "Изумруд", en: "Emerald" }), hex: "#0c6b56" },
}

// Fixture catalog. Delete this file when products come from the backend.
const catalog: Omit<Product, "inStock">[] = [
  {
    id: "atlas",
    name: phrase({ ru: "Куртка Atlas", en: "Atlas jacket" }),
    price: 420,
    shipping: 0,
    gender: "men",
    category: "jackets",
    material: "leather",
    color: palette.black,
    sizes: ["S", "M", "L", "XL"],
    stock: { S: 2, M: 4, L: 2, XL: 1 },
    image: "/media/prod-jacket-black.jpg",
    note: phrase({ ru: "Плотная кожа, прямой крой, молния спереди.", en: "Dense leather, straight cut, front zip." }),
  },
  {
    id: "nora",
    name: phrase({ ru: "Куртка Nora", en: "Nora jacket" }),
    price: 390,
    shipping: 0,
    gender: "women",
    category: "jackets",
    material: "leather",
    color: palette.cognac,
    sizes: ["XS", "S", "M", "L"],
    stock: { XS: 1, S: 3, M: 2, L: 1 },
    image: "/media/prod-jacket-cognac.jpg",
    note: phrase({ ru: "Укороченная куртка из кожи коньячного цвета.", en: "Cropped jacket in cognac leather." }),
  },
  {
    id: "court",
    name: phrase({ ru: "Кеды Court", en: "Court sneakers" }),
    price: 180,
    shipping: 0,
    gender: "men",
    category: "sneakers",
    material: "leather",
    color: palette.white,
    sizes: ["40", "41", "42", "43", "44"],
    stock: { "40": 2, "41": 3, "42": 4, "43": 2, "44": 1 },
    image: "/media/prod-sneakers-white.jpg",
    note: phrase({ ru: "Белая кожа, тонкая подошва, без лишнего декора.", en: "White leather, slim sole, no extra trim." }),
  },
  {
    id: "night",
    name: phrase({ ru: "Кеды Night", en: "Night sneakers" }),
    price: 190,
    shipping: 0,
    gender: "women",
    category: "sneakers",
    material: "leather",
    color: palette.black,
    sizes: ["36", "37", "38", "39", "40"],
    stock: { "36": 0, "37": 0, "38": 0, "39": 0, "40": 0 },
    image: "/media/prod-sneakers-black.jpg",
    note: phrase({ ru: "Чёрная кожа. Сейчас шьём только на заказ.", en: "Black leather. Made to order right now." }),
  },
  {
    id: "fold",
    name: phrase({ ru: "Сумка Fold", en: "Fold bag" }),
    price: 260,
    shipping: 0,
    gender: "men",
    category: "bags",
    material: "leather",
    color: palette.black,
    sizes: ["One"],
    stock: { One: 5 },
    image: "/media/prod-bag-black.jpg",
    note: phrase({ ru: "Жёсткая сумка на плечо, одно отделение.", en: "Structured shoulder bag, one compartment." }),
  },
  {
    id: "field",
    name: phrase({ ru: "Сумка Field", en: "Field bag" }),
    price: 240,
    shipping: 0,
    gender: "women",
    category: "bags",
    material: "leather",
    color: palette.emerald,
    sizes: ["One"],
    stock: { One: 3 },
    image: "/media/prod-bag-emerald.jpg",
    note: phrase({ ru: "Компактная сумка изумрудной кожи.", en: "Compact bag in emerald leather." }),
  },
  {
    id: "line",
    name: phrase({ ru: "Ремень Line", en: "Line belt" }),
    price: 90,
    shipping: 0,
    gender: "men",
    category: "belts",
    material: "leather",
    color: palette.black,
    sizes: ["80", "85", "90", "95", "100"],
    stock: { "80": 2, "85": 4, "90": 4, "95": 2, "100": 1 },
    image: "/media/prod-belt.jpg",
    note: phrase({ ru: "Тонкий ремень, матовая пряжка.", en: "Slim belt, matte buckle." }),
  },
]

const jacketMen = ["S", "M", "L", "XL"]
const jacketWomen = ["XS", "S", "M", "L"]
const shoeMen = ["40", "41", "42", "43", "44"]
const shoeWomen = ["36", "37", "38", "39", "40"]
const beltSizes = ["80", "85", "90", "95", "100"]

const kindNote: Record<Kind, Phrase> = {
  jackets: phrase({ ru: "Кожаная куртка, прямой крой.", en: "Leather jacket, straight cut." }),
  sneakers: phrase({ ru: "Кожаные кеды, тонкая подошва.", en: "Leather sneakers, slim sole." }),
  bags: phrase({ ru: "Кожаная сумка на плечо.", en: "Leather shoulder bag." }),
  belts: phrase({ ru: "Кожаный ремень, матовая пряжка.", en: "Leather belt, matte buckle." }),
}

const more: Draft[] = [
  ["harbor", "Куртка Harbor", "Harbor jacket", 445, "men", "jackets", "black", "/media/prod-jacket-black.jpg", jacketMen, [1, 3, 2, 1]],
  ["ridge", "Куртка Ridge", "Ridge jacket", 410, "men", "jackets", "black", "/media/prod-jacket-black.jpg", jacketMen, [2, 2, 1, 0]],
  ["north", "Куртка North", "North jacket", 468, "men", "jackets", "black", "/media/prod-jacket-black.jpg", jacketMen, [1, 2, 3, 1]],
  ["vault", "Куртка Vault", "Vault jacket", 398, "men", "jackets", "black", "/media/prod-jacket-black.jpg", jacketMen, [0, 2, 2, 1]],
  ["lumen", "Куртка Lumen", "Lumen jacket", 375, "women", "jackets", "cognac", "/media/prod-jacket-cognac.jpg", jacketWomen, [1, 2, 2, 1]],
  ["sable", "Куртка Sable", "Sable jacket", 412, "women", "jackets", "cognac", "/media/prod-jacket-cognac.jpg", jacketWomen, [0, 1, 3, 1]],
  ["marlow", "Куртка Marlow", "Marlow jacket", 360, "women", "jackets", "cognac", "/media/prod-jacket-cognac.jpg", jacketWomen, [1, 2, 1, 0]],
  ["cinder", "Куртка Cinder", "Cinder jacket", 428, "women", "jackets", "cognac", "/media/prod-jacket-cognac.jpg", jacketWomen, [2, 1, 2, 1]],
  ["pace", "Кеды Pace", "Pace sneakers", 175, "men", "sneakers", "white", "/media/prod-sneakers-white.jpg", shoeMen, [1, 2, 3, 2, 1]],
  ["drift", "Кеды Drift", "Drift sneakers", 196, "men", "sneakers", "white", "/media/prod-sneakers-white.jpg", shoeMen, [2, 1, 2, 1, 0]],
  ["plain", "Кеды Plain", "Plain sneakers", 164, "men", "sneakers", "white", "/media/prod-sneakers-white.jpg", shoeMen, [1, 3, 2, 2, 1]],
  ["vale", "Кеды Vale", "Vale sneakers", 188, "women", "sneakers", "black", "/media/prod-sneakers-black.jpg", shoeWomen, [1, 2, 2, 1, 1]],
  ["ink", "Кеды Ink", "Ink sneakers", 204, "women", "sneakers", "black", "/media/prod-sneakers-black.jpg", shoeWomen, [0, 0, 0, 0, 0]],
  ["mono", "Кеды Mono", "Mono sneakers", 172, "women", "sneakers", "black", "/media/prod-sneakers-black.jpg", shoeWomen, [2, 1, 3, 1, 0]],
  ["case", "Сумка Case", "Case bag", 255, "men", "bags", "black", "/media/prod-bag-black.jpg", ["One"], [4]],
  ["ledger", "Сумка Ledger", "Ledger bag", 280, "men", "bags", "black", "/media/prod-bag-black.jpg", ["One"], [2]],
  ["clasp", "Сумка Clasp", "Clasp bag", 230, "women", "bags", "emerald", "/media/prod-bag-emerald.jpg", ["One"], [3]],
  ["grove", "Сумка Grove", "Grove bag", 268, "women", "bags", "emerald", "/media/prod-bag-emerald.jpg", ["One"], [1]],
  ["span", "Ремень Span", "Span belt", 86, "men", "belts", "black", "/media/prod-belt.jpg", beltSizes, [1, 3, 2, 2, 1]],
  ["gauge", "Ремень Gauge", "Gauge belt", 110, "men", "belts", "black", "/media/prod-belt.jpg", beltSizes, [2, 1, 3, 1, 0]],
  ["loop", "Ремень Loop", "Loop belt", 84, "women", "belts", "black", "/media/prod-belt.jpg", beltSizes, [1, 2, 2, 1, 1]],
  ["slim", "Ремень Slim", "Slim belt", 96, "women", "belts", "black", "/media/prod-belt.jpg", beltSizes, [0, 2, 3, 1, 1]],
  ["arc", "Ремень Arc", "Arc belt", 78, "women", "belts", "black", "/media/prod-belt.jpg", beltSizes, [2, 2, 1, 1, 0]],
]

type Draft = [
  id: string,
  ru: string,
  en: string,
  price: number,
  gender: Gender,
  kind: Kind,
  color: ColorId,
  image: string,
  sizes: string[],
  qty: number[],
]

function toProduct(draft: Draft): Omit<Product, "inStock"> {
  const [id, ru, en, price, gender, kind, color, image, sizes, qty] = draft
  return {
    id,
    name: phrase({ ru, en }),
    price,
    shipping: 0,
    gender,
    category: kind,
    material: "leather",
    color: palette[color],
    sizes,
    stock: Object.fromEntries(sizes.map((size, index) => [size, qty[index] ?? 0])),
    image,
    note: kindNote[kind],
  }
}

const extraViews: Record<string, string[]> = {
  "/media/prod-jacket-black.jpg": ["/media/jacket-black-side.jpg", "/media/jacket-black-back.jpg", "/media/jacket-black-detail.jpg", "/media/jacket-black-front.jpg", "/media/jacket-black-collar.jpg"],
  "/media/prod-jacket-cognac.jpg": ["/media/jacket-cognac-side.jpg", "/media/jacket-cognac-back.jpg", "/media/jacket-cognac-detail.jpg", "/media/jacket-cognac-front.jpg", "/media/jacket-cognac-collar.jpg"],
  "/media/prod-sneakers-white.jpg": ["/media/sneaker-white-side.jpg", "/media/sneaker-white-back.jpg", "/media/sneaker-white-sole.jpg", "/media/sneaker-white-top.jpg", "/media/sneaker-white-heel.jpg"],
  "/media/prod-sneakers-black.jpg": ["/media/sneaker-black-side.jpg", "/media/sneaker-black-back.jpg", "/media/sneaker-black-sole.jpg", "/media/sneaker-black-top.jpg", "/media/sneaker-black-heel.jpg"],
  "/media/prod-bag-black.jpg": ["/media/bag-black-front.jpg", "/media/bag-black-open.jpg", "/media/bag-black-detail.jpg", "/media/bag-black-side.jpg", "/media/bag-black-strap.jpg"],
  "/media/prod-bag-emerald.jpg": ["/media/bag-emerald-side.jpg", "/media/bag-emerald-back.jpg", "/media/bag-emerald-detail.jpg", "/media/bag-emerald-front.jpg", "/media/bag-emerald-open.jpg"],
  "/media/prod-belt.jpg": ["/media/belt-line.jpg", "/media/belt-buckle.jpg", "/media/belt-holes.jpg", "/media/belt-curve.jpg", "/media/belt-tip.jpg"],
}

export const products: Product[] = [...catalog, ...more.map(toProduct)].map((product) => ({
  ...product,
  images: extraViews[product.image],
  inStock: Object.values(product.stock).some((qty) => qty > 0),
}))

export const kinds: { id: Kind; image: string }[] = [
  { id: "jackets", image: "/media/prod-jacket-black.jpg" },
  { id: "sneakers", image: "/media/prod-sneakers-white.jpg" },
  { id: "bags", image: "/media/prod-bag-black.jpg" },
  { id: "belts", image: "/media/prod-belt.jpg" },
]
