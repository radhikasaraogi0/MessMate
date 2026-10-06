import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { analyticsService, feedbackService } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import Badge from '../../components/common/Badge';
import StarRating from '../../components/common/StarRating';
import {
  Users,
  MessageSquareText,
  Star,
  AlertTriangle,
  TrendingUp,
  UtensilsCrossed,
  BarChart3,
  Calendar,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [mealRatings, setMealRatings] = useState([]);
  const [ratingTrend, setRatingTrend] = useState([]);
  const [issuesData, setIssuesData] = useState([]);
  const [recentFeedbacks, setRecentFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      const [overRes, mealRes, trendRes, issueRes, fbRes] = await Promise.all([
        analyticsService.getOverview(),
        analyticsService.getMealRatings(),
        analyticsService.getRatingTrend(7),
        analyticsService.getIssues(),
        feedbackService.getAllFeedback({ limit: 5 }),
      ]);

      if (overRes.success) setOverview(overRes.data);
      if (mealRes.success) setMealRatings(mealRes.data);
      if (trendRes.success) setRatingTrend(trendRes.data);
      if (issueRes.success) setIssuesData(issueRes.data);
      if (fbRes.success) setRecentFeedbacks(fbRes.data);
    } catch (err) {
      console.error('Admin dashboard data fetch error:', err);
      setError('Failed to fetch analytics data from server.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return <LoadingSpinner message="Calculating dynamic mess analytics..." />;
  }

  // Bar colors for Meal Types
  const MEAL_BAR_COLORS = {
    Breakfast: '#f59e0b',
    Lunch: '#0284c7',
    Snacks: '#ea580c',
    Dinner: '#9333ea',
  };

  // Issue Bar colors
  const ISSUE_COLORS = [
    '#ef4444',
    '#f97316',
    '#eab308',
    '#84cc16',
    '#06b6d4',
    '#6366f1',
    '#a855f7',
    '#ec4899',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Banner Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: '700',
                padding: '3px 10px',
                borderRadius: '6px',
                backgroundColor: '#eff6ff',
                color: '#1d4ed8',
                border: '1px solid #bfdbfe',
              }}
            >
              📍 {user?.messId?.name || 'Assigned Mess'} {user?.messId?.area ? `(${user?.messId?.area})` : ''}
            </span>
          </div>
          <h1
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '2rem',
              fontWeight: '800',
              color: '#0f172a',
              margin: '0 0 6px 0',
            }}
          >
            Mess Authority Analytics Dashboard
          </h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>
            Live aggregation metrics, meal ratings breakdown, and student issue patterns
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            color: '#334155',
            fontWeight: '600',
            fontSize: '0.875rem',
            cursor: refreshing ? 'not-allowed' : 'pointer',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          }}
        >
          <RefreshCw size={16} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          <span>{refreshing ? 'Syncing...' : 'Sync Live Data'}</span>
        </button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Top 4 Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Total Students */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
              Total Students
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>
              {overview?.totalStudents || 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: '600', marginTop: '4px' }}>
              Active hostel accounts
            </div>
          </div>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              backgroundColor: '#e0f2fe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Users size={26} />
          </div>
        </div>

        {/* Total Feedback */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
              Total Feedback
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>
              {overview?.totalFeedback?.toLocaleString() || 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#ea580c', fontWeight: '600', marginTop: '4px' }}>
              Logged submissions
            </div>
          </div>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              backgroundColor: '#ffedd5',
              color: '#ea580c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MessageSquareText size={26} />
          </div>
        </div>

        {/* Average Rating */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
              Average Rating
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>
                {overview?.averageRating ? overview.averageRating.toFixed(1) : '0.0'}
              </span>
              <Star size={24} fill="#f59e0b" color="#f59e0b" />
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', marginTop: '4px' }}>
              Across all meals
            </div>
          </div>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              backgroundColor: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Star size={26} />
          </div>
        </div>

        {/* Issues Reported */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
              Issues Reported
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#dc2626' }}>
              {overview?.totalIssues || 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#b91c1c', fontWeight: '600', marginTop: '4px' }}>
              Flagged food complaints
            </div>
          </div>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AlertTriangle size={26} />
          </div>
        </div>
      </div>

      {/* 3 Useful Recharts Graphs Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '24px' }}>
        {/* Graph 1 – Average Rating by Meal (BAR CHART) */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '18px',
            padding: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.15rem', fontWeight: '700', color: '#0f172a' }}>
                Average Rating by Meal
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                Comparative quality score across Breakfast, Lunch, Snacks, and Dinner
              </p>
            </div>
            <Badge variant="primary" size="sm">Bar Chart</Badge>
          </div>

          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mealRatings} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="meal" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis domain={[0, 5]} stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip
                  formatter={(val) => [`${val} ⭐`, 'Average Rating']}
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', border: 'none' }}
                />
                <Bar dataKey="averageRating" radius={[8, 8, 0, 0]}>
                  {mealRatings.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={MEAL_BAR_COLORS[entry.meal] || '#ea580c'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 2 – Mess Rating Trend (LINE CHART) */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '18px',
            padding: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.15rem', fontWeight: '700', color: '#0f172a' }}>
                Mess Rating Trend
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                Daily average student satisfaction rating over the past 7 days
              </p>
            </div>
            <Badge variant="success" size="sm">Line Chart</Badge>
          </div>

          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ratingTrend} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis domain={[0, 5]} stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip
                  formatter={(val, name, props) => [
                    `${val} ⭐ (${props.payload.count} reviews)`,
                    props.payload.displayDate,
                  ]}
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', border: 'none' }}
                />
                <Line
                  type="monotone"
                  dataKey="averageRating"
                  stroke="#ea580c"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#ea580c', stroke: '#ffffff', strokeWidth: 2 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Graph 3 – Most Reported Food Issues (BAR CHART) */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '18px',
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.15rem', fontWeight: '700', color: '#0f172a' }}>
              Most Reported Food Issues
            </h3>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
              Frequency of reported complaints calculated dynamically from student feedback
            </p>
          </div>
          <Badge variant="danger" size="sm">Complaints Frequency</Badge>
        </div>

        <div style={{ width: '100%', height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={issuesData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis
                dataKey="issue"
                type="category"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                width={100}
              />
              <Tooltip
                formatter={(val, name, props) => [
                  `${val} reports (${props.payload.percentage}% of issues)`,
                  'Frequency',
                ]}
                contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', border: 'none' }}
              />
              <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                {issuesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={ISSUE_COLORS[index % ISSUE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Feedback Feed Preview */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '18px',
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.15rem', fontWeight: '700', color: '#0f172a' }}>
              Recent Student Submissions
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
              Latest reviews submitted across university blocks
            </p>
          </div>
          <Link
            to="/admin/feedback"
            style={{
              fontSize: '0.85rem',
              fontWeight: '700',
              color: '#ea580c',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>View All Feedback</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {recentFeedbacks.map((item) => (
            <div
              key={item._id}
              style={{
                padding: '14px 18px',
                borderRadius: '12px',
                backgroundColor: '#f8fafc',
                border: '1px solid #f1f5f9',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Badge mealType={item.mealType} size="sm">
                  {item.mealType}
                </Badge>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.875rem', color: '#0f172a' }}>
                      {item.studentId?.name || 'Resident Student'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      ({item.studentId?.hostel || 'Hostel'} - Rm {item.studentId?.roomNumber || 'N/A'})
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>&bull; {item.date}</span>
                  </div>
                  {item.comment && (
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.825rem', color: '#475569' }}>
                      "{item.comment}"
                    </p>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <StarRating rating={item.averageRating} size={14} showLabel={true} />
                {item.issues && item.issues.length > 0 && item.issues[0] !== 'No issue' && (
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: '#fee2e2',
                      color: '#b91c1c',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                    }}
                  >
                    {item.issues.join(', ')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
