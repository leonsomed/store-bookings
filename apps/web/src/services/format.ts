import type { Address } from 'database';
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

export const timestampFromDateTime = (date: string, time: string) => {
  return dayjs(`${date} ${time}`, 'MM/DD/YYYY HH:mm').toDate().getTime();
};

export function getAddressLine(address: Address) {
  return [
    address.street,
    address.street2,
    address.city,
    address.state,
    address.zip,
  ]
    .filter(Boolean)
    .join(', ');
}
