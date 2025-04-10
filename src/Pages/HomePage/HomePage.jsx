import React, { useContext, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import Question from "../Question/Question";
import { userProvider } from "../../Context/UserProvider";
import axios from "../../API/axios";
import { QuestionContext } from "../../Context/QuestionContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { Pagination, Form, InputGroup, Button } from "react-bootstrap";

function HomePage() {
  const navigate = useNavigate();
  const [user] = useContext(userProvider);
  const { questions, setQuestions } = useContext(QuestionContext);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchSubmitted, setSearchSubmitted] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(3);

  function handleClick() {
    navigate("/ask");
  }

  useEffect(() => {
    async function fetchAllQuestions() {
      try {
        const response = await axios.get("/all-questions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setQuestions(
          Array.isArray(response.data.result) ? response.data.result : []
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setLoading(false);
      }
    }
    fetchAllQuestions();
  }, [token, setQuestions]);

  // Filter questions based on search term - FIXED SYNTAX
  const filteredQuestions = useMemo(() => {
    if (!searchTerm.trim()) return questions;
    return questions.filter(question => 
      question.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [questions, searchTerm]);

  // Paginated Questions
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = Array.isArray(filteredQuestions)
    ? filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion)
    : [];
  const totalPages = Math.ceil(filteredQuestions?.length / questionsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchSubmitted(true);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchSubmitted(false);
    setCurrentPage(1);
  };

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

        <div className="row mb-4">
          <div className="col-12">
            <Form onSubmit={handleSearch}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSearchSubmitted(false);
                  }}
                />
                <Button variant="primary" type="submit">
                  Search
                </Button>
                {searchTerm && (
                  <Button 
                    variant="outline-secondary" 
                    onClick={handleClearSearch}
                  >
                    Clear
                  </Button>
                )}
              </InputGroup>
            </Form>
          </div>
        </div>

        <h3 className="ns">Questions</h3>
      </div>

      <div className="load">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {currentQuestions?.length > 0 ? (
              currentQuestions.map((question, index) => (
                <div className="question-item" key={index}>
                  <Question
                    title={question.title}
                    user_name={question.user_name}
                    question_id={question.question_id}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                {searchSubmitted || searchTerm ? (
                  <p>No questions found matching "{searchTerm}"</p>
                ) : (
                  <p>No questions available yet.</p>
                )}
              </div>
            )}

            {filteredQuestions?.length > questionsPerPage && (
              <div className="d-flex justify-content-center mt-4">
                <Pagination className="custom-pagination">
                  <Pagination.First
                    onClick={() => paginate(1)}
                    disabled={currentPage === 1}
                    aria-label="First page"
                  />
                  <Pagination.Prev
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                  />
                  <Pagination.Item active aria-current="page">
                    {currentPage}
                  </Pagination.Item>
                  <Pagination.Next
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                  />
                  <Pagination.Last
                    onClick={() => paginate(totalPages)}
                    disabled={currentPage === totalPages}
                    aria-label="Last page"
                  />
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