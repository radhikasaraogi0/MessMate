import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { messService } from '../../services/api';
import Logo from '../../components/common/Logo';
import { Lock, Mail, User, Building, DoorClosed, ArrowRight, UtensilsCrossed, MapPin, ShieldCheck } from 'lucide-react';
import Alert from '../../components/common/Alert';

const HOSTEL_OPTIONS = [
  'Himalaya Block A',
  'Ganga Block B',
  'Cauvery Block C',
  'Godavari Block D',
  'Narmada Block E',
  'Yamuna Block F',
];

export const Register = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'mess' ? 'mess' : 'student';
  const [activeTab, setActiveTab] = useState(initialTab);

  const [messes, setMesses] = useState([]);
  const [loadingMesses, setLoadingMesses] = useState(true);

  // Student Form
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    password: '',
    hostel: 'Himalaya Block A',
    roomNumber: '',
    messId: '',
  });

  // Mess Registration Form
  const [messForm, setMessForm] = useState({
    messName: '',
    area: '',
    description: '',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    officeRoom: 'Mess Office',
  });

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register, setSession } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMesses = async () => {
      try {
        const res = await messService.getAllMesses();
        if (res.success && res.data) {
          setMesses(res.data);
          if (res.data.length > 0) {
            setStudentForm((prev) => ({ ...prev, messId: res.data[0]._id }));
          }
        }
      } catch (err) {
        console.error('Failed to load messes:', err);
      } finally {
        setLoadingMesses(false);
      }
    };
    fetchMesses();
  }, []);

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const { name, email, password, hostel, roomNumber, messId } = studentForm;

    if (!name || !email || !password || !hostel || !roomNumber || !messId) {
      setError('Please fill in all required fields and select your assigned mess.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setSubmitting(true);
      await register({
        name,
        email,
        password,
        hostel,
        roomNumber,
        messId,
        role: 'student',
      });
      navigate('/student/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMessSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const { messName, area, description, adminName, adminEmail, adminPassword, officeRoom } = messForm;

    if (!messName || !area || !adminName || !adminEmail || !adminPassword) {
      setError('Please provide mess name, area, and all admin authority details.');
      return;
    }

    if (adminPassword.length < 6) {
      setError('Admin password must be at least 6 characters long.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await messService.registerMess({
        messName,
        area,
        description,
        adminName,
        adminEmail,
        adminPassword,
        hostel: area,
        roomNumber: officeRoom || 'Mess Office',
      });

      if (res.success && res.data?.token) {
        setSession(res.data.token, res.data.user);
        navigate('/admin/dashboard', { replace: true });
      } else {
        setSuccessMsg('Mess registered successfully! Please log in.');
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to register new mess.');
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
        backgroundColor: '#111215',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: activeTab === 'mess' ? '540px' : '480px',
          backgroundColor: '#181a20',
          borderRadius: '20px',
          boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.6)',
          border: '1px solid #262933',
          padding: '36px 32px',
          transition: 'max-width 0.2s ease',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
            <Logo size="lg" />
          </div>
          <h2
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '1.65rem',
              fontWeight: '800',
              color: '#f8fafc',
              margin: '0 0 6px 0',
            }}
          >
            {activeTab === 'student' ? 'Student Registration' : 'Register New Mess'}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
            {activeTab === 'student'
              ? 'Join your campus mess on MessMate to rate meals and track menus'
              : 'Add your hostel dining hall and manage meals, complaints & reviews'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#131418',
            padding: '4px',
            borderRadius: '12px',
            border: '1px solid #262933',
            marginBottom: '20px',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setActiveTab('student');
              setError('');
            }}
            style={{
              flex: 1,
              padding: '9px 12px',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: activeTab === 'student' ? '#fef08a' : 'transparent',
              color: activeTab === 'student' ? '#0f1013' : '#94a3b8',
              fontWeight: '800',
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            🎓 Student Account
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('mess');
              setError('');
            }}
            style={{
              flex: 1,
              padding: '9px 12px',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: activeTab === 'mess' ? '#c4b5fd' : 'transparent',
              color: activeTab === 'mess' ? '#0f1013' : '#94a3b8',
              fontWeight: '800',
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            🏢 New Mess Authority
          </button>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {successMsg && <Alert type="success" message={successMsg} />}

        {/* STUDENT REGISTRATION FORM */}
        {activeTab === 'student' && (
          <form onSubmit={handleStudentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {/* Mess Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#f8fafc', marginBottom: '6px' }}>
                Select Your Mess *
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#fef08a' }}>
                  <UtensilsCrossed size={18} />
                </div>
                <select
                  required
                  value={studentForm.messId}
                  onChange={(e) => setStudentForm({ ...studentForm, messId: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: '10px',
                    border: '1px solid #2a2e39',
                    fontSize: '0.9rem',
                    outline: 'none',
                    backgroundColor: '#131418',
                    boxSizing: 'border-box',
                    color: '#f8fafc',
                    fontWeight: '600',
                  }}
                >
                  {loadingMesses ? (
                    <option value="">Loading messes...</option>
                  ) : (
                    messes.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.name} ({m.area})
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#f8fafc', marginBottom: '6px' }}>
                Full Name *
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika Saraogi"
                  value={studentForm.name}
                  onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: '10px',
                    border: '1px solid #2a2e39',
                    backgroundColor: '#131418',
                    color: '#f8fafc',
                    fontSize: '0.925rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#f8fafc', marginBottom: '6px' }}>
                College Email Address *
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="yourname@messmate.edu"
                  value={studentForm.email}
                  onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: '10px',
                    border: '1px solid #2a2e39',
                    backgroundColor: '#131418',
                    color: '#f8fafc',
                    fontSize: '0.925rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#f8fafc', marginBottom: '6px' }}>
                Password (min. 6 characters) *
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  placeholder="Create a strong password"
                  value={studentForm.password}
                  onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: '10px',
                    border: '1px solid #2a2e39',
                    backgroundColor: '#131418',
                    color: '#f8fafc',
                    fontSize: '0.925rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Hostel and Room Number Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#f8fafc', marginBottom: '6px' }}>
                  Hostel / Block *
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                    <Building size={18} />
                  </div>
                  <select
                    value={studentForm.hostel}
                    onChange={(e) => setStudentForm({ ...studentForm, hostel: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      borderRadius: '10px',
                      border: '1px solid #2a2e39',
                      backgroundColor: '#131418',
                      color: '#f8fafc',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  >
                    {HOSTEL_OPTIONS.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#f8fafc', marginBottom: '6px' }}>
                  Room No. *
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                    <DoorClosed size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 302"
                    value={studentForm.roomNumber}
                    onChange={(e) => setStudentForm({ ...studentForm, roomNumber: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      borderRadius: '10px',
                      border: '1px solid #2a2e39',
                      backgroundColor: '#131418',
                      color: '#f8fafc',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                marginTop: '8px',
                backgroundColor: '#fef08a',
                color: '#0f1013',
                border: 'none',
                padding: '13px',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: '800',
                cursor: submitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(254, 240, 138, 0.25)',
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? 'Creating Account...' : 'Register as Student'}
              {!submitting && <ArrowRight size={18} />}
            </button>
          </form>
        )}

        {/* NEW MESS REGISTRATION FORM */}
        {activeTab === 'mess' && (
          <form onSubmit={handleMessSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                backgroundColor: '#161c2e',
                border: '1px solid #23345d',
                fontSize: '0.825rem',
                color: '#93c5fd',
                lineHeight: 1.45,
              }}
            >
              📌 Register your Mess facility. An administrator account will be created automatically to manage menus, analytics, and student reviews.
            </div>

            {/* Mess Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#f8fafc', marginBottom: '6px' }}>
                Mess Name *
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#c4b5fd' }}>
                  <UtensilsCrossed size={18} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nilgiri Central Dining Hall"
                  value={messForm.messName}
                  onChange={(e) => setMessForm({ ...messForm, messName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: '10px',
                    border: '1px solid #2a2e39',
                    backgroundColor: '#131418',
                    color: '#f8fafc',
                    fontSize: '0.925rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Area */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#f8fafc', marginBottom: '6px' }}>
                Area / Zone *
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#c4b5fd' }}>
                  <MapPin size={18} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. West Campus Quad or Residential Sector 4"
                  value={messForm.area}
                  onChange={(e) => setMessForm({ ...messForm, area: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: '10px',
                    border: '1px solid #2a2e39',
                    backgroundColor: '#131418',
                    color: '#f8fafc',
                    fontSize: '0.925rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#f8fafc', marginBottom: '6px' }}>
                Mess Description (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Multi-tier dining serving engineering undergraduate blocks"
                value={messForm.description}
                onChange={(e) => setMessForm({ ...messForm, description: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #2a2e39',
                  backgroundColor: '#131418',
                  color: '#f8fafc',
                  fontSize: '0.925rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div
              style={{
                marginTop: '6px',
                paddingTop: '12px',
                borderTop: '1px dashed #262933',
                fontWeight: '700',
                fontSize: '0.85rem',
                color: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <ShieldCheck size={16} color="#c4b5fd" />
              Mess Authority (Admin) Account Details
            </div>

            {/* Admin Name & Office */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', color: '#f8fafc', marginBottom: '4px' }}>
                  Authority Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Supervisor Verma"
                  value={messForm.adminName}
                  onChange={(e) => setMessForm({ ...messForm, adminName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '9px',
                    border: '1px solid #2a2e39',
                    backgroundColor: '#131418',
                    color: '#f8fafc',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', color: '#f8fafc', marginBottom: '4px' }}>
                  Office Room
                </label>
                <input
                  type="text"
                  placeholder="Mess Office"
                  value={messForm.officeRoom}
                  onChange={(e) => setMessForm({ ...messForm, officeRoom: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '9px',
                    border: '1px solid #2a2e39',
                    backgroundColor: '#131418',
                    color: '#f8fafc',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Admin Email & Password */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', color: '#f8fafc', marginBottom: '4px' }}>
                  Official Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="admin@mess.edu"
                  value={messForm.adminEmail}
                  onChange={(e) => setMessForm({ ...messForm, adminEmail: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '9px',
                    border: '1px solid #2a2e39',
                    backgroundColor: '#131418',
                    color: '#f8fafc',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', color: '#f8fafc', marginBottom: '4px' }}>
                  Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Min. 6 characters"
                  value={messForm.adminPassword}
                  onChange={(e) => setMessForm({ ...messForm, adminPassword: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '9px',
                    border: '1px solid #2a2e39',
                    backgroundColor: '#131418',
                    color: '#f8fafc',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                marginTop: '10px',
                backgroundColor: '#c4b5fd',
                color: '#0f1013',
                border: 'none',
                padding: '13px',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: '800',
                cursor: submitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(196, 181, 253, 0.25)',
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? 'Registering Mess...' : 'Register Mess & Enter Portal'}
              {!submitting && <ArrowRight size={18} />}
            </button>
          </form>
        )}

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.875rem', color: '#94a3b8' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#fef08a', fontWeight: '800', textDecoration: 'none' }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
