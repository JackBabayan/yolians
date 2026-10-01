import { useEffect, useState, type ReactNode } from "react"
import { useLocation } from "react-router-dom"
import { Footer } from "./Footer"
import { Header } from "./Header"
import { Preloader } from "./Preloader"

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="min-h-[100dvh] bg-white text-ink">
      <Preloader onDone={() => setReady(true)} />
      <Header />
      <main className={pathname === "/" || pathname === "/tailoring" ? "" : "pt-32 pb-16 md:pt-40 md:pb-24"}>
        {ready ? (
          <div key={pathname} className="page-enter">
            {children}
          </div>
        ) : null}
      </main>
      <Footer />
    </div>
  )
}
