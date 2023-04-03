import { Address } from '@prisma/client';
import { Services } from '..';

export class RegionService {
  private services: Services = null as unknown as Services;

  init(services: Services) {
    this.services = services;
  }

  async geocodeAddress(address: Address): Promise<[number, number]> {
    // TODO call mapbox geocoding api
    return [-116.9693364, 32.5089527];
  }
}
