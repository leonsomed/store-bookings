import { LessonRole, ProductType } from '@prisma/client';
import { Bundle, BundleId, Product, ProductId } from './types';
import { Services } from '..';

const products: Product[] = [
  {
    description: 'DMV Lesson',
    id: ProductId.dmvLesson,
    type: ProductType.lesson,
    role: LessonRole.driver,
    durationMinutes: 60 * 3.5,
  },
  {
    id: ProductId.driver1,
    description: 'One-hour driving lesson',
    type: ProductType.lesson,
    role: LessonRole.driver,
    durationMinutes: 60 * 1,
  },
  {
    id: ProductId.driver2,
    description: 'Two-hour driving lesson',
    type: ProductType.lesson,
    role: LessonRole.driver,
    durationMinutes: 60 * 2,
  },
  {
    id: ProductId.observer1,
    description: 'One-hour observation lesson',
    type: ProductType.lesson,
    role: LessonRole.observer,
    durationMinutes: 60 * 1,
  },
  {
    id: ProductId.observer2,
    description: 'Two-hour observation lesson',
    type: ProductType.lesson,
    role: LessonRole.observer,
    durationMinutes: 60 * 2,
  },
  {
    id: ProductId.course,
    description: 'Drivers Ed Course',
    type: ProductType.course,
  },
];

const bundles: Bundle[] = [
  {
    id: BundleId.standard6,
    description: '3 two-hour lesson bundle',
    products: [{ id: ProductId.driver2, quantity: 3 }],
  },
  {
    id: BundleId.standard10,
    description: '5 two-hour lesson bundle',
    products: [{ id: ProductId.driver2, quantity: 5 }],
  },
  {
    id: BundleId.de6,
    description: '3 two-hour lesson bundle and drivers Ed course',
    products: [
      { id: ProductId.driver2, quantity: 3 },
      { id: ProductId.course, quantity: 1 },
    ],
  },
  {
    id: BundleId.de10,
    description: '5 two-hour lesson bundle and drivers Ed course',
    products: [
      { id: ProductId.driver2, quantity: 5 },
      { id: ProductId.course, quantity: 1 },
    ],
  },
  {
    id: BundleId.standard7x7,
    description: '7 one-hour driving and 7 one-hour observation lessons',
    products: [
      { id: ProductId.driver1, quantity: 7 },
      { id: ProductId.observer1, quantity: 7 },
    ],
  },
];

export class ProductService {
  private services: Services = null as unknown as Services;

  init(services: Services) {
    this.services = services;
  }

  async getBundles(): Promise<Bundle[]> {
    return bundles;
  }

  async getProducts(): Promise<Product[]> {
    return products;
  }
}
