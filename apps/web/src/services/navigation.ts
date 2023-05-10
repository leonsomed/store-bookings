export type ParamType = 'accountId' | 'orderId';

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
  accountOrderNewProducts: (accountId: string, orderId: string) =>
    `/account/${accountId}/order/${orderId}/product`,
  accountOrderTransactions: (accountId: string, orderId: string) =>
    `/account/${accountId}/order/${orderId}/transaction`,
  accountOrderProductDetails: (
    accountId: string,
    orderId: string,
    productId: string
  ) => `/account/${accountId}/order/${orderId}/product/${productId}`,
  accountOrderProductVoid: (
    accountId: string,
    orderId: string,
    productId: string
  ) => `/account/${accountId}/order/${orderId}/product/${productId}/void`,
  accountOrderProductSetPrice: (
    accountId: string,
    orderId: string,
    productId: string
  ) => `/account/${accountId}/order/${orderId}/product/${productId}/set-price`,
  accountOrderCancelLesson: (
    accountId: string,
    orderId: string,
    productId: string
  ) =>
    `/account/${accountId}/order/${orderId}/product/${productId}/cancel-lesson`,
  accountOrderBookLesson: (
    accountId: string,
    orderId: string,
    productId: string
  ) =>
    `/account/${accountId}/order/${orderId}/product/${productId}/book-lesson`,
};
