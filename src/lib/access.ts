/**
 * Who may see a record — the same rule the orchestrator and s3-asset-monitor
 * apply when they write to piveau (dataops-toolstack `piveau_access.py`):
 *
 *   dct:accessRights PUBLIC      → public      anyone
 *   dct:accessRights RESTRICTED  → restricted  any signed-in user
 *   dct:accessRights NON_PUBLIC  → internal    members of the catalogue
 *
 * and a record gets the stricter of its own level and its catalogue's. piveau
 * enforces it; the UI only labels it.
 */

export type AccessLevel = 'public' | 'restricted' | 'internal'

const RANK: Record<AccessLevel, number> = { public: 0, restricted: 1, internal: 2 }

/** Level for a dct:accessRights IRI or a hub-search label; null when it names none. */
export function levelOf(rights: string | null | undefined): AccessLevel | null {
  if (!rights) return null
  const name = rights.replace(/\/+$/, '').split(/[/#]/).pop()!.toUpperCase().replace(/-/g, '_')
  if (name === 'PUBLIC') return 'public'
  if (name === 'RESTRICTED') return 'restricted'
  if (name === 'NON_PUBLIC' || name === 'INTERNAL') return 'internal'
  return null
}

/** The stricter of the levels given; public when none is known. */
export function stricter(...levels: (AccessLevel | null | undefined)[]): AccessLevel {
  let out: AccessLevel = 'public'
  for (const l of levels) if (l && RANK[l] > RANK[out]) out = l
  return out
}

export const ACCESS_LABEL: Record<AccessLevel, string> = {
  public: 'Public',
  restricted: 'Signed-in users',
  internal: 'Members only',
}

export const ACCESS_HELP: Record<AccessLevel, string> = {
  public: 'Visible to everyone.',
  restricted: 'Visible to anyone signed in with a 6G-DALI account.',
  internal: 'Visible only to members of this catalogue.',
}
