
import React, { useEffect } from "react";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import Footer from "./components/home/Footer";

function App() {
  useEffect(() => {
    document.title = "Lovable";
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <AppRoutes />
      </div>
      <Footer />
    </div>
  );
}

export default App;
