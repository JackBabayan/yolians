import { type FormEvent, type ReactNode, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { TextField } from "../components/form"
import { useStore } from "../store"

export function Login() {
  const { tx, login } = useStore()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  function submit(event: FormEvent) {
    event.preventDefault()
    const message = login(email, password)
    if (message) {
      setError(message)
      return
    }
    navigate("/account")
  }

  return (
    <AuthShell title={tx("sign.in.2")}>
      <form onSubmit={submit} className="flex flex-col gap-5">
        <TextField label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <TextField label={tx("password")} type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        {error ? <p className="text-xl text-[#8f2d2d]">{error}</p> : null}
        <button type="submit" className="btn w-full">
          {tx("sign.in")}
        </button>
        <Link to="/register" className="text-xl text-accent">
          {tx("create.account")}
        </Link>
      </form>
    </AuthShell>
  )
}

export function Register() {
  const { tx, register } = useStore()
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" })
  const [error, setError] = useState("")

  function submit(event: FormEvent) {
    event.preventDefault()
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || form.password.length < 4) {
      setError(tx("first.name.last.name.email"))
      return
    }
    const message = register({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email,
      password: form.password,
      phone: "",
      addresses: [],
      cards: [],
    })
    if (message) {
      setError(message)
      return
    }
    navigate("/account")
  }

  return (
    <AuthShell title={tx("create.account.2")}>
      <form onSubmit={submit} className="flex flex-col gap-5">
        <TextField label={tx("first.name")} value={form.firstName} onChange={(event) => setForm({ ...form, firstName: event.target.value })} />
        <TextField label={tx("last.name")} value={form.lastName} onChange={(event) => setForm({ ...form, lastName: event.target.value })} />
        <TextField label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <TextField label={tx("password")} type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        {error ? <p className="text-xl text-[#8f2d2d]">{error}</p> : null}
        <button type="submit" className="btn w-full">
          {tx("create.account")}
        </button>
        <Link to="/login" className="text-xl text-muted">
          {tx("already.have.an.account")}
        </Link>
      </form>
    </AuthShell>
  )
}

function AuthShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-12">
      <h1 className="text-4xl tracking-tight">{title}</h1>
      <div className="mt-8">{children}</div>
    </div>
  )
}
