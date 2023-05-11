import * as yup from 'yup';
import { NextResponse } from 'next/server';
import { getServices, ScheduleLessonPayload } from 'database';
import { routeMiddleware } from '../../../../../../../../../services/endpoint';

const schema = yup
  .object()
  .shape({
    timestamp: yup.number().required(),
    address: yup.string().required(),
    accountId: yup.string().uuid().required(),
    instructorId: yup.string().uuid().required(),
    studentId: yup.string().uuid().required(),
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
  const payload: ScheduleLessonPayload = {
    authorId: 'c71d0998-1871-4e10-a76d-13d50ab76f54', // TODO the current user
    timestamp: input.timestamp,
    address: input.address,
    accountId: input.accountId,
    instructorId: input.instructorId,
    studentId: input.studentId,
    orderId: input.orderId,
    itemId: input.itemId,
    userId: input.userId,
    note: input.note,
  };
  await itemActivityService.scheduleLesson(payload);

  return NextResponse.json({ success: 1 });
});
