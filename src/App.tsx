import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Navigate, Route, Routes, useParams, useSearchParams } from 'react-router-dom';
import RootDropzone from './components/RootDropzone';
import { FilesProvider } from './contexts/Files';
import DownloadView from './views/DownloadView';
import HomeView from './views/HomeView';
import NotFoundView from './views/NotFoundView';
import { useEffect } from 'react';

function DownloadRedirectWrapper() {
  const { sendId } = useParams();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code') ?? '';

  return <Navigate to={`/d/${sendId}/${code}`} replace />;
}

function App() {
  useEffect(() => {
    const url = new URL(window.location.href);
    let hadChanges = false;

    const currentKeys = Array.from(url.searchParams.keys());

    currentKeys.forEach((param) => {
      if (param === '_gl' || param === '_gcl_au' || param === '_fplc' || param.startsWith('_ga')) {
        url.searchParams.delete(param);
        hadChanges = true;
      }
    });

    if (hadChanges) {
      const newUrl = url.searchParams.toString()
        ? `${url.pathname}?${url.searchParams.toString()}${url.hash}`
        : `${url.pathname}${url.hash}`;

      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <FilesProvider>
                <RootDropzone>
                  <HomeView />
                </RootDropzone>
              </FilesProvider>
            }
          />
          <Route path="/download/:sendId" element={<DownloadRedirectWrapper />} />
          <Route path="/d/:sendId/:code" element={<DownloadView />} />
          <Route path="*" element={<NotFoundView />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-center" />
    </>
  );
}

export default App;
