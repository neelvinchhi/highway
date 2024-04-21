import React from 'react';
import Preview from './preview';
import { BrowserRouter as Router, Routes, Route, Form } from 'react-router-dom';
import Chat from './chat';
import QuizComponent from './quiz';
import GoogleAuth from './googleauth';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<GoogleAuth />} />
          <Route path="/quiz" element={<QuizComponent />}/>
          <Route exact path="/dashboard" element={<Preview />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
