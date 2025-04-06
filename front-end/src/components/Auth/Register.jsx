import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { REGISTER_USER } from '../../services/auth';
import { useNavigate } from 'react-router-dom';
import './auth.css';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    bio: '',
    avatarUrl: '',
    phoneNumber: ''
  });
  const [register] = useMutation(REGISTER_USER);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await register({ 
        variables: { 
          input: {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
            bio: formData.bio,
            avatarUrl: formData.avatarUrl,
            phoneNumber: formData.phoneNumber
          }
        }
      });
      
      localStorage.setItem('token', data.register.token);
      navigate('/feed');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2 className="auth-title">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              placeholder="Username"
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="Email"
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Password"
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              placeholder="Full Name"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              placeholder="Bio"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              value={formData.avatarUrl}
              onChange={(e) => setFormData({...formData, avatarUrl: e.target.value})}
              placeholder="Avatar URL"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              placeholder="Phone Number"
              className="form-input"
            />
          </div>
          <button type="submit" className="auth-button">Register</button>
        </form>
      </div>
    </div>
  );
}