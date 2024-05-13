import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';



function ScorePage() {
  const { quizId } = useParams();
  const [score, setScore] = useState(null);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const response = await API.get(`scores/${quizId}/`);
        console.log(response.data)
        setScore(response.data.score);
      } catch (error) {
        console.error('Failed to fetch score:', error);
      }
    };

    fetchScore();
  }, [quizId]);

  return (
    <div>
      <h1>Your Score</h1>
      {score !== null ? <p>Your score for this quiz is: {score}</p> : <p>Loading...</p>}
    </div>
  );
}

export default ScorePage;