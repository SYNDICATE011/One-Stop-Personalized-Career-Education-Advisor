import { useState } from "react";
import LandPage from "./components/landingPage/Landpage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
