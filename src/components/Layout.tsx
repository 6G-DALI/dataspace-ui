import type { ReactNode } from 'react'
import { FiBox, FiCpu, FiDatabase, FiHome, FiLayers, FiSettings } from 'react-icons/fi'
import { AppShell, daliTools, type AccountAction, type Crumb, type SidebarEntry } from '@6g-dali/ui-shell'
import { login, logout } from '../auth/session'
import { useSession } from '../auth/useSession'
import { accountConsoleUrl, config } from '../config'
import { navigate, href, type View } from '../router'

/**
 * The catalogue's application shell: @6g-dali/ui-shell's AppShell, the frame
 * dataops-ui and portal-ui render, so the three apps look and behave alike.
 *
 * Unlike those two, nobody has to sign in. Anonymous visitors get a "Sign in"
 * entry where the username sits; the shell has no slot of its own for it yet
 * (see README, follow-ups), so it uses the account action. Signed in, the
 * username opens this realm's Keycloak account console, and Logout appears.
 */

const VIEW_PATH: Record<View, string[]> = {
  home: [],
  catalogues: ['catalogues'],
  datasets: ['datasets'],
  models: ['models'],
  services: ['services'],
}

interface LayoutProps {
  view: View
  breadcrumbs: Crumb[]
  pageTitle?: ReactNode
  children: ReactNode
}

export default function Layout({ view, breadcrumbs, pageTitle, children }: LayoutProps) {
  const session = useSession()

  const nav: SidebarEntry<View>[] = [
    { label: 'Home', view: 'home', icon: FiHome },
    { label: 'Catalogues', view: 'catalogues', icon: FiLayers },
    { label: 'Datasets', view: 'datasets', icon: FiDatabase },
    ...(config.modelsCatalogue ? [{ label: 'ML models', view: 'models' as const, icon: FiCpu }] : []),
    ...(config.servicesCatalogue ? [{ label: 'Data services', view: 'services' as const, icon: FiSettings }] : []),
  ]
  if (session.authenticated && config.dataopsUrl) {
    nav.push(
      { heading: 'Contribute' },
      {
        label: 'Publish data',
        href: config.dataopsUrl,
        icon: FiBox,
        newTab: true,
        title: 'Register datasets and testbeds in DataOps',
      },
    )
  }

  let account: AccountAction | undefined
  let username: string | undefined
  if (session.authenticated) {
    username = session.username ?? 'user'
    const url = accountConsoleUrl()
    account = url ? { href: url, newTab: true, title: 'Your account — opens the identity provider' } : undefined
  } else if (session.ready) {
    username = 'Sign in'
    account = { onSelect: login, title: 'Sign in with your 6G-DALI account to see restricted records' }
  }

  return (
    <AppShell<View>
      brand={<>6G-<span className="dali-accent">DALI</span> Data Space</>}
      homeView="home"
      nav={nav}
      activeView={view}
      onNavigate={next => navigate(href(VIEW_PATH[next]))}
      tools={daliTools(config)}
      breadcrumbs={breadcrumbs}
      pageTitle={pageTitle}
      username={username}
      account={account}
      onLogout={session.authenticated ? logout : undefined}
      footer={<strong>Data Space &mdash; the 6G-DALI metadata catalogue.</strong>}
      build={__BUILD_SHA__}
    >
      {children}
    </AppShell>
  )
}

/** A breadcrumb that links to a hash route. */
export function crumb(label: string, path?: string[]): Crumb {
  if (!path) return { label }
  const to = href(path)
  return { label, href: to, onSelect: () => navigate(to) }
}
