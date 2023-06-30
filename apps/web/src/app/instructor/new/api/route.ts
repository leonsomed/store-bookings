import * as yup from 'yup';
import { NextResponse } from 'next/server';
import { getServices, NewInstructorPayload } from 'database';
import { routeMiddleware } from '../../../../services/endpoint';

const schema = yup
  .object()
  .shape({
    email: yup.string().email().required(),
    firstName: yup.string().required(),
    lastName: yup.string().required(),
  })
  .required();

export const POST = routeMiddleware(async (req: Request) => {
  const { instructorService } = await getServices();
  const body = await req.json();
  const input = await schema.validate({
    ...body,
  });
  const payload: NewInstructorPayload = {
    email: input.email,
    firstName: input.firstName,
    lastName: input.lastName,
  };
  const instructor = await instructorService.createInstructor(payload);

  return NextResponse.json({ data: instructor });
});
