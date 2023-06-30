import { Address } from '@prisma/client';
import { Services } from '..';

export class RegionService {
  private services: Services = null as unknown as Services;

  init(services: Services) {
    this.services = services;
  }
}
