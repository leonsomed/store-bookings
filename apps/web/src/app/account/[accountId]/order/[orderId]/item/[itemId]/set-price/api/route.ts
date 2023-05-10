import * as yup from 'yup';
import { NextResponse } from 'next/server';
import { getServices, SetOrderItemPricePayload } from 'database';
import { routeMiddleware } from '../../../../../../../../../services/endpoint';

const schema = yup
  .object()
  .shape({
    accountId: yup.string().uuid().required(),
    orderId: yup.string().uuid().required(),
    itemId: yup.string().uuid().required(),
    userId: yup.string().uuid().required(),
    note: yup.string().required(),
    newPriceCents: yup.number().required().min(1),
    currentPriceCents: yup.number().required().min(1),
  })
  .required();

export const POST = routeMiddleware(async (req: Request, { params }) => {
  const { accountId, orderId, itemId } = params;
  const { itemActivityService } = await getServices();
  const body = await req.json();
  const input = await schema.validate({
    ...body,
    accountId,
    orderId,
    itemId,
  });
  const payload: SetOrderItemPricePayload = {
    authorId: 'c71d0998-1871-4e10-a76d-13d50ab76f54', // TODO the current user
    orderId: input.orderId,
    itemId: input.itemId,
    userId: input.userId,
    accountId: input.accountId,
    newPriceCents: input.newPriceCents,
    currentPriceCents: input.currentPriceCents,
    note: input.note,
  };
  await itemActivityService.setOrderItemPrice(payload);

  return NextResponse.json({ success: 1 });
});
