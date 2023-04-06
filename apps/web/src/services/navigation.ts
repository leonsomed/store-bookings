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
  accountOrderTransactions: (accountId: string, orderId: string) =>
    `/account/${accountId}/order/${orderId}/transaction`,
  accountProductDetails: (
    accountId: string,
    orderId: string,
    productId: string
  ) => `/account/${accountId}/order/${orderId}/product/${productId}`,
  accountProductVoid: (accountId: string, orderId: string, productId: string) =>
    `/account/${accountId}/order/${orderId}/product/${productId}/void`,
  accountProductSetPrice: (
    accountId: string,
    orderId: string,
    productId: string
  ) => `/account/${accountId}/order/${orderId}/product/${productId}/set-price`,
  accountCancelLesson: (
    accountId: string,
    orderId: string,
    productId: string
  ) =>
    `/account/${accountId}/order/${orderId}/product/${productId}/cancel-lesson`,
  accountBookLesson: (accountId: string, orderId: string, productId: string) =>
    `/account/${accountId}/order/${orderId}/product/${productId}/book-lesson`,
};
