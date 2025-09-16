// Dashboard.jsx
import React, { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import Main_dashboard_area from "./Main_dashboard_area";

function Dashboard() {
  const [modal, setModal] = useState("dashboard");

  return (
    <main
      style={{ fontFamily: "'Poppins', sans-serif" }}
      className="bg-[#efefefea] flex h-screen overflow-hidden"
    >
      <Sidebar onselect={setModal} selected={modal} />
      <div style={{ flex: 1, padding: "1.3rem" }} className="flex-1 overflow-y-auto">
        <Main_dashboard_area selected={modal} />
      </div>
    </main>
  );
}

export default Dashboard;
