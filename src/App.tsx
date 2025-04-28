
import React from "react";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import Footer from "./components/home/Footer";

function App() {
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
