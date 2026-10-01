import { Link } from "react-router-dom"
import type { Product } from "../data"
import { useStore } from "../store"
import { ArrowRight } from "./icons"
import { ProductCard } from "./ProductCard"

export function ProductRail({ title, products }: { title: string; products: Product[] }) {
  const { tx } = useStore()
  if (products.length === 0) return null

  return (
    <section className="mt-16 border-t border-line pt-12">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-3xl tracking-tight">{title}</h2>
        <Link to="/catalog" className="inline-flex items-center gap-2 text-xl">
          {tx("shop.collection")}
          <ArrowRight size={14} />
        </Link>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
