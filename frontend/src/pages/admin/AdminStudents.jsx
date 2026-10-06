import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/api';
import StarRating from '../../components/common/StarRating';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import EmptyState from '../../components/common/EmptyState';
import { Users, Search, Building, DoorClosed, MessageSquare, Star } from 'lucide-react';

const HOSTEL_OPTIONS = [
  'Himalaya Block A',
  'Ganga Block B',
  'Cauvery Block C',
  'Godavari Block D',
  'Narmada Block E',
  'Yamuna Block F',
];

export const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedHostel, setSelectedHostel] = useState('');

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedHostel) params.hostel = selectedHostel;

      const res = await studentService.getAllStudents(params);
      if (res.success) {
        setStudents(res.data || []);
      }
    } catch (err) {
      console.error('Fetch students error:', err);
      setError('Failed to fetch student directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [selectedHostel]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStudents();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title */}
      <div>
        <h1
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '1.85rem',
            fontWeight: '800',
            color: '#0f172a',
            margin: '0 0 4px 0',
          }}
        >
          Registered Student Directory
        </h1>
        <p style={{ margin: 0, color: '#64748b', fontSize: '0.925rem' }}>
          Overview of registered hostel residents, feedback contribution rates, and average ratings given
        </p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Filter and Search Bar */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '18px 20px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '14px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flex: 1, gap: '10px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search by student name, email, or room number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 40px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: '10px 18px',
              backgroundColor: '#ea580c',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            Search
          </button>
        </form>

        <select
          value={selectedHostel}
          onChange={(e) => setSelectedHostel(e.target.value)}
          style={{
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            fontSize: '0.85rem',
            outline: 'none',
            backgroundColor: '#ffffff',
          }}
        >
          <option value="">All Hostels</option>
          {HOSTEL_OPTIONS.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
      </div>

      {/* Students Table */}
      {loading ? (
        <LoadingSpinner message="Loading student roster..." />
      ) : students.length === 0 ? (
        <EmptyState
          title="No students found"
          description="Try adjusting your search keywords or hostel filter."
        />
      ) : (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: '700' }}>
                  <th style={{ padding: '14px 20px' }}>Student</th>
                  <th style={{ padding: '14px 20px' }}>Hostel Block</th>
                  <th style={{ padding: '14px 20px' }}>Room No.</th>
                  <th style={{ padding: '14px 20px' }}>Reviews Submitted</th>
                  <th style={{ padding: '14px 20px' }}>Average Rating Given</th>
                  <th style={{ padding: '14px 20px' }}>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => (
                  <tr
                    key={student._id}
                    style={{
                      borderBottom: idx < students.length - 1 ? '1px solid #f1f5f9' : 'none',
                    }}
                  >
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: '#ffedd5',
                            color: '#c2410c',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                          }}
                        >
                          {student.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: '700', color: '#0f172a' }}>{student.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', color: '#334155' }}>
                      {student.hostel}
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: '600', color: '#0f172a' }}>
                      Room {student.roomNumber}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span
                        style={{
                          backgroundColor: '#f1f5f9',
                          padding: '3px 10px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: '700',
                          color: '#334155',
                        }}
                      >
                        {student.feedbackCount} feedback entries
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      {student.avgRating ? (
                        <StarRating rating={student.avgRating} size={15} showLabel={true} />
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
                          No reviews yet
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#64748b', fontSize: '0.8rem' }}>
                      {new Date(student.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;
