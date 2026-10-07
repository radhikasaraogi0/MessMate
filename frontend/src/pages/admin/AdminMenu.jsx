import React, { useState, useEffect } from 'react';
import { mealService } from '../../services/api';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Alert from '../../components/common/Alert';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import {
  UtensilsCrossed,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const MEAL_TIMES = {
  Breakfast: '7:30 AM - 9:30 AM',
  Lunch: '12:30 PM - 2:30 PM',
  Snacks: '5:00 PM - 6:15 PM',
  Dinner: '7:45 PM - 9:45 PM',
};

export const AdminMenu = () => {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentMealId, setCurrentMealId] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    mealType: 'Breakfast',
    items: '',
    description: '',
  });
  const [saving, setSaving] = useState(false);

  const fetchMealsForDate = async (date) => {
    try {
      setLoading(true);
      const res = await mealService.getTodayMeals(date);
      if (res.success) {
        setMeals(res.data || []);
      }
    } catch (err) {
      console.error('Fetch meals error:', err);
      setError('Failed to fetch menu items for this date.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMealsForDate(selectedDate);
  }, [selectedDate]);

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const openAddModal = (defaultType = 'Breakfast') => {
    setModalMode('add');
    setCurrentMealId(null);
    setFormData({
      date: selectedDate,
      mealType: defaultType,
      items: '',
      description: '',
    });
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (meal) => {
    setModalMode('edit');
    setCurrentMealId(meal._id);
    setFormData({
      date: meal.date,
      mealType: meal.mealType,
      items: Array.isArray(meal.items) ? meal.items.join(', ') : meal.items,
      description: meal.description || '',
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleSaveMeal = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (modalMode === 'add') {
        const res = await mealService.createMeal(formData);
        if (res.success) {
          setSuccess(`Added ${formData.mealType} menu for ${formData.date}!`);
          setIsModalOpen(false);
          fetchMealsForDate(selectedDate);
        }
      } else {
        const res = await mealService.updateMeal(currentMealId, formData);
        if (res.success) {
          setSuccess(`Updated ${formData.mealType} menu successfully!`);
          setIsModalOpen(false);
          fetchMealsForDate(selectedDate);
        }
      }
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMeal = async (id, mealType) => {
    if (!window.confirm(`Are you sure you want to delete ${mealType} menu for this day?`)) return;

    try {
      const res = await mealService.deleteMeal(id);
      if (res.success) {
        setSuccess(`Deleted ${mealType} menu`);
        fetchMealsForDate(selectedDate);
        setTimeout(() => setSuccess(''), 4000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete meal');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title & Action Bar */}
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
            Mess Menu Management
          </h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.925rem' }}>
            Schedule and customize daily breakfast, lunch, evening snacks, and dinner offerings
          </p>
        </div>

        <button
          type="button"
          onClick={() => openAddModal()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#fef08a',
            color: '#0f1013',
            border: 'none',
            padding: '11px 20px',
            borderRadius: '10px',
            fontWeight: '800',
            fontSize: '0.9rem',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(254, 240, 138, 0.25)',
          }}
        >
          <Plus size={18} />
          <span>Add New Meal</span>
        </button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {/* Date Navigation Bar */}
      <div
        style={{
          backgroundColor: '#181a20',
          borderRadius: '14px',
          padding: '14px 20px',
          border: '1px solid #262933',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 20px -2px rgba(0,0,0,0.3)',
        }}
      >
        <button
          type="button"
          onClick={handlePrevDay}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '8px',
            border: '1px solid #2a2e39',
            backgroundColor: '#131418',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.85rem',
            color: '#f8fafc',
          }}
        >
          <ChevronLeft size={16} />
          <span>Prev Day</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #2a2e39',
              backgroundColor: '#131418',
              color: '#f8fafc',
              fontSize: '0.925rem',
              fontWeight: '700',
              outline: 'none',
              cursor: 'pointer',
            }}
          />
          <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f8fafc' }}>
            {new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>

        <button
          type="button"
          onClick={handleNextDay}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '8px',
            border: '1px solid #2a2e39',
            backgroundColor: '#131418',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.85rem',
            color: '#f8fafc',
          }}
        >
          <span>Next Day</span>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Meals Grid */}
      {loading ? (
        <LoadingSpinner message="Loading meals for selected day..." />
      ) : meals.length === 0 ? (
        <EmptyState
          title={`No meals scheduled for ${selectedDate}`}
          description="Click below to add a meal for this date."
          action={
            <button
              type="button"
              onClick={() => openAddModal()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '10px',
                backgroundColor: '#fef08a',
                color: '#0f1013',
                border: 'none',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              <Plus size={16} /> Add First Meal
            </button>
          }
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          {meals.map((meal) => (
            <div
              key={meal._id}
              style={{
                backgroundColor: '#181a20',
                borderRadius: '16px',
                border: '1px solid #262933',
                boxShadow: '0 4px 20px -2px rgba(0,0,0,0.3)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                overflow: 'hidden',
              }}
            >
              <div>
                {/* Header */}
                <div
                  style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid #262933',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#14151a',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Badge mealType={meal.mealType} size="md">
                      {meal.mealType}
                    </Badge>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {MEAL_TIMES[meal.mealType]}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => openEditModal(meal)}
                      style={{
                        padding: '6px',
                        borderRadius: '6px',
                        border: '1px solid #2e3547',
                        backgroundColor: '#1f232d',
                        color: '#7dd3fc',
                        cursor: 'pointer',
                      }}
                      title="Edit meal"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteMeal(meal._id, meal.mealType)}
                      style={{
                        padding: '6px',
                        borderRadius: '6px',
                        border: '1px solid #5c1d24',
                        backgroundColor: '#2b171a',
                        color: '#fca5a5',
                        cursor: 'pointer',
                      }}
                      title="Delete meal"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Items */}
                <div style={{ padding: '20px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Dishes / Menu Items
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                    {meal.items.map((item, idx) => (
                      <span
                        key={idx}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          backgroundColor: '#262315',
                          border: '1px solid #785e1a',
                          color: '#fef08a',
                          fontSize: '0.85rem',
                          fontWeight: '700',
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  {meal.description && (
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.45 }}>
                      {meal.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Meal Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'add' ? 'Add New Meal Menu' : `Edit ${formData.mealType} Menu`}
      >
        <form onSubmit={handleSaveMeal} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#f8fafc', marginBottom: '6px' }}>
                Date:
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #2a2e39',
                  backgroundColor: '#131418',
                  color: '#f8fafc',
                  boxSizing: 'border-box',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#f8fafc', marginBottom: '6px' }}>
                Meal Type:
              </label>
              <select
                value={formData.mealType}
                onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #2a2e39',
                  backgroundColor: '#131418',
                  color: '#f8fafc',
                  boxSizing: 'border-box',
                  fontSize: '0.9rem',
                }}
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Snacks">Snacks</option>
                <option value="Dinner">Dinner</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#f8fafc', marginBottom: '6px' }}>
              Food Items (comma-separated):
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Steamed Rice, Dal Makhani, Paneer Tikka, Naan"
              value={formData.items}
              onChange={(e) => setFormData({ ...formData, items: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #2a2e39',
                backgroundColor: '#131418',
                color: '#f8fafc',
                boxSizing: 'border-box',
                fontSize: '0.9rem',
              }}
            />
            <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
              Separate items by commas to automatically split them into chips.
            </span>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#f8fafc', marginBottom: '6px' }}>
              Description / Chef's Note:
            </label>
            <textarea
              rows={3}
              placeholder="Brief description or dietary information (e.g., Jain option available on request)..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #2a2e39',
                backgroundColor: '#131418',
                color: '#f8fafc',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                fontSize: '0.875rem',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              style={{
                padding: '9px 16px',
                borderRadius: '8px',
                border: '1px solid #2a2e39',
                backgroundColor: '#181a20',
                color: '#94a3b8',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: '9px 20px',
                borderRadius: '8px',
                backgroundColor: '#fef08a',
                color: '#0f1013',
                border: 'none',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontWeight: '800',
              }}
            >
              {saving ? 'Saving...' : modalMode === 'add' ? 'Add Meal' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminMenu;
