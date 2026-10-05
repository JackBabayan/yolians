import { useEffect, useSyncExternalStore } from "react"
import { api } from "./api"

const cache = new Map<string, { en: unknown; ru: unknown }>()
const pending = new Set<string>()
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function loadContent(path: string) {
  if (cache.has(path) || pending.has(path)) return
  pending.add(path)
  Promise.all([
    api<unknown>(`${path}?locale=en`, { auth: false }),
    api<unknown>(`${path}?locale=ru`, { auth: false }),
  ])
    .then(([en, ru]) => {
      cache.set(path, { en, ru })
      pending.delete(path)
      listeners.forEach((listener) => listener())
    })
    .catch(() => {
      pending.delete(path)
    })
}

export function useContent<T>(path: string) {
  const value = useSyncExternalStore(
    subscribe,
    () => cache.get(path) ?? null,
    () => cache.get(path) ?? null,
  )
  useEffect(() => {
    loadContent(path)
  }, [path])
  return value as { en: T; ru: T } | null
}
