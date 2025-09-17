import React, { useState, useEffect } from "react";

import Aptitude from "./Aptitude";

function Main_dashboard_area({ selected }) {
  return (
    <div className="" style={{ fontFamily: "'Lexend Deca', sans-serif" }}>
      {selected == "dashboard" && <div>THis is dashboard</div>}

      {selected == "test" && <Aptitude />}
      {selected == "college" && <div>college</div>}
      {selected == "scholarship" && <div>scholarship</div>}
      {selected == "career" && <div>career</div>}
      {selected == "ai" && <div>ai</div>}
    </div>
  );
}

export default Main_dashboard_area;
