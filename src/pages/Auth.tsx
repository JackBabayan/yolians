import { type FormEvent, type ReactNode, useEffect, useState } from "react"
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { TextField } from "../components/form"
import { Loader } from "../components/Loader"
import { useStore } from "../store"

export function Login() {
  const { tx, login } = useStore()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    const message = await login(email, password)
    setBusy(false)
    if (message) {
      setError(message)
      return
    }
    navigate("/account")
  }

  return (
    <AuthShell title={tx("sign.in.2")}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <TextField label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <TextField label={tx("password")} type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        <Link to="/forgot-password" className="text-xl text-muted">
          {tx("forgot.password")}
        </Link>
        {error ? <p className="text-xl text-[#8f2d2d]">{error}</p> : null}
        {busy ? <Loader label={tx("loading")} /> : null}
        <button type="submit" className="btn w-full" disabled={busy}>
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
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || form.password.length < 4) {
      setError(tx("first.name.last.name.email"))
      return
    }
    setBusy(true)
    const message = await register({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email,
      password: form.password,
      phone: "",
      addresses: [],
      cards: [],
    })
    setBusy(false)
    if (message) {
      setError(message)
      return
    }
    navigate("/account")
  }

  return (
    <AuthShell title={tx("create.account.2")}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <TextField label={tx("first.name")} value={form.firstName} onChange={(event) => setForm({ ...form, firstName: event.target.value })} />
        <TextField label={tx("last.name")} value={form.lastName} onChange={(event) => setForm({ ...form, lastName: event.target.value })} />
        <TextField label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <TextField label={tx("password")} type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        {error ? <p className="text-xl text-[#8f2d2d]">{error}</p> : null}
        {busy ? <Loader label={tx("loading")} /> : null}
        <button type="submit" className="btn w-full" disabled={busy}>
          {tx("create.account")}
        </button>
        <Link to="/login" className="text-xl text-muted">
          {tx("already.have.an.account")}
        </Link>
      </form>
    </AuthShell>
  )
}

export function ForgotPassword() {
  const { tx, requestPasswordReset } = useStore()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    const message = await requestPasswordReset(email)
    setBusy(false)
    if (message) {
      setError(message)
      return
    }
    setSent(true)
  }

  return (
    <AuthShell title={tx("reset.password")}>
      {sent ? (
        <p className="text-xl">{tx("reset.link.sent")}</p>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-4">
          <TextField label="Email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          {error ? <p className="text-xl text-[#8f2d2d]">{error}</p> : null}
          {busy ? <Loader label={tx("loading")} /> : null}
          <button type="submit" className="btn w-full" disabled={busy}>
            {tx("send.reset.link")}
          </button>
        </form>
      )}
      <Link to="/login" className="mt-4 inline-block text-xl text-muted">
        {tx("sign.in")}
      </Link>
    </AuthShell>
  )
}

export function ResetPassword() {
  const { tx, resetPassword } = useStore()
  const token = useAuthToken()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (password !== confirm) {
      setError(tx("passwords.do.not.match"))
      return
    }
    setBusy(true)
    const message = await resetPassword(token, password)
    setBusy(false)
    if (message) {
      setError(message)
      return
    }
    setDone(true)
  }

  return (
    <AuthShell title={tx("reset.password")}>
      {!token ? (
        <p className="text-xl text-[#8f2d2d]">{tx("reset.link.invalid")}</p>
      ) : done ? (
        <p className="text-xl">{tx("password.updated")}</p>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-4">
          <TextField label={tx("password")} type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} />
          <TextField label={tx("confirm.password")} type="password" autoComplete="new-password" value={confirm} onChange={(event) => setConfirm(event.target.value)} />
          {error ? <p className="text-xl text-[#8f2d2d]">{error}</p> : null}
          {busy ? <Loader label={tx("loading")} /> : null}
          <button type="submit" className="btn w-full" disabled={busy}>
            {tx("save.password")}
          </button>
        </form>
      )}
      <Link to="/login" className="mt-4 inline-block text-xl text-accent">
        {tx("sign.in")}
      </Link>
    </AuthShell>
  )
}

export function VerifyEmail() {
  const { tx, verifyEmail, resendVerification } = useStore()
  const token = useAuthToken()
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(Boolean(token))
  const [email, setEmail] = useState("")
  const [resendError, setResendError] = useState("")
  const [resent, setResent] = useState(false)
  const [resending, setResending] = useState(false)

  useEffect(() => {
    if (!token) return
    let gone = false
    verifyEmail(token).then((message) => {
      if (gone) return
      setBusy(false)
      if (message) setError(message)
      else setDone(true)
    })
    return () => {
      gone = true
    }
  }, [token, verifyEmail])

  async function resend(event: FormEvent) {
    event.preventDefault()
    setResending(true)
    const message = await resendVerification(email)
    setResending(false)
    if (message) {
      setResendError(message)
      return
    }
    setResent(true)
  }

  return (
    <AuthShell title={tx("confirm.email")}>
      {busy ? <Loader label={tx("loading")} /> : null}
      {done ? <p className="text-xl">{tx("email.confirmed")}</p> : null}
      {error ? <p className="text-xl text-[#8f2d2d]">{error}</p> : null}
      {!busy && !done ? (
        resent ? (
          <p className={`text-xl ${error ? "mt-6" : ""}`}>{tx("verification.sent")}</p>
        ) : (
          <form onSubmit={resend} className={`flex flex-col gap-4 ${error ? "mt-6" : ""}`}>
            <TextField label="Email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            {resendError ? <p className="text-xl text-[#8f2d2d]">{resendError}</p> : null}
            {resending ? <Loader label={tx("loading")} /> : null}
            <button type="submit" className="btn w-full" disabled={resending}>
              {tx("resend.verification")}
            </button>
          </form>
        )
      ) : null}
      <Link to="/login" className="mt-4 inline-block text-xl text-accent">
        {tx("sign.in")}
      </Link>
    </AuthShell>
  )
}

function useAuthToken() {
  const [params] = useSearchParams()
  const { token } = useParams()
  return params.get("token") || token || ""
}

function AuthShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-12">
      <h1 className="text-4xl tracking-tight">{title}</h1>
      <div className="mt-8">{children}</div>
    </div>
  )
}
