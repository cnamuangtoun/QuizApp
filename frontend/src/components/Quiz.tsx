import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SelectWordsQuestion from './SelectWordsQuestion';
import { IQuiz, IQuestion, IChoice } from '../types';
import API from '../api';



const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const { quizId } = useParams<{ quizId: string }>();
  const [quiz, setQuiz] = useState<IQuiz | null>(null);
  const [answers, setAnswers] = useState<{ [questionId: number]: number[] }>({});

  useEffect(() => {
    API.get<IQuiz>(`/quizzes/${quizId}/`)
      .then(response => {
        setQuiz(response.data)
      })
      .catch(error => console.log(error));
  }, [quizId]);

  const handleSubmit = async () => {
    if (!quiz) {
      console.log('No quiz data available to submit.');
      return;
    }

    const finalAnswer = Object.keys(answers).map(questionId => ({
      question: Number(questionId),
      choices: answers[Number(questionId)]
    }));
    
    try {
      await API.post(`submitQuiz/${quizId}/`, { finalAnswer });
      alert('Quiz submitted successfully!');
      navigate(`/scores/${quizId}`);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit the quiz.');
    }
  };

  const handleSelectionChange = (questionId: number, choiceId: number, type: string) => {
    setAnswers(prev => {
      switch (type) {
        case 'S':  // Single choice
          return { ...prev, [questionId]: [choiceId] };
        default:  // Multiple choice
          const currentChoices = prev[questionId] || [];
          if (currentChoices.includes(choiceId)) {
            return { ...prev, [questionId]: currentChoices.filter(id => id !== choiceId) };
          } else {
            return { ...prev, [questionId]: [...currentChoices, choiceId] };
          }
      }
    });
  };

  const renderChoices = (question: IQuestion) => {
    switch (question.question_type) {
      case 'S': // Single Choice
        return question.choices.map((choice: IChoice) => (
          <div key={choice.id}>
            <input type="radio" name={`question-${question.id}`}
              value={choice.id}
              checked={answers[question.id]?.includes(choice.id)}
              onChange={() => handleSelectionChange(question.id, choice.id, 'S')} />
            {choice.text}
          </div>
        ));
      case 'M': // Multiple Choice
        return question.choices.map((choice: IChoice) => (
          <div key={choice.id}>
            <input type="checkbox" name={`question-${question.id}`}
              value={choice.id}
              checked={answers[question.id]?.includes(choice.id)}
              onChange={() => handleSelectionChange(question.id, choice.id, 'M')} />
            {choice.text}
          </div>
        ));
      case 'T': // Text input for Select words
        return <SelectWordsQuestion sentence={question.text_answer} selectedIndices={answers[question.id] || []}
        onToggleWord={(index) => handleSelectionChange(question.id, index, 'T')} />
      default:
        return null;
    }
  };

  if (!quiz) return <div>Loading...</div>;

  return (
    <div>
      <h1>{quiz.title}</h1>
      {quiz.questions.map((question: IQuestion) => (
        <div key={question.id}>
          <h3>{question.text}</h3>
          {renderChoices(question)}
        </div>
      ))}
      <button onClick={handleSubmit} style={{ marginTop: '20px' }}>Submit Quiz</button>
    </div>
  );
};

export default Quiz;