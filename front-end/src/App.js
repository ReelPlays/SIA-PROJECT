import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import apolloClient from './apolloClient';
import Home from './pages/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Feed from './pages/Feed';
import './App.css';

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/feed" element={<Feed />} />
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
}

// This is the crucial line
export default App;