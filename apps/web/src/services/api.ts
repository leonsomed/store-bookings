'use client';

import { ItemEntry } from '../app/account/[accountId]/order/NewOrderForm';
import { dollarsToCents } from './format';

interface OrderPayload {
  accountId: string;
  items: ItemEntry[];
}

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
  newOrder: async (order: OrderPayload) => {
    const description = order.items.map((item) => item.description).join(', ');
    const items = order.items.flatMap((item) =>
      item.items.map((subItem) => ({
        id: subItem.id,
        state: subItem.state,
        priceCents: dollarsToCents(subItem.priceDollars),
      }))
    );

    return client('POST', `/account/${order.accountId}/order/api`, {
      items,
      description,
    });
  },
};
