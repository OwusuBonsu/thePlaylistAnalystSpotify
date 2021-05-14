import { render } from "@testing-library/react";
import "bootstrap/dist/css/bootstrap.min.css";
import Analysis from "./Analysis";
import Dashboard from "./Dashboard";
import Login from "./landing";

const code = new URLSearchParams(window.location.search).get("code");

function App() {
  return code ? (
    <>
      <Dashboard code={code} />
    </>
  ) : (
    <Login />
  );
}

export default App;
