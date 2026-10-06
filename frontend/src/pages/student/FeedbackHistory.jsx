import React, { useState, useEffect } from 'react';
import { feedbackService } from '../../services/api';
import StarRating from '../../components/common/StarRating';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Alert from '../../components/common/Alert';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import {
  History,
  Filter,
  Trash2,
  Edit3,
  Calendar,
  Utensils,
  Star,
  Search,
  RotateCcw,
} from 'lucide-react';

const ISSUE_OPTIONS = [
  'Too spicy',
  'Too salty',
  'Too oily',
  'Food was cold',
  'Poor quality',
  'Less quantity',
  'Poor variety',
  'No issue',
  'Other',
];

export const FeedbackHistory = () => {
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filters
  const [filterDate, setFilterDate] = useState('');
  const [filterMealType, setFilterMealType] = useState('');
  const [filterRating, setFilterRating] = useState('');

  // Edit Modal State
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [editTaste, setEditTaste] = useState(5);
  const [editQuality, setEditQuality] = useState(5);
  const [editHygiene, setEditHygiene] = useState(5);
  const [editQuantity, setEditQuantity] = useState(5);
  const [editIssues, setEditIssues] = useState([]);
  const [editComment, setEditComment] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterDate) params.date = filterDate;
      if (filterMealType) params.mealType = filterMealType;
      if (filterRating) params.rating = filterRating;

      const res = await feedbackService.getMyHistory(params);
      if (res.success) {
        setHistory(res.data || []);
        setSummary(res.summary || null);
      }
    } catch (err) {
      console.error('Fetch history error:', err);
      setError('Failed to fetch your feedback history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [filterDate, filterMealType, filterRating]);

  const handleResetFilters = () => {
    setFilterDate('');
    setFilterMealType('');
    setFilterRating('');
  };

  const openEditModal = (fb) => {
    setEditingFeedback(fb);
    setEditTaste(fb.tasteRating || 5);
    setEditQuality(fb.qualityRating || 5);
    setEditHygiene(fb.hygieneRating || 5);
    setEditQuantity(fb.quantityRating || 5);
    setEditIssues(fb.issues || []);
    setEditComment(fb.comment || '');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingFeedback) return;

    try {
      setUpdating(true);
      const res = await feedbackService.updateFeedback(editingFeedback._id, {
        tasteRating: editTaste,
        qualityRating: editQuality,
        hygieneRating: editHygiene,
        quantityRating: editQuantity,
        issues: editIssues,
        comment: editComment,
      });

      if (res.success) {
        setSuccess('Feedback updated successfully!');
        setEditingFeedback(null);
        fetchHistory();
        setTimeout(() => setSuccess(''), 4000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update feedback.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteFeedback = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback entry?')) return;

    try {
      const res = await feedbackService.deleteFeedback(id);
      if (res.success) {
        setSuccess('Feedback deleted successfully');
        fetchHistory();
        setTimeout(() => setSuccess(''), 4000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete feedback.');
    }
  };

  const toggleEditIssue = (issue) => {
    if (issue === 'No issue') {
      setEditIssues(['No issue']);
      return;
    }
    let updated = editIssues.filter((i) => i !== 'No issue');
    if (updated.includes(issue)) {
      updated = updated.filter((i) => i !== issue);
      if (updated.length === 0) updated = ['No issue'];
    } else {
      updated.push(issue);
    }
    setEditIssues(updated);
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
            margin: '0 0 6px 0',
          }}
        >
          My Feedback History
        </h1>
        <p style={{ margin: 0, color: '#64748b', fontSize: '0.925rem' }}>
          Inspect your past ratings, update recent comments, or verify problem resolutions
        </p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {/* Summary KPI Cards */}
      {summary && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
          }}
        >
          <div style={{ backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
              Total Reviews
            </span>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>
              {summary.totalSubmissions}
            </div>
          </div>
          <div style={{ backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
              Avg Overall
            </span>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ea580c' }}>
              {summary.avgRating} ⭐
            </div>
          </div>
          <div style={{ backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
              Taste Avg
            </span>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>
              {summary.avgTaste}
            </div>
          </div>
          <div style={{ backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
              Hygiene Avg
            </span>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>
              {summary.avgHygiene}
            </div>
          </div>
        </div>
      )}

      {/* Filter Control Bar */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '16px 20px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontWeight: '700', fontSize: '0.85rem' }}>
          <Filter size={16} />
          <span>Filters:</span>
        </div>

        {/* Date Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.85rem',
              outline: 'none',
            }}
          />
        </div>

        {/* Meal Type Filter */}
        <div>
          <select
            value={filterMealType}
            onChange={(e) => setFilterMealType(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.85rem',
              outline: 'none',
              backgroundColor: '#ffffff',
            }}
          >
            <option value="">All Meals</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Snacks">Snacks</option>
            <option value="Dinner">Dinner</option>
          </select>
        </div>

        {/* Rating Filter */}
        <div>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.85rem',
              outline: 'none',
              backgroundColor: '#ffffff',
            }}
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        {(filterDate || filterMealType || filterRating) && (
          <button
            type="button"
            onClick={handleResetFilters}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'none',
              border: 'none',
              color: '#ea580c',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              marginLeft: 'auto',
            }}
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* History Table */}
      {loading ? (
        <LoadingSpinner message="Loading your feedback entries..." />
      ) : history.length === 0 ? (
        <EmptyState
          title="No feedback found"
          description={
            filterDate || filterMealType || filterRating
              ? 'No feedback entries matched your current filter criteria.'
              : 'You have not submitted any mess feedback yet.'
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
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: '700' }}>
                  <th style={{ padding: '14px 20px' }}>Date</th>
                  <th style={{ padding: '14px 20px' }}>Meal</th>
                  <th style={{ padding: '14px 20px' }}>Rating</th>
                  <th style={{ padding: '14px 20px' }}>Dimensions</th>
                  <th style={{ padding: '14px 20px' }}>Issues Reported</th>
                  <th style={{ padding: '14px 20px' }}>Comments</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, idx) => (
                  <tr
                    key={item._id}
                    style={{
                      borderBottom: idx < history.length - 1 ? '1px solid #f1f5f9' : 'none',
                    }}
                  >
                    <td style={{ padding: '16px 20px', fontWeight: '600', color: '#0f172a', whiteSpace: 'nowrap' }}>
                      {item.date}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <Badge mealType={item.mealType} size="sm">
                        {item.mealType}
                      </Badge>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <StarRating rating={item.averageRating} size={15} showLabel={true} />
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>
                      <div>Taste: <strong>{item.tasteRating}★</strong></div>
                      <div>Quality: <strong>{item.qualityRating}★</strong></div>
                      <div>Hygiene: <strong>{item.hygieneRating}★</strong></div>
                      <div>Quantity: <strong>{item.quantityRating}★</strong></div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      {item.issues && item.issues.length > 0 && item.issues[0] !== 'No issue' ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {item.issues.map((iss, i) => (
                            <span
                              key={i}
                              style={{
                                padding: '2px 8px',
                                borderRadius: '4px',
                                backgroundColor: '#fee2e2',
                                color: '#b91c1c',
                                fontSize: '0.72rem',
                                fontWeight: '600',
                              }}
                            >
                              {iss}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: '600' }}>
                          No issues
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#334155', maxWidth: '240px' }}>
                      {item.comment ? `"${item.comment}"` : <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>None</span>}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            backgroundColor: '#ffffff',
                            color: '#0284c7',
                            cursor: 'pointer',
                          }}
                          title="Edit feedback"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteFeedback(item._id)}
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            border: '1px solid #fecaca',
                            backgroundColor: '#fff1f2',
                            color: '#e11d48',
                            cursor: 'pointer',
                          }}
                          title="Delete feedback"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Feedback Modal */}
      <Modal
        isOpen={Boolean(editingFeedback)}
        onClose={() => setEditingFeedback(null)}
        title={`Edit Feedback (${editingFeedback?.mealType} - ${editingFeedback?.date})`}
      >
        {editingFeedback && (
          <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px' }}>
                  Taste ({editTaste}/5)
                </label>
                <StarRating rating={editTaste} interactive={true} onChange={setEditTaste} size={22} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px' }}>
                  Quality ({editQuality}/5)
                </label>
                <StarRating rating={editQuality} interactive={true} onChange={setEditQuality} size={22} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px' }}>
                  Hygiene ({editHygiene}/5)
                </label>
                <StarRating rating={editHygiene} interactive={true} onChange={setEditHygiene} size={22} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px' }}>
                  Quantity ({editQuantity}/5)
                </label>
                <StarRating rating={editQuantity} interactive={true} onChange={setEditQuantity} size={22} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>
                Issues:
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {ISSUE_OPTIONS.map((iss) => {
                  const active = editIssues.includes(iss);
                  return (
                    <button
                      key={iss}
                      type="button"
                      onClick={() => toggleEditIssue(iss)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: `1px solid ${active ? '#ea580c' : '#cbd5e1'}`,
                        backgroundColor: active ? '#fff7ed' : '#ffffff',
                        color: active ? '#c2410c' : '#475569',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        fontWeight: active ? '700' : '500',
                      }}
                    >
                      {iss}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>
                Comment:
              </label>
              <textarea
                rows={3}
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => setEditingFeedback(null)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating}
                style={{
                  padding: '9px 20px',
                  borderRadius: '8px',
                  backgroundColor: '#ea580c',
                  color: '#ffffff',
                  border: 'none',
                  cursor: updating ? 'not-allowed' : 'pointer',
                  fontWeight: '700',
                }}
              >
                {updating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default FeedbackHistory;
