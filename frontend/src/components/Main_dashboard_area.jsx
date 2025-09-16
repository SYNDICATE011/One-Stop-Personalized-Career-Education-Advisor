import React from "react";
import { Home, Bell, Inbox, Settings } from "lucide-react";

import Star from "../assets/stars.png";

function Main_dashboard_area({ selected }) {
  return (
    <div className="" style={{ fontFamily: "'Lexend Deca', sans-serif" }}>
      {selected == "dashboard" && <div>THis is dashboard</div>}

      {selected == "test" && (
        <div className=" h-screen flex flex-col gap-[1.5rem]">
          <div className="flex gap-4 items-center justify-between">
            <input
              className="border-1 border-[#0000002f] w-[70%] bg-white h-11 rounded-3xl pl-5 pr-5"
              type="search"
              name=""
              id=""
              placeholder="Search tests . . . "
            />
            <div className="bg-white border-1 border-[#00000042] p-2 rounded-[50%]">
              <Bell size={22} />
            </div>
            <div className="bg-white border-1 border-[#00000042] p-2 rounded-[50%]">
              <Inbox size={22} />
            </div>

            <p className="text-[18px] p-1 pr-3 pl-3 border-[#00000048] rounded-md border-1 bg-[#be94f5]">
              APTITUDE TEST
            </p>
          </div>
          <div className="relative border-1 w-[70%] border-[#00000022] bg-[#ff5432e6] p-4 rounded-xl">
            <img src={Star} className="absolute h-[80%] right-15 opacity-80 overflow-auto" alt="" />
            <div className="flex flex-col gap-7 items-start">
              <p
                className="text-md text-white font-semibold"
                style={{ fontFamily: "'Kodchasan', sans-serif" }}
              >
                Aptitude <span className="text-[#000]">Test</span>
              </p>
              <p className="font-light text-[#000000ba] text-4xl">
                Discover Yourself with <br />
                Aptitude & Interest Tests
              </p>
              <small className="relative bottom-3">
                Understand your strengths, interests, and skills to make smarter career decisions.
              </small>
              <button className="border-1 cursor-pointer border-[#0000005f] p-2 pr-4 pl-4 rounded-3xl bg-[#fff] ">
                Start now
              </button>
            </div>
          </div>
        </div>
      )}
      {selected == "college" && <div>college</div>}
      {selected == "scholarship" && <div>scholarship</div>}
      {selected == "career" && <div>career</div>}
      {selected == "ai" && <div>ai</div>}
    </div>
  );
}

export default Main_dashboard_area;
