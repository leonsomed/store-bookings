import type { Address } from '@prisma/client';
import { Services } from '..';
import { prisma } from '../../client';

export class AddressService {
  private services: Services = null as unknown as Services;

  init(services: Services) {
    this.services = services;
  }

  async createAddress(address: Address) {
    const coords = await this.services.regionService.geocodeAddress(address);
    const geoJson = `{"type": "Point","coordinates": [${coords.join(',')}]}`;
    await prisma.$executeRaw`INSERT INTO "Address" (id, street, street2, city, state, zip, country, coords) values (${
      address.id
    }, ${address.street}, ${address.street2 ?? ''}, ${address.city}, ${
      address.state
    }, ${address.zip}, ${address.country}, ST_GeomFromGeoJSON(${geoJson}))`;
  }
}
