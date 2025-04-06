import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_ME } from '../services/auth';

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const { loading, error } = useQuery(GET_ME);

  useEffect(() => {
    if (!loading && error) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [loading, error, navigate]);

  if (loading) return <div>Loading...</div>;
  if (error) return null;

  return children;
}