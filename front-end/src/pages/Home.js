import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="auth-container">
      <div className="home-content">
        <h1>Welcome to SocialFeed</h1>
        <div className="button-group">
          <Link to="/login" className="auth-button">
            Login
          </Link>
          <Link to="/register" className="auth-button">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;