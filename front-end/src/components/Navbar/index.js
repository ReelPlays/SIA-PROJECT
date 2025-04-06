import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';



function Navbar() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isAuthenticated = localStorage.getItem('token');

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    handleClose();
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-logo">
          Social Media
        </Link>

        <div className="navbar-search">
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
          />
        </div>

        <div className="navbar-right">
          {isAuthenticated ? (
            <div className="navbar-user">
              <button
                className="user-menu-button"
                onClick={handleMenu}
                aria-label="User menu"
              >
                <span className="user-icon">👤</span>
              </button>
              {Boolean(anchorEl) && (
                <div className="user-menu">
                  <Link to="/feed" className="menu-item" onClick={handleClose}>
                    Feed
                  </Link>
                  <Link to="/profile/me" className="menu-item" onClick={handleClose}>
                    Profile
                  </Link>
                  <button className="menu-item" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-button">
                Login
              </Link>
              <Link to="/register" className="signup-button">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;