import React, { useContext, useState } from "react";
import { userProvider } from "../../Context/UserProvider";
import { v4 as uuidv4 } from "uuid";
import axios from "../../API/axios";
import { useForm } from "react-hook-form";
import "./AskQuestion.css";
import { Link } from "react-router-dom";


function AskQuestion() {
  const {
    register,
    trigger,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [user, setUser] = useContext(userProvider); 
  const token = localStorage.getItem("token");
  const [successful, setSuccessful] = useState(false);

  async function handlePost(data) {
     
    const question_id = uuidv4();
    console.log("Data being sent:",{
      tag: data.tag,
      title: data.title,
      question_description: data.question_description,
      question_id: question_id,
      user_id: user.user_id,
    });
    try {
      await axios.post(
        "/create-question", 
        {
          tag: data.tag,
          title: data.title,
          question_description: data.question_description,
          question_id: question_id,
          user_id: user.user_id,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setSuccessful(true);
      reset();
    } catch (error) {
      console.error("Error posting question:", error.response || error);
    }
  }

  return (
    <div className="top container text-center"> 
      <div className="py-5">
        <h2>Steps to Write a Good Question</h2>
        <ul className="text-start mx-auto" style={{ maxWidth: "450px" }}>
          <li>Summarize your problem in a one-line title.</li>
          <li>Describe your problem in more detail.</li>
          <li>Describe what you tried and what you expected to happen.</li>
          <li>Review your question and post it to the site.</li>
        </ul> 
      </div>
      <div>
        <h2 className="pb-2">Ask a Public Question</h2>
        {successful && (
          <div>
            <Link to="/home" style={{ textDecoration: "none" }}>
              <small
                style={{ display: "block", color: "lightgreen", fontSize: "20px" }}
              >
                Question posted successfully. Redirecting to home page...
              </small>
            </Link>
          </div>
        )}
        <form onSubmit={handleSubmit(handlePost)}>
          <div>
            <textarea 
              placeholder="Tag" 
              className={`w-75 ${errors.tag ? "invalid" : ""}`}
              rows="2" 
              {...register("tag", {
                required: "Tag is required.",
                minLength: {
                  value: 3,
                  message: "Minimum tag length is 3",
                },
              })}
              onKeyUp={() => trigger("tag")}
            />
            {errors.tag && (
              <small className="text-danger">{errors.tag.message}</small>
            )}
          </div>
          <div>
            <textarea
              className={`w-75 ${errors.title ? "invalid" : ""}`}
              rows="2"
              placeholder="Title"
              {...register("title", {
                required: "Title is required",
                maxLength: {
                  value: 200,
                  message: "Maximum length is 200",
                },
              })}
              onKeyUp={() => trigger("title")}
            />
            {errors.title && (
              <small className="text-danger">{errors.title.message}</small>
            )}
          </div>
          <div>
            <textarea
              className={`w-75 ${errors.question ? "invalid" : ""}`}
              rows="6"
              placeholder="Question Description..."
              {...register("question_description", {
                required: "Question is required",
                maxLength: {
                  value: 300,
                  message: "Maximum allowed length is 300",
                },
              })}
              onKeyUp={() => trigger("question")}
            />
            {errors.question_description && (
              <small className="text-danger">{errors.question_description.message}</small>
            )}
          </div>
          <div>
            <button type="submit" className="btn btn-success mb-5 mt-3">
              Post Your Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AskQuestion; 

