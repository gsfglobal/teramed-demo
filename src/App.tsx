import { lazy, Suspense } from 'react';
import { HashRouter, Route, Routes, useLocation, Link } from 'react-router-dom';
import { Layout } from './components/Layout';
import { GiuliaProvider } from './components/Cta';
import { useReveal } from './lib/motion';
import Home from './pages/Home';

const Centro = lazy(() => import('./pages/Centro'));
const Trattamenti = lazy(() => import('./pages/Trattamenti'));
const Team = lazy(() => import('./pages/Team'));
const Implantologia = lazy(() => import('./pages/Implantologia'));
const Contatti = lazy(() => import('./pages/Contatti'));

function NotFound() {
  return (
    <section className="wrap pb-32 pt-[calc(var(--header-h)+96px)]">
      <p className="kicker">Pagina non trovata</p>
      <h1 className="display t-1 mt-3">Questa pagina non esiste.</h1>
      <p className="lead mt-4">Controlla l’indirizzo oppure torna alla home.</p>
      <Link to="/" className="btn btn-primary mt-8">Torna alla home</Link>
    </section>
  );
}

function Routed() {
  const { pathname } = useLocation();
  useReveal([pathname]);
  return (
    <Suspense fallback={<div className="min-h-[100svh]" />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/centro" element={<Centro />} />
        <Route path="/trattamenti" element={<Trattamenti />} />
        <Route path="/team" element={<Team />} />
        <Route path="/implantologia" element={<Implantologia />} />
        <Route path="/contatti" element={<Contatti />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <HashRouter>
      <GiuliaProvider>
        <Layout>
          <Routed />
        </Layout>
      </GiuliaProvider>
    </HashRouter>
  );
}
