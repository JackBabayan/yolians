import { Link } from "react-router-dom"
import { formatShipping, inStock, money, type Product } from "../data"
import { useStore } from "../store"

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { lang, tx } = useStore()
  const available = inStock(product)

  return (
    <Link
      to={`/product/${product.id}`}
      className="product-card block"
      style={{ animationDelay: `${(index % 8) * 55}ms` }}
    >
      <div className="aspect-square bg-white">
        <img
          src={product.image}
          alt={product.name[lang]}
          className="h-full w-full object-contain"
        />
      </div>
      <p className="mt-3 text-xl tracking-tight">{product.name[lang]}</p>
      <p className="mt-1 text-xl">{money(product.price)}</p>
      <p className="mt-1 text-sm text-muted">
        {tx("nav.shipping")} {formatShipping(product.shipping, lang).toLowerCase()}
      </p>
      {available ? null : (
        <p className="mt-1 text-xl text-accent">
          {tx("made.to.order")}
        </p>
      )}
    </Link>
  )
}
