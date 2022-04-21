import { Reader } from "./pages/Reader";
import { RecoilRoot } from "recoil";
import { Header } from "./components/Header";
import CssBaseLine from "@mui/material/CssBaseline";

function App() {

  return (
    <div className="App">
      <RecoilRoot>
        <CssBaseLine>
          <Header />
          <Reader />
        </CssBaseLine>
      </RecoilRoot>
    </div>
  );
}

export default App;
