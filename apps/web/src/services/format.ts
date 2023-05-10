import dayjs from 'dayjs';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function formatCentsToDollars(cents: number) {
  if (isNaN(cents)) return '$...';
  return formatter.format(cents / 100);
}

export function formatDollars(dollars: number) {
  if (isNaN(dollars)) return '$...';
  return formatter.format(dollars);
}

export const dollarsToCents = (dollars: string) =>
  parseInt(dollars.replace('.', ''));

export const formatDate = (
  date: Date | string | undefined | null,
  fallback = 'n/a'
) => {
  if (!date) return fallback;

  return dayjs(date).format('MM/DD/YYYY hh:mm A');
};
