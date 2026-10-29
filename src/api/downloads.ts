import { accessToken } from '../auth/session'
import { config } from '../config'
import { ApiError } from './piveau'

/**
 * A distribution's dcat:downloadURL is the file's raw Data Lake address, which a browser cannot open (the buckets
 * are private). The DataOps orchestrator signs a short-lived link for it, after reading the dataset from piveau as
 * this user, so only a dataset the user can see gives a link.
 */

/** Whether a download URL is a file in the catalogue's own Data Lake bucket (<endpoint>/<catalogue>/<key>). */
export function isDataLakeFile(url: string, catalogueId: string): boolean {
  if (!catalogueId) return false
  try {
    const u = new URL(url)
    const [bucket, ...key] = decodeURIComponent(u.pathname).replace(/^\/+/, '').split('/')
    return (u.protocol === 'http:' || u.protocol === 'https:') && !u.search && bucket === catalogueId
      && key.length > 0 && key[key.length - 1] !== ''
  } catch {
    return false
  }
}

export function signedDownloadsEnabled(): boolean {
  return !!config.downloadApiUrl
}

/** A signed link for one Data Lake file of a dataset, valid for a few minutes. */
export async function signedDownloadUrl(catalogueId: string, datasetId: string, url: string): Promise<string> {
  const query = new URLSearchParams({ catalogue: catalogueId, dataset: datasetId, url })
  const endpoint = `${config.downloadApiUrl.replace(/\/+$/, '')}/downloads/presign?${query}`
  const token = await accessToken()
  const send = (auth: boolean) =>
    fetch(endpoint, { headers: { Accept: 'application/json', ...(auth && token ? { Authorization: `Bearer ${token}` } : {}) } })
  let res: Response
  try {
    res = await send(true)
    if (res.status === 401 && token) res = await send(false)
  } catch {
    throw new ApiError(0, 'The download service could not be reached.')
  }
  if (!res.ok) {
    let detail = ''
    try { detail = ((await res.json()) as { detail?: string }).detail ?? '' } catch { /* not JSON */ }
    throw new ApiError(res.status, res.status === 404
      ? 'This file is not available to you. Sign in, or ask the dataset owner for access.'
      : detail || `The download could not be prepared (${res.status}).`)
  }
  return ((await res.json()) as { url: string }).url
}
