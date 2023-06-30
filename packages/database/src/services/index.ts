import { RegionService } from './region';
import { AddressService } from './address';
import { ItemActivityService } from './activity';
import { ProductService } from './product';
import { InstructorService } from './instructor';

export * from './product/types';
export * from './activity/types';
export * from './instructor/types';
export * from './address/types';

export interface Services {
  regionService: RegionService;
  addressService: AddressService;
  itemActivityService: ItemActivityService;
  productService: ProductService;
  instructorService: InstructorService;
}

export function getServices() {
  const regionService = new RegionService();
  const addressService = new AddressService();
  const itemActivityService = new ItemActivityService();
  const productService = new ProductService();
  const instructorService = new InstructorService();

  const services = {
    regionService,
    addressService,
    itemActivityService,
    productService,
    instructorService,
  };

  regionService.init(services);
  addressService.init(services);
  itemActivityService.init(services);
  productService.init(services);
  instructorService.init(services);

  return services;
}
