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
  ChevronRight,
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
          background: 'linear-gradient(135deg, #181a20 0%, #15161b 100%)',
          borderRadius: '20px',
          padding: '28px 32px',
          color: '#ffffff',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          border: '1px solid #282c38',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fef08a', fontSize: '0.875rem', marginBottom: '6px', fontWeight: '600' }}>
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
              color: '#f8fafc',
            }}
          >
            {getGreeting()}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem' }}>
            Mess: <strong style={{ color: '#fef08a' }}>{user?.messId?.name || 'Assigned Mess'}</strong> {user?.messId?.area ? `(${user?.messId?.area})` : ''} &bull; Room <strong>{user?.roomNumber}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link
            to="/student/feedback"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#fef08a',
              color: '#0f1013',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '0.95rem',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(254, 240, 138, 0.25)',
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
              backgroundColor: '#20232b',
              color: '#f8fafc',
              padding: '12px 20px',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '0.95rem',
              textDecoration: 'none',
              border: '1px solid #313644',
            }}
          >
            <span>View Full Menu</span>
          </Link>
        </div>
      </div>

      {/* Stats Summary Grid - Styled to match pastel reference cards */}
      {(() => {
        const activeMeal = todayMeals.find((m) => m.timingStatus === 'serving' || m.isFeedbackOpen);

        return (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '18px',
            }}
          >
            {/* Box 1: Your Average Rating - Warm Pastel Yellow */}
            <Link
              to="/student/history"
              style={{
                backgroundColor: '#fed066',
                borderRadius: '20px',
                padding: '22px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 8px 24px rgba(254, 208, 102, 0.25)',
                textDecoration: 'none',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(254, 208, 102, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(254, 208, 102, 0.25)';
              }}
            >
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#181a20', marginBottom: '6px' }}>
                  Your Average Rating
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0f1013', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {summary.avgRating > 0 ? (
                    <>
                      <span>{summary.avgRating.toFixed(1)}</span>
                      <span style={{ fontSize: '1.45rem', fontWeight: '700', color: '#3c3016' }}> / 5.0</span>
                    </>
                  ) : (
                    <span style={{ fontSize: '1.75rem', fontWeight: '800' }}>N/A</span>
                  )}
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: '600', color: '#3c3016', marginTop: '4px' }}>
                  {summary.totalSubmissions > 0 ? 'Your personal review average' : 'No feedback submitted yet'}
                </div>
              </div>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: '#0f1013',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                }}
              >
                <ChevronRight size={20} strokeWidth={2.6} />
              </div>
            </Link>

            {/* Box 2: Meals Planned Today - Soft Pastel Lavender */}
            <Link
              to="/student/menu"
              style={{
                backgroundColor: '#d8b4fe',
                borderRadius: '20px',
                padding: '22px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 8px 24px rgba(216, 180, 254, 0.25)',
                textDecoration: 'none',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(216, 180, 254, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(216, 180, 254, 0.25)';
              }}
            >
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#181a20', marginBottom: '6px' }}>
                  Meals Planned Today
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0f1013', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {todayMeals.length}
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: '600', color: '#3b0764', marginTop: '4px' }}>
                  {todayMeals.length > 0 ? `${todayMeals.length} meals on daily schedule` : 'No meals scheduled'}
                </div>
              </div>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: '#0f1013',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                }}
              >
                <ChevronRight size={20} strokeWidth={2.6} />
              </div>
            </Link>

            {/* Box 3: Your Submissions - Soft Pastel Lime */}
            <Link
              to="/student/history"
              style={{
                backgroundColor: '#bef264',
                borderRadius: '20px',
                padding: '22px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 8px 24px rgba(190, 242, 100, 0.25)',
                textDecoration: 'none',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(190, 242, 100, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(190, 242, 100, 0.25)';
              }}
            >
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#181a20', marginBottom: '6px' }}>
                  Your Submissions
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0f1013', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {summary.totalSubmissions || 0}
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: '600', color: '#273f08', marginTop: '4px' }}>
                  {summary.totalSubmissions === 1 ? '1 review submitted' : `${summary.totalSubmissions || 0} reviews submitted`}
                </div>
              </div>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: '#0f1013',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                }}
              >
                <ChevronRight size={20} strokeWidth={2.6} />
              </div>
            </Link>
          </div>
        );
      })()}

      {/* Today's Menu Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.5rem', fontWeight: '800', color: '#f8fafc', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
              Today's Mess Menu
            </h2>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8' }}>
              Today the mess menu is in the hostel mess and provides fresh daily options.
            </p>
          </div>
          <Link
            to="/student/menu"
            style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#94a3b8',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fef08a')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
            }}
          >
            {todayMeals.map((meal, index) => {
              // Parse meal items into an array if they are comma-separated or list
              let itemList = [];
              if (Array.isArray(meal.items)) {
                itemList = meal.items.flatMap((item) =>
                  typeof item === 'string'
                    ? item.split(',').map((s) => s.trim()).filter(Boolean)
                    : [item]
                );
              } else if (typeof meal.items === 'string') {
                itemList = meal.items.split(',').map((s) => s.trim()).filter(Boolean);
              }

              // Determine timing pill
              const isServing = meal.timingStatus === 'serving' || meal.isFeedbackOpen;
              const opensText = meal.opensAt ? `Opens ${meal.opensAt}` : null;

              // Find first locked meal index to display full unlock text vs compact lock icon
              const firstLockedIndex = todayMeals.findIndex((m) => !m.isFeedbackOpen);
              const isFirstLockedMeal = index === firstLockedIndex;

              // Dynamic community rating calculated strictly from feedback submissions
              const hasRating = meal.avgRating && Number(meal.avgRating) > 0;
              const displayRating = hasRating ? Number(meal.avgRating).toFixed(1) : 'N/A';

              return (
                <div
                  key={meal._id}
                  style={{
                    backgroundColor: '#181b24',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid #262b3a',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '380px',
                    transition: 'border-color 0.15s ease',
                  }}
                >
                  <div>
                    {/* Top Header: Badge on Left & Single Star + Numeric Rating on Right */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '14px',
                      }}
                    >
                      <Badge mealType={meal.mealType} size="md">
                        {meal.mealType}
                      </Badge>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Star size={17} fill={hasRating ? '#fbbf24' : 'none'} color={hasRating ? '#fbbf24' : '#64748b'} />
                        <span style={{ fontSize: '0.95rem', fontWeight: '800', color: hasRating ? '#f8fafc' : '#94a3b8' }}>
                          {displayRating}
                        </span>
                      </div>
                    </div>

                    {/* Opens Timing Capsule or Subtitle */}
                    {isServing ? (
                      <div
                        style={{
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          color: '#94a3b8',
                          marginBottom: '14px',
                        }}
                      >
                        {meal.description || 'Real mess meal'}
                      </div>
                    ) : opensText ? (
                      <div style={{ marginBottom: '14px' }}>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: '#cbd5e1',
                            backgroundColor: '#222736',
                            border: '1px solid #2e3547',
                            padding: '3px 10px',
                            borderRadius: '9999px',
                            display: 'inline-block',
                          }}
                        >
                          {opensText}
                        </span>
                      </div>
                    ) : (
                      <div
                        style={{
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          color: '#94a3b8',
                          marginBottom: '14px',
                        }}
                      >
                        {meal.description || 'Real mess meal'}
                      </div>
                    )}

                    {/* Bulleted List of Dishes */}
                    <div style={{ marginBottom: '16px' }}>
                      <ul
                        style={{
                          margin: 0,
                          padding: 0,
                          listStyle: 'none',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                        }}
                      >
                        {itemList && itemList.length > 0 ? (
                          itemList.map((dish, idx) => (
                            <li
                              key={idx}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '0.875rem',
                                color: '#cbd5e1',
                                fontWeight: '500',
                                lineHeight: 1.35,
                              }}
                            >
                              <span
                                style={{
                                  width: '4px',
                                  height: '4px',
                                  borderRadius: '50%',
                                  backgroundColor: '#94a3b8',
                                  flexShrink: 0,
                                }}
                              />
                              <span>{dish}</span>
                            </li>
                          ))
                        ) : (
                          <li
                            style={{
                              fontSize: '0.85rem',
                              color: '#64748b',
                              fontStyle: 'italic',
                            }}
                          >
                            Menu items will be updated shortly
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Bottom Action Button */}
                  <div style={{ marginTop: 'auto', paddingTop: '14px' }}>
                    {meal.isFeedbackOpen ? (
                      <Link
                        to={`/student/feedback?mealType=${meal.mealType}&date=${meal.date}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '11px 16px',
                          borderRadius: '12px',
                          backgroundColor: '#fef08a',
                          color: '#0f1013',
                          fontSize: '0.875rem',
                          fontWeight: '800',
                          textDecoration: 'none',
                          boxShadow: '0 4px 14px rgba(254, 240, 138, 0.25)',
                          transition: 'transform 0.15s ease, filter 0.15s ease',
                        }}
                      >
                        <span>Rate {meal.mealType}</span>
                      </Link>
                    ) : isFirstLockedMeal ? (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          borderRadius: '12px',
                          backgroundColor: '#1a1e2b',
                          border: '1px solid #2e3547',
                          color: '#64748b',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          cursor: 'not-allowed',
                          textAlign: 'center',
                        }}
                        title={`Feedback will open at ${meal.opensAt || 'scheduled time'}`}
                      >
                        <span style={{ flex: 1, textAlign: 'center' }}>
                          Feedback Unlocks at {meal.opensAt || '12:30 PM'}
                        </span>
                        <Lock size={15} color="#64748b" style={{ flexShrink: 0, marginLeft: '6px' }} />
                      </div>
                    ) : (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '11px 16px',
                          borderRadius: '12px',
                          backgroundColor: '#1a1e2b',
                          border: '1px solid #2e3547',
                          color: '#64748b',
                          cursor: 'not-allowed',
                        }}
                        title={`Feedback unlocks at ${meal.opensAt || 'scheduled time'}`}
                      >
                        <Lock size={16} color="#64748b" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Feedback Given by Student */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.35rem', fontWeight: '700', color: '#f8fafc', margin: '0 0 4px 0' }}>
              Your Recent Feedback
            </h2>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8' }}>
              Past reviews submitted by your account
            </p>
          </div>
          <Link
            to="/student/history"
            style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#fef08a',
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
                  backgroundColor: '#fef08a',
                  color: '#0f1013',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  fontWeight: '700',
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
              backgroundColor: '#181a20',
              borderRadius: '16px',
              border: '1px solid #262933',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            {recentFeedback.map((fb, idx) => (
              <div
                key={fb._id}
                style={{
                  padding: '18px 24px',
                  borderBottom: idx < recentFeedback.length - 1 ? '1px solid #232630' : 'none',
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
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>&bull;</span>
                      <span style={{ fontSize: '0.825rem', color: '#94a3b8' }}>{fb.date}</span>
                    </div>
                    {fb.comment && (
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: '#f8fafc' }}>
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
                        backgroundColor: '#30161a',
                        color: '#fca5a5',
                        border: '1px solid #4a2126',
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
                        backgroundColor: '#122b1c',
                        color: '#86efac',
                        border: '1px solid #1f4f32',
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
