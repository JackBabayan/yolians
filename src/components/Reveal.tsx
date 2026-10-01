import type { ReactNode } from "react"

export function Reveal({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={className ? `reveal ${className}` : "reveal"}>{children}</div>
}
