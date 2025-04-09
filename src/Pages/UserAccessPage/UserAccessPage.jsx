import React, { useContext, useEffect, useState } from "react";
import "./UserAccessPage.css";
import SignIn from "../SignIn/SignIn";
import { Link } from "react-router-dom";
import SignUp from "../SignUp/SignUp";
import { userProvider } from "../../Context/UserProvider";

function UserAccessPage() {
  const [user, setUser] = useContext(userProvider);
  const [showSignIn, setSignIn] = useState(true);

  function toggleForm() { // Function to toggle between sign in and sign up forms 
    setSignIn((prevState) => !prevState); 
  }

  // useEffect(() => {
  //   if (user?.user_name) {
  //     setUser({});
  //     localStorage.setItem("token", "");
  //     console.log("deleted user");
  //   }
  // }, []); 

  return (
    <div className="home">
      <div className="container">
        <div className="con row">
          {showSignIn ? (
            <SignIn key="signIn" toggleForm={toggleForm} />
          ) : (
            <SignUp key="signUp" toggleForm={toggleForm} />
          )}

          <div className="info col col-md pb-sm-5">
            <Link to ="" className="about" target="_blank" >About</Link>
            <h1 className="network pb-3 hi">Evangadi Networks</h1>
            <p>
            Every stage of life presents an opportunity to learn, grow, and inspire. Whether you're a student taking your first steps in education or a CEO shaping the future of a global company, your journey holds valuable lessons for others.
            </p>

            <p className="pl">
            Success is rarely a solo endeavor—it thrives on shared knowledge and meaningful connections. Whether you’re eager to mentor, seeking guidance, or simply looking to expand your network, take the first step toward building lasting relationships by joining us today.
            </p>
            
            <Link to="/how-it-works">
              <button className="works">HOW IT WORKS</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserAccessPage;