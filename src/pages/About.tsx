import { ArrowLeft, ArrowRight } from "../components/icons"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { motion, useReducedMotion } from "motion/react"
import { Reveal } from "../components/Reveal"
import { useContent } from "../content"
import { phrase, slideLabel } from "../i18n"
import { useStore } from "../store"

const holdMs = 6500

const chapters = [
  {
    image: "/media/leather-craft.jpg",
    title: phrase({ ru: "Раскрой", en: "The cut" }),
    body: phrase({
      ru: "Каждую вещь кроим вручную и небольшими партиями. Каталог короткий, чтобы было понятно, что выбрать.",
      en: "Each piece is cut by hand, in small runs. The catalog stays short so the choice stays clear.",
    }),
  },
  {
    image: "/media/jacket-cognac-detail.jpg",
    title: phrase({ ru: "Кожа", en: "The leather" }),
    body: phrase({
      ru: "Берём кожу с ровной лицевой стороной. Цвет партии не перекрашиваем под сезон.",
      en: "We use leather with an even face. A batch color is not redyed to chase a season.",
    }),
  },
  {
    image: "/media/jacket-black-collar.jpg",
    title: phrase({ ru: "Ателье", en: "The atelier" }),
    body: phrase({
      ru: "Шьём в Милане. Если нужного размера нет, делаем вещь отдельно. Мерки можно снять у вас.",
      en: "We sew in Milan. If a size is missing, we make the piece separately. Measuring can happen at your place.",
    }),
  },
  {
    image: "/media/hero-walk.jpg",
    title: phrase({ ru: "Посадка", en: "The fit" }),
    body: phrase({
      ru: "После примерки поправляем посадку. Для своего кроя есть отдельный пошив.",
      en: "After a fitting we adjust the shape. A cut of your own is made through tailoring.",
    }),
  },
  {
    image: "/media/belt-buckle.jpg",
    title: phrase({ ru: "Фурнитура", en: "The hardware" }),
    body: phrase({
      ru: "Пряжки, молнии и швы подбираем под кожу. Мелочь держит весь силуэт.",
      en: "Buckles, zips and seams are chosen for the leather. The small parts hold the whole silhouette.",
    }),
  },
] as const

const portraits = [
  {
    image: "/media/jacket-cognac-front.jpg",
    caption: phrase({
      ru: "Ателье в Милане. Если нужного размера нет, сошьём отдельно. Замер можно снять у вас.",
      en: "The atelier is in Milan. If a size is missing, we make it separately. Measuring can happen at your place.",
    }),
  },
  {
    image: "/media/jacket-black-front.jpg",
    caption: phrase({
      ru: "Берём кожу с ровной лицевой стороной. Цвет партии не перекрашиваем под сезон.",
      en: "We use leather with an even face. A batch color is not redyed to chase a season.",
    }),
  },
  {
    image: "/media/bag-emerald-front.jpg",
    caption: phrase({
      ru: "Сумки шьём небольшими партиями, в той же мастерской, что и куртки.",
      en: "Bags are made in small runs, in the same atelier as the jackets.",
    }),
  },
  {
    image: "/media/prod-sneakers-white.jpg",
    caption: phrase({
      ru: "Кеды из той же кожи. Если размера нет, пару можно сшить отдельно.",
      en: "Sneakers use the same leather. A missing size can be made separately.",
    }),
  },
  {
    image: "/media/prod-belt.jpg",
    caption: phrase({
      ru: "Ремни кроим из той же кожи, тоже короткими партиями.",
      en: "Belts are cut from the same leather, also in short runs.",
    }),
  },
] as const

const frames = [
  { src: "/media/ig-collar.jpg", caption: phrase({ ru: "Ворот", en: "Collar" }) },
  { src: "/media/jacket-cognac-side.jpg", caption: phrase({ ru: "Силуэт", en: "Silhouette" }) },
  { src: "/media/bag-emerald-detail.jpg", caption: phrase({ ru: "Сумка", en: "Bag" }) },
  { src: "/media/sneaker-black-sole.jpg", caption: phrase({ ru: "Подошва", en: "Sole" }) },
  { src: "/media/belt-holes.jpg", caption: phrase({ ru: "Ремень", en: "Belt" }) },
  { src: "/media/bag-black-open.jpg", caption: phrase({ ru: "Внутри", en: "Inside" }) },
] as const

const closeLine = phrase({
  ru: "Посмотрите вещи или закажите свой крой.",
  en: "See the pieces, or order your own cut.",
})

const previousLabel = phrase({ ru: "Предыдущая глава", en: "Previous chapter" })
const nextLabel = phrase({ ru: "Следующая глава", en: "Next chapter" })
const previousFrame = phrase({ ru: "Предыдущий кадр", en: "Previous frame" })
const nextFrame = phrase({ ru: "Следующий кадр", en: "Next frame" })
const detailsLabel = phrase({ ru: "Детали", en: "Details" })

export function About() {
  const { lang, tx } = useStore()
  const about = useContent<{
    storyTitle?: string
    storyText?: string
    craftsmanshipSteps?: { title: string; image: string; body: string }[]
    editorialGallery?: { image: string; caption: string }[]
    frames?: { src: string; caption: string }[]
  }>("/content/about")
  const copy = about?.[lang] ?? about?.en
  const story = copy?.craftsmanshipSteps?.length
    ? copy.craftsmanshipSteps
    : chapters.map((item) => ({ image: item.image, title: item.title[lang], body: item.body[lang] }))
  const gallery = copy?.editorialGallery?.length
    ? copy.editorialGallery
    : portraits.map((item) => ({ image: item.image, caption: item.caption[lang] }))
  const frameList = copy?.frames?.length
    ? copy.frames.map((item) => ({ src: item.src, caption: item.caption }))
    : frames.map((item) => ({ src: item.src, caption: item.caption[lang] }))

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 md:px-8">
      <header className="grid h-[calc(100dvh-8rem)] min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-6 pb-10 md:h-[calc(100dvh-10rem)] md:pb-16 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.92fr)] lg:grid-rows-1 lg:gap-10">
        <div className="flex h-full min-h-0 flex-col">
          <Mark />
          <h1 className="mt-1 max-w-[10ch] text-4xl tracking-tight md:text-6xl lg:text-7xl">{copy?.storyTitle || tx("our.story")}</h1>
          <p className="mt-4 max-w-[38ch] text-xl leading-relaxed text-muted">
            {copy?.storyText || tx("yolians.makes.leather.pieces.in")}
          </p>
        </div>
        <Portrait slides={gallery} />
      </header>

      <Story chapters={story} />

      <section className="mt-16 md:mt-24" aria-label={detailsLabel[lang]}>
        <h2 className="text-3xl tracking-tight md:text-4xl">{detailsLabel[lang]}</h2>
        <ul className="mt-6 flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
          {frameList.map((frame) => (
            <Frame key={frame.src} frame={frame} />
          ))}
        </ul>
      </section>

      <section className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-line pt-10 md:mt-24 md:flex-row md:items-end">
        <h2 className="max-w-[16ch] text-4xl tracking-tight md:text-5xl">{closeLine[lang]}</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/catalog" className="btn">{tx("shop")}</Link>
          <Link to="/tailoring" className="btn btn-line">{tx("tailoring")}</Link>
        </div>
      </section>
    </div>
  )
}

function Mark() {
  const slotRef = useRef<HTMLDivElement>(null)
  const wordRef = useRef<HTMLParagraphElement>(null)

  useLayoutEffect(() => {
    const slot = slotRef.current
    const word = wordRef.current
    if (!slot || !word) return
    const fit = () => {
      const available = slot.clientHeight
      if (available < 8) return
      word.style.letterSpacing = "0.14em"
      word.style.fontSize = "100px"
      const natural = word.getBoundingClientRect().height
      if (natural < 1) return
      word.style.fontSize = `${(available / natural) * 68}px`
    }
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(slot)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={slotRef} className="hidden min-h-0 w-max max-w-full flex-1 overflow-hidden lg:block">
      <p ref={wordRef} aria-hidden="true" className="[writing-mode:vertical-rl] leading-none text-accent uppercase">
        Yolians
      </p>
    </div>
  )
}

function useSlide(length: number) {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduce || length < 2) return
    const id = window.setTimeout(() => {
      setIndex((current) => (current + 1) % length)
    }, holdMs)
    return () => window.clearTimeout(id)
  }, [reduce, index, length])

  function step(delta: number) {
    setIndex((current) => (current + delta + length) % length)
  }

  return { index: length > 0 ? index % length : 0, setIndex, step, reduce }
}

function Portrait({ slides }: { slides: { image: string; caption: string }[] }) {
  const { lang } = useStore()
  const { index, setIndex, step, reduce } = useSlide(slides.length)
  const slide = slides[index]

  return (
    <section className="flex h-full min-h-0 flex-col justify-start" aria-roledescription="carousel" aria-label={slide?.caption ?? ""}>
      <div className="relative min-h-0 flex-1 overflow-hidden bg-white">
        {slides.map((item, itemIndex) => {
          const active = itemIndex === index
          return (
            <img
              key={item.image}
              src={item.image}
              alt={active ? item.caption : ""}
              aria-hidden={!active}
              className={`absolute inset-0 h-full w-full object-contain object-top transition-opacity duration-700 motion-reduce:transition-none ${active ? "opacity-100" : "opacity-0"}`}
            />
          )
        })}
      </div>
      <motion.p
        key={slide.image}
        className="mt-3 shrink-0 max-w-[36ch] text-sm leading-relaxed text-muted"
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {slide?.caption}
      </motion.p>
      <div className="mt-3 flex shrink-0 items-center gap-3">
        <button
          type="button"
          aria-label={previousFrame[lang]}
          className="grid size-10 place-items-center border border-accent text-accent hover:bg-accent/10"
          onClick={() => step(-1)}
        >
          <ArrowLeft size={16} />
        </button>
        <button
          type="button"
          aria-label={nextFrame[lang]}
          className="grid size-10 place-items-center border border-accent text-accent hover:bg-accent/10"
          onClick={() => step(1)}
        >
          <ArrowRight size={16} />
        </button>
        <div className="ml-auto flex items-center gap-2">
          {slides.map((item, itemIndex) => (
            <button
              key={item.image}
              type="button"
              aria-label={slideLabel(itemIndex + 1, lang)}
              aria-current={itemIndex === index ? "true" : undefined}
              onClick={() => setIndex(itemIndex)}
              className={`h-1.5 ${itemIndex === index ? "w-8 bg-accent" : "w-1.5 bg-accent/30"}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function Frame({ frame }: { frame: { src: string; caption: string | (typeof frames)[number]["caption"] } }) {
  const { lang } = useStore()
  const caption = typeof frame.caption === "string" ? frame.caption : frame.caption[lang]
  return (
    <li className="w-[74%] shrink-0 snap-start sm:w-[46%] lg:w-[28%]">
      <Reveal>
        <figure>
          <div className="overflow-hidden">
            <img
              src={frame.src}
              alt={caption}
              className="aspect-[3/4] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04] motion-reduce:transition-none motion-reduce:hover:scale-100"
            />
          </div>
          <figcaption className="mt-3 text-sm text-muted">{caption}</figcaption>
        </figure>
      </Reveal>
    </li>
  )
}

function Story({ chapters: slides }: { chapters: { image: string; title: string; body: string }[] }) {
  const { lang } = useStore()
  const { index, setIndex, step, reduce } = useSlide(slides.length)
  const chapter = slides[index]

  return (
      <section className="mt-16 md:mt-24" aria-roledescription="carousel" aria-label={chapter?.title ?? ""}>
      <div className="grid overflow-hidden bg-[#f4f6f6] lg:grid-cols-[1.25fr_0.75fr]">
        <div className="relative min-h-[420px] md:min-h-[560px]">
          {slides.map((item, itemIndex) => {
            const active = itemIndex === index
            return (
              <img
                key={item.image}
                src={item.image}
                alt={active ? item.title : ""}
                aria-hidden={!active}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 motion-reduce:transition-none ${active ? "opacity-100" : "opacity-0"}`}
              />
            )
          })}
        </div>
        <div className="flex flex-col justify-between gap-8 p-6 md:p-10">
          <p className="text-sm tracking-[0.18em] text-muted uppercase">
            {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </p>
          <motion.div
            key={chapter?.title}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-4xl tracking-tight md:text-5xl">{chapter?.title}</h2>
            <p className="mt-4 max-w-[34ch] text-xl leading-relaxed text-muted">{chapter?.body}</p>
          </motion.div>
          <div>
            <div className="mb-5 h-px bg-line">
              {reduce ? <span className="block h-px w-full bg-accent" /> : <span key={index} className="story-progress w-full" />}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label={previousLabel[lang]}
                className="grid size-12 place-items-center border border-accent text-accent hover:bg-white"
                onClick={() => step(-1)}
              >
                <ArrowLeft size={16} />
              </button>
              <button
                type="button"
                aria-label={nextLabel[lang]}
                className="grid size-12 place-items-center border border-accent text-accent hover:bg-white"
                onClick={() => step(1)}
              >
                <ArrowRight size={16} />
              </button>
              <div className="ml-auto flex items-center gap-2">
                {slides.map((item, itemIndex) => (
                  <button
                    key={item.title}
                    type="button"
                    aria-label={slideLabel(itemIndex + 1, lang)}
                    aria-current={itemIndex === index ? "true" : undefined}
                    onClick={() => setIndex(itemIndex)}
                    className={`h-1.5 ${itemIndex === index ? "w-8 bg-accent" : "w-1.5 bg-accent/30"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
