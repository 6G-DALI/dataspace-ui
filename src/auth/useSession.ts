import { useSyncExternalStore } from 'react'
import { getSession, subscribe, type Session } from './session'

/** The current sign-in state; re-renders when it changes (e.g. a failed token refresh). */
export function useSession(): Session {
  return useSyncExternalStore(subscribe, getSession)
}
