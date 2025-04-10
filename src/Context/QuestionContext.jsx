import React, { createContext, useState, useEffect } from "react";
import axios from "../API/axios"; // Make sure to import your axios instance

export const QuestionContext = createContext();

export const QuestionProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        const response = await axios.get("/all-questions", { // Remove '/api' prefix
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setQuestions(Array.isArray(response.data.result) ? response.data.result : []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch questions:", err.response || err.message);
        setError(err);
        setQuestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []); // Run only once on mount

  const addQuestion = (newQuestion) => {
    setQuestions(prev => [...prev, newQuestion]);
  };

  const updateQuestion = (updatedQuestion) => {
    setQuestions(prev => 
      prev.map(q => 
        q.question_id === updatedQuestion.question_id ? updatedQuestion : q
      )
    );
  };

  const value = {
    questions,
    isLoading,
    error,
    setQuestions,
    addQuestion,
    updateQuestion
  };

  return (
    <QuestionContext.Provider value={value}>
      {children}
    </QuestionContext.Provider>
  );
};