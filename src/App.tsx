import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Navigate, Route, Routes, useParams, useSearchParams } from 'react-router-dom';
import RootDropzone from './components/RootDropzone';
import { FilesProvider } from './contexts/Files';
import DownloadView from './views/DownloadView';
import HomeView from './views/HomeView';
import NotFoundView from './views/NotFoundView';

function DownloadRedirectWrapper() {
  const { sendId } = useParams();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code') ?? '';

  return <Navigate to={`/d/${sendId}/${code}`} replace />;
}

function App() {
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
