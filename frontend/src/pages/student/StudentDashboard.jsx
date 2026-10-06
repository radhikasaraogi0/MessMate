import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mealService, feedbackService } from '../../services/api';
import StarRating from '../../components/common/StarRating';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import {
  MessageSquarePlus,
  Calendar,
  Utensils,
  Star,
  Award,
  ArrowRight,
  Clock,
  Sparkles,
  History,
  Lock,
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [todayMeals, setTodayMeals] = useState([]);
  const [summary, setSummary] = useState({ totalSubmissions: 0, avgRating: 0 });
  const [recentFeedback, setRecentFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const todayDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [mealsRes, historyRes] = await Promise.all([
          mealService.getTodayMeals(),
          feedbackService.getMyHistory({ limit: 4 }),
        ]);

        if (mealsRes.success) {
          setTodayMeals(mealsRes.data || []);
        }

        if (historyRes.success) {
          setSummary(historyRes.summary || { totalSubmissions: 0, avgRating: 0 });
          setRecentFeedback(historyRes.data || []);
        }
      } catch (err) {
        console.error('Dashboard load error:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading your mess dashboard..." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Welcome Banner Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
          borderRadius: '20px',
          padding: '28px 32px',
          color: '#ffffff',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          boxShadow: '0 10px 25px -5px rgba(234, 88, 12, 0.35)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.9, fontSize: '0.875rem', marginBottom: '6px' }}>
            <Calendar size={16} />
            <span>{todayDateStr}</span>
          </div>
          <h1
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(1.75rem, 4vw, 2.3rem)',
              fontWeight: '800',
              margin: '0 0 6px 0',
              letterSpacing: '-0.02em',
            }}
          >
            {getGreeting()}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ margin: 0, opacity: 0.92, fontSize: '0.95rem' }}>
            Mess: <strong>{user?.messId?.name || 'Assigned Mess'}</strong> {user?.messId?.area ? `(${user?.messId?.area})` : ''} &bull; Room <strong>{user?.roomNumber}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link
            to="/student/feedback"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#ffffff',
              color: '#c2410c',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '0.95rem',
              textDecoration: 'none',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'transform 0.15s ease',
            }}
          >
            <MessageSquarePlus size={18} />
            <span>Give Feedback</span>
          </Link>
          <Link
            to="/student/menu"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              padding: '12px 20px',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '0.95rem',
              textDecoration: 'none',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            <span>View Full Menu</span>
          </Link>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '18px',
        }}
      >
        {/* Your Feedback Submissions */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '20px 24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              backgroundColor: '#ffedd5',
              color: '#ea580c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <History size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>
              Your Submissions
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a' }}>
              {summary.totalSubmissions}
            </div>
          </div>
        </div>

        {/* Your Average Rating */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '20px 24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              backgroundColor: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Star size={26} fill="#d97706" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>
              Your Avg Rating
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a' }}>
                {summary.avgRating > 0 ? summary.avgRating.toFixed(1) : 'N/A'}
              </span>
              {summary.avgRating > 0 && <Star size={20} fill="#f59e0b" color="#f59e0b" />}
            </div>
          </div>
        </div>

        {/* Today's Meals Count */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '20px 24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              backgroundColor: '#e0f2fe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Utensils size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>
              Meals Planned Today
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a' }}>
              {todayMeals.length}
            </div>
          </div>
        </div>
      </div>

      {/* Today's Menu Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.35rem', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0' }}>
              Today's Mess Menu
            </h2>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
              Fresh food schedule and student average scores for each meal
            </p>
          </div>
          <Link
            to="/student/menu"
            style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#ea580c',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>Weekly Schedule</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {todayMeals.length === 0 ? (
          <EmptyState
            title="No menu logged for today"
            description="The mess supervisor has not uploaded today's meal schedule yet."
          />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '18px',
            }}
          >
            {todayMeals.map((meal) => (
              <div
                key={meal._id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '22px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Badge mealType={meal.mealType} size="md">
                        {meal.mealType}
                      </Badge>
                      {meal.timingStatus === 'serving' ? (
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: '700',
                            color: '#15803d',
                            backgroundColor: '#dcfce7',
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16a34a' }} />
                          Serving Now
                        </span>
                      ) : !meal.isFeedbackOpen && (
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: '700',
                            color: '#b45309',
                            backgroundColor: '#fef3c7',
                            padding: '2px 8px',
                            borderRadius: '9999px',
                          }}
                        >
                          Opens {meal.opensAt}
                        </span>
                      )}
                    </div>
                    {meal.avgRating ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <StarRating rating={meal.avgRating} size={15} showLabel={true} />
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                          ({meal.feedbackCount})
                        </span>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
                        No ratings yet
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1e293b', margin: '0 0 10px 0' }}>
                    {meal.items?.join(', ')}
                  </h3>

                  {meal.description && (
                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 16px 0', lineHeight: 1.45 }}>
                      {meal.description}
                    </p>
                  )}
                </div>

                <div style={{ paddingTop: '12px', borderTop: '1px solid #f1f5f9', marginTop: '12px' }}>
                  {meal.isFeedbackOpen ? (
                    <Link
                      to={`/student/feedback?mealType=${meal.mealType}&date=${meal.date}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '9px 14px',
                        borderRadius: '8px',
                        backgroundColor: '#fff7ed',
                        color: '#ea580c',
                        border: '1px solid #fed7aa',
                        fontSize: '0.875rem',
                        fontWeight: '700',
                        textDecoration: 'none',
                      }}
                    >
                      <MessageSquarePlus size={16} />
                      <span>Rate {meal.mealType}</span>
                    </Link>
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '9px 14px',
                        borderRadius: '8px',
                        backgroundColor: '#f8fafc',
                        color: '#64748b',
                        border: '1px solid #e2e8f0',
                        fontSize: '0.825rem',
                        fontWeight: '600',
                      }}
                      title={`Feedback will open when ${meal.mealType} begins at ${meal.opensAt}`}
                    >
                      <Lock size={14} color="#94a3b8" />
                      <span>Feedback Unlocks at {meal.opensAt || 'Meal Time'}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Feedback Given by Student */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.35rem', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0' }}>
              Your Recent Feedback
            </h2>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
              Past reviews submitted by your account
            </p>
          </div>
          <Link
            to="/student/history"
            style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#ea580c',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>View All ({summary.totalSubmissions})</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {recentFeedback.length === 0 ? (
          <EmptyState
            title="You haven't submitted feedback yet"
            description="Help improve the hostel dining experience by submitting your thoughts on today's meals!"
            action={
              <Link
                to="/student/feedback"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#ea580c',
                  color: '#ffffff',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  textDecoration: 'none',
                }}
              >
                <MessageSquarePlus size={16} />
                Submit Your First Review
              </Link>
            }
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
            {recentFeedback.map((fb, idx) => (
              <div
                key={fb._id}
                style={{
                  padding: '18px 24px',
                  borderBottom: idx < recentFeedback.length - 1 ? '1px solid #f1f5f9' : 'none',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <Badge mealType={fb.mealType} size="sm">
                    {fb.mealType}
                  </Badge>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <StarRating rating={fb.averageRating} size={15} showLabel={true} />
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>&bull;</span>
                      <span style={{ fontSize: '0.825rem', color: '#64748b' }}>{fb.date}</span>
                    </div>
                    {fb.comment && (
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: '#334155' }}>
                        "{fb.comment}"
                      </p>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {fb.issues && fb.issues.length > 0 && fb.issues[0] !== 'No issue' ? (
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: '6px',
                        backgroundColor: '#fef2f2',
                        color: '#b91c1c',
                        border: '1px solid #fecaca',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                      }}
                    >
                      {fb.issues.join(', ')}
                    </span>
                  ) : (
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: '6px',
                        backgroundColor: '#f0fdf4',
                        color: '#15803d',
                        border: '1px solid #bbf7d0',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                      }}
                    >
                      No issue reported
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
