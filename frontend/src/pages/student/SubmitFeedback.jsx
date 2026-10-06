import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { feedbackService, mealService } from '../../services/api';
import StarRating from '../../components/common/StarRating';
import Alert from '../../components/common/Alert';
import { getMealAvailability, getLocalDateString, MEAL_SCHEDULE } from '../../utils/mealTiming';
import {
  MessageSquarePlus,
  Calendar,
  Utensils,
  CheckSquare,
  Square,
  Send,
  Sparkles,
  Info,
  CheckCircle,
  Clock,
  Lock,
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

export const SubmitFeedback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [date, setDate] = useState(() => searchParams.get('date') || getLocalDateString());
  const [mealType, setMealType] = useState(() => {
    const paramMeal = searchParams.get('mealType');
    if (paramMeal) return paramMeal;

    // Smart default: pick the currently active or most recently served meal
    const meals = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];
    const active = meals.find((m) => getMealAvailability(m, getLocalDateString()).isAvailable);
    return active || 'Breakfast';
  });
  const [tasteRating, setTasteRating] = useState(4);
  const [qualityRating, setQualityRating] = useState(4);
  const [hygieneRating, setHygieneRating] = useState(5);
  const [quantityRating, setQuantityRating] = useState(4);
  const [selectedIssues, setSelectedIssues] = useState(['No issue']);
  const [comment, setComment] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Real-time availability calculation
  const availability = getMealAvailability(mealType, date);

  // Toggle issue checkbox
  const toggleIssue = (issue) => {
    if (issue === 'No issue') {
      setSelectedIssues(['No issue']);
      return;
    }

    let updated = selectedIssues.filter((i) => i !== 'No issue');

    if (updated.includes(issue)) {
      updated = updated.filter((i) => i !== issue);
      if (updated.length === 0) updated = ['No issue'];
    } else {
      updated.push(issue);
    }
    setSelectedIssues(updated);
  };

  const calculateOverall = () => {
    return ((tasteRating + qualityRating + hygieneRating + quantityRating) / 4).toFixed(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!availability.isAvailable) {
      setError(availability.reason);
      return;
    }

    try {
      setSubmitting(true);
      const res = await feedbackService.submitFeedback({
        date,
        mealType,
        tasteRating,
        qualityRating,
        hygieneRating,
        quantityRating,
        issues: selectedIssues,
        comment,
      });

      if (res.success) {
        setSuccess('Your feedback has been submitted successfully! Redirecting...');
        setTimeout(() => {
          navigate('/student/history');
        }, 1500);
      }
    } catch (err) {
      console.error('Feedback submit error:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Could not submit feedback. Please check if you already reviewed this meal.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#ea580c', fontWeight: '700', fontSize: '0.85rem', marginBottom: '4px' }}>
          <Sparkles size={16} />
          <span>Meal Quality Voice</span>
        </div>
        <h1
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '1.85rem',
            fontWeight: '800',
            color: '#0f172a',
            margin: '0 0 6px 0',
          }}
        >
          Give Mess Feedback
        </h1>
        <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>
          Your honest reviews hold the catering service accountable and directly guide mess menu improvements.
        </p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} />}

      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03)',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {/* Date and Meal Selection */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
          }}
        >
          <div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.875rem',
                fontWeight: '700',
                color: '#334155',
                marginBottom: '8px',
              }}
            >
              <Calendar size={16} color="#ea580c" />
              <span>Select Date</span>
            </label>
            <input
              type="date"
              required
              max={getLocalDateString()}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.925rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.875rem',
                fontWeight: '700',
                color: '#334155',
                marginBottom: '8px',
              }}
            >
              <Utensils size={16} color="#ea580c" />
              <span>Meal Type</span>
            </label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.925rem',
                outline: 'none',
                backgroundColor: '#ffffff',
                boxSizing: 'border-box',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              {['Breakfast', 'Lunch', 'Snacks', 'Dinner'].map((type) => {
                const status = getMealAvailability(type, date);
                return (
                  <option key={type} value={type}>
                    {status.isAvailable
                      ? `${type} (${status.status === 'serving' ? '🔥 Serving Now' : 'Ready for Review'})`
                      : `🔒 ${type} (${status.opensAt ? `Opens at ${status.opensAt}` : 'Upcoming'})`}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Real-time Locked Banner */}
        {!availability.isAvailable && (
          <div
            style={{
              backgroundColor: '#fffbeb',
              borderRadius: '12px',
              padding: '14px 18px',
              border: '1px solid #fde68a',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#92400e',
              fontSize: '0.9rem',
            }}
          >
            <Clock size={22} color="#d97706" style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ display: 'block', marginBottom: '2px' }}>
                Meal has not started yet
              </strong>
              <span>{availability.reason}</span>
            </div>
          </div>
        )}

        {/* 4 Pillars of Rating */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '700', color: '#0f172a' }}>
              Meal Quality Ratings (1 to 5 Stars)
            </h3>
            <div
              style={{
                backgroundColor: '#fff7ed',
                border: '1px solid #fed7aa',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: '700',
                color: '#c2410c',
              }}
            >
              Calculated Average: {calculateOverall()} ⭐
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '18px',
            }}
          >
            {/* Taste Rating */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                padding: '16px 20px',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#334155' }}>
                  Taste & Flavor
                </span>
                <span style={{ fontWeight: '700', color: '#ea580c' }}>{tasteRating} / 5</span>
              </div>
              <StarRating
                rating={tasteRating}
                interactive={true}
                onChange={setTasteRating}
                size={28}
              />
            </div>

            {/* Food Quality Rating */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                padding: '16px 20px',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#334155' }}>
                  Food Quality
                </span>
                <span style={{ fontWeight: '700', color: '#ea580c' }}>{qualityRating} / 5</span>
              </div>
              <StarRating
                rating={qualityRating}
                interactive={true}
                onChange={setQualityRating}
                size={28}
              />
            </div>

            {/* Hygiene Rating */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                padding: '16px 20px',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#334155' }}>
                  Kitchen & Plate Hygiene
                </span>
                <span style={{ fontWeight: '700', color: '#ea580c' }}>{hygieneRating} / 5</span>
              </div>
              <StarRating
                rating={hygieneRating}
                interactive={true}
                onChange={setHygieneRating}
                size={28}
              />
            </div>

            {/* Quantity Rating */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                padding: '16px 20px',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#334155' }}>
                  Portion Quantity
                </span>
                <span style={{ fontWeight: '700', color: '#ea580c' }}>{quantityRating} / 5</span>
              </div>
              <StarRating
                rating={quantityRating}
                interactive={true}
                onChange={setQuantityRating}
                size={28}
              />
            </div>
          </div>
        </div>

        {/* Specific Food Issues Checklist */}
        <div>
          <label style={{ display: 'block', fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>
            What was the issue? (Select all that apply)
          </label>
          <p style={{ margin: '0 0 14px 0', fontSize: '0.85rem', color: '#64748b' }}>
            Helps mess authorities pinpoint kitchen faults quickly.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
              gap: '10px',
            }}
          >
            {ISSUE_OPTIONS.map((issue) => {
              const isSelected = selectedIssues.includes(issue);
              return (
                <button
                  type="button"
                  key={issue}
                  onClick={() => toggleIssue(issue)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: `1px solid ${isSelected ? '#ea580c' : '#cbd5e1'}`,
                    backgroundColor: isSelected ? '#fff7ed' : '#ffffff',
                    color: isSelected ? '#9a3412' : '#334155',
                    fontWeight: isSelected ? '700' : '500',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isSelected ? (
                    <CheckSquare size={18} color="#ea580c" />
                  ) : (
                    <Square size={18} color="#94a3b8" />
                  )}
                  <span>{issue}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Comments Textarea */}
        <div>
          <label style={{ display: 'block', fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>
            Additional Comments / Suggestions
          </label>
          <textarea
            rows={4}
            maxLength={500}
            placeholder="Share specific details about what was good or what can be improved (e.g., Dal was too salty, paneer was soft)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              fontSize: '0.925rem',
              outline: 'none',
              boxSizing: 'border-box',
              resize: 'vertical',
              fontFamily: 'inherit',
            }}
          />
          <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
            {comment.length} / 500 characters
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
          <Link
            to="/student/dashboard"
            style={{
              padding: '12px 20px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#475569',
              fontWeight: '600',
              fontSize: '0.925rem',
              textDecoration: 'none',
            }}
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting || !availability.isAvailable}
            style={{
              backgroundColor: availability.isAvailable ? '#ea580c' : '#94a3b8',
              color: '#ffffff',
              border: 'none',
              padding: '12px 28px',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '0.95rem',
              cursor: submitting || !availability.isAvailable ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: availability.isAvailable ? '0 4px 6px -1px rgba(234, 88, 12, 0.3)' : 'none',
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {availability.isAvailable ? (
              <>
                <Send size={16} />
                <span>{submitting ? 'Submitting Feedback...' : 'Submit Feedback'}</span>
              </>
            ) : (
              <>
                <Lock size={16} />
                <span>Feedback Unlocks at {availability.opensAt || 'Meal Time'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitFeedback;
