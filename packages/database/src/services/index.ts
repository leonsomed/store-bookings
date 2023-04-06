import { RegionService } from './region';
import { AddressService } from './address';
import { ItemActivityService } from './activity';
import { ProductService } from './product';

export * from './product/types';
export * from './activity/types';

export interface Services {
  regionService: RegionService;
  addressService: AddressService;
  itemActivityService: ItemActivityService;
  productService: ProductService;
}

export function getServices() {
  const regionService = new RegionService();
  const addressService = new AddressService();
  const itemActivityService = new ItemActivityService();
  const productService = new ProductService();

  const services = {
    regionService,
    addressService,
    itemActivityService,
    productService,
  };

  regionService.init(services);
  addressService.init(services);
  itemActivityService.init(services);
  productService.init(services);

  return services;
}
