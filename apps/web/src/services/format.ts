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
