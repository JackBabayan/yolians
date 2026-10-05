export function Loader({ label, className }: { label?: string; className?: string }) {
  return (
    <div className={className ? `loader ${className}` : "loader"} role="status" aria-label={label}>
      <span className="loader-track">
        <span className="loader-fill" />
      </span>
    </div>
  )
}
