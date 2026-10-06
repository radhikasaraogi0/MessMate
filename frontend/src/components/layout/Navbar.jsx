import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../common/Logo';
import {
  Menu as MenuIcon,
  X,
  LogOut,
  User,
  LayoutDashboard,
  CalendarDays,
  MessageSquarePlus,
  History,
  ShieldCheck,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 0.15s ease',
    color: isActive ? '#ea580c' : '#475569',
    backgroundColor: isActive ? '#fff7ed' : 'transparent',
  });

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 20px',
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo */}
        <Link
          to={!isAuthenticated ? '/' : isAdmin ? '/admin/dashboard' : '/student/dashboard'}
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
          }}
        >
          <Logo size="md" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '6px',
          }}
          className="desktop-nav"
        >
          {!isAuthenticated ? (
            <>
              <NavLink to="/" style={navLinkStyle}>
                Home
              </NavLink>
              <NavLink to="/login" style={navLinkStyle}>
                Login
              </NavLink>
              <Link
                to="/register"
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  backgroundColor: '#ea580c',
                  color: '#ffffff',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  marginLeft: '8px',
                  boxShadow: '0 2px 4px rgba(234, 88, 12, 0.25)',
                }}
              >
                Student Signup
              </Link>
            </>
          ) : !isAdmin ? (
            <>
              <NavLink to="/student/dashboard" style={navLinkStyle}>
                <LayoutDashboard size={17} />
                Dashboard
              </NavLink>
              <NavLink to="/student/menu" style={navLinkStyle}>
                <CalendarDays size={17} />
                Mess Menu
              </NavLink>
              <NavLink to="/student/feedback" style={navLinkStyle}>
                <MessageSquarePlus size={17} />
                Give Feedback
              </NavLink>
              <NavLink to="/student/history" style={navLinkStyle}>
                <History size={17} />
                My History
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/admin/dashboard" style={navLinkStyle}>
                <LayoutDashboard size={17} />
                Overview
              </NavLink>
              <NavLink to="/admin/feedback" style={navLinkStyle}>
                Feedback Logs
              </NavLink>
              <NavLink to="/admin/menu" style={navLinkStyle}>
                Menu Management
              </NavLink>
              <NavLink to="/admin/analytics" style={navLinkStyle}>
                Analytics
              </NavLink>
              <NavLink to="/admin/students" style={navLinkStyle}>
                Students
              </NavLink>
            </>
          )}
        </nav>

        {/* Right Section: User Profile & Actions */}
        {isAuthenticated && (
          <div
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '14px',
            }}
            className="desktop-nav"
          >
            <Link
              to={isAdmin ? '/admin/dashboard' : '/student/profile'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '6px 12px',
                borderRadius: '8px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                textDecoration: 'none',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: isAdmin ? '#f3e8ff' : '#ffedd5',
                  color: isAdmin ? '#7e22ce' : '#c2410c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                }}
              >
                {isAdmin ? <ShieldCheck size={18} /> : user?.name?.charAt(0).toUpperCase()}
              </div>
              <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#0f172a',
                  }}
                >
                  {user?.name?.split(' ')[0]}
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    color: '#ea580c',
                    fontWeight: '600',
                    display: 'block',
                    maxWidth: '180px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  📍 {user?.messId?.name || (isAdmin ? 'Mess Admin' : user?.hostel)}
                </span>
              </div>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              style={{
                background: '#f1f5f9',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#64748b',
                fontWeight: '600',
                fontSize: '0.85rem',
                transition: 'all 0.15s ease',
              }}
              title="Logout"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fee2e2';
                e.currentTarget.style.color = '#dc2626';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
                e.currentTarget.style.color = '#64748b';
              }}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        )}

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'none',
            border: 'none',
            padding: '8px',
            color: '#334155',
            cursor: 'pointer',
          }}
          className="mobile-toggle"
        >
          {mobileMenuOpen ? <X size={26} /> : <MenuIcon size={26} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderTop: '1px solid #f1f5f9',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
          className="mobile-drawer"
        >
          {!isAuthenticated ? (
            <>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                style={{ padding: '10px 0', textDecoration: 'none', color: '#334155', fontWeight: '600' }}
              >
                Home
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                style={{ padding: '10px 0', textDecoration: 'none', color: '#334155', fontWeight: '600' }}
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  backgroundColor: '#ea580c',
                  color: '#ffffff',
                  textAlign: 'center',
                  fontWeight: '600',
                  textDecoration: 'none',
                }}
              >
                Student Signup
              </Link>
            </>
          ) : !isAdmin ? (
            <>
              <Link
                to="/student/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                style={{ padding: '10px 0', textDecoration: 'none', color: '#334155', fontWeight: '600' }}
              >
                Dashboard
              </Link>
              <Link
                to="/student/menu"
                onClick={() => setMobileMenuOpen(false)}
                style={{ padding: '10px 0', textDecoration: 'none', color: '#334155', fontWeight: '600' }}
              >
                Mess Menu
              </Link>
              <Link
                to="/student/feedback"
                onClick={() => setMobileMenuOpen(false)}
                style={{ padding: '10px 0', textDecoration: 'none', color: '#334155', fontWeight: '600' }}
              >
                Give Feedback
              </Link>
              <Link
                to="/student/history"
                onClick={() => setMobileMenuOpen(false)}
                style={{ padding: '10px 0', textDecoration: 'none', color: '#334155', fontWeight: '600' }}
              >
                Feedback History
              </Link>
              <Link
                to="/student/profile"
                onClick={() => setMobileMenuOpen(false)}
                style={{ padding: '10px 0', textDecoration: 'none', color: '#334155', fontWeight: '600' }}
              >
                My Profile
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                style={{
                  marginTop: '8px',
                  padding: '10px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                style={{ padding: '10px 0', textDecoration: 'none', color: '#334155', fontWeight: '600' }}
              >
                Overview
              </Link>
              <Link
                to="/admin/feedback"
                onClick={() => setMobileMenuOpen(false)}
                style={{ padding: '10px 0', textDecoration: 'none', color: '#334155', fontWeight: '600' }}
              >
                Feedback Logs
              </Link>
              <Link
                to="/admin/menu"
                onClick={() => setMobileMenuOpen(false)}
                style={{ padding: '10px 0', textDecoration: 'none', color: '#334155', fontWeight: '600' }}
              >
                Menu Management
              </Link>
              <Link
                to="/admin/analytics"
                onClick={() => setMobileMenuOpen(false)}
                style={{ padding: '10px 0', textDecoration: 'none', color: '#334155', fontWeight: '600' }}
              >
                Analytics
              </Link>
              <Link
                to="/admin/students"
                onClick={() => setMobileMenuOpen(false)}
                style={{ padding: '10px 0', textDecoration: 'none', color: '#334155', fontWeight: '600' }}
              >
                Students
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                style={{
                  marginTop: '8px',
                  padding: '10px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
