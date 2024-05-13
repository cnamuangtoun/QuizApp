import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import RequireAuth from './RequireAuth';
import ScorePage from './components/ScorePage';
import QuizList from './components/QuizList';
import Quiz from './components/Quiz';
import UserStatistics from './components/UserStatistics'
import Login from './components/Login';



const Navigation: React.FC = () => {
  const { isAuthenticated } = useAuth();  // Access the authentication status and logout function

  return (
    <nav>
      <ul>
        {isAuthenticated ? (
          <>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/quizzes">Quizzes</Link></li>
            <li><Link to="/stats">Quiz Stats</Link></li>
          </>
        ) : (
          <li><Link to="/login">Log in</Link></li>
        )}
      </ul>
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div>
          <Navigation />
          <Routes>
            <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
            <Route path="/login" element={<Login />} />
            <Route path="/quizzes" element={<RequireAuth><QuizList /></RequireAuth>} />
            <Route path="/quiz/:quizId" element={<RequireAuth><Quiz /></RequireAuth>} />
            <Route path="/scores/:quizId" element={<RequireAuth><ScorePage /></RequireAuth>} />
            <Route path="/stats" element={<UserStatistics />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

// A simple Home component for demonstration
const Home: React.FC = () => {
  return <h1>Welcome to the Quiz page!</h1>;
};

export default App;