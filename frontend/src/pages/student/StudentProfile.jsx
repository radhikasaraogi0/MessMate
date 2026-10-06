import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { feedbackService } from '../../services/api';
import { User, Building, DoorClosed, Mail, Calendar, Award, Star, UtensilsCrossed } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export const StudentProfile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await feedbackService.getMyHistory();
        if (res.success && res.summary) {
          setStats(res.summary);
        }
      } catch (err) {
        console.error('Profile stats error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '1.85rem',
            fontWeight: '800',
            color: '#0f172a',
            margin: '0 0 6px 0',
          }}
        >
          Student Profile
        </h1>
        <p style={{ margin: 0, color: '#64748b', fontSize: '0.925rem' }}>
          Your university resident details and feedback engagement profile
        </p>
      </div>

      {/* Resident Identity Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          padding: '32px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '20px',
              backgroundColor: '#ea580c',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: '800',
              fontFamily: "'Outfit', sans-serif",
              boxShadow: '0 10px 15px -3px rgba(234, 88, 12, 0.3)',
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>
              {user?.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.9rem' }}>
              <span
                style={{
                  backgroundColor: '#fff7ed',
                  color: '#ea580c',
                  border: '1px solid #fed7aa',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                }}
              >
                Resident Student
              </span>
              <span>&bull;</span>
              <span>{user?.email}</span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            paddingTop: '20px',
            borderTop: '1px solid #f1f5f9',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
            <UtensilsCrossed size={20} color="#ea580c" />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Assigned Mess</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>
                {user?.messId?.name || 'Mess'} {user?.messId?.area ? `(${user?.messId?.area})` : ''}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
            <Building size={20} color="#ea580c" />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Hostel Block</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>{user?.hostel}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
            <DoorClosed size={20} color="#ea580c" />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Room Number</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>Room {user?.roomNumber}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
            <Award size={20} color="#ea580c" />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Reviews Submitted</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>{stats?.totalSubmissions || 0} reviews</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
            <Star size={20} color="#f59e0b" fill="#f59e0b" />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Your Average Rating</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>
                {stats?.avgRating ? `${stats.avgRating} ★` : 'No reviews yet'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
