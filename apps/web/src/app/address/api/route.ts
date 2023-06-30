import * as yup from 'yup';
import { NextResponse } from 'next/server';
import { getServices, NewAddressPayload } from 'database';
import { routeMiddleware } from '../../../services/endpoint';

const schema = yup
  .object()
  .shape({
    street: yup.string().required(),
    city: yup.string().required(),
    state: yup.string().required(),
    country: yup.string().required(),
    zip: yup.string().required(),
    coordinates: yup.array(yup.number().required()).length(2).required(),
  })
  .required();

export const POST = routeMiddleware(async (req: Request) => {
  const { addressService } = await getServices();
  const body = await req.json();
  const input = await schema.validate({
    ...body,
  });
  const payload: NewAddressPayload = {
    street: input.street,
    city: input.city,
    state: input.state,
    country: input.country,
    zip: input.zip,
    coordinates: input.coordinates as [number, number],
  };
  const instructor = await addressService.createAddress(payload);

  return NextResponse.json({ data: instructor });
});
