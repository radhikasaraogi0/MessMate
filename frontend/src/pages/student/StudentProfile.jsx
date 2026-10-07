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
            color: '#f8fafc',
            margin: '0 0 6px 0',
          }}
        >
          Student Profile
        </h1>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.925rem' }}>
          Your university resident details and feedback engagement profile
        </p>
      </div>

      {/* Resident Identity Card */}
      <div
        style={{
          backgroundColor: '#181a20',
          borderRadius: '20px',
          border: '1px solid #262933',
          padding: '32px',
          boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '20px',
              backgroundColor: '#fef08a',
              color: '#0f1013',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: '900',
              fontFamily: "'Outfit', sans-serif",
              boxShadow: '0 8px 18px rgba(254, 240, 138, 0.25)',
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ margin: '0 0 6px 0', fontSize: '1.5rem', fontWeight: '800', color: '#f8fafc' }}>
              {user?.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>
              <span
                style={{
                  backgroundColor: '#262315',
                  color: '#fef08a',
                  border: '1px solid #785e1a',
                  padding: '3px 10px',
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
            borderTop: '1px solid #262933',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', backgroundColor: '#131418', border: '1px solid #22252e', borderRadius: '14px' }}>
            <UtensilsCrossed size={20} color="#fef08a" />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>Assigned Mess</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f8fafc' }}>
                {user?.messId?.name || 'Mess'} {user?.messId?.area ? `(${user?.messId?.area})` : ''}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', backgroundColor: '#131418', border: '1px solid #22252e', borderRadius: '14px' }}>
            <Building size={20} color="#c4b5fd" />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>Hostel Block</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f8fafc' }}>{user?.hostel}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', backgroundColor: '#131418', border: '1px solid #22252e', borderRadius: '14px' }}>
            <DoorClosed size={20} color="#fed7aa" />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>Room Number</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f8fafc' }}>Room {user?.roomNumber}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', backgroundColor: '#131418', border: '1px solid #22252e', borderRadius: '14px' }}>
            <Award size={20} color="#bbf7d0" />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>Reviews Submitted</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f8fafc' }}>{stats?.totalSubmissions || 0} reviews</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', backgroundColor: '#131418', border: '1px solid #22252e', borderRadius: '14px' }}>
            <Star size={20} color="#fbbf24" fill="#fbbf24" />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>Your Average Rating</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fef08a' }}>
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
