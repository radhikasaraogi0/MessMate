import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import Badge from '../../components/common/Badge';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Layers,
  Sparkles,
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

export const AdminAnalytics = () => {
  const [days, setDays] = useState(7);
  const [overview, setOverview] = useState(null);
  const [mealRatings, setMealRatings] = useState([]);
  const [ratingTrend, setRatingTrend] = useState([]);
  const [issuesData, setIssuesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalytics = async (trendDays) => {
    try {
      setLoading(true);
      const [overRes, mealRes, trendRes, issueRes] = await Promise.all([
        analyticsService.getOverview(),
        analyticsService.getMealRatings(),
        analyticsService.getRatingTrend(trendDays),
        analyticsService.getIssues(),
      ]);

      if (overRes.success) setOverview(overRes.data);
      if (mealRes.success) setMealRatings(mealRes.data);
      if (trendRes.success) setRatingTrend(trendRes.data);
      if (issueRes.success) setIssuesData(issueRes.data);
    } catch (err) {
      console.error('Analytics load error:', err);
      setError('Failed to compute analytics charts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(days);
  }, [days]);

  if (loading) {
    return <LoadingSpinner message="Aggregating dining analytics across the database..." />;
  }

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
      {/* Title & Timeframe Selector */}
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
          <h1
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '1.85rem',
              fontWeight: '800',
              color: '#f8fafc',
              margin: '0 0 4px 0',
            }}
          >
            Visual Quality Analytics
          </h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.925rem' }}>
            Data-driven intelligence to monitor mess compliance, meal satisfaction, and kitchen defects
          </p>
        </div>

        {/* Days Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#181a20', padding: '4px', borderRadius: '12px', border: '1px solid #262933' }}>
          <button
            type="button"
            onClick={() => setDays(7)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: days === 7 ? '#fef08a' : 'transparent',
              color: days === 7 ? '#0f1013' : '#94a3b8',
              fontWeight: days === 7 ? '800' : '600',
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Last 7 Days
          </button>
          <button
            type="button"
            onClick={() => setDays(30)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: days === 30 ? '#fef08a' : 'transparent',
              color: days === 30 ? '#0f1013' : '#94a3b8',
              fontWeight: days === 30 ? '800' : '600',
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* 4 Pillars Overall Score Card */}
      {overview?.breakdown && (
        <div
          style={{
            backgroundColor: '#181a20',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #262933',
            boxShadow: '0 4px 20px -2px rgba(0,0,0,0.3)',
          }}
        >
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc' }}>
            4-Pillar Quality Breakdown (Overall)
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
            }}
          >
            <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#282315', border: '1px solid #785e1a' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#fed7aa', textTransform: 'uppercase' }}>Taste & Flavor</div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#fef08a', marginTop: '4px' }}>
                {overview.breakdown.taste} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>/ 5.0</span>
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#221c3b', border: '1px solid #5b4d8a' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#ddd6fe', textTransform: 'uppercase' }}>Food Quality</div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#c4b5fd', marginTop: '4px' }}>
                {overview.breakdown.quality} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>/ 5.0</span>
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#14281e', border: '1px solid #23593b' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#bbf7d0', textTransform: 'uppercase' }}>Hygiene & Cleanliness</div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#86efac', marginTop: '4px' }}>
                {overview.breakdown.hygiene} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>/ 5.0</span>
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#291e18', border: '1px solid #663d23' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#fed7aa', textTransform: 'uppercase' }}>Quantity & Portion</div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#fdba74', marginTop: '4px' }}>
                {overview.breakdown.quantity} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>/ 5.0</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Graph 1: Rating Trend Line Chart */}
      <div
        style={{
          backgroundColor: '#181a20',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #262933',
          boxShadow: '0 4px 20px -2px rgba(0,0,0,0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', fontWeight: '700', color: '#f8fafc' }}>
              Mess Rating Trend (Last {days} Days)
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
              Chronological daily satisfaction trend based on verified student ratings
            </p>
          </div>
          <Badge variant="primary" size="sm">Line Chart</Badge>
        </div>

        <div style={{ width: '100%', height: '320px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ratingTrend} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262933" />
              <XAxis dataKey="displayDate" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis domain={[0, 5]} stroke="#94a3b8" fontSize={12} tickLine={false} />
              <Tooltip
                formatter={(val, name, props) => [
                  `${val} ⭐ (${props.payload.count} reviews)`,
                  'Average Rating',
                ]}
                contentStyle={{ backgroundColor: '#181a20', color: '#f8fafc', borderRadius: '8px', border: '1px solid #262933' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="averageRating"
                name="Mess Average Rating"
                stroke="#fef08a"
                strokeWidth={3}
                dot={{ r: 5, fill: '#fef08a', stroke: '#181a20', strokeWidth: 2 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Meal Ratings Multi-Bar & Common Issues */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '24px' }}>
        {/* Multi-Dimensional Ratings per Meal */}
        <div
          style={{
            backgroundColor: '#181a20',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #262933',
            boxShadow: '0 4px 20px -2px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', fontWeight: '700', color: '#f8fafc' }}>
                Average Rating by Meal
              </h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
                Comparing Taste, Quality, Hygiene, and Quantity scores across meals
              </p>
            </div>
            <Badge variant="warning" size="sm">Bar Chart</Badge>
          </div>

          <div style={{ width: '100%', height: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mealRatings} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262933" />
                <XAxis dataKey="meal" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis domain={[0, 5]} stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  formatter={(val) => [`${val} ★`]}
                  contentStyle={{ backgroundColor: '#181a20', color: '#f8fafc', borderRadius: '8px', border: '1px solid #262933' }}
                />
                <Legend />
                <Bar dataKey="taste" name="Taste" fill="#fef08a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="quality" name="Quality" fill="#c4b5fd" radius={[4, 4, 0, 0]} />
                <Bar dataKey="hygiene" name="Hygiene" fill="#bbf7d0" radius={[4, 4, 0, 0]} />
                <Bar dataKey="quantity" name="Quantity" fill="#fed7aa" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Reported Food Issues */}
        <div
          style={{
            backgroundColor: '#181a20',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #262933',
            boxShadow: '0 4px 20px -2px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', fontWeight: '700', color: '#f8fafc' }}>
                Most Reported Food Issues
              </h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
                Identifies recurring kitchen failures requiring supervision
              </p>
            </div>
            <Badge variant="danger" size="sm">Bar Chart</Badge>
          </div>

          <div style={{ width: '100%', height: '320px' }}>
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
                    `${val} occurrences (${props.payload.percentage}% of issues)`,
                    'Report Count',
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
      </div>
    </div>
  );
};

export default AdminAnalytics;
