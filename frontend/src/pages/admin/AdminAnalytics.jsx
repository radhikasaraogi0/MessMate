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
              color: '#0f172a',
              margin: '0 0 4px 0',
            }}
          >
            Visual Quality Analytics
          </h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.925rem' }}>
            Data-driven intelligence to monitor mess compliance, meal satisfaction, and kitchen defects
          </p>
        </div>

        {/* Days Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#e2e8f0', padding: '4px', borderRadius: '12px' }}>
          <button
            type="button"
            onClick={() => setDays(7)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: days === 7 ? '#ffffff' : 'transparent',
              color: days === 7 ? '#ea580c' : '#64748b',
              fontWeight: '700',
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: days === 7 ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
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
              backgroundColor: days === 30 ? '#ffffff' : 'transparent',
              color: days === 30 ? '#ea580c' : '#64748b',
              fontWeight: '700',
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: days === 30 ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
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
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}
        >
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>
            4-Pillar Quality Breakdown (Overall)
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
            }}
          >
            <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#fff7ed', border: '1px solid #fed7aa' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#9a3412', textTransform: 'uppercase' }}>Taste & Flavor</div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#c2410c', marginTop: '4px' }}>
                {overview.breakdown.taste} <span style={{ fontSize: '1rem' }}>/ 5.0</span>
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#e0f2fe', border: '1px solid #bae6fd' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#075985', textTransform: 'uppercase' }}>Food Quality</div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0284c7', marginTop: '4px' }}>
                {overview.breakdown.quality} <span style={{ fontSize: '1rem' }}>/ 5.0</span>
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#166534', textTransform: 'uppercase' }}>Hygiene & Cleanliness</div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#16a34a', marginTop: '4px' }}>
                {overview.breakdown.hygiene} <span style={{ fontSize: '1rem' }}>/ 5.0</span>
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#f3e8ff', border: '1px solid #e9d5ff' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#6b21a8', textTransform: 'uppercase' }}>Quantity & Portion</div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#9333ea', marginTop: '4px' }}>
                {overview.breakdown.quantity} <span style={{ fontSize: '1rem' }}>/ 5.0</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Graph 1: Rating Trend Line Chart */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', fontWeight: '700', color: '#0f172a' }}>
              Mess Rating Trend (Last {days} Days)
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
              Chronological daily satisfaction trend based on verified student ratings
            </p>
          </div>
          <Badge variant="primary" size="sm">Line Chart</Badge>
        </div>

        <div style={{ width: '100%', height: '320px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ratingTrend} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="displayDate" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis domain={[0, 5]} stroke="#64748b" fontSize={12} tickLine={false} />
              <Tooltip
                formatter={(val, name, props) => [
                  `${val} ⭐ (${props.payload.count} reviews)`,
                  'Average Rating',
                ]}
                contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', border: 'none' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="averageRating"
                name="Mess Average Rating"
                stroke="#ea580c"
                strokeWidth={3}
                dot={{ r: 5, fill: '#ea580c', stroke: '#ffffff', strokeWidth: 2 }}
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
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', fontWeight: '700', color: '#0f172a' }}>
                Average Rating by Meal
              </h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                Comparing Taste, Quality, Hygiene, and Quantity scores across meals
              </p>
            </div>
            <Badge variant="warning" size="sm">Bar Chart</Badge>
          </div>

          <div style={{ width: '100%', height: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mealRatings} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="meal" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis domain={[0, 5]} stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip
                  formatter={(val) => [`${val} ★`]}
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', border: 'none' }}
                />
                <Legend />
                <Bar dataKey="taste" name="Taste" fill="#ea580c" radius={[4, 4, 0, 0]} />
                <Bar dataKey="quality" name="Quality" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="hygiene" name="Hygiene" fill="#16a34a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="quantity" name="Quantity" fill="#9333ea" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Reported Food Issues */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', fontWeight: '700', color: '#0f172a' }}>
                Most Reported Food Issues
              </h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
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
                    `${val} occurrences (${props.payload.percentage}% of issues)`,
                    'Report Count',
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
      </div>
    </div>
  );
};

export default AdminAnalytics;
