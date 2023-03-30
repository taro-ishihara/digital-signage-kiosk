import "./App.css";

import { ContentsProvider } from "./context/ContentsContext.js";
import ContentsManager from "./components/ContentsManager.js";

function App() {
  return (
    <div className="App">
      <ContentsProvider>
        <ContentsManager />
      </ContentsProvider>
    </div>
  );
}

export default App;
