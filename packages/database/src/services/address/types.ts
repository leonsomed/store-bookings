import type { Address } from '@prisma/client';
export type { Address } from '@prisma/client';

export type NewAddressPayload = Omit<Address, 'id' | 'street2'> & {
  coordinates: [number, number];
};

export interface NewAddressResponse {
  address: Address;
  coordinates: [number, number];
}
