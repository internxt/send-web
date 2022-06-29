import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RootDropzone from "./components/RootDropzone";
import { FilesProvider } from "./contexts/Files";
import DownloadView from "./views/DownloadView";
import HomeView from "./views/HomeView";

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
          <Route path="/:shareId" element={<DownloadView />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-center" />
    </>
  );
}

export default App;
