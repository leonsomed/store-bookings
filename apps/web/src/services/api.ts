'use client';

import type { NewOrderPayload } from '../app/account/[accountId]/order/api/route';

const defaultHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

const client = async (method: 'POST' | 'GET', url: string, payload: any) => {
  const response = await fetch(url, {
    method: method,
    body: JSON.stringify(payload),
    headers: defaultHeaders,
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const api = {
  newOrder: async ({ accountId, ...payload }: NewOrderPayload) => {
    return client('POST', `/account/${accountId}/order/api`, payload);
  },
};
