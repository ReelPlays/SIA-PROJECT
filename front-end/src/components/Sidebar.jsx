import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="sidebar">
      <Link to="/feed" className="sidebar-item">
        <span>🏠</span> Home
      </Link>
      <Link to="/profile/me" className="sidebar-item">
        <span>👤</span> Profile
      </Link>
      <div className="sidebar-item">
        <span>👥</span> Friends
      </div>
      <div className="sidebar-item">
        <span>🔔</span> Notifications
      </div>
    </div>
  );
}

export default Sidebar;