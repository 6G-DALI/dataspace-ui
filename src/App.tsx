import ConsentBanner from './components/ConsentBanner'
import DatasetSearch from './components/DatasetSearch'
import Layout, { crumb } from './components/Layout'
import { EmptyPanel } from './components/ui'
import { config } from './config'
import { CataloguePage, CataloguesPage } from './pages/CataloguePages'
import DatasetPage from './pages/DatasetPage'
import HomePage from './pages/HomePage'
import { href, useRoute } from './router'

/**
 * Routes. Every page is public; signing in only changes what piveau returns.
 * See router.ts for the hash grammar.
 */
export default function App() {
  const route = useRoute()
  const [a, b] = route.path

  let page
  if (!a || a === 'home') page = <HomePage />
  else if (a === 'catalogues' && b) page = <CataloguePage key={b} route={route} id={b} />
  else if (a === 'catalogues') page = <CataloguesPage />
  else if (a === 'datasets' && b) page = <DatasetPage key={b} id={b} />
  else if (a === 'datasets') {
    page = (
      <Layout view="datasets" breadcrumbs={[crumb('Home', []), crumb('Datasets')]} pageTitle="Search the Data Space">
        <DatasetSearch route={route} basePath={['datasets']} />
      </Layout>
    )
  } else if (a === 'models' && config.modelsCatalogue) {
    page = <CataloguePage key="models" route={route} id={config.modelsCatalogue} view="models" basePath={['models']} />
  } else if (a === 'services' && config.servicesCatalogue) {
    page = <CataloguePage key="services" route={route} id={config.servicesCatalogue} view="services" basePath={['services']} />
  } else {
    page = (
      <Layout view="home" breadcrumbs={[crumb('Home', []), crumb('Not found')]}>
        <EmptyPanel title="Page not found">
          <a href={href([])}>Back to the home page</a>
        </EmptyPanel>
      </Layout>
    )
  }

  return (
    <>
      {/* Focuses the content without following the link: "#main" would be read as a route. */}
      <a className="skip-to-content" href="#main" onClick={e => {
        e.preventDefault()
        const main = document.getElementById('main')
        main?.setAttribute('tabindex', '-1')
        main?.focus()
      }}>Skip to content</a>
      {page}
      <ConsentBanner />
    </>
  )
}
