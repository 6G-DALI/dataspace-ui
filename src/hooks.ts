import { useEffect, useState, type DependencyList } from 'react'
import { getCatalogueExtras, listCatalogues, type SearchCatalogue } from './api/piveau'
import type { CatalogueExtras } from './lib/record'

export interface Async<T> {
  data: T | undefined
  error: string | null
  loading: boolean
}

/**
 * Runs `load` whenever `deps` change and keeps the latest answer. A newer run
 * aborts the older one, so a slow response can never overwrite a newer one.
 */
export function useAsync<T>(load: (signal: AbortSignal) => Promise<T>, deps: DependencyList): Async<T> {
  const [state, setState] = useState<Async<T>>({ data: undefined, error: null, loading: true })
  useEffect(() => {
    const ctrl = new AbortController()
    setState(s => ({ data: s.data, error: null, loading: true }))
    load(ctrl.signal).then(
      data => { if (!ctrl.signal.aborted) setState({ data, error: null, loading: false }) },
      (e: Error) => {
        if (ctrl.signal.aborted || e.name === 'AbortError') return
        setState({ data: undefined, error: e.message || String(e), loading: false })
      },
    )
    return () => ctrl.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return state
}

/** Every catalogue the caller can see (hub-search applies the token). */
export function useCatalogues(): Async<SearchCatalogue[]> {
  return useAsync(signal => listCatalogues(signal), [])
}

/** A catalogue's logo, country and access rights; undefined while loading, null if unavailable. */
export function useCatalogueExtras(id: string | null | undefined): CatalogueExtras | null | undefined {
  const [extras, setExtras] = useState<CatalogueExtras | null | undefined>(undefined)
  useEffect(() => {
    let live = true
    setExtras(undefined)
    if (!id) { setExtras(null); return }
    getCatalogueExtras(id).then(x => { if (live) setExtras(x) })
    return () => { live = false }
  }, [id])
  return extras
}
