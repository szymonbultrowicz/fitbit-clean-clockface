const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const days = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

// Add zero in front of numbers < 10
export function zeroPad(i: number): string {
  return i < 10 ? `0${i}` : `${i}`;
}

export function formatDate(date: Date): string {
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`; // format(date, "ddd, MMM Mo YYYY");
}
