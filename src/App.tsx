
import React, { useEffect } from "react";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";

function App() {
  useEffect(() => {
    document.title = "Lovable";
  }, []);

  return <AppRoutes />;
}

export default App;
