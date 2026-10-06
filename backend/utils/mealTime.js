// Meal Timing and Feedback Availability Configuration (Option A: Unlocks at start time)
const MEAL_SCHEDULE = {
  Breakfast: {
    startHour: 7,
    startMinute: 30,
    endHour: 9,
    endMinute: 30,
    startTime: '7:30 AM',
    endTime: '9:30 AM',
    timeRange: '7:30 AM – 9:30 AM',
  },
  Lunch: {
    startHour: 12,
    startMinute: 30,
    endHour: 14,
    endMinute: 30,
    startTime: '12:30 PM',
    endTime: '2:30 PM',
    timeRange: '12:30 PM – 2:30 PM',
  },
  Snacks: {
    startHour: 17,
    startMinute: 0,
    endHour: 18,
    endMinute: 15,
    startTime: '5:00 PM',
    endTime: '6:15 PM',
    timeRange: '5:00 PM – 6:15 PM',
  },
  Dinner: {
    startHour: 19,
    startMinute: 45,
    endHour: 21,
    endMinute: 45,
    startTime: '7:45 PM',
    endTime: '9:45 PM',
    timeRange: '7:45 PM – 9:45 PM',
  },
};

const getLocalDateString = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Check if feedback is open for a meal on a given date
 * @param {string} mealType - 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner'
 * @param {string} dateStr - 'YYYY-MM-DD'
 * @param {Date} now - current server date/time
 * @returns {object} { isOpen: boolean, reason?: string, opensAt?: string, status: 'upcoming'|'serving'|'past' }
 */
const checkMealFeedbackStatus = (mealType, dateStr, now = new Date()) => {
  const todayStr = getLocalDateString(now);
  const schedule = MEAL_SCHEDULE[mealType];

  if (!schedule) {
    return { isOpen: true, status: 'past' };
  }

  // Future Date: Not allowed yet
  if (dateStr > todayStr) {
    return {
      isOpen: false,
      status: 'upcoming',
      reason: `Feedback cannot be submitted for a future date (${dateStr}).`,
      opensAt: `${schedule.startTime} on ${dateStr}`,
      schedule,
    };
  }

  // Past Date: Always allowed
  if (dateStr < todayStr) {
    return {
      isOpen: true,
      status: 'past',
      schedule,
    };
  }

  // Today's Date: Check real-time clock
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = schedule.startHour * 60 + schedule.startMinute;
  const endMinutes = schedule.endHour * 60 + schedule.endMinute;

  // Meal hasn't started serving yet
  if (currentMinutes < startMinutes) {
    return {
      isOpen: false,
      status: 'upcoming',
      reason: `${mealType} serving begins at ${schedule.startTime}. Feedback unlocks once the meal is being served.`,
      opensAt: schedule.startTime,
      schedule,
    };
  }

  // Currently being served
  if (currentMinutes <= endMinutes) {
    return {
      isOpen: true,
      status: 'serving',
      label: 'Serving Now',
      schedule,
    };
  }

  // Meal serving has concluded
  return {
    isOpen: true,
    status: 'past',
    label: 'Served Today',
    schedule,
  };
};

module.exports = {
  MEAL_SCHEDULE,
  getLocalDateString,
  checkMealFeedbackStatus,
};
