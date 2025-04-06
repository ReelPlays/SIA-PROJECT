import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_ME } from '../services/auth';

function Home() {
  const navigate = useNavigate();
  const { data, loading } = useQuery(GET_ME);
  const isLoggedIn = !!localStorage.getItem('token');

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to Our Social Network</h1>
        <p>Connect, Share, and Engage with Your Community</p>
        
        {!isLoggedIn ? (
          <div className="auth-buttons">
            <Link to="/login" className="btn btn-primary">Login</Link>
            <Link to="/register" className="btn btn-secondary">Register</Link>
          </div>
        ) : (
          <div className="user-welcome">
            <h2>Welcome back, {data?.me?.username}!</h2>
            <Link to="/feed" className="btn btn-primary">View Your Feed</Link>
            <Link to={`/profile/${data?.me?.username}`} className="btn btn-secondary">Your Profile</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;