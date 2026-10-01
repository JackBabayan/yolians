import type { ReactNode } from "react"

export function Pill({
  children,
  onClick,
  type = "button",
}: {
  children: ReactNode
  onClick?: () => void
  type?: "button" | "submit"
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="btn"
    >
      {children}
    </button>
  )
}

export function LineButton({
  children,
  onClick,
  type = "button",
}: {
  children: ReactNode
  onClick?: () => void
  type?: "button" | "submit"
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="btn btn-line"
    >
      {children}
    </button>
  )
}
