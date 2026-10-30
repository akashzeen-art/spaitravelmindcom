import { useCallback, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AiProvider } from './context/AiContext';
import { AppLanguageProvider } from './context/AppLanguageContext';
import Preloader from './components/Preloader';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import CitiesPage from './pages/CitiesPage';
import CountriesPage from './pages/CountriesPage';
import LanguagesPage from './pages/LanguagesPage';
import GuidePage from './pages/GuidePage';
import LanguagePracticePage from './pages/LanguagePracticePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const [bootDone, setBootDone] = useState(false);
  const finishBoot = useCallback(() => setBootDone(true), []);

  return (
    <AiProvider>
      <AppLanguageProvider>
        {!bootDone && <Preloader onDone={finishBoot} />}
        <div className={`tx-app${bootDone ? ' is-ready' : ''}`}>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/cities" element={<CitiesPage />} />
              <Route path="/countries" element={<CountriesPage />} />
              <Route path="/languages" element={<LanguagesPage />} />
              <Route path="/languages/:langId" element={<LanguagePracticePage />} />
              <Route path="/guide/:slug" element={<GuidePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </div>
      </AppLanguageProvider>
    </AiProvider>
  );
}

export default App;
