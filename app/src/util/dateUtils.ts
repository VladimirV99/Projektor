const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const removeTime = (date: Date) => {
    return date.setHours(0, 0, 0, 0);
};

export const toDateString = (date: Date) => {
    const dayOfWeek = days[date.getDay()];
    const month = months[date.getMonth()];
    const day = date.getDate();
    return `${dayOfWeek} ${month} ${day}`;
};

export const toTimeString = (date: Date) => {
    let hours = date.getHours().toString();
    if (hours.length == 1) hours = '0' + hours;
    let minutes = date.getMinutes().toString();
    if (minutes.length == 1) minutes = '0' + minutes;
    return `${hours}:${minutes}`;
};

export const parseServerDate = (date: Date) => {
    return new Date(date + 'Z');
};

export const addMillisecond = (date: Date) => {
    return new Date(date.getTime() + 1);
};
