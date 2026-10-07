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
              color: '#f8fafc',
              margin: '0 0 6px 0',
            }}
          >
            Hostel Mess Menu
          </h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.925rem' }}>
            Check detailed schedules, food items, and serving times
          </p>
        </div>

        {/* Tab Toggle: Daily vs Weekly */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#1c1f26',
            padding: '4px',
            borderRadius: '12px',
            border: '1px solid #282c38',
          }}
        >
          <button
            type="button"
            onClick={() => setViewMode('daily')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: viewMode === 'daily' ? '#fef08a' : 'transparent',
              color: viewMode === 'daily' ? '#0f1013' : '#94a3b8',
              fontWeight: '700',
              fontSize: '0.875rem',
              cursor: 'pointer',
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
              backgroundColor: viewMode === 'weekly' ? '#fef08a' : 'transparent',
              color: viewMode === 'weekly' ? '#0f1013' : '#94a3b8',
              fontWeight: '700',
              fontSize: '0.875rem',
              cursor: 'pointer',
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
              backgroundColor: '#181a20',
              borderRadius: '14px',
              padding: '12px 20px',
              border: '1px solid #262933',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
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
                border: '1px solid #2e323e',
                backgroundColor: '#1e212a',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.85rem',
                color: '#f8fafc',
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
                  border: '1px solid #2e323e',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#f8fafc',
                  backgroundColor: '#13151a',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              />
              <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#f8fafc' }}>
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
                border: '1px solid #2e323e',
                backgroundColor: '#1e212a',
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
                      backgroundColor: '#181a20',
                      borderRadius: '16px',
                      border: '1px solid #262933',
                      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
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
                          borderBottom: '1px solid #232630',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          backgroundColor: '#1b1d24',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '10px',
                              backgroundColor: '#282415',
                              border: '1px solid #45391d',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fef08a',
                            }}
                          >
                            <IconComponent size={20} />
                          </div>
                          <div>
                            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '700', color: '#f8fafc' }}>
                              {meal.mealType}
                            </h3>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
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
                        <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px' }}>
                          Items Served
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                          {meal.items.map((item, idx) => (
                            <span
                              key={idx}
                              style={{
                                padding: '5px 12px',
                                borderRadius: '8px',
                                backgroundColor: '#211f18',
                                border: '1px solid #4a3e21',
                                color: '#fef08a',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                              }}
                            >
                              {item}
                            </span>
                          ))}
                        </div>

                        {meal.description && (
                          <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.5 }}>
                            {meal.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bottom CTA */}
                    <div style={{ padding: '14px 20px', borderTop: '1px solid #232630', backgroundColor: '#15171d' }}>
                      <Link
                        to={`/student/feedback?mealType=${meal.mealType}&date=${meal.date}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          padding: '10px',
                          borderRadius: '10px',
                          backgroundColor: '#fef08a',
                          color: '#0f1013',
                          fontWeight: '700',
                          fontSize: '0.875rem',
                          textDecoration: 'none',
                          boxShadow: '0 2px 8px rgba(254, 240, 138, 0.2)',
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
                    backgroundColor: '#181a20',
                    borderRadius: '16px',
                    border: '1px solid #262933',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  }}
                >
                  {/* Day Banner */}
                  <div
                    style={{
                      padding: '14px 20px',
                      backgroundColor: '#1c1f27',
                      borderBottom: '1px solid #262933',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#f8fafc' }}>
                        {dayGroup.dayName}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                        ({dayGroup.date})
                      </span>
                    </div>
                  </div>

                  {/* 4 Meal Columns for the Day */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    }}
                  >
                    {['Breakfast', 'Lunch', 'Snacks', 'Dinner'].map((type) => {
                      const meal = dayGroup.meals[type];
                      return (
                        <div
                          key={type}
                          style={{
                            padding: '18px 20px',
                            borderRight: '1px solid #232630',
                            borderBottom: '1px solid #232630',
                          }}
                        >
                          <div style={{ marginBottom: '8px' }}>
                            <Badge mealType={type} size="sm">
                              {type}
                            </Badge>
                          </div>
                          {meal ? (
                            <>
                              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.875rem', color: '#cbd5e1' }}>
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
                                    fontSize: '0.78rem',
                                    color: '#fef08a',
                                    fontWeight: '700',
                                    textDecoration: 'none',
                                  }}
                                >
                                  + Give Feedback
                                </Link>
                              </div>
                            </>
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>
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
