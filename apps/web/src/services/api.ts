'use client';

import { NewOrderProductsPayload, NewOrderTransactionPayload } from 'database';

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
  newOrderProducts: async ({
    accountId,
    ...payload
  }: Omit<NewOrderProductsPayload, 'authorId'>) => {
    return client('POST', `/account/${accountId}/order/api`, payload);
  },
  newOrderTransaction: async ({
    accountId,
    orderId,
    ...payload
  }: Omit<NewOrderTransactionPayload, 'authorId'>) => {
    return client(
      'POST',
      `/account/${accountId}/order/${orderId}/transaction/api`,
      payload
    );
  },
};
