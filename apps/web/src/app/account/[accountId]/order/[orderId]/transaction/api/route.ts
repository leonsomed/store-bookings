import { NextResponse } from 'next/server';
import { getServices, NewOrderTransactionPayload } from 'database';
import * as yup from 'yup';
import { routeMiddleware } from '../../../../../../../services/endpoint';

const schema = yup
  .object()
  .shape({
    accountId: yup.string().uuid().required(),
    orderId: yup.string().uuid().optional(),
    userId: yup.string().uuid().required(),
    note: yup.string().required(),
    cents: yup.number().required(),
    stripeChargeId: yup.string().optional(),
    stripeCustomerId: yup.string().optional(),
    category: yup.string().oneOf(['cash', 'stripe']).required(),
  })
  .required();

export const POST = routeMiddleware(async (req: Request, { params }) => {
  const { accountId, orderId } = params;
  const { itemActivityService } = await getServices();
  const body = await req.json();
  const input = await schema.validate({
    ...body,
    accountId,
    orderId,
  });
  const payload: NewOrderTransactionPayload = {
    authorId: 'c71d0998-1871-4e10-a76d-13d50ab76f54', // TODO the current user
    orderId: input.orderId,
    userId: input.userId,
    accountId: input.accountId,
    cents: input.cents,
    note: input.note,
    category: input.category,
    stripeChargeId: input.stripeChargeId,
    stripeCustomerId: input.stripeCustomerId,
  };
  await itemActivityService.newOrderTransaction(payload);

  return NextResponse.json({ success: 1 });
});
