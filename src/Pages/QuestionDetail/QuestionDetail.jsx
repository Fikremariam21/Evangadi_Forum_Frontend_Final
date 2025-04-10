import React, { useContext, useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { QuestionContext } from "../../Context/QuestionContext";
import axios from "../../API/axios";
import { userProvider } from "../../Context/UserProvider";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./QuestionDetail.css";

function DetailQuestion() {
  // Form hooks
  const {
    register: registerQuestion,
    handleSubmit: handleQuestionSubmit,
    reset: resetQuestion,
    formState: { errors: questionErrors },
    setValue: setQuestionValue,
  } = useForm();

  const {
    register: registerAnswer,
    handleSubmit: handleAnswerSubmit,
    reset: resetAnswer,
    formState: { errors: answerErrors },
    trigger: triggerAnswer,
  } = useForm();

  // Context and state
  const token = localStorage.getItem("token");
  const [user] = useContext(userProvider);
  const { questions, setQuestions } = useContext(QuestionContext);
  const { question_id } = useParams();
  const navigate = useNavigate();

  const [dbAnswer, setDbAnswer] = useState([]);
  const [isLoading, setIsLoading] = useState({
    answers: false,
    question: false,
    delete: false,
    answer: false,
  });
  const [isEditing, setIsEditing] = useState(false);

  // Memoized question finder
  const selectedQuestion = React.useMemo(() => 
    questions.find((ques) => ques.question_id === question_id) || {}, 
    [questions, question_id]
  );

  // Fetch answers with proper loading state
  const getAnswers = useCallback(async () => {
    if (!question_id || !token) return;
    
    setIsLoading(prev => ({...prev, answers: true}));
    try {
      const response = await axios.get(`/answers/all/${question_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDbAnswer(response.data.result || []);
    } catch (error) {
      console.error("Error fetching answers:", error);
      toast.error("Failed to load answers");
    } finally {
      setIsLoading(prev => ({...prev, answers: false}));
    }
  }, [question_id, token]);

  useEffect(() => {
    getAnswers();
  }, [getAnswers]);

  // Question handlers
  const handleUpdateQuestion = async (data) => {
    if (!user?.user_id) {
      toast.warn("Please log in to update the question.");
      return;
    }

    setIsLoading(prev => ({...prev, question: true}));
    try {
      await axios.put(
        `/update-question/${question_id}`,
        {
          title: data.title,
          question_description: data.description,
          user_id: user.user_id,
          tag: selectedQuestion?.tag || "",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Question updated successfully!");
      setIsEditing(false);
      resetQuestion();

      // Update context
      setQuestions((prevQuestions) =>
        prevQuestions.map((ques) =>
          ques.question_id === question_id
            ? {
                ...ques,
                title: data.title,
                question_description: data.description,
              }
            : ques
        )
      );
    } catch (error) {
      console.error("Error updating question:", error);
      toast.error(
        error.response?.data?.msg || "Failed to update question"
      );
    } finally {
      setIsLoading(prev => ({...prev, question: false}));
    }
  };

  // Answer handlers
  const handlePostAnswer = async (data) => {
    if (!user?.user_id) {
      toast.warn("Please log in to post an answer.");
      return;
    }

    setIsLoading(prev => ({...prev, answer: true}));
    try {
      await axios.post(
        "/answers/create",
        {
          answer: data.answer,
          question_id: question_id,
          user_id: user.user_id,
        },
        { headers: { Authorization: "Bearer " + token } }
      );
      await getAnswers();
      resetAnswer();
      toast.success("Answer posted successfully!");
      
      // Scroll to top after successful answer submission
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    } catch (error) {
      console.error("Error posting answer:", error);
      toast.error(
        error.response?.data?.msg || "Failed to post answer"
      );
    } finally {
      setIsLoading(prev => ({...prev, answer: false}));
    }
  };

  const handleDeleteQuestion = async () => {
    if (user?.user_id !== selectedQuestion?.user_id) {
      toast.error("You are not authorized to delete this question.");
      return;
    }

    const confirmDelete = async () => {
      setIsLoading(prev => ({...prev, delete: true}));
      try {
        await axios.delete(`/questions/${question_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Question deleted successfully!");
        navigate("/home");
      } catch (error) {
        console.error("Error deleting question:", error);
        toast.error(
          error.response?.data?.msg || "Failed to delete question"
        );
      } finally {
        setIsLoading(prev => ({...prev, delete: false}));
      }
    };

    toast.info(
      <div className="toast-confirmation">
        <p>Are you sure you want to delete this question?</p>
        <p>This action cannot be undone.</p>
        <button 
          onClick={confirmDelete}
        >
          Yes
        </button>
        <button className="btn-noDelete"
          onClick={() => toast.dismiss()}
        >
          No
        </button>
      </div>,
      {
        autoClose: false,
        closeOnClick: false,
        position: "top-center"
      }
    );
  };

  const handleEditClick = () => {
    setQuestionValue("title", selectedQuestion?.title);
    setQuestionValue("description", selectedQuestion?.question_description);
    setIsEditing(true);
  };

  const canDelete = user?.user_id === selectedQuestion?.user_id;

  return (
    <div className="container top">
      {/* Question Section */}
      <div className="card mb-4">
        <div className="card-body">
          <h4 className="card-title">Question</h4>
          {!isEditing ? (
            <>
              <h5 className="card-subtitle mb-2 text-muted">
                {selectedQuestion?.title || "Loading..."}
              </h5>
              <p className="card-text">
                {selectedQuestion?.question_description || "Loading..."}
              </p>
              {canDelete && (
                <div className="mt-3">
                  <button
                    className="btn btn-delete me-2"
                    onClick={handleDeleteQuestion}
                    disabled={isLoading.delete}
                  >
                    {isLoading.delete ? "Deleting..." : "Delete"}
                  </button>
                  <button 
                    className="btn btn-edit"
                    onClick={handleEditClick}
                  >
                    Edit
                  </button>
                </div>
              )}
            </>
          ) : (
            <form onSubmit={handleQuestionSubmit(handleUpdateQuestion)}>
              <div className="form-group mb-3">
                <label className="form-label">Title</label>
                <input
                  className={`form-control ${questionErrors.title && "is-invalid"}`}
                  type="text"
                  {...registerQuestion("title", { 
                    required: "Title is required" 
                  })}
                />
                {questionErrors.title && (
                  <div className="invalid-feedback">
                    {questionErrors.title.message}
                  </div>
                )}
              </div>
              <div className="form-group mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className={`form-control ${questionErrors.description && "is-invalid"}`}
                  rows="5"
                  {...registerQuestion("description", {
                    required: "Description is required",
                  })}
                />
                {questionErrors.description && (
                  <div className="invalid-feedback">
                    {questionErrors.description.message}
                  </div>
                )}
              </div>
              <div className="d-flex gap-2">
                <button 
                  type="submit" 
                  className="btn btn-success"
                  disabled={isLoading.question}
                >
                  {isLoading.question ? "Updating..." : "Update Question"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading.question}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Answers Section */}
      <div className="card mb-4">
        <div className="card-body">
          <h4 className="card-title">Answers</h4>
          {isLoading.answers ? (
            <div className="text-center">Loading answers...</div>
          ) : dbAnswer?.length > 0 ? (
            dbAnswer.map((answerData) => (
              <div className="card mb-3 info_question" key={answerData.answer_id}>
                <div className="card-body row">
                  <div className="col-md-4 d-flex flex-column align-items-center">
                    <i className="fas fa-user-circle fa-3x user-icon mb-2" style={{color: "rgb(81, 108, 240)"}}></i>
                    <p className="username">{answerData.user_name}</p>
                  </div>
                  <div className="col-md-8">
                    <p className="answer-text">{answerData.answer}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted">No answers yet.</p>
          )}
        </div>
      </div>

      {/* Answer Form Section */}
      <div className="card answer text-center mb-5">
        <div className="card-body">
          <h2 className="pt-3">Answer The Question</h2>
          <Link to="/home" className="text-decoration-none">
            <small className="text-primary" style={{ fontSize: "20px" }}>
              Go back to Questions Page
            </small>
          </Link>

          <form onSubmit={handleAnswerSubmit(handlePostAnswer)} className="mt-4">
            <div className="form-group">
              <textarea
                className={`form-control w-75 mx-auto ${
                  answerErrors.answer ? "is-invalid" : ""
                }`}
                rows="6"
                placeholder="Your answer..."
                {...registerAnswer("answer", {
                  required: "Answer is required",
                  maxLength: {
                    value: 300,
                    message: "Maximum allowed length is 300",
                  },
                })}
              />
              {answerErrors.answer && (
                <div className="invalid-feedback d-block text-center">
                  {answerErrors.answer.message}
                </div>
              )}
            </div>
            <button 
              type="submit" 
              className="btn btn-success mt-3"
              disabled={isLoading.answer}
            >
              {isLoading.answer ? "Posting..." : " Post Your Answer"}
            </button>
          </form>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default DetailQuestion;