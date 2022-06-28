import { Toaster } from "react-hot-toast";
import RootDropzone from "./components/RootDropzone";
import { FilesProvider } from "./contexts/Files";
import HomeView from "./views/HomeView";

function App() {
  return (
    <FilesProvider>
      <RootDropzone>
        <HomeView></HomeView>
      </RootDropzone>
      <Toaster position="bottom-center" />
    </FilesProvider>
  );
}

export default App;
