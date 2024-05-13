import React, { useEffect, useState } from 'react';
import API from '../api';
import { QuizStat } from '../types';



const UserQuizStatistics: React.FC = () => {
    const [quizzes, setQuizzes] = useState<QuizStat[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [completedCount, setCompletedCount] = useState<number>(0);
    const [averageScore, setAverageScore] = useState<number | null>(null);

    useEffect(() => {
        setLoading(true);
        API.get<QuizStat[]>('userStats/')  // Adjust the endpoint as necessary
            .then(response => {
                const data = response.data;
                setQuizzes(data);
                setLoading(false);

                // Calculate the number of quizzes completed and average score
                const completedQuizzes = data.filter(quiz => quiz.completed);
                setCompletedCount(completedQuizzes.length);

                if (completedQuizzes.length > 0) {
                    const totalScore = completedQuizzes.reduce((acc, curr) => acc + (curr.score || 0), 0);
                    setAverageScore(totalScore / completedQuizzes.length);
                } else {
                    setAverageScore(null);
                }
            })
            .catch(err => {
                setError(err.response.data.message || "An error occurred");
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!quizzes.length) return <div>No Quiz Data Found</div>;

    return (
        <div>
            <h1>All Quiz Statistics</h1>
            <p>Total Quizzes: {quizzes.length}</p>
            <p>Quizzes Completed: {completedCount}</p>
            <p>Average Score: {averageScore !== null ? averageScore.toFixed(2) : 'N/A'}%</p>
            {quizzes.map((quiz, index) => (
                <div key={index}>
                    <h2>{quiz.quiz.title}</h2>
                    <p>Score: {quiz.score}%</p>
                </div>
            ))}
        </div>
    );
}

export default UserQuizStatistics;