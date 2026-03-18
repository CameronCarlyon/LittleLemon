const seededRandom = function (seed) {
    var m = 2**35 - 31;
    var a = 185852;
    var s = seed % m;
    return function () {
        return (s = s * a % m) / m;
    };
};

const SLOT_INTERVAL_MINUTES = 30;

const padTime = (value) => String(value).padStart(2, '0');

const getTimeSlotMinutes = (timeSlot) => {
    const [hour, minute] = timeSlot.split(':').map(Number);
    return (hour * 60) + minute;
};

const isSameCalendarDate = (leftDate, rightDate) => {
    return leftDate.getFullYear() === rightDate.getFullYear()
        && leftDate.getMonth() === rightDate.getMonth()
        && leftDate.getDate() === rightDate.getDate();
};

const getAvailabilityChance = (dayOfWeek, timeSlot) => {
    const minutes = getTimeSlotMinutes(timeSlot);

    if (dayOfWeek === 6) {
        if (minutes >= 12 * 60 && minutes <= 14 * 60) return 0.38;
        if (minutes >= 18 * 60 && minutes <= 20 * 60) return 0.32;
        if (minutes >= 15 * 60 && minutes < 18 * 60) return 0.58;
        return 0.5;
    }

    if (minutes >= 12 * 60 && minutes <= 13 * 60 + 30) return 0.45;
    if (minutes >= 18 * 60 && minutes <= 20 * 60 + 30) return 0.35;
    if (minutes >= 14 * 60 && minutes < 18 * 60) return 0.72;
    if (minutes < 12 * 60) return 0.76;
    if (minutes > 20 * 60 + 30) return 0.6;
    return 0.55;
};

const buildTimeSlots = (openHour, openMinute, closeHour, closeMinute) => {
    const slots = [];
    const startMinutes = (openHour * 60) + openMinute;
    const endMinutes = (closeHour * 60) + closeMinute;

    for (let minutes = startMinutes; minutes < endMinutes; minutes += SLOT_INTERVAL_MINUTES) {
        const hour = Math.floor(minutes / 60);
        const minute = minutes % 60;
        slots.push(`${padTime(hour)}:${padTime(minute)}`);
    }

    return slots;
};

export const getReservationTimeSlots = function(date) {
    const dayOfWeek = date.getDay();
    let timeSlots = [];

    if (dayOfWeek === 0) {
        return [];
    }

    if (dayOfWeek === 6) {
        timeSlots = buildTimeSlots(12, 0, 21, 0);
    } else {
        timeSlots = buildTimeSlots(10, 30, 23, 0);
    }

    const now = new Date();
    if (!isSameCalendarDate(date, now)) {
        return timeSlots;
    }

    const currentMinutes = (now.getHours() * 60) + now.getMinutes();
    return timeSlots.filter((timeSlot) => getTimeSlotMinutes(timeSlot) > currentMinutes);
};

export const fetchAPI = function(date) {
    const allTimeSlots = getReservationTimeSlots(date);
    const dayOfWeek = date.getDay();
    let result = [];
    const seedBase = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();

    for (const timeSlot of allTimeSlots) {
        const slotSeed = seedBase + getTimeSlotMinutes(timeSlot);
        const random = seededRandom(slotSeed);
        if (random() < getAvailabilityChance(dayOfWeek, timeSlot)) {
            result.push(timeSlot);
        }
    }

    return result;
};

export const submitAPI = function(formData) {
    return true;
};