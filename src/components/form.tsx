import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react"

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <label className="flex flex-col gap-2 text-xl">
      <span>{label}</span>
      {children}
      {error ? <span className="text-xl text-[#8f2d2d]">{error}</span> : null}
    </label>
  )
}

type FieldProps = {
  label: string
  error?: string
}

export function TextField({ label, error, ...props }: FieldProps & Omit<InputHTMLAttributes<HTMLInputElement>, "className">) {
  return (
    <Field label={label} error={error}>
      <input className="control" {...props} aria-invalid={error ? true : undefined} />
    </Field>
  )
}

export function SelectField({
  label,
  error,
  children,
  ...props
}: FieldProps & Omit<SelectHTMLAttributes<HTMLSelectElement>, "className">) {
  return (
    <Field label={label} error={error}>
      <select className="control" {...props} aria-invalid={error ? true : undefined}>
        {children}
      </select>
    </Field>
  )
}

export function TextAreaField({
  label,
  error,
  ...props
}: FieldProps & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className">) {
  return (
    <Field label={label} error={error}>
      <textarea className="control h-36 rounded-3xl py-4" rows={4} {...props} aria-invalid={error ? true : undefined} />
    </Field>
  )
}
