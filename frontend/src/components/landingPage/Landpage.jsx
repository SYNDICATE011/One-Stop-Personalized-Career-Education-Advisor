import "./LandPage.css";
import React, { useEffect, useRef } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

const LandPage = () => {
  const cardsRef = useRef();
  const handleWheel = (event) => {
    event.preventDefault();
    cardsRef.current.scrollLeft += event.deltaY;
  };

  useEffect(() => {
    cardsRef.current.addEventListener("wheel", handleWheel);
  }, []);

  const components = {
    nav: ["Subjects", "Courses", "Degrees", "ForBusiness"],
    auth: ["Login", "SignUp"],
    stats: [
      {
        field: "Education",
        title: "subjects",
        plus: "+40",
      },
      {
        field: "Online",
        title: "courses",
        plus: "+300",
      },
      {
        field: "5 star",
        title: "learner reviews",
        plus: "+180k",
      },
    ],
    section2: {
      buttons: ["New Courses", "Recommended", "Most Popular"],
      cards: [
        {
          img: "https://img.freepik.com/free-photo/young-happy-student-with-backpack-standing-campus_171337-1566.jpg?w=740&t=st=1687336321~exp=1687336921~hmac=3e2a5f0e4a3e2f0e4b1c8e4f0e4b1c8e4f0e4b1c8e4f0e4b1c8e4f0e4b1c8e4f0e4",
          title: "Business Management",
          button: "More Details",
        },
        {
          img: "https://img.freepik.com/free-photo/young-happy-student-with-backpack-standing-campus_171337-1566.jpg?w=740&t=st=1687336321~exp=1687336921~hmac=3e2a5f0e4a3e2f0e4b1c8e4f0e4b1c8e4f0e4b1c8e4f0e4b1c8e4f0e4b1c8e4f0e4",
          title: "Business Management",
          button: "More Details",
        },
        {
          img: "https://img.freepik.com/free-photo/young-happy-student-with-backpack-standing-campus_171337-1566.jpg?w=740&t=st=1687336321~exp=1687336921~hmac=3e2a5f0e4a3e2f0e4b1c8e4f0e4b1c8e4f0e4b1c8e4f0e4b1c8e4f0e4b1c8e4f0e4",
          title: "Business Management",
          button: "More Details",
        },
        {
          img: "https://img.freepik.com/free-photo/young-happy-student-with-backpack-standing-campus_171337-1566.jpg?w=740&t=st=1687336321~exp=1687336921~hmac=3e2a5f0e4a3e2f0e4b1c8e4f0e4b1c8e4f0e4b1c8e4f0e4b1c8e4f0e4b1c8e4f0e4",
          title: "Business Management",
          button: "More Details",
        },
        {
          img: "https://img.freepik.com/free-photo/young-happy-student-with-backpack-standing-campus_171337-1566.jpg?w=740&t=st=1687336321~exp=1687336921~hmac=3e2a5f0e4a3e2f0e4b1c8e4f0e4b1c8e4f0e4b1c8e4f0e4b1c8e4f0e4b1c8e4f0e4",
          title: "Business Management",
          button: "More Details",
        },
        {
          img: "https://img.freepik.com/free-photo/young-happy-student-with-backpack-standing-campus_171337-1566.jpg?w=740&t=st=1687336321~exp=1687336921~hmac=3e2a5f0e4a3e2f0e4b1c8e4f0e4b1c8e4f0e4b1c8e4f0e4b1c8e4f0e4b1c8e4f0e4",
          title: "Business Management",
          button: "More Details",
        },
      ],
    },
    section4: {
      buttons: [
        "Arts & Humanities",
        "Business",
        "Computer Science",
        "Data Science",
        "Health",
        "Math & Logic",
        "Personal Development",
        "Physical Science & Engineering",
        "Social Sciences",
      ],
    },
  };

  return (
    <div className="body">
      <nav className="nav">
        <h1 className="logo">
          <span>Learn</span>ify
        </h1>
        <ul className="nav-links">
          {components.nav.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <ul className="auth-links">
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </ul>
      </nav>
      <div className="main-section">
        <h1 className="main-heading">
          Find the right
          <br /> <span>course</span> for you
        </h1>
        <p className="sub-heading">
          See your personalised recommendations <br /> based on your interests and goals
        </p>
        <div className="buttons">
          <button className="btn">Find course</button>
          <button className="btn">View our blog</button>
        </div>
        <div className="stats">
          {components.stats.map((stat, index) => {
            return (
              <div>
                <div className="stat" key={index}>
                  <span className="field-name">{stat.field}</span>
                  <p>{stat.title}</p>
                  <h2>{stat.plus}</h2>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="section-2">
        <div>
          <h1>
            Take your <span>Knowledge</span>
            <br />a degree further
          </h1>
          <div className="courses">
            {components.section2.buttons.map((button, index) => (
              <button key={index}>{button}</button>
            ))}
          </div>
        </div>
        <div className="course-cards" ref={cardsRef}>
          {components.section2.cards.map((card, index) => (
            <div className="cards" key={index}>
              <img src={card.img} alt={card.title} />
              <h3>{card.title}</h3>
              <button>{card.button}</button>
            </div>
          ))}
        </div>
      </div>
      <div className="section-3">
        <div className="section-3-content">
          <h1>
            Upgrade your <span>skills</span>
            <br /> with <span>FREE</span>online courses
            <br />
          </h1>
          <p>Ready to gain in-demand skills to kickstart your career?</p>
          <button>Start now</button>
        </div>
      </div>
      <div className="section-4">
        <div>
          <div className="section-4-heading">
            <h1>
              Explore
              <br /> top <span>subjects</span>
            </h1>
            <div>
              <button>Our Subjects</button>
              <p>We have the largest selection of subjects to study with our online courses</p>
            </div>
          </div>
          <div className="course" ref={cardsRef}>
            {components.section4.buttons.map((button, index) => (
              <button key={index}>{button}</button>
            ))}
          </div>
        </div>
        <div className="section-4-lower">
          <div className="section-4-info">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda libero iusto numquam
              consequuntur facilis voluptas, sed ipsa, harum inventore eveniet fugiat asperiores ipsam! Veniam
              aliquid voluptatum eius, praesentium provident perspiciatis!
            </p>
            <div className="section-4-buttons">
              <button className="btn">Explore courses</button>
              <button className="btn-trans">view all subjects</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LandPage;
