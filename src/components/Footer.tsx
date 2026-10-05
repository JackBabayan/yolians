import { FacebookLogo, InstagramLogo, TelegramLogo, YoutubeLogo } from "./icons"
import { Link } from "react-router-dom"
import { useStore } from "../store"

const social = [
  { href: "https://instagram.com/yolians", label: "Instagram", icon: InstagramLogo },
  { href: "https://facebook.com/yolians", label: "Facebook", icon: FacebookLogo },
  { href: "https://t.me/yolians", label: "Telegram", icon: TelegramLogo },
  { href: "https://youtube.com/@yolians", label: "YouTube", icon: YoutubeLogo },
]

export function Footer() {
  const { tx } = useStore()

  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-4 py-12 md:grid-cols-3 md:px-8">
        <div>
          <p className="text-xl font-medium">Yolians</p>
          <ul className="mt-4 space-y-2 text-xl text-muted">
            <li><Link to="/catalog?gender=women">{tx("nav.women")}</Link></li>
            <li><Link to="/catalog?gender=men">{tx("nav.men")}</Link></li>
            <li><Link to="/catalog?category=sneakers">{tx("kind.sneakers")}</Link></li>
            <li><Link to="/catalog?category=bags">{tx("nav.bags")}</Link></li>
            <li><Link to="/catalog?category=belts">{tx("kind.belts")}</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xl font-medium">{tx("about.us")}</p>
          <ul className="mt-4 space-y-2 text-xl text-muted">
            <li><Link to="/tailoring">{tx("nav.tailoring")}</Link></li>
            <li><Link to="/contact">{tx("contact.us")}</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/shipping-info">{tx("nav.shipping")}</Link></li>
            <li><Link to="/returns">{tx("nav.returns")}</Link></li>
            <li><Link to="/size-guide">{tx("nav.size")}</Link></li>
            <li><Link to="/about">{tx("our.story")}</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xl font-medium">{tx("follow.us")}</p>
          <div className="mt-4 flex gap-4">
            {social.map((item) => (
              <a key={item.label} href={item.href} target="_blank" rel="noreferrer" aria-label={item.label}>
                <item.icon size={22} />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-[1400px] flex-wrap justify-between gap-3 border-t border-line px-4 py-4 text-sm text-muted md:px-8">
        <span>© {new Date().getFullYear()} Yolians</span>
        <span className="flex gap-4">
          <Link to="/privacy">{tx("privacy.policy")}</Link>
          <Link to="/terms">{tx("terms")}</Link>
        </span>
      </div>
    </footer>
  )
}
