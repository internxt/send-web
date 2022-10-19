import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RootDropzone from "./components/RootDropzone";
import { FilesProvider } from "./contexts/Files";
import DownloadView from "./views/DownloadView";
import HomeView from "./views/HomeView";
import NotFoundView from "./views/NotFoundView";

function App() {
  useEffect(() => {
    if (document) {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
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
          <Route path="/download/:shareId" element={<DownloadView />} />
          <Route path="*" element={<NotFoundView />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-center" />
    </>
  );
}

export default App;
