import * as yup from 'yup';
import { NextResponse } from 'next/server';
import {
  CancelLessonPayload,
  getServices,
  ScheduleLessonPayload,
} from 'database';
import { routeMiddleware } from '../../../../../../../../../services/endpoint';

const schema = yup
  .object()
  .shape({
    accountId: yup.string().uuid().required(),
    orderId: yup.string().uuid().required(),
    itemId: yup.string().uuid().required(),
    userId: yup.string().uuid().required(),
    note: yup.string().required(),
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
  const payload: CancelLessonPayload = {
    authorId: 'c71d0998-1871-4e10-a76d-13d50ab76f54', // TODO the current user
    accountId: input.accountId,
    orderId: input.orderId,
    itemId: input.itemId,
    userId: input.userId,
    note: input.note,
  };
  await itemActivityService.cancelLesson(payload);

  return NextResponse.json({ success: 1 });
});
