import React, { useState, useEffect } from "react";
import { Bell, Inbox } from "lucide-react";
import Star from "../assets/stars.png";
import { useAuth } from "@clerk/clerk-react";
import { current_user } from "./authentication/Service";
import axios from "axios";
import { ArrowRight } from "lucide-react";
import CareerQuestions from "./CareerQuestions";

function Aptitude() {
  const { getToken } = useAuth();

  const [startTest, setStartTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [results, setResults] = useState(null);
  const [report, setReport] = useState(null);
  const [category, setCategory] = useState("all");

  console.log(report);

  function handleOverlayClick(e) {
    if (e.target.id === "overlay") {
      setStartTest(null);
      setResults(null);
    }
  }

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const token = await getToken({ template: "myTokenTemplate" });
        if (!token) return;
        const data = await current_user(token);
        setCurrentUser(data);
      } catch (err) {
        console.log(err);
      }
    };
    getCurrentUser();
  }, [getToken]);

  useEffect(() => {
    const getQuestions = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/v1/aptitude/questions");
        if (!res.ok) throw new Error("Get question request failed");
        const data = await res.json();
        setQuestions(data);
      } catch (err) {
        console.error("Failed to fetch questions:", err);
      }
    };
    getQuestions();
  }, []);

  const handleStartSession = async () => {
    try {
      setLoading(true);
      const res = await axios.post("http://127.0.0.1:8000/v1/aptitude/start-session", {
        user_id: currentUser.id,
      });
      setSessionId(res.data.session_id);
      setStartTest("start-test");
    } catch (err) {
      console.error("Error starting session:", err);
      alert("Could not start quiz session!");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (qid, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [qid]: answer,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sessionId) return alert("No active session found");

    try {
      const res = await axios.post("http://127.0.0.1:8000/v1/aptitude/submit", {
        session_id: sessionId,
        answers: answers,
      });

      setResults(res.data);
      console.log("Submission result:", res.data);
    } catch (err) {
      console.error("Error submitting answers:", err);
    }
  };

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/v1/aptitude/user-report/${currentUser?.id}`);
        setReport(res.data);
      } catch (err) {
        console.error("Error fetching report:", err);
      }
    };

    if (currentUser) fetchReport();
  }, [currentUser]);

  return (
    <div className="h-screen flex flex-col overflow-hidden gap-[1.5rem]">
      <div className="flex top-0 pt-5 gap-4 w-[80%] bg-[#efefeffc] z-2 pb-2  fixed items-center justify-between">
        <input
          className="border border-[#0000002f] w-[70%] bg-white h-11 rounded-3xl pl-5 pr-5"
          type="search"
          placeholder="Search tests . . . "
        />
        <div className="bg-white border border-[#00000042] p-2 rounded-full">
          <Bell size={22} />
        </div>
        <div className="bg-white border border-[#00000042] p-2 rounded-full">
          <Inbox size={22} />
        </div>
        <p className="text-[18px] p-1 pr-3 pl-3 border-[#00000048] rounded-md border bg-[#be94f5]">
          APTITUDE TEST
        </p>
      </div>

      <div className="absolute right-9 top-26 h-[600px] w-[22%] bg-white border border-gray-200 rounded-2xl shadow-lg p-6 flex flex-col gap-6">
        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800">
          <span className="text-[#ff5432e6]">My</span> Performance
        </h2>

        {/* User Profile */}
        <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
          <img
            src={currentUser?.picture}
            alt="profile"
            className="h-16 w-16 rounded-full object-cover shadow-md"
          />
          <div>
            <p className="text-lg font-bold text-gray-800">{currentUser?.name}</p>
            <p className="text-sm text-gray-500">Aptitude Test</p>
          </div>
        </div>

        {/* Score Summary */}
        <div className="space-y-3 flex flex-col gap-4 ">
          <div className="flex w-full gap-3">
            <p className="text-gray-700 border-1 p-2 bg-[#efefef] border-gray-300 w-full flex flex-col rounded-[8px]">
              <small>Score</small>
              <span className="text-blue-600 font-bold relative left-2  text-lg">
                {report?.total_correct ?? 0}
              </span>
            </p>
            <p className="text-gray-700 border-1 p-2 bg-[#efefef] border-gray-300 w-full flex flex-col rounded-[8px]">
              <small>Total questions</small>
              <span className="text-blue-600 font-bold relative left-2 text-lg">
                {report?.total_questions_answered ?? 0}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-green-600 bg-green-200 rounded-[8px] w-full p-2 border-1 font-medium">
              ✔ Correct: {report?.total_correct}
            </p>
            <p className="text-red-600 bg-red-200 rounded-[8px] w-full p-2 border-1 font-medium">
              ✘ Incorrect: {report?.total_incorrect}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Accuracy</p>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full"
              style={{
                width: `${report ? report.accuracy_percentage : 0}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto flex flex-col gap-3">
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
            Retake Test
          </button>
          <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg shadow hover:bg-gray-200 transition">
            View History
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-8 w-[70%] flex-1 overflow-auto">
        <div className="relative border top-20 border-[#00000022] bg-[#ff5432e6] p-4 rounded-xl">
          <img src={Star} className="absolute h-[80%] right-15 opacity-80 overflow-auto" alt="" />
          <div className="flex flex-col gap-7 items-start">
            <p className="text-md text-white font-semibold font-kodchasan">
              Aptitude <span className="text-[#000]">Test</span>
            </p>
            <p className="font-light text-[#000000ba] text-4xl">
              Discover Yourself with <br />
              Aptitude & Interest Tests
            </p>
            <small className="relative bottom-3">
              Understand your strengths, interests, and skills to make smarter career decisions.
            </small>
            <button
              onClick={handleStartSession}
              disabled={loading}
              className="border flex items-center cursor-pointer border-[#0000005f] p-1 px-4 rounded-3xl bg-white"
            >
              {loading ? "Starting..." : "Start now"}
              <span className="border-1 text-center p-1 flex items-center bg-[#000] text-white relative left-3 font-black rounded-[50%]">
                <ArrowRight size={18} />
              </span>
            </button>
          </div>
        </div>

        <div className=" relative top-20   flex gap-3 items-center ">
          <button
            onClick={() => setCategory("all")}
            className={`border-1 cursor-pointer  ${
              category == "all" ? "bg-gray-300" : "bg-white"
            } border-[#0005] p-1 px-4 rounded-md`}
          >
            All
          </button>
          <button
            onClick={() => setCategory("science")}
            className={`border-1 cursor-pointer  ${
              category == "science" ? "bg-gray-300" : "bg-white"
            } border-[#0005] p-1 px-4 rounded-md`}
          >
            Science
          </button>
          <button
            onClick={() => setCategory("commerce")}
            className={`border-1 cursor-pointer  ${
              category == "commerce" ? "bg-gray-300" : "bg-white"
            } border-[#0005] p-1 px-4 rounded-md`}
          >
            Commerce
          </button>
          <button
            onClick={() => setCategory("arts")}
            className={`border-1 cursor-pointer  ${
              category == "arts" ? "bg-gray-300" : "bg-white"
            } border-[#0005] p-1 px-4 rounded-md`}
          >
            Arts
          </button>
          <button
            onClick={() => setCategory("medical")}
            className={`border-1 cursor-pointer  ${
              category == "medical" ? "bg-gray-300" : "bg-white"
            } border-[#0005] p-1 px-4 rounded-md`}
          >
            Medical
          </button>
          <button
            onClick={() => setCategory("architecture")}
            className={`border-1 cursor-pointer  ${
              category == "architecture" ? "bg-gray-300" : "bg-white"
            } border-[#0005] p-1 px-4 rounded-md`}
          >
            Architecture
          </button>
          <button
            onClick={() => setCategory("nursing")}
            className={`border-1 cursor-pointer  ${
              category == "nursing" ? "bg-gray-300" : "bg-white"
            } border-[#0005] p-1 px-4 rounded-md`}
          >
            Nursing
          </button>
        </div>

        <div className="relative top-20  pb-7">
          <CareerQuestions onselect={category} />
        </div>
      </div>

      {startTest === "start-test" && (
        <div
          id="overlay"
          onClick={handleOverlayClick}
          className="fixed top-0 right-0 h-full w-[84%] bg-[#ebebeb] flex items-center justify-center z-50"
        >
          <div className="h-full w-full p-5 overflow-y-auto flex flex-col gap-7">
            <p className="text-2xl font-semibold">General Aptitude Test</p>
            <button
              id="overlay"
              className="absolute right-5 top-5 border p-1 px-3 rounded-md bg-black text-white"
              onClick={handleOverlayClick}
            >
              close
            </button>

            {results ? (
              <div className="mt-10 flex flex-col gap-5 items-start w-full ">
                <div className=" mb-8 flex flex-col gap-3 border-1 border-[#0000004c] p-3 rounded-md bg-white">
                  <h2 className="text-2xl flex gap-3 font-bold text-gray-800">
                    🎯 Your Score:
                    <span className="text-blue-600 ml-2">{results.score}</span>
                  </h2>
                  <p className="text-gray-500 mt-1">
                    You answered {results.results.filter((r) => r.is_correct).length} out of{" "}
                    {results.results.length} correctly
                  </p>
                </div>

                <div className="space-y-6 flex flex-col gap-4 w-full">
                  {results.results.map((r, i) => (
                    <div
                      key={r.question_id}
                      className={`p-5 rounded-xl flex flex-col gap-2 shadow-md border-l-4 transition-all ${
                        r.is_correct ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500"
                      }`}
                    >
                      <p className="text-lg font-semibold text-gray-800 mb-2">
                        {i + 1}. {r.question_text}
                      </p>

                      <p className="text-gray-700">
                        <span className="font-medium">Your answer:</span>{" "}
                        <span
                          className={`${
                            r.is_correct ? "text-green-700 font-semibold" : "text-red-700 font-semibold"
                          }`}
                        >
                          {r.selected_option}
                        </span>
                      </p>

                      {!r.is_correct && (
                        <p className="text-gray-700">
                          <span className="font-medium">Correct answer:</span>{" "}
                          <span className="text-green-700 font-semibold">{r.correct_answer}</span>
                        </p>
                      )}

                      <p className="mt-2">
                        {r.is_correct ? (
                          <span className="px-3 py-1 text-sm rounded bg-green-100 text-green-800 font-medium">
                            ✔ Correct
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-sm rounded bg-red-100 text-red-800 font-medium">
                            ✘ Incorrect
                          </span>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className=" flex flex-col gap-5 space-y-6">
                {questions.map((q, i) => (
                  <div
                    key={q.id}
                    className="bg-white border flex flex-col gap-5 border-gray-200 shadow-md rounded-xl p-5 hover:shadow-lg transition-all"
                  >
                    <p className="text-lg flex items-center gap-3 font-semibold text-gray-800 mb-4">
                      <span className="text-blue-500 mr-2">{i + 1}.</span>
                      {q.question_text}
                    </p>

                    <div className="space-y-3 flex flex-col gap-2">
                      {q.options.map((opt, idx) => (
                        <label
                          key={idx}
                          className={`flex items-center  p-3 border rounded-lg cursor-pointer transition-all ${
                            answers[q.id] === opt
                              ? "border-blue-500 bg-blue-50"
                              : "border-[#0000002f] hover:border-blue-400"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${q.id}`}
                            value={opt}
                            checked={answers[q.id] === opt}
                            onChange={() => handleAnswerChange(q.id, opt)}
                            className="hidden"
                          />
                          <span className="ml-2 text-gray-700">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex ">
                  <button
                    type="submit"
                    className="px-6 cursor-pointer py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:scale-105 transition-all"
                  >
                    Submit Answers
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Aptitude;
