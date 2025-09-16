import { useState, useEffect } from "react";
import LandPage from "./components/landingPage/Landpage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Dashboard";

const App = () => {
  const [user, setCurrentUser] = useState(null);

  useEffect(() => {});

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
