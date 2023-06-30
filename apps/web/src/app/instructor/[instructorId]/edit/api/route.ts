import * as yup from 'yup';
import { NextResponse } from 'next/server';
import { EditInstructorPayload, getServices } from 'database';
import { routeMiddleware } from '../../../../../services/endpoint';

const schema = yup
  .object()
  .shape({
    email: yup.string().email().required(),
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    addressId: yup.string().uuid().required(),
  })
  .required();

export const POST = routeMiddleware(async (req: Request, { params }) => {
  const { instructorId } = params;
  const { instructorService } = await getServices();
  const body = await req.json();
  const input = await schema.validate({
    ...body,
  });
  const payload: EditInstructorPayload = {
    id: instructorId,
    email: input.email,
    firstName: input.firstName,
    lastName: input.lastName,
    addressId: input.addressId,
  };
  const instructor = await instructorService.editInstructor(payload);

  return NextResponse.json({ data: instructor });
});
