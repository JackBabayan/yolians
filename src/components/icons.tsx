export {
  ArrowLeft,
  ArrowRight,
  Bag,
  CaretDown,
  Envelope,
  FacebookLogo,
  Funnel,
  InstagramLogo,
  List,
  Minus,
  Plus,
  TelegramLogo,
  User,
  X,
  YoutubeLogo,
} from "@phosphor-icons/react"

const chevronPath = "M1 1.5 6 6.5 11 1.5"

export function Chevron({ className, size = 12 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size * (8 / 12)}
      viewBox="0 0 12 8"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d={chevronPath}
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const selectChevron = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="${chevronPath}" stroke="#14181c" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
)}")`

document.documentElement.style.setProperty("--select-chevron", selectChevron)

type CardBrand = "mastercard" | "visa" | "mir" | "arca"

export function CardLogo({ brand }: { brand: CardBrand }) {
  if (brand === "mastercard") {
    return (
      <svg width="40" height="24" viewBox="0 0 40 24" aria-hidden="true">
        <circle cx="15" cy="12" r="8" fill="#eb001b" />
        <circle cx="25" cy="12" r="8" fill="#f79e1b" />
        <path fill="#ff5f00" d="M20 5.4a8 8 0 0 1 0 13.2 8 8 0 0 1 0-13.2" />
      </svg>
    )
  }
  if (brand === "visa") {
    return (
      <svg width="48" height="16" viewBox="0 0 48 16" aria-hidden="true">
        <text x="0" y="13" fill="#1a1f71" fontFamily="Arial, sans-serif" fontSize="16" fontStyle="italic" fontWeight="700">
          VISA
        </text>
      </svg>
    )
  }
  if (brand === "mir") {
    return (
      <svg width="44" height="18" viewBox="0 0 44 18" aria-hidden="true">
        <text x="0" y="14" fill="#1f8f4e" fontFamily="Arial, sans-serif" fontSize="15" fontWeight="700" letterSpacing="0.5">
          МИР
        </text>
      </svg>
    )
  }
  return (
    <svg width="46" height="16" viewBox="0 0 46 16" aria-hidden="true">
      <text x="0" y="13" fill="#16324f" fontFamily="Arial, sans-serif" fontSize="15" fontWeight="700">
        ArCa
      </text>
    </svg>
  )
}
