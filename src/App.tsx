import RootDropzone from "./components/RootDropzone";
import { FilesProvider } from "./contexts/Files";
import HomeView from "./views/HomeView";

function App() {
  return (
    <FilesProvider>
      <RootDropzone>
        <HomeView></HomeView>
      </RootDropzone>
    </FilesProvider>
  );
}

export default App;
