import * as yup from 'yup';
import { NextResponse } from 'next/server';
import { getServices, VoidOrderItemPayload } from 'database';
import { VoidReason } from '@prisma/client';
import { routeMiddleware } from '../../../../../../../../../services/endpoint';
import { VOID_REASONS } from '../../../../../../../../../items/constants';

const schema = yup
  .object()
  .shape({
    accountId: yup.string().uuid().required(),
    orderId: yup.string().uuid().required(),
    itemId: yup.string().uuid().required(),
    userId: yup.string().uuid().required(),
    note: yup.string().required(),
    reason: yup
      .string()
      .oneOf(VOID_REASONS.map((n) => n.value))
      .required(),
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
  const payload: VoidOrderItemPayload = {
    authorId: 'c71d0998-1871-4e10-a76d-13d50ab76f54', // TODO the current user
    orderId: input.orderId,
    itemId: input.itemId,
    userId: input.userId,
    accountId: input.accountId,
    reason: input.reason as VoidReason,
    note: input.note,
  };
  await itemActivityService.voidOrderItem(payload);

  return NextResponse.json({ success: 1 });
});
