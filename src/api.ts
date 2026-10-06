const TOKEN_KEY = "yolians-token"

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export async function api<T>(
  path: string,
  options?: { method?: string; body?: unknown; token?: string | null; auth?: boolean },
): Promise<T> {
  const headers = new Headers({ Accept: "application/json" })
  if (options?.body !== undefined) headers.set("Content-Type", "application/json")
  const token = options?.auth === false ? null : options?.token !== undefined ? options.token : getToken()
  if (token) headers.set("Authorization", `Bearer ${token}`)
  const response = await fetch(`/api${path}`, {
    method: options?.method ?? "GET",
    headers,
    body: options?.body === undefined ? undefined : JSON.stringify(options.body),
  })
  const data = (await response.json().catch(() => ({}))) as {
    error?: unknown
    message?: unknown
    errors?: { message?: unknown }[]
  }
  if (!response.ok) {
    const nested = data.errors?.find((item) => typeof item.message === "string")?.message
    const message =
      typeof data.error === "string"
        ? data.error
        : typeof data.message === "string"
          ? data.message
          : typeof nested === "string"
            ? nested
            : response.statusText
    throw new ApiError(response.status, message)
  }
  return data as T
}
