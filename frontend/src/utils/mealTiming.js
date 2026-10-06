export const MEAL_SCHEDULE = {
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

export const getLocalDateString = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Validates whether feedback can be submitted for a given meal and date.
 * Option A rule: Unlocks as soon as meal serving begins.
 */
export const getMealAvailability = (mealType, dateStr, now = new Date()) => {
  const todayStr = getLocalDateString(now);
  const schedule = MEAL_SCHEDULE[mealType];

  if (!schedule) {
    return { isAvailable: true, status: 'past' };
  }

  // Future date
  if (dateStr > todayStr) {
    return {
      isAvailable: false,
      status: 'upcoming',
      opensAt: `${schedule.startTime} on ${dateStr}`,
      reason: `Feedback cannot be submitted for future dates. Opens on ${dateStr} at ${schedule.startTime}.`,
      badgeText: `Upcoming`,
      badgeVariant: 'warning',
    };
  }

  // Past date
  if (dateStr < todayStr) {
    return {
      isAvailable: true,
      status: 'past',
      reason: null,
      badgeText: `Past Meal`,
      badgeVariant: 'default',
    };
  }

  // Today
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = schedule.startHour * 60 + schedule.startMinute;
  const endMinutes = schedule.endHour * 60 + schedule.endMinute;

  if (currentMinutes < startMinutes) {
    return {
      isAvailable: false,
      status: 'upcoming',
      opensAt: schedule.startTime,
      reason: `${mealType} serving starts at ${schedule.startTime}. Feedback will unlock once the meal is being served.`,
      badgeText: `Opens at ${schedule.startTime}`,
      badgeVariant: 'warning',
    };
  }

  if (currentMinutes <= endMinutes) {
    return {
      isAvailable: true,
      status: 'serving',
      reason: null,
      badgeText: `Serving Now`,
      badgeVariant: 'success',
    };
  }

  return {
    isAvailable: true,
    status: 'completed',
    reason: null,
    badgeText: `Served Today`,
    badgeVariant: 'default',
  };
};
