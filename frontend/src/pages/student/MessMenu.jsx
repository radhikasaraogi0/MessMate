import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mealService } from '../../services/api';
import Badge from '../../components/common/Badge';
import StarRating from '../../components/common/StarRating';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import {
  CalendarDays,
  Utensils,
  Coffee,
  Sun,
  Cookie,
  Moon,
  MessageSquarePlus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const MEAL_ICONS = {
  Breakfast: Coffee,
  Lunch: Sun,
  Snacks: Cookie,
  Dinner: Moon,
};

const MEAL_TIMES = {
  Breakfast: '7:30 AM - 9:30 AM',
  Lunch: '12:30 PM - 2:30 PM',
  Snacks: '5:00 PM - 6:15 PM',
  Dinner: '7:45 PM - 9:45 PM',
};

export const MessMenu = () => {
  const [viewMode, setViewMode] = useState('daily'); // 'daily' or 'weekly'
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [dailyMeals, setDailyMeals] = useState([]);
  const [weeklyMenu, setWeeklyMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load Daily Menu
  useEffect(() => {
    if (viewMode === 'daily') {
      const loadDaily = async () => {
        try {
          setLoading(true);
          const res = await mealService.getTodayMeals(selectedDate);
          if (res.success) {
            setDailyMeals(res.data || []);
          }
        } catch (err) {
          console.error('Error fetching daily menu:', err);
        } finally {
          setLoading(false);
        }
      };
      loadDaily();
    }
  }, [viewMode, selectedDate]);

  // Load Weekly Menu
  useEffect(() => {
    if (viewMode === 'weekly') {
      const loadWeekly = async () => {
        try {
          setLoading(true);
          const res = await mealService.getWeeklyMenu(selectedDate);
          if (res.success) {
            setWeeklyMenu(res.data || []);
          }
        } catch (err) {
          console.error('Error fetching weekly menu:', err);
        } finally {
          setLoading(false);
        }
      };
      loadWeekly();
    }
  }, [viewMode, selectedDate]);

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

  const formattedDateHeader = new Date(selectedDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header & Switcher */}
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
              margin: '0 0 6px 0',
            }}
          >
            Hostel Mess Menu
          </h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.925rem' }}>
            Check detailed schedules, nutritional options, and meal timings
          </p>
        </div>

        {/* Tab Toggle: Daily vs Weekly */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#e2e8f0',
            padding: '4px',
            borderRadius: '12px',
          }}
        >
          <button
            type="button"
            onClick={() => setViewMode('daily')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: viewMode === 'daily' ? '#ffffff' : 'transparent',
              color: viewMode === 'daily' ? '#0f172a' : '#64748b',
              fontWeight: '700',
              fontSize: '0.875rem',
              cursor: 'pointer',
              boxShadow: viewMode === 'daily' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            Daily View
          </button>
          <button
            type="button"
            onClick={() => setViewMode('weekly')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: viewMode === 'weekly' ? '#ffffff' : 'transparent',
              color: viewMode === 'weekly' ? '#0f172a' : '#64748b',
              fontWeight: '700',
              fontSize: '0.875rem',
              cursor: 'pointer',
              boxShadow: viewMode === 'weekly' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            Weekly Schedule
          </button>
        </div>
      </div>

      {/* Daily View Mode */}
      {viewMode === 'daily' && (
        <>
          {/* Date Selector Navigation Bar */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              padding: '12px 20px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
            }}
          >
            <button
              type="button"
              onClick={handlePrevDay}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.85rem',
                color: '#334155',
              }}
            >
              <ChevronLeft size={16} />
              <span>Previous Day</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  padding: '7px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#0f172a',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              />
              <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>
                {formattedDateHeader}
              </span>
            </div>

            <button
              type="button"
              onClick={handleNextDay}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.85rem',
                color: '#334155',
              }}
            >
              <span>Next Day</span>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Meals Grid */}
          {loading ? (
            <LoadingSpinner message="Fetching menu for selected day..." />
          ) : dailyMeals.length === 0 ? (
            <EmptyState
              title={`No menu recorded for ${selectedDate}`}
              description="Please check back soon or select another date from the selector above."
            />
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
              }}
            >
              {dailyMeals.map((meal) => {
                const IconComponent = MEAL_ICONS[meal.mealType] || Utensils;
                return (
                  <div
                    key={meal._id}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      overflow: 'hidden',
                    }}
                  >
                    <div>
                      {/* Meal Card Top Header */}
                      <div
                        style={{
                          padding: '16px 20px',
                          borderBottom: '1px solid #f1f5f9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          backgroundColor: '#f8fafc',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '8px',
                              backgroundColor: '#ffffff',
                              border: '1px solid #e2e8f0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#ea580c',
                            }}
                          >
                            <IconComponent size={20} />
                          </div>
                          <div>
                            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '700', color: '#0f172a' }}>
                              {meal.mealType}
                            </h3>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              {MEAL_TIMES[meal.mealType]}
                            </span>
                          </div>
                        </div>

                        {meal.avgRating && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <StarRating rating={meal.avgRating} size={15} showLabel={true} />
                          </div>
                        )}
                      </div>

                      {/* Food Items Pill List */}
                      <div style={{ padding: '20px' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '10px' }}>
                          Items Served
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                          {meal.items.map((item, idx) => (
                            <span
                              key={idx}
                              style={{
                                padding: '5px 12px',
                                borderRadius: '8px',
                                backgroundColor: '#fff7ed',
                                border: '1px solid #fed7aa',
                                color: '#9a3412',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                              }}
                            >
                              {item}
                            </span>
                          ))}
                        </div>

                        {meal.description && (
                          <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5 }}>
                            {meal.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bottom CTA */}
                    <div style={{ padding: '14px 20px', borderTop: '1px solid #f1f5f9', backgroundColor: '#fcfcfd' }}>
                      <Link
                        to={`/student/feedback?mealType=${meal.mealType}&date=${meal.date}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          padding: '9px',
                          borderRadius: '8px',
                          backgroundColor: '#ea580c',
                          color: '#ffffff',
                          fontWeight: '700',
                          fontSize: '0.85rem',
                          textDecoration: 'none',
                        }}
                      >
                        <MessageSquarePlus size={16} />
                        <span>Submit Feedback for this Meal</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Weekly View Mode */}
      {viewMode === 'weekly' && (
        <div>
          {loading ? (
            <LoadingSpinner message="Assembling full weekly menu schedule..." />
          ) : weeklyMenu.length === 0 ? (
            <EmptyState
              title="No weekly menu scheduled"
              description="The mess administration has not published the weekly schedule."
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {weeklyMenu.map((dayGroup) => (
                <div
                  key={dayGroup.date}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  }}
                >
                  {/* Day Banner */}
                  <div
                    style={{
                      padding: '14px 20px',
                      backgroundColor: '#f8fafc',
                      borderBottom: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>
                        {dayGroup.dayName}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        ({dayGroup.date})
                      </span>
                    </div>
                  </div>

                  {/* 4 Meal Columns for the Day */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      divideColor: '#f1f5f9',
                    }}
                  >
                    {['Breakfast', 'Lunch', 'Snacks', 'Dinner'].map((type) => {
                      const meal = dayGroup.meals[type];
                      return (
                        <div
                          key={type}
                          style={{
                            padding: '18px 20px',
                            borderRight: '1px solid #f1f5f9',
                            borderBottom: '1px solid #f1f5f9',
                          }}
                        >
                          <div style={{ marginBottom: '8px' }}>
                            <Badge mealType={type} size="sm">
                              {type}
                            </Badge>
                          </div>
                          {meal ? (
                            <>
                              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.875rem', color: '#334155' }}>
                                {meal.items.map((item, i) => (
                                  <li key={i} style={{ marginBottom: '4px' }}>
                                    {item}
                                  </li>
                                ))}
                              </ul>
                              <div style={{ marginTop: '12px' }}>
                                <Link
                                  to={`/student/feedback?mealType=${type}&date=${dayGroup.date}`}
                                  style={{
                                    fontSize: '0.75rem',
                                    color: '#ea580c',
                                    fontWeight: '700',
                                    textDecoration: 'none',
                                  }}
                                >
                                  + Give Feedback
                                </Link>
                              </div>
                            </>
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>
                              Not specified
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessMenu;
