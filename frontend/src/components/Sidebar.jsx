// Sidebar.jsx
import React, { useEffect, useState } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { AccountMenu, current_user } from "./authentication/Service";
import { FaHome } from "react-icons/fa";
import { AiOutlineDashboard } from "react-icons/ai";
import { FaFileAlt } from "react-icons/fa";
import { GiGraduateCap } from "react-icons/gi";
import { SiOpenai } from "react-icons/si";
import { GiDiploma } from "react-icons/gi";
import { MdMap } from "react-icons/md";
import { useAuth } from "@clerk/clerk-react";

import { useNavigate } from "react-router-dom";
import Pencil from "../assets/girl_pencil.png";

function Sidebar({ onselect, selected }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [showAccount, setShowAccount] = useState(false);
  const navigate = useNavigate();

  const { getToken } = useAuth();

  const goToHome = () => {
    navigate("/");
  };

  useEffect(() => {
    const GetUser = async () => {
      try {
        const token = await getToken({ template: "myTokenTemplate" });
        if (!token) return;

        const user = await current_user(token);
        console.log("user", user);

        setCurrentUser(user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    GetUser();
  }, [getToken]);
  return (
    <div
      className="w-[250px] border-r-1  border-[#0000001e] h-[100vh] bg-[#fff] p-[1rem] flex flex-col justify-between pb-8 pl-4"
      style={{ fontFamily: "'Lexend Deca', sans-serif" }}
    >
      <div className="flex flex-col gap-8">
        <h1 className="text-2xl font-bold relative left-2" style={{ fontFamily: "'Kodchasan', sans-serif" }}>
          <span className="text-[#ff5532]">Learn</span>ify
        </h1>
        <div className="flex flex-col items-start gap-4 font-light w-full text-[15px]">
          <span className="text-[13px] relative top-2 left-2 text-[#00000079]">overview</span>
          <div
            onClick={() => goToHome()}
            className="flex items-center w-[100%] gap-2 p-2 hover:bg-[#ff5532] hover:text-white rounded cursor-pointer"
          >
            <FaHome size={21} />
            Home
          </div>
          <div
            onClick={() => onselect("dashboard")}
            className={`flex items-center w-[100%] gap-2 p-2 hover:bg-[#ff5532] hover:text-white  rounded cursor-pointer ${
              selected == "dashboard" ? "bg-[#ff5532] text-white" : ""
            } `}
          >
            <AiOutlineDashboard size={22} />
            Dashboard
          </div>
          <div
            onClick={() => onselect("test")}
            className={`flex items-center w-[100%] gap-2 p-2 hover:bg-[#ff5532] hover:text-white  rounded cursor-pointer ${
              selected == "test" ? "bg-[#ff5532] text-white" : ""
            } `}
          >
            <FaFileAlt size={22} />
            Aptitude Test
          </div>
          <div
            onClick={() => onselect("college")}
            className={`flex items-center w-[100%] gap-2 p-2 hover:bg-[#ff5532] hover:text-white  rounded cursor-pointer ${
              selected == "college" ? "bg-[#ff5532] text-white" : ""
            } `}
          >
            <GiGraduateCap size={22} />
            Govt Colleges
          </div>

          <div
            onClick={() => onselect("scholarship")}
            className={`flex items-center w-[100%] gap-2 p-2 hover:bg-[#ff5532] hover:text-white  rounded cursor-pointer ${
              selected == "scholarship" ? "bg-[#ff5532] text-white" : ""
            } `}
          >
            <GiDiploma size={22} />
            Scholarships
          </div>

          <div
            onClick={() => onselect("career")}
            className={`flex items-center w-[100%] gap-2 p-2 hover:bg-[#ff5532] hover:text-white  rounded cursor-pointer ${
              selected == "career" ? "bg-[#ff5532] text-white" : ""
            } `}
          >
            <MdMap size={22} />
            Career Mapping
          </div>
          <div
            onClick={() => onselect("ai")}
            className={`flex items-center w-[100%] gap-2 p-2 hover:bg-[#ff5532] hover:text-white  rounded cursor-pointer ${
              selected == "ai" ? "bg-[#ff5532] text-white" : ""
            } `}
          >
            <SiOpenai size={22} />
            AI Recommendation
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 hover:bg-gray-200 p-2  bg-gray-100 rounded-md cursor-pointer">
        <UserButton />
        <p className="text-[17px] font-light">Account</p>
      </div>
    </div>
  );
}

export default Sidebar;
