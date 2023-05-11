export type ParamType = 'accountId' | 'orderId' | 'itemId';

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
  accounts: () => '/account',
  accountDetails: (accountId: string) => `/account/${accountId}`,
  accountOrderNew: (accountId: string) => `/account/${accountId}/order`,
  accountOrderDetails: (accountId: string, orderId: string) =>
    `/account/${accountId}/order/${orderId}`,
  accountOrderNewItems: (accountId: string, orderId: string) =>
    `/account/${accountId}/order/${orderId}/item`,
  accountOrderTransactions: (accountId: string, orderId: string) =>
    `/account/${accountId}/order/${orderId}/transaction`,
  accountOrderItemDetails: (
    accountId: string,
    orderId: string,
    itemId: string
  ) => `/account/${accountId}/order/${orderId}/item/${itemId}`,
  accountOrderItemVoid: (accountId: string, orderId: string, itemId: string) =>
    `/account/${accountId}/order/${orderId}/item/${itemId}/void`,
  accountOrderItemReverseVoid: (
    accountId: string,
    orderId: string,
    itemId: string
  ) => `/account/${accountId}/order/${orderId}/item/${itemId}/reverse-void`,
  accountOrderItemSetPrice: (
    accountId: string,
    orderId: string,
    itemId: string
  ) => `/account/${accountId}/order/${orderId}/item/${itemId}/set-price`,
  accountOrderItemView: (accountId: string, orderId: string, itemId: string) =>
    `/account/${accountId}/order/${orderId}/item/${itemId}/view`,
  accountOrderCancelLesson: (
    accountId: string,
    orderId: string,
    itemId: string
  ) => `/account/${accountId}/order/${orderId}/item/${itemId}/cancel-lesson`,
  accountOrderScheduleLesson: (
    accountId: string,
    orderId: string,
    itemId: string
  ) => `/account/${accountId}/order/${orderId}/item/${itemId}/schedule-lesson`,
};
