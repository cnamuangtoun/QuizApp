import React, { useEffect, useState } from 'react';
import API from '../api';
import { IQuiz } from '../types';

const UserQuizzes: React.FC = () => {
    const [quizzes, setQuizzes] = useState<IQuiz[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get('quizzes/user')
            .then(response => {
                setQuizzes(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Failed to fetch quizzes', error);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading quizzes...</div>;

    return (
        <div>
            <h1>Your Quizzes</h1>
            <ul>
                {quizzes.map(quiz => (
                    <li key={quiz.id}>{quiz.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default UserQuizzes;