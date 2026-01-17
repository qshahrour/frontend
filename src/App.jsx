import { useState } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";

function App() {
  const [authenticated, setAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  return authenticated ? (
    <Dashboard />
  ) : (
    <Login onLogin={() => setAuthenticated(true)} />
  );
}

export default App;
