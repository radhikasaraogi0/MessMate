import React, { useState, useEffect } from 'react';
import { feedbackService } from '../../services/api';
import StarRating from '../../components/common/StarRating';
import Badge from '../../components/common/Badge';
import Alert from '../../components/common/Alert';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import {
  Search,
  Filter,
  Trash2,
  Calendar,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';

const ISSUE_OPTIONS = [
  'Too spicy',
  'Too salty',
  'Too oily',
  'Food was cold',
  'Poor quality',
  'Less quantity',
  'Poor variety',
  'Other',
];

export const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');
  const [mealType, setMealType] = useState('');
  const [rating, setRating] = useState('');
  const [issue, setIssue] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 15 };
      if (search.trim()) params.search = search.trim();
      if (date) params.date = date;
      if (mealType) params.mealType = mealType;
      if (rating) params.rating = rating;
      if (issue) params.issue = issue;

      const res = await feedbackService.getAllFeedback(params);
      if (res.success) {
        setFeedbacks(res.data || []);
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.total || 0);
      }
    } catch (err) {
      console.error('Fetch all feedback error:', err);
      setError('Failed to fetch feedback logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [page, date, mealType, rating, issue]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchFeedback();
  };

  const handleResetFilters = () => {
    setSearch('');
    setDate('');
    setMealType('');
    setRating('');
    setIssue('');
    setPage(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this feedback entry?')) return;
    try {
      const res = await feedbackService.deleteFeedback(id);
      if (res.success) {
        setSuccess('Feedback entry deleted successfully');
        fetchFeedback();
        setTimeout(() => setSuccess(''), 4000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete feedback');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
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
            All Student Feedback Logs
          </h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.925rem' }}>
            Browse, search, and filter student dining reviews ({totalCount} total entries)
          </p>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {/* Search and Filters Bar */}
      <div
        style={{
          backgroundColor: '#181a20',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid #262933',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          boxShadow: '0 4px 20px -2px rgba(0,0,0,0.3)',
        }}
      >
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search feedback by student name, email, or comment keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px 11px 40px',
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
          <button
            type="submit"
            style={{
              padding: '11px 22px',
              backgroundColor: '#fef08a',
              color: '#0f1013',
              border: 'none',
              borderRadius: '10px',
              fontWeight: '800',
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            Search
          </button>
        </form>

        {/* Dropdown Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '700' }}>
            <Filter size={16} />
            <span>Filter By:</span>
          </div>

          {/* Date */}
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setPage(1);
            }}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #2a2e39',
              backgroundColor: '#131418',
              color: '#f8fafc',
              fontSize: '0.85rem',
              outline: 'none',
            }}
          />

          {/* Meal Type */}
          <select
            value={mealType}
            onChange={(e) => {
              setMealType(e.target.value);
              setPage(1);
            }}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #2a2e39',
              backgroundColor: '#131418',
              color: '#f8fafc',
              fontSize: '0.85rem',
              outline: 'none',
            }}
          >
            <option value="">All Meals</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Snacks">Snacks</option>
            <option value="Dinner">Dinner</option>
          </select>

          {/* Rating */}
          <select
            value={rating}
            onChange={(e) => {
              setRating(e.target.value);
              setPage(1);
            }}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #2a2e39',
              backgroundColor: '#131418',
              color: '#f8fafc',
              fontSize: '0.85rem',
              outline: 'none',
            }}
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>

          {/* Issue */}
          <select
            value={issue}
            onChange={(e) => {
              setIssue(e.target.value);
              setPage(1);
            }}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #2a2e39',
              backgroundColor: '#131418',
              color: '#f8fafc',
              fontSize: '0.85rem',
              outline: 'none',
            }}
          >
            <option value="">All Issues</option>
            {ISSUE_OPTIONS.map((iss) => (
              <option key={iss} value={iss}>
                {iss}
              </option>
            ))}
          </select>

          {(search || date || mealType || rating || issue) && (
            <button
              type="button"
              onClick={handleResetFilters}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'none',
                border: 'none',
                color: '#fef08a',
                fontSize: '0.85rem',
                fontWeight: '700',
                cursor: 'pointer',
                marginLeft: 'auto',
              }}
            >
              <RotateCcw size={14} />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Feedback Logs Table */}
      {loading ? (
        <LoadingSpinner message="Querying feedback records..." />
      ) : feedbacks.length === 0 ? (
        <EmptyState
          title="No feedback matching your filters"
          description="Try broadening your search query or reset the date and rating filters."
        />
      ) : (
        <div
          style={{
            backgroundColor: '#181a20',
            borderRadius: '16px',
            border: '1px solid #262933',
            overflow: 'hidden',
            boxShadow: '0 4px 20px -2px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#14151a', borderBottom: '1px solid #262933', color: '#94a3b8', fontWeight: '700' }}>
                  <th style={{ padding: '14px 20px' }}>Student</th>
                  <th style={{ padding: '14px 20px' }}>Hostel & Room</th>
                  <th style={{ padding: '14px 20px' }}>Meal</th>
                  <th style={{ padding: '14px 20px' }}>Date</th>
                  <th style={{ padding: '14px 20px' }}>Overall</th>
                  <th style={{ padding: '14px 20px' }}>Breakdown</th>
                  <th style={{ padding: '14px 20px' }}>Issues</th>
                  <th style={{ padding: '14px 20px' }}>Comment</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((item, idx) => (
                  <tr
                    key={item._id}
                    style={{
                      borderBottom: idx < feedbacks.length - 1 ? '1px solid #22252e' : 'none',
                    }}
                  >
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: '700', color: '#f8fafc' }}>
                        {item.studentId?.name || 'Resident'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        {item.studentId?.email}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', color: '#e2e8f0', whiteSpace: 'nowrap' }}>
                      <div>{item.studentId?.hostel || 'Hostel'}</div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                        Room {item.studentId?.roomNumber || 'N/A'}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <Badge mealType={item.mealType} size="sm">
                        {item.mealType}
                      </Badge>
                    </td>
                    <td style={{ padding: '16px 20px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                      {item.date}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <StarRating rating={item.averageRating} size={14} showLabel={true} />
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                      <div>Taste: <strong style={{ color: '#f8fafc' }}>{item.tasteRating}★</strong></div>
                      <div>Quality: <strong style={{ color: '#f8fafc' }}>{item.qualityRating}★</strong></div>
                      <div>Hygiene: <strong style={{ color: '#f8fafc' }}>{item.hygieneRating}★</strong></div>
                      <div>Quantity: <strong style={{ color: '#f8fafc' }}>{item.quantityRating}★</strong></div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      {item.issues && item.issues.length > 0 && item.issues[0] !== 'No issue' ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '200px' }}>
                          {item.issues.map((iss, i) => (
                            <span
                              key={i}
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
                              {iss}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#86efac', fontWeight: '600' }}>
                          No issue
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#cbd5e1', maxWidth: '220px' }}>
                      {item.comment ? `"${item.comment}"` : <span style={{ color: '#64748b', fontStyle: 'italic' }}>None</span>}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => handleDelete(item._id)}
                        style={{
                          padding: '6px',
                          borderRadius: '6px',
                          border: '1px solid #5c1d24',
                          backgroundColor: '#2b171a',
                          color: '#fca5a5',
                          cursor: 'pointer',
                        }}
                        title="Delete feedback entry"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div
              style={{
                padding: '16px 20px',
                borderTop: '1px solid #262933',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Page {page} of {totalPages} ({totalCount} items)
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid #2a2e39',
                    backgroundColor: '#131418',
                    color: '#f8fafc',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: page <= 1 ? 'not-allowed' : 'pointer',
                    opacity: page <= 1 ? 0.5 : 1,
                  }}
                >
                  <ChevronLeft size={16} />
                  <span>Prev</span>
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid #2a2e39',
                    backgroundColor: '#131418',
                    color: '#f8fafc',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                    opacity: page >= totalPages ? 0.5 : 1,
                  }}
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminFeedback;
