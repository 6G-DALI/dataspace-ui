import { createKeycloak, usernameOf } from '@6g-dali/ui-shell'
import { config } from '../config'

/**
 * Optional sign-in.
 *
 * The catalogue is public: every page works without an account, and nothing
 * forces a login. Signing in only widens what piveau returns — records that are
 * restricted to signed-in users, and those of catalogues the user is a member of
 * — because every request then carries the user's token and piveau decides.
 * Nothing here is an access control; hiding a button is a courtesy.
 *
 * Session discovery follows portal-ui, not `check-sso`: the tokens are kept in
 * sessionStorage and handed back to `keycloak.init()` on the next load, which
 * refreshes them with a plain fetch. `check-sso` needs a third-party-cookie
 * iframe that ad blockers, private windows and ITP routinely break. The cost is
 * a refresh token readable by scripts on this page, for the life of the tab —
 * the accepted trade-off for a public SPA client with no backend.
 *
 * A visitor who already has a Keycloak session (signed in to another app in the
 * same realm) is not recognised until they click "Sign in"; that round trip then
 * completes without asking for a password.
 */

const keycloak = createKeycloak(config)

const TOKENS_KEY = 'catalogue_kc_tokens'
const RETURN_KEY = 'catalogue_post_login_hash'

export interface Session {
  /** Keycloak answered at start-up (signed in or not). False: sign-in is unavailable. */
  ready: boolean
  authenticated: boolean
  username: string | null
}

let session: Session = { ready: false, authenticated: false, username: null }
const listeners = new Set<() => void>()

function publish(next: Session) {
  session = next
  for (const l of listeners) l()
}

export function getSession(): Session {
  return session
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

/** The page itself without the hash: the hash is the router's, the query Keycloak's. */
export function redirectUri(): string {
  return window.location.origin + window.location.pathname
}

function storedTokens(): { token: string; refreshToken: string; idToken?: string } | null {
  try {
    const raw = sessionStorage.getItem(TOKENS_KEY)
    if (!raw) return null
    const t = JSON.parse(raw) as { token?: string; refreshToken?: string; idToken?: string }
    return t.token && t.refreshToken ? { token: t.token, refreshToken: t.refreshToken, idToken: t.idToken } : null
  } catch {
    return null
  }
}

function persistTokens() {
  if (!keycloak.token || !keycloak.refreshToken) return
  try {
    sessionStorage.setItem(TOKENS_KEY, JSON.stringify({
      token: keycloak.token, refreshToken: keycloak.refreshToken, idToken: keycloak.idToken,
    }))
  } catch { /* storage unavailable: the session lasts until reload */ }
}

function clearTokens() {
  try { sessionStorage.removeItem(TOKENS_KEY) } catch { /* nothing stored */ }
}

function signedOut() {
  clearTokens()
  keycloak.clearToken()
  publish({ ready: session.ready, authenticated: false, username: null })
}

/**
 * Starts the adapter. Never throws: if Keycloak is unreachable or misconfigured
 * the catalogue still works, anonymously, with sign-in disabled.
 */
export async function initSession(): Promise<void> {
  // PKCE needs crypto.subtle, which the browser only exposes in a secure
  // context (HTTPS, or localhost). Without it keycloak-js fails with a message
  // that names none of this; the public pages do not need it at all.
  if (!window.isSecureContext || !window.crypto?.subtle) {
    console.warn('Sign-in disabled: this page is not served over HTTPS.')
    return
  }
  const returning = /[?&](code|error)=/.test(window.location.search)
  try {
    const authenticated = await keycloak.init({
      ...(returning ? {} : storedTokens() ?? {}),
      pkceMethod: 'S256',
      responseMode: 'query',
      redirectUri: redirectUri(),
      checkLoginIframe: false,
      enableLogging: import.meta.env.DEV,
    })
    if (authenticated) persistTokens()
    else clearTokens()
    keycloak.onTokenExpired = () => {
      keycloak.updateToken(30).then(persistTokens).catch(signedOut)
    }
    publish({ ready: true, authenticated, username: authenticated ? usernameOf(keycloak) : null })
  } catch (err) {
    clearTokens()
    console.warn('Keycloak is unavailable; continuing without sign-in:', err)
  }
  restoreRoute()
}

/** Sign in, then come back to the page the visitor was on. */
export function login(): void {
  if (!session.ready) return
  try {
    if (window.location.hash) sessionStorage.setItem(RETURN_KEY, window.location.hash)
  } catch { /* the visitor lands on the home page instead */ }
  clearTokens()
  void keycloak.login({ redirectUri: redirectUri() })
}

export function logout(): void {
  try {
    if (window.location.hash) sessionStorage.setItem(RETURN_KEY, window.location.hash)
  } catch { /* lands on the home page */ }
  // Keycloak's logout ends the server-side session; the stored refresh token
  // would otherwise restore it on the next load.
  clearTokens()
  void keycloak.logout({ redirectUri: redirectUri() })
}

function restoreRoute() {
  try {
    const target = sessionStorage.getItem(RETURN_KEY)
    if (!target) return
    sessionStorage.removeItem(RETURN_KEY)
    if (window.location.hash !== target) window.location.hash = target
  } catch { /* nothing to restore */ }
}

/**
 * The bearer token for an API call, renewed when it has under 30 s left, or
 * null when nobody is signed in. A refresh that fails ends the session rather
 * than sending a stale token: the call then goes out anonymously.
 */
export async function accessToken(): Promise<string | null> {
  if (!session.authenticated) return null
  try {
    if (await keycloak.updateToken(30)) persistTokens()
    return keycloak.token ?? null
  } catch {
    signedOut()
    return null
  }
}
