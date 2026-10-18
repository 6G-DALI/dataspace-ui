import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'admin-lte/dist/css/adminlte.min.css'
import 'admin-lte/dist/js/adminlte.min.js'
// The shared 6G-DALI theme, after Bootstrap and AdminLTE because it overrides
// them; this app's own styles come last.
import '@6g-dali/ui-theme/fonts.css'
import '@6g-dali/ui-theme'
import { initTheme } from '@6g-dali/ui-theme/theme.js'
import App from './App'
import { initSession } from './auth/session'
import './index.css'

// The stored or OS-preferred theme, before anything renders.
initTheme()

// The pages are public, so they render whatever Keycloak says — and also when
// it cannot be reached at all. Waiting for initSession first means a signed-in
// visitor's first search already carries their token, instead of showing the
// public results and then changing under them.
void initSession().finally(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
})
