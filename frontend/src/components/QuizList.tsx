import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';
import { IQuiz } from '../types';

const QuizList: React.FC = () => {
  const [quizzes, setQuizzes] = useState<IQuiz[]>([]);

  useEffect(() => {
    API.get<IQuiz[]>('quizzes/')
      .then(response => {
        setQuizzes(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the quizzes!', error);
      });
  }, []);

  return (
    <div>
      <h1>Available Quizzes</h1>
      <ul>
        {quizzes.map(quiz => (
          <li key={quiz.id}>
            <Link to={`/quiz/${quiz.id}`}>{quiz.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizList;