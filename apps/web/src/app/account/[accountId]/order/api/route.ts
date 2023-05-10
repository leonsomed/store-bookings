import { NextResponse } from 'next/server';
import { prisma, getServices, ProductId, BundleId } from 'database';
import * as yup from 'yup';
import { routeMiddleware } from '../../../../../services/endpoint';
import { NewOrderProductsPayload } from 'database';

const lazyLoaderFactory = () => {
  let cache: any;

  return async <T>(fn: () => Promise<T>): Promise<T> => {
    if (cache) {
      return cache;
    }

    const result = await fn();
    cache = result;

    return result;
  };
};

const lazyLoader = lazyLoaderFactory();

export const POST = routeMiddleware(async (req: Request, { params }) => {
  const { accountId } = params;
  const { itemActivityService } = await getServices();
  const body = await req.json();
  const schema = await lazyLoader(async () => {
    const products = await getServices().productService.getProducts();
    const schema = yup
      .object()
      .shape({
        accountId: yup.string().uuid().required(),
        orderId: yup.string().uuid().optional(),
        userId: yup.string().uuid().required(),
        regionId: yup.string().uuid().required(),
        description: yup.string().required(),
        items: yup
          .array()
          .of(
            yup
              .object()
              .shape({
                id: yup
                  .string()
                  .required()
                  .oneOf(products.map((n) => n.id.toString())),
                priceCents: yup.number().min(1).required(),
                state: yup
                  .string()
                  .oneOf(['california', 'texas'])
                  .when('id', {
                    is: (id) =>
                      products.find((n) => n.id === id).type === 'course',
                    then: (schema) => schema.required(),
                  }),
              })
              .required()
          )
          .min(1)
          .required(),
      })
      .required();
    return schema;
  });
  const input = await schema.validate({
    ...body,
    accountId,
  });
  const payload: NewOrderProductsPayload = {
    authorId: 'c71d0998-1871-4e10-a76d-13d50ab76f54', // TODO the current user
    orderId: input.orderId,
    userId: input.userId,
    regionId: input.regionId,
    accountId: input.accountId,
    description: input.description,
    items: input.items.map((item) => ({
      id: item.id as ProductId,
      priceCents: item.priceCents,
      state: item.state,
    })),
  };
  await itemActivityService.newOrderProducts(payload);

  return NextResponse.json({ success: 1 });
});
