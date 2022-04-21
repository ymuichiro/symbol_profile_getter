import AppBar from "@mui/material/AppBar/AppBar";
import Toolbar from "@mui/material/Toolbar/Toolbar";
import logo from "../static/logo_width.png";

export function Header(): JSX.Element {
  return <AppBar position="static">
    <Toolbar style={{ display: "flex", justifyContent: "center" }}>
      <img src={logo} className="App-logo" alt="logo" height={"50px"} />
    </Toolbar>
  </AppBar>;
}