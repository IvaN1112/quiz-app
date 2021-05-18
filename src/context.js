import axios from 'axios';
import React, { useState, useContext, useEffect } from 'react';

const table = {
  sports: 21,
  history: 23,
  politics: 24,
};

const API_ENDPOINT = 'https://opentdb.com/api.php?';

const url = '';
const tempUrl =
  'https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple';

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  //displaying quiz form if true
  const [waiting, setWaiting] = useState(true);
  //loading is for fetchingdata
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  //index of question displayed
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  //when we can't data from API, we generate error
  const [error, setError] = useState(false);
  const [quiz, setQuiz] = useState({
    amount: 10,
    category: 'sports',
    difficulty: 'easy',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchQuestions = async (url) => {
    setLoading(true);
    setWaiting(false);
    const response = await axios(url).catch((err) => console.log(err));
    if (response) {
      const data = response.data.results;
      if (data.length > 0) {
        setQuestions(data);
        setLoading(false);
        setError(false);
      } else {
        setLoading(false);
        setError(true);
        setWaiting(true);
      }
    } else {
      setWaiting(true);
      setError(true);
    }
  };
  const nextQuestion = () => {
    setIndex((oldIndex) => {
      const newIndex = oldIndex + 1;
      if (newIndex > questions.length - 1) {
        openModal(true);
      }
      return newIndex;
    });
  };
  const checkAnswer = (clickedAnswer, correctAnwer) => {
    nextQuestion();
    if (clickedAnswer === correctAnwer) {
      setCorrect(correct + 1);
    }
  };
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    //When we close the modal we will go back to the quiz form
    setWaiting(true);
    setCorrect(0);
  };
  const handleChange = (e) => {
    const name = e.target.name;
    setQuiz({ ...quiz, [name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const { amount, category, difficulty } = quiz;
    const url = `${API_ENDPOINT}amount=${amount}&category=${table[category]}&difficulty=${difficulty}&type=multiple`;
    fetchQuestions(url);
  };
  return (
    <AppContext.Provider
      value={{
        waiting,
        loading,
        questions,
        index,
        correct,
        error,
        isModalOpen,
        nextQuestion,
        checkAnswer,
        closeModal,
        quiz,
        handleChange,
        handleSubmit,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
