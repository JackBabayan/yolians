import { useEffect, type ReactNode } from "react"
import { useLocation } from "react-router-dom"
import { Footer } from "./Footer"
import { Header } from "./Header"

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="min-h-[100dvh] bg-white text-ink">
      <Header />
      <main className={pathname === "/" || pathname === "/tailoring" ? "" : "pt-32 pb-16 md:pt-40 md:pb-24"}>{children}</main>
      <Footer />
    </div>
  )
}
