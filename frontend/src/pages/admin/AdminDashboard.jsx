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

  // Bar colors for Meal Types (Polysure signature pastels)
  const MEAL_BAR_COLORS = {
    Breakfast: '#fef08a',
    Lunch: '#c4b5fd',
    Snacks: '#fed7aa',
    Dinner: '#bbf7d0',
  };

  // Issue Bar colors
  const ISSUE_COLORS = [
    '#f87171',
    '#fb923c',
    '#facc15',
    '#4ade80',
    '#38bdf8',
    '#818cf8',
    '#c084fc',
    '#f472b6',
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
                backgroundColor: '#161c2e',
                color: '#93c5fd',
                border: '1px solid #23345d',
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
              color: '#f8fafc',
              margin: '0 0 6px 0',
            }}
          >
            Mess Authority Analytics Dashboard
          </h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem' }}>
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
            backgroundColor: '#181a20',
            border: '1px solid #262933',
            color: '#f8fafc',
            fontWeight: '600',
            fontSize: '0.875rem',
            cursor: refreshing ? 'not-allowed' : 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
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
            backgroundColor: '#181a20',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #262933',
            boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
              Total Students
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#f8fafc' }}>
              {overview?.totalStudents || 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#bbf7d0', fontWeight: '600', marginTop: '4px' }}>
              Active hostel accounts
            </div>
          </div>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              backgroundColor: '#241f3d',
              color: '#c4b5fd',
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
            backgroundColor: '#181a20',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #262933',
            boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
              Total Feedback
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#f8fafc' }}>
              {overview?.totalFeedback?.toLocaleString() || 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#fed7aa', fontWeight: '600', marginTop: '4px' }}>
              Logged submissions
            </div>
          </div>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              backgroundColor: '#2b2015',
              color: '#fed7aa',
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
            backgroundColor: '#181a20',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #262933',
            boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
              Average Rating
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '2rem', fontWeight: '800', color: '#fef08a' }}>
                {overview?.averageRating ? overview.averageRating.toFixed(1) : '0.0'}
              </span>
              <Star size={24} fill="#fbbf24" color="#fbbf24" />
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', marginTop: '4px' }}>
              Across all meals
            </div>
          </div>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              backgroundColor: '#282315',
              color: '#fef08a',
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
            backgroundColor: '#181a20',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #262933',
            boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
              Issues Reported
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#f87171' }}>
              {overview?.totalIssues || 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#fca5a5', fontWeight: '600', marginTop: '4px' }}>
              Flagged food complaints
            </div>
          </div>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              backgroundColor: '#2d1519',
              color: '#f87171',
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
            backgroundColor: '#181a20',
            borderRadius: '18px',
            padding: '24px',
            border: '1px solid #262933',
            boxShadow: '0 4px 20px -2px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.15rem', fontWeight: '700', color: '#f8fafc' }}>
                Average Rating by Meal
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
                Comparative quality score across Breakfast, Lunch, Snacks, and Dinner
              </p>
            </div>
            <Badge variant="primary" size="sm">Bar Chart</Badge>
          </div>

          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mealRatings} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262933" />
                <XAxis dataKey="meal" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis domain={[0, 5]} stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  formatter={(val) => [`${val} ⭐`, 'Average Rating']}
                  contentStyle={{ backgroundColor: '#181a20', color: '#f8fafc', borderRadius: '8px', border: '1px solid #262933' }}
                />
                <Bar dataKey="averageRating" radius={[8, 8, 0, 0]}>
                  {mealRatings.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={MEAL_BAR_COLORS[entry.meal] || '#fef08a'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 2 – Mess Rating Trend (LINE CHART) */}
        <div
          style={{
            backgroundColor: '#181a20',
            borderRadius: '18px',
            padding: '24px',
            border: '1px solid #262933',
            boxShadow: '0 4px 20px -2px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.15rem', fontWeight: '700', color: '#f8fafc' }}>
                Mess Rating Trend
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
                Daily average student satisfaction rating over the past 7 days
              </p>
            </div>
            <Badge variant="success" size="sm">Line Chart</Badge>
          </div>

          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ratingTrend} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262933" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis domain={[0, 5]} stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  formatter={(val, name, props) => [
                    `${val} ⭐ (${props.payload.count} reviews)`,
                    props.payload.displayDate,
                  ]}
                  contentStyle={{ backgroundColor: '#181a20', color: '#f8fafc', borderRadius: '8px', border: '1px solid #262933' }}
                />
                <Line
                  type="monotone"
                  dataKey="averageRating"
                  stroke="#fef08a"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#fef08a', stroke: '#181a20', strokeWidth: 2 }}
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
          backgroundColor: '#181a20',
          borderRadius: '18px',
          padding: '24px',
          border: '1px solid #262933',
          boxShadow: '0 4px 20px -2px rgba(0,0,0,0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.15rem', fontWeight: '700', color: '#f8fafc' }}>
              Most Reported Food Issues
            </h3>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
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
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#262933" />
              <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis
                dataKey="issue"
                type="category"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                width={100}
              />
              <Tooltip
                formatter={(val, name, props) => [
                  `${val} reports (${props.payload.percentage}% of issues)`,
                  'Frequency',
                ]}
                contentStyle={{ backgroundColor: '#181a20', color: '#f8fafc', borderRadius: '8px', border: '1px solid #262933' }}
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
          backgroundColor: '#181a20',
          borderRadius: '18px',
          padding: '24px',
          border: '1px solid #262933',
          boxShadow: '0 4px 20px -2px rgba(0,0,0,0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.15rem', fontWeight: '700', color: '#f8fafc' }}>
              Recent Student Submissions
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
              Latest reviews submitted across university blocks
            </p>
          </div>
          <Link
            to="/admin/feedback"
            style={{
              fontSize: '0.85rem',
              fontWeight: '700',
              color: '#fef08a',
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
                backgroundColor: '#131418',
                border: '1px solid #22252e',
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
                    <span style={{ fontWeight: '700', fontSize: '0.875rem', color: '#f8fafc' }}>
                      {item.studentId?.name || 'Resident Student'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      ({item.studentId?.hostel || 'Hostel'} - Rm {item.studentId?.roomNumber || 'N/A'})
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>&bull; {item.date}</span>
                  </div>
                  {item.comment && (
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.825rem', color: '#cbd5e1' }}>
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
                      backgroundColor: '#2d1519',
                      border: '1px solid #5c1d24',
                      color: '#fca5a5',
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
