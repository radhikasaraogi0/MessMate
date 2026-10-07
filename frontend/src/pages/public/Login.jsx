import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { messService } from '../../services/api';
import Logo from '../../components/common/Logo';
import { Lock, Mail, ArrowRight, UtensilsCrossed, ChevronDown } from 'lucide-react';
import Alert from '../../components/common/Alert';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedMessId, setSelectedMessId] = useState('');
  const [messes, setMesses] = useState([]);
  const [loadingMesses, setLoadingMesses] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchMesses = async () => {
      try {
        const res = await messService.getAllMesses();
        if (res.success && res.data) {
          setMesses(res.data);
          if (res.data.length > 0) {
            setSelectedMessId(res.data[0]._id);
          }
        }
      } catch (err) {
        console.error('Failed to load mess list:', err);
      } finally {
        setLoadingMesses(false);
      }
    };

    fetchMesses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedMessId) {
      setError('Please select your assigned mess from the list');
      return;
    }

    if (!email || !password) {
      setError('Please provide both email and password');
      return;
    }

    try {
      setSubmitting(true);
      const user = await login(email, password, selectedMessId);

      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/student/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 68px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '36px 16px',
        backgroundColor: '#080d1a',
        backgroundImage: 'radial-gradient(circle at 10% 25%, rgba(30, 58, 98, 0.45) 0%, transparent 45%), radial-gradient(circle at 90% 75%, rgba(22, 45, 78, 0.5) 0%, transparent 50%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '470px',
          backgroundColor: '#0f172a',
          borderRadius: '24px',
          boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(30, 41, 59, 0.9)',
          border: '1px solid #1e293b',
          padding: '38px 32px',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <Logo size="lg" />
          </div>
          <h2
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '1.75rem',
              fontWeight: '800',
              color: '#f8fafc',
              margin: '0 0 6px 0',
              letterSpacing: '-0.02em',
            }}
          >
            Welcome Back
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0, fontWeight: '500' }}>
            Sign in to access your MessMate dining portal
          </p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Mess Selector Dropdown */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: '700',
                color: '#f8fafc',
                marginBottom: '6px',
              }}
            >
              Select Your Mess *
            </label>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#facc15',
                  display: 'flex',
                  pointerEvents: 'none',
                }}
              >
                <UtensilsCrossed size={18} />
              </div>
              <select
                required
                value={selectedMessId}
                onChange={(e) => setSelectedMessId(e.target.value)}
                disabled={loadingMesses}
                style={{
                  width: '100%',
                  padding: '12px 38px 12px 42px',
                  borderRadius: '12px',
                  border: '1px solid #1e293b',
                  fontSize: '0.925rem',
                  outline: 'none',
                  backgroundColor: '#0b1321',
                  boxSizing: 'border-box',
                  color: '#f8fafc',
                  fontWeight: '600',
                  cursor: 'pointer',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#facc15';
                  e.target.style.boxShadow = '0 0 0 3px rgba(250, 204, 21, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#1e293b';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {loadingMesses ? (
                  <option value="">Loading registered messes...</option>
                ) : (
                  messes.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.name} ({m.area})
                    </option>
                  ))
                )}
              </select>
              <div
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                  display: 'flex',
                  pointerEvents: 'none',
                }}
              >
                <ChevronDown size={18} />
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
              Both students and authorities must select their assigned mess.
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: '700',
                color: '#f8fafc',
                marginBottom: '6px',
              }}
            >
              Email Address *
            </label>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                  display: 'flex',
                }}
              >
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                placeholder="you@messmate.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '12px',
                  border: '1px solid #1e293b',
                  backgroundColor: '#0b1321',
                  color: '#f8fafc',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#facc15';
                  e.target.style.boxShadow = '0 0 0 3px rgba(250, 204, 21, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#1e293b';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: '700',
                color: '#f8fafc',
                marginBottom: '6px',
              }}
            >
              Password *
            </label>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                  display: 'flex',
                }}
              >
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '12px',
                  border: '1px solid #1e293b',
                  backgroundColor: '#0b1321',
                  color: '#f8fafc',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#facc15';
                  e.target.style.boxShadow = '0 0 0 3px rgba(250, 204, 21, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#1e293b';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            style={{
              marginTop: '8px',
              backgroundColor: '#facc15',
              color: '#0f172a',
              border: 'none',
              padding: '14px',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '800',
              cursor: submitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 8px 24px rgba(250, 204, 21, 0.3)',
              opacity: submitting ? 0.7 : 1,
              transition: 'transform 0.15s ease, filter 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.filter = 'none')}
          >
            <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
            {!submitting && <ArrowRight size={18} strokeWidth={2.5} />}
          </button>
        </form>

        {/* Footer Links */}
        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.875rem', color: '#94a3b8' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#facc15', fontWeight: '800', textDecoration: 'none' }}>
            Register as a Student
          </Link>
        </div>

        <div
          style={{
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid #1e293b',
            textAlign: 'center',
            fontSize: '0.85rem',
            color: '#94a3b8',
          }}
        >
          Mess authority wanting to join?{' '}
          <Link to="/register?tab=mess" style={{ color: '#facc15', fontWeight: '800', textDecoration: 'none' }}>
            Register a New Mess
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
