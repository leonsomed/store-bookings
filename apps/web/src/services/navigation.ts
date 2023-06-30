export type ParamType = 'accountId' | 'orderId' | 'itemId' | 'instructorId';

export function getParam(
  key: ParamType,
  params: PageParamsProps['params']
): string {
  if (!params[key]) {
    throw new Error(`Missing parameter: ${key}`);
  }

  return params[key];
}

export interface PageParamsProps {
  params: { accountId?: string; orderId?: string };
}

export const routes = {
  home: () => '/',
  account: {
    home: () => '/account',
    details: (accountId: string) => `/account/${accountId}`,
    newOrder: (accountId: string) => `/account/${accountId}/order/new`,
    newOrderItem: (accountId: string, orderId: string) =>
      `/account/${accountId}/order/${orderId}/item/new`,
    orderDetails: (accountId: string, orderId: string) =>
      `/account/${accountId}/order/${orderId}`,
    orderTransactions: (accountId: string, orderId: string) =>
      `/account/${accountId}/order/${orderId}/transaction`,
    orderItemDetails: (accountId: string, orderId: string, itemId: string) =>
      `/account/${accountId}/order/${orderId}/item/${itemId}`,
    orderItemVoid: (accountId: string, orderId: string, itemId: string) =>
      `/account/${accountId}/order/${orderId}/item/${itemId}/void`,
    orderItemReverseVoid: (
      accountId: string,
      orderId: string,
      itemId: string
    ) => `/account/${accountId}/order/${orderId}/item/${itemId}/reverse-void`,
    orderItemSetPrice: (accountId: string, orderId: string, itemId: string) =>
      `/account/${accountId}/order/${orderId}/item/${itemId}/set-price`,
    orderItemView: (accountId: string, orderId: string, itemId: string) =>
      `/account/${accountId}/order/${orderId}/item/${itemId}/view`,
    orderCancelLesson: (accountId: string, orderId: string, itemId: string) =>
      `/account/${accountId}/order/${orderId}/item/${itemId}/cancel-lesson`,
    orderScheduleLesson: (accountId: string, orderId: string, itemId: string) =>
      `/account/${accountId}/order/${orderId}/item/${itemId}/schedule-lesson`,
  },
  instructor: {
    home: () => '/instructor',
    details: (instructorId: string) => `/instructor/${instructorId}`,
    edit: (instructorId: string) => `/instructor/${instructorId}/edit`,
    newInstructor: () => `/instructor/new`,
  },
};
