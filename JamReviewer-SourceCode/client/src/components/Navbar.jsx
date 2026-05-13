import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Music2, Search, LogOut, LayoutDashboard, Shield, Menu, X } from 'lucide-react';

const Navbar = ({ onSearch }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchVal);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <Music2 size={26} className="brand-icon" />
          <span>JamReviewer</span>
        </Link>

        {onSearch !== undefined && (
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search songs, artists, movies..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="search-input"
              />
            </div>
          </form>
        )}

        <div className="navbar-actions">
          {user ? (
            <>
              <span className="nav-role-badge">{user.role}</span>

              {user.role === 'CREATOR' && (
                <Link to="/creator" className="nav-link">
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </Link>
              )}
              {user.role === 'ADMIN' && (
                <Link to="/admin" className="nav-link">
                  <Shield size={18} />
                  <span>Admin</span>
                </Link>
              )}

              <span className="nav-username">{user.name}</span>
              <button onClick={handleLogout} className="btn-logout">
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-nav-outline">Login</Link>
              <Link to="/register" className="btn-nav-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
