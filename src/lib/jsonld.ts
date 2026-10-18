/**
 * Just enough JSON-LD to read the records hub-repo returns.
 *
 * hub-repo compacts its output: keys come back as `dct:title` for prefixes in
 * its `@context` and as full IRIs for the rest (the GAIA-X and DALI terms), and
 * a value is a string, `{ "@value" }`, `{ "@id" }` or an array of those. The
 * graph is normalised once — every key and type expanded to a full IRI — so the
 * readers below never have to guess which spelling a record used.
 */

export const NS = {
  dct: 'http://purl.org/dc/terms/',
  dcat: 'http://www.w3.org/ns/dcat#',
  dqv: 'http://www.w3.org/ns/dqv#',
  foaf: 'http://xmlns.com/foaf/0.1/',
  schema: 'https://schema.org/',
  prov: 'http://www.w3.org/ns/prov#',
  vcard: 'http://www.w3.org/2006/vcard/ns#',
  dali: 'https://dali-project.eu/ns#',
  gx: 'https://registry.lab.gaia-x.eu/v1/api/trusted-shape-registry/v1/shapes/jsonld/trustframework#',
} as const

export type Node = Record<string, unknown> & { '@id'?: string; '@type'?: string[] }

function expand(term: string, context: Record<string, string>): string {
  if (term.startsWith('@') || /^[a-z][a-z0-9+.-]*:\/\//i.test(term)) return term
  const i = term.indexOf(':')
  if (i > 0) {
    const prefix = term.slice(0, i)
    const base = context[prefix] ?? (NS as Record<string, string>)[prefix]
    if (base) return base + term.slice(i + 1)
  }
  return term
}

/** The `@graph` of a hub-repo response, keys and types expanded. */
export function graphOf(doc: unknown): Node[] {
  if (!doc || typeof doc !== 'object') return []
  const d = doc as { '@graph'?: unknown[]; '@context'?: unknown }
  const context: Record<string, string> = {}
  if (d['@context'] && typeof d['@context'] === 'object' && !Array.isArray(d['@context'])) {
    for (const [k, v] of Object.entries(d['@context'] as Record<string, unknown>)) {
      if (typeof v === 'string') context[k] = v
    }
  }
  const raw = Array.isArray(d['@graph']) ? d['@graph'] : [doc]
  return raw.filter((n): n is Record<string, unknown> => !!n && typeof n === 'object').map(n => {
    const out: Node = {}
    for (const [k, v] of Object.entries(n)) {
      if (k === '@context') continue
      if (k === '@type') {
        out['@type'] = ([] as unknown[]).concat(v).map(t => expand(String(t), context))
      } else {
        out[expand(k, context)] = v
      }
    }
    return out
  })
}

function asArray(v: unknown): unknown[] {
  return v === undefined || v === null ? [] : Array.isArray(v) ? v : [v]
}

function scalar(v: unknown): string | null {
  if (v === undefined || v === null) return null
  if (typeof v === 'string') return v
  if (typeof v === 'number' || typeof v === 'boolean') return String(v)
  if (typeof v === 'object') {
    const o = v as Record<string, unknown>
    if ('@value' in o) return o['@value'] === null ? null : String(o['@value'])
    if ('@id' in o) return String(o['@id'])
  }
  return null
}

/** Every value of a property as a string (literal value or IRI). */
export function values(node: Node | undefined, prop: string): string[] {
  if (!node) return []
  return asArray(node[prop]).map(scalar).filter((s): s is string => s !== null && s !== '')
}

/** The first value of a property, or null. Prefers an English literal when there are several. */
export function value(node: Node | undefined, prop: string): string | null {
  if (!node) return null
  const all = asArray(node[prop])
  const en = all.find(v => v && typeof v === 'object' && (v as Record<string, unknown>)['@language'] === 'en')
  return scalar(en ?? all[0])
}

/** A boolean literal, or null when absent or not a boolean. */
export function bool(node: Node | undefined, prop: string): boolean | null {
  const v = value(node, prop)
  if (v === 'true') return true
  if (v === 'false') return false
  return null
}

/** The `@id`s a property points to. */
export function refs(node: Node | undefined, prop: string): string[] {
  if (!node) return []
  return asArray(node[prop])
    .map(v => (v && typeof v === 'object' && '@id' in (v as object) ? String((v as Record<string, unknown>)['@id']) : null))
    .filter((s): s is string => !!s)
}

export function isA(node: Node, type: string): boolean {
  return (node['@type'] ?? []).includes(type)
}

export function byId(graph: Node[]): Map<string, Node> {
  return new Map(graph.filter(n => n['@id']).map(n => [n['@id'] as string, n]))
}

/** The node a property points to (blank nodes included), if it is in the graph. */
export function follow(graph: Map<string, Node>, node: Node | undefined, prop: string): Node | undefined {
  const id = refs(node, prop)[0]
  return id ? graph.get(id) : undefined
}
