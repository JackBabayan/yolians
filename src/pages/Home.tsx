import { ArrowRight } from "../components/icons"
import { type FormEvent, useState } from "react"
import { Link } from "react-router-dom"
import { useContent } from "../content"
import { useProducts, type Gender } from "../data"
import { Hero, type HeroSlide } from "../components/Hero"
import { ProductCard } from "../components/ProductCard"
import { Reveal } from "../components/Reveal"
import { useStore } from "../store"

const heroSlides: HeroSlide[] = [
  { kind: "image", src: "/media/hero-walk.jpg" },
  { kind: "video", src: "/media/hero-film.mp4" },
  { kind: "image", src: "/media/cat-women.jpg" },
]

export function Home() {
  const { tx, lang } = useStore()
  const products = useProducts()
  const home = useContent<{
    hero?: {
      headline?: string
      subheadline?: string
      buttonText?: string
      buttonLink?: string
      slides?: HeroSlide[]
      imageUrl?: string
    }
    brandStory?: {
      title?: string
      content?: string
      imageUrl?: string
    }
  }>("/content/home")
  const hero = home?.[lang]?.hero ?? home?.en?.hero
  const craftImg = home?.[lang]?.brandStory?.imageUrl || home?.en?.brandStory?.imageUrl || "/media/leather-craft.jpg"
  const [gender, setGender] = useState<Gender | "all">("all")
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const visible = products.filter((item) => gender === "all" || item.gender === gender)

  function subscribe(event: FormEvent) {
    event.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
  }

  return (
    <>
      <Hero slides={hero?.slides || heroSlides}>
        {(dots) => (
          <>
            <h1 className="mt-5 text-5xl leading-[0.95] font-medium tracking-tight md:text-7xl">
              {hero?.headline || (
                <>
                  {tx("leather")}
                  <br />
                  {tx("cut.for.you")}
                </>
              )}
            </h1>
            <p className="mt-4 max-w-[36ch] text-xl text-white/90">
              {hero?.subheadline || tx("jackets.sneakers.bags.and.belts")}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link to={hero?.buttonLink || "/catalog"} className="btn">
                {hero?.buttonText || tx("shop")}
              </Link>
              <Link to="/tailoring" className="btn btn-on-dark">
                {tx("tailoring")}
              </Link>
              <div className="ml-auto">{dots}</div>
            </div>
          </>
        )}
      </Hero>

      <section className="mx-auto w-full max-w-[1400px] px-4 py-12 md:px-8 md:py-16">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-3xl tracking-tight">Collection</h2>
          <Link to={gender === "all" ? "/catalog" : `/catalog?gender=${gender}`} className="inline-flex items-center gap-2 text-xl">
            {tx("shop.all")}
            <ArrowRight size={14} />
          </Link>
        </div>
        <div className="mt-8 flex items-center justify-center gap-3 text-xl">
          <FilterTab
            active={gender === "women"}
            onClick={() => setGender(gender === "women" ? "all" : "women")}
          >
            {tx("nav.women")}
          </FilterTab>
          <span className="text-muted" aria-hidden="true">
            /
          </span>
          <FilterTab
            active={gender === "men"}
            onClick={() => setGender(gender === "men" ? "all" : "men")}
          >
            {tx("nav.men")}
          </FilterTab>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
          {visible.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Link to={gender === "all" ? "/catalog" : `/catalog?gender=${gender}`} className="btn">
            {tx("shop.all")}
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="overflow-hidden py-8 md:py-14">
        <div className="grid items-center md:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]">
          <div className="edge-fade relative">
            <img
              src={craftImg}
              alt=""
              className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl"
            />
            <img
              src={craftImg}
              alt={tx("leather.being.cut.in.the")}
              className="relative aspect-[4/3] w-full object-cover md:aspect-auto md:h-[540px]"
            />
          </div>
          <Reveal className="px-4 py-10 md:pr-[max(2rem,calc((100vw-1400px)/2))] md:pl-6">
            <h2 className="mt-5 text-5xl leading-[0.95] font-medium tracking-tight md:text-7xl">
              {tx("if.the.size.is.gone")}
            </h2>
            <p className="mt-4 max-w-[36ch] text-xl text-muted">
              {tx("we.will.make.the.piece")}
            </p>
            <Link to="/tailoring" className="btn mt-6">
              {tx("tailoring")}
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="px-4 py-24 md:py-36">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <p className="text-xl tracking-[0.22em] text-accent uppercase">Yolians</p>
          <h2 className="mt-5 text-5xl leading-[0.95] font-medium tracking-tight md:text-7xl">
            {tx("subscribe")}
            <span className="mt-1 block">{tx("to.our.newsletter")}</span>
          </h2>
          <p className="mt-6 max-w-[34ch] text-xl text-muted">
            {tx("new.pieces.and.tailoring.dates")}
          </p>
          {subscribed ? (
            <p className="mt-12 text-xl">{tx("you.are.on.the.list")}</p>
          ) : (
            <form
              onSubmit={subscribe}
              className="mt-12 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:items-center sm:border sm:border-line sm:p-1.5"
            >
              <label className="sr-only" htmlFor="newsletter-email">
                Email
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
                className="control sm:h-12 sm:flex-1 sm:border-0"
              />
              <button type="submit" className="btn w-full sm:w-auto">
                {tx("subscribe.2")}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}

function FilterTab({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: string
}) {
  return (
    <button
      onClick={onClick}
      className={active ? "font-medium text-accent underline decoration-2 underline-offset-8" : "text-muted"}
    >
      {children}
    </button>
  )
}
