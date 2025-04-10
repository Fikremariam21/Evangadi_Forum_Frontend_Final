import React, { useContext, useEffect, useState } from "react";
import "./HomePage.css";
import Question from "../Question/Question";
import { userProvider } from "../../Context/UserProvider";
import { useNavigate } from "react-router-dom";
import axios from "../../API/axios";
import { QuestionContext } from "../../Context/QuestionContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { Pagination } from "react-bootstrap";

function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useContext(userProvider);
  const { questions, setQuestions } = useContext(QuestionContext);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(3);

  function handleClick() {
    navigate("/ask");
  }

  useEffect(() => {
    async function fetchAllQuestions() {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        const response = await axios.get("/api/all-questions", { // Remove '/api' prefix
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        });
        setQuestions(Array.isArray(response.data.result) ? response.data.result : []); // Ensure questions is an array
        setLoading(false);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setLoading(false);
      }
    }
    fetchAllQuestions();
  }, [token, setQuestions]);

  // Paginated Questions
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = Array.isArray(questions)
    ? questions.slice(indexOfFirstQuestion, indexOfLastQuestion)
    : [];
  const totalPages = Math.ceil(questions?.length / questionsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <div className="homee">
        <div className="row hed mb-4">
          <div className="col-md-6 d-flex justify-content-center justify-content-md-start">
            <button onClick={handleClick} className="qb">
              Ask Question
            </button>
          </div>
          <div className="col-md-6 d-flex justify-content-center justify-content-md-end">
            <h4 className="wel">Welcome : {user.user_name}</h4>
          </div>
        </div>

        <h3 className="ns">Questions</h3>
      </div>

      <div className="load">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {currentQuestions?.map((question, index) => (
              <div className="question-item" key={index}>
                <Question
                  title={question.title}
                  user_name={question.user_name}
                  question_id={question.question_id}
                />
              </div>
            ))}

            {/* Pagination */}
            {questions?.length > questionsPerPage && (
              <div className="d-flex justify-content-center mt-4">
                <Pagination>
                  <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
                  <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
                  {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                      key={index + 1}
                      active={index + 1 === currentPage}
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
                  <Pagination.Last onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} />
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default HomePage;


