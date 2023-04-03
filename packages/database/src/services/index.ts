import { RegionService } from './region';
import { AddressService } from './address';

export interface Services {
  regionService: RegionService;
  addressService: AddressService;
}

export function getServices() {
  const regionService = new RegionService();
  const addressService = new AddressService();

  const services = {
    regionService,
    addressService,
  };

  regionService.init(services);
  addressService.init(services);

  return services;
}
