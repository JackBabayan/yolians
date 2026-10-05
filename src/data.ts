import { getProducts, useProducts } from "./catalog"
import { messages, phrase, type Lang, type Phrase } from "./i18n"
import { kinds } from "./mock/catalog"

export type { Lang }
export type Gender = "women" | "men" | "unisex"
export type Kind = "jackets" | "sneakers" | "bags" | "belts"
export type ColorId = "black" | "cognac" | "white" | "emerald"

export type ProductColor = {
  id: string
  name: Record<Lang, string>
  hex: string
}

export type Product = {
  id: string
  name: Record<Lang, string>
  price: number
  shipping: number
  gender: Gender
  category: Kind
  material: string
  color: ProductColor
  sizes: string[]
  stock: Record<string, number>
  inStock: boolean
  image: string
  images?: string[]
  note: Record<Lang, string>
}

export { kinds, useProducts }

export function productById(id: string) {
  return getProducts().find((item) => item.id === id)
}

export function inStock(product: Product) {
  return product.inStock
}

export function money(value: number) {
  return `$${value}`
}

export function formatShipping(value: number, lang: Lang) {
  if (value === 0) return messages["shipping.free"][lang]
  return money(value)
}

export const countries: { code: string; name: Phrase }[] = [
  { code: "AU", name: phrase({ ru: "Австралия", en: "Australia" }) },
  { code: "AT", name: phrase({ ru: "Австрия", en: "Austria" }) },
  { code: "AZ", name: phrase({ ru: "Азербайджан", en: "Azerbaijan" }) },
  { code: "AL", name: phrase({ ru: "Албания", en: "Albania" }) },
  { code: "AD", name: phrase({ ru: "Андорра", en: "Andorra" }) },
  { code: "AM", name: phrase({ ru: "Армения", en: "Armenia" }) },
  { code: "AF", name: phrase({ ru: "Афганистан", en: "Afghanistan" }) },
  { code: "BD", name: phrase({ ru: "Бангладеш", en: "Bangladesh" }) },
  { code: "BH", name: phrase({ ru: "Бахрейн", en: "Bahrain" }) },
  { code: "BY", name: phrase({ ru: "Беларусь", en: "Belarus" }) },
  { code: "BE", name: phrase({ ru: "Бельгия", en: "Belgium" }) },
  { code: "BG", name: phrase({ ru: "Болгария", en: "Bulgaria" }) },
  { code: "BA", name: phrase({ ru: "Босния и Герцеговина", en: "Bosnia and Herzegovina" }) },
  { code: "BN", name: phrase({ ru: "Бруней", en: "Brunei" }) },
  { code: "BT", name: phrase({ ru: "Бутан", en: "Bhutan" }) },
  { code: "VA", name: phrase({ ru: "Ватикан", en: "Vatican City" }) },
  { code: "GB", name: phrase({ ru: "Великобритания", en: "United Kingdom" }) },
  { code: "HU", name: phrase({ ru: "Венгрия", en: "Hungary" }) },
  { code: "TL", name: phrase({ ru: "Восточный Тимор", en: "Timor-Leste" }) },
  { code: "VN", name: phrase({ ru: "Вьетнам", en: "Vietnam" }) },
  { code: "DE", name: phrase({ ru: "Германия", en: "Germany" }) },
  { code: "HK", name: phrase({ ru: "Гонконг", en: "Hong Kong" }) },
  { code: "GR", name: phrase({ ru: "Греция", en: "Greece" }) },
  { code: "GE", name: phrase({ ru: "Грузия", en: "Georgia" }) },
  { code: "DK", name: phrase({ ru: "Дания", en: "Denmark" }) },
  { code: "IL", name: phrase({ ru: "Израиль", en: "Israel" }) },
  { code: "IN", name: phrase({ ru: "Индия", en: "India" }) },
  { code: "ID", name: phrase({ ru: "Индонезия", en: "Indonesia" }) },
  { code: "JO", name: phrase({ ru: "Иордания", en: "Jordan" }) },
  { code: "IQ", name: phrase({ ru: "Ирак", en: "Iraq" }) },
  { code: "IR", name: phrase({ ru: "Иран", en: "Iran" }) },
  { code: "IE", name: phrase({ ru: "Ирландия", en: "Ireland" }) },
  { code: "IS", name: phrase({ ru: "Исландия", en: "Iceland" }) },
  { code: "ES", name: phrase({ ru: "Испания", en: "Spain" }) },
  { code: "IT", name: phrase({ ru: "Италия", en: "Italy" }) },
  { code: "YE", name: phrase({ ru: "Йемен", en: "Yemen" }) },
  { code: "KZ", name: phrase({ ru: "Казахстан", en: "Kazakhstan" }) },
  { code: "KH", name: phrase({ ru: "Камбоджа", en: "Cambodia" }) },
  { code: "CA", name: phrase({ ru: "Канада", en: "Canada" }) },
  { code: "QA", name: phrase({ ru: "Катар", en: "Qatar" }) },
  { code: "CY", name: phrase({ ru: "Кипр", en: "Cyprus" }) },
  { code: "KG", name: phrase({ ru: "Киргизия", en: "Kyrgyzstan" }) },
  { code: "CN", name: phrase({ ru: "Китай", en: "China" }) },
  { code: "KP", name: phrase({ ru: "КНДР", en: "North Korea" }) },
  { code: "XK", name: phrase({ ru: "Косово", en: "Kosovo" }) },
  { code: "KW", name: phrase({ ru: "Кувейт", en: "Kuwait" }) },
  { code: "LA", name: phrase({ ru: "Лаос", en: "Laos" }) },
  { code: "LV", name: phrase({ ru: "Латвия", en: "Latvia" }) },
  { code: "LB", name: phrase({ ru: "Ливан", en: "Lebanon" }) },
  { code: "LT", name: phrase({ ru: "Литва", en: "Lithuania" }) },
  { code: "LI", name: phrase({ ru: "Лихтенштейн", en: "Liechtenstein" }) },
  { code: "LU", name: phrase({ ru: "Люксембург", en: "Luxembourg" }) },
  { code: "MO", name: phrase({ ru: "Макао", en: "Macao" }) },
  { code: "MY", name: phrase({ ru: "Малайзия", en: "Malaysia" }) },
  { code: "MV", name: phrase({ ru: "Мальдивы", en: "Maldives" }) },
  { code: "MT", name: phrase({ ru: "Мальта", en: "Malta" }) },
  { code: "MD", name: phrase({ ru: "Молдова", en: "Moldova" }) },
  { code: "MC", name: phrase({ ru: "Монако", en: "Monaco" }) },
  { code: "MN", name: phrase({ ru: "Монголия", en: "Mongolia" }) },
  { code: "MM", name: phrase({ ru: "Мьянма", en: "Myanmar" }) },
  { code: "NP", name: phrase({ ru: "Непал", en: "Nepal" }) },
  { code: "NL", name: phrase({ ru: "Нидерланды", en: "Netherlands" }) },
  { code: "NO", name: phrase({ ru: "Норвегия", en: "Norway" }) },
  { code: "AE", name: phrase({ ru: "ОАЭ", en: "United Arab Emirates" }) },
  { code: "OM", name: phrase({ ru: "Оман", en: "Oman" }) },
  { code: "PK", name: phrase({ ru: "Пакистан", en: "Pakistan" }) },
  { code: "PS", name: phrase({ ru: "Палестина", en: "Palestine" }) },
  { code: "PL", name: phrase({ ru: "Польша", en: "Poland" }) },
  { code: "PT", name: phrase({ ru: "Португалия", en: "Portugal" }) },
  { code: "RU", name: phrase({ ru: "Россия", en: "Russia" }) },
  { code: "RO", name: phrase({ ru: "Румыния", en: "Romania" }) },
  { code: "SM", name: phrase({ ru: "Сан-Марино", en: "San Marino" }) },
  { code: "SA", name: phrase({ ru: "Саудовская Аравия", en: "Saudi Arabia" }) },
  { code: "MK", name: phrase({ ru: "Северная Македония", en: "North Macedonia" }) },
  { code: "RS", name: phrase({ ru: "Сербия", en: "Serbia" }) },
  { code: "SG", name: phrase({ ru: "Сингапур", en: "Singapore" }) },
  { code: "SY", name: phrase({ ru: "Сирия", en: "Syria" }) },
  { code: "SK", name: phrase({ ru: "Словакия", en: "Slovakia" }) },
  { code: "SI", name: phrase({ ru: "Словения", en: "Slovenia" }) },
  { code: "US", name: phrase({ ru: "США", en: "United States" }) },
  { code: "TJ", name: phrase({ ru: "Таджикистан", en: "Tajikistan" }) },
  { code: "TH", name: phrase({ ru: "Таиланд", en: "Thailand" }) },
  { code: "TW", name: phrase({ ru: "Тайвань", en: "Taiwan" }) },
  { code: "TM", name: phrase({ ru: "Туркменистан", en: "Turkmenistan" }) },
  { code: "TR", name: phrase({ ru: "Турция", en: "Turkey" }) },
  { code: "UZ", name: phrase({ ru: "Узбекистан", en: "Uzbekistan" }) },
  { code: "UA", name: phrase({ ru: "Украина", en: "Ukraine" }) },
  { code: "PH", name: phrase({ ru: "Филиппины", en: "Philippines" }) },
  { code: "FI", name: phrase({ ru: "Финляндия", en: "Finland" }) },
  { code: "FR", name: phrase({ ru: "Франция", en: "France" }) },
  { code: "HR", name: phrase({ ru: "Хорватия", en: "Croatia" }) },
  { code: "ME", name: phrase({ ru: "Черногория", en: "Montenegro" }) },
  { code: "CZ", name: phrase({ ru: "Чехия", en: "Czechia" }) },
  { code: "CH", name: phrase({ ru: "Швейцария", en: "Switzerland" }) },
  { code: "SE", name: phrase({ ru: "Швеция", en: "Sweden" }) },
  { code: "LK", name: phrase({ ru: "Шри-Ланка", en: "Sri Lanka" }) },
  { code: "EE", name: phrase({ ru: "Эстония", en: "Estonia" }) },
  { code: "KR", name: phrase({ ru: "Южная Корея", en: "South Korea" }) },
  { code: "JP", name: phrase({ ru: "Япония", en: "Japan" }) },
]

export function countriesBy(lang: Lang) {
  return [...countries].sort((a, b) => a.name[lang].localeCompare(b.name[lang], lang))
}
