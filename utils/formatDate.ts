import { CalendarDate } from "@internationalized/date";

export const formatDate = (date: CalendarDate) => {
  return date.toDate('UTC').toISOString();
};

export const formatDateString = (date: string) => {
  const parsedDate = new Date(date);
  
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Europe/Istanbul'
  };

  return parsedDate.toLocaleString('tr-TR', options);
};

export const formatDateToUTC = (date: string) => {
  if (!date) return null;
  
  const localDate = new Date(date);
  return new Date(
    Date.UTC(
      localDate.getFullYear(),
      localDate.getMonth(),
      localDate.getDate(),
      0, 0, 0
    )
  ).toISOString();
};