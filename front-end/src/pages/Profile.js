import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_USER_PROFILE } from '../graphql/queries';
import './Profile.css';



function Profile() {
  const { username } = useParams();
  const [tabValue, setTabValue] = React.useState(0);
  const { loading, error, data } = useQuery(GET_USER_PROFILE, {
    variables: { username },
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">Error loading profile. Please try again later.</p>
      </div>
    );  
  }

  const { user } = data;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">{user.username[0].toUpperCase()}</div>
        <div className="profile-info">
          <h1 className="profile-username">{user.username}</h1>
          <p className="profile-email">{user.email}</p>
          <p className="profile-joined">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <h2 className="stat-value">{user.posts?.length || 0}</h2>
          <p className="stat-label">Posts</p>
        </div>
        <div className="stat-card">
          <h2 className="stat-value">{user.followers?.length || 0}</h2>
          <p className="stat-label">Followers</p>
        </div>
        <div className="stat-card">
          <h2 className="stat-value">{user.following?.length || 0}</h2>
          <p className="stat-label">Following</p>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-tabs">
          <button 
            className={`tab-button ${tabValue === 0 ? 'active' : ''}`}
            onClick={(e) => handleTabChange(e, 0)}
          >
            Posts
          </button>
          <button 
            className={`tab-button ${tabValue === 1 ? 'active' : ''}`}
            onClick={(e) => handleTabChange(e, 1)}
          >
            About
          </button>
        </div>

        <div className="tab-content">
          {tabValue === 0 ? (
            user.posts?.length > 0 ? (
              <div className="posts-grid">
                {user.posts.map((post) => (
                  <div className="post-card" key={post.id}>
                    <p className="post-content">{post.content}</p>
                    <p className="post-date">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-posts">No posts yet</p>
            )
          ) : (
            <div className="about-section">
              <h2 className="about-title">About {user.username}</h2>
              <p className="about-text">
                This user hasn't added any information yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;