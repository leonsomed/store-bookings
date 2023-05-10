'use client';

import { ReverseVoidOrderItemPayload, VoidOrderItemPayload } from 'database';
import {
  NewOrderItemsPayload,
  NewOrderTransactionPayload,
  SetOrderItemPricePayload,
} from 'database';

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
  newOrderItems: async ({
    accountId,
    ...payload
  }: Omit<NewOrderItemsPayload, 'authorId'>) => {
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
  setOrderItemPrice: async ({
    accountId,
    orderId,
    itemId,
    ...payload
  }: Omit<SetOrderItemPricePayload, 'authorId'>) => {
    return client(
      'POST',
      `/account/${accountId}/order/${orderId}/item/${itemId}/set-price/api`,
      payload
    );
  },
  voidOrderItem: async ({
    accountId,
    orderId,
    itemId,
    ...payload
  }: Omit<VoidOrderItemPayload, 'authorId'>) => {
    return client(
      'POST',
      `/account/${accountId}/order/${orderId}/item/${itemId}/void/api`,
      payload
    );
  },
  reverseVoidOrderItem: async ({
    accountId,
    orderId,
    itemId,
    ...payload
  }: Omit<ReverseVoidOrderItemPayload, 'authorId'>) => {
    return client(
      'POST',
      `/account/${accountId}/order/${orderId}/item/${itemId}/reverse-void/api`,
      payload
    );
  },
};
