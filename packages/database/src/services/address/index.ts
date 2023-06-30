import { uuid } from 'uuidv4';
import { NewAddressResponse, NewAddressPayload, Services } from '..';
import { prisma } from '../../client';

export class AddressService {
  private services: Services = null as unknown as Services;

  init(services: Services) {
    this.services = services;
  }

  async createAddress(address: NewAddressPayload): Promise<NewAddressResponse> {
    const id = uuid();
    const street2 = ''; // TODO
    const geoJson = `{"type": "Point","coordinates": [${address.coordinates.join(
      ','
    )}]}`;
    await prisma.$executeRaw`INSERT INTO "Address" (id, street, street2, city, state, zip, country, coords) values (${id}, ${address.street}, ${street2}, ${address.city}, ${address.state}, ${address.zip}, ${address.country}, ST_GeomFromGeoJSON(${geoJson}))`;

    const doc = await prisma.address.findFirst({ where: { id } });

    if (!doc) {
      throw new Error(`Address not found ${id}`);
    }

    return { address: doc, coordinates: address.coordinates };
  }
}
