import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { messService } from '../../services/api';
import Logo from '../../components/common/Logo';
import { Lock, Mail, ArrowRight, UtensilsCrossed } from 'lucide-react';
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
        padding: '32px 16px',
        backgroundColor: '#f8fafc',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02)',
          border: '1px solid #e2e8f0',
          padding: '36px 32px',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
            <Logo size="lg" />
          </div>
          <h2
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '1.65rem',
              fontWeight: '800',
              color: '#0f172a',
              margin: '0 0 6px 0',
            }}
          >
            Welcome Back
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
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
                fontWeight: '600',
                color: '#334155',
                marginBottom: '6px',
              }}
            >
              Select Your Mess *
            </label>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#ea580c',
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
                  padding: '11px 12px 11px 40px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.925rem',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                  boxSizing: 'border-box',
                  color: '#0f172a',
                  fontWeight: '500',
                  cursor: 'pointer',
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
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
              Both students and authorities must select their assigned mess.
            </div>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: '600',
                color: '#334155',
                marginBottom: '6px',
              }}
            >
              Email Address *
            </label>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '12px',
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
                  padding: '11px 12px 11px 40px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s ease',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#ea580c')}
                onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
              />
            </div>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: '600',
                color: '#334155',
                marginBottom: '6px',
              }}
            >
              Password *
            </label>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '12px',
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
                  padding: '11px 12px 11px 40px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s ease',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#ea580c')}
                onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              marginTop: '6px',
              backgroundColor: '#ea580c',
              color: '#ffffff',
              border: 'none',
              padding: '13px',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: submitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 6px -1px rgba(234, 88, 12, 0.3)',
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
            {!submitting && <ArrowRight size={18} />}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#ea580c', fontWeight: '700', textDecoration: 'none' }}>
            Register as a Student
          </Link>
        </div>

        <div
          style={{
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid #f1f5f9',
            textAlign: 'center',
            fontSize: '0.85rem',
            color: '#64748b',
          }}
        >
          Mess authority wanting to join?{' '}
          <Link to="/register?tab=mess" style={{ color: '#0284c7', fontWeight: '700', textDecoration: 'none' }}>
            Register a New Mess
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
