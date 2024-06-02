import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import MainLay from './components/MainLay';
import PostList from './components/PostList';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import 'tailwindcss/tailwind.css';

import './App.css'
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLay />} />
        <Route path="/posts" element={<PostList />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;

