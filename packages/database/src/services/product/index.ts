import { LessonRole, ProductType, State } from '../activity/types';
import { Bundle, BundleId, Product, ProductId } from './types';

export const products: Product[] = [
  {
    id: ProductId.dmvLesson,
    type: ProductType.lesson,
    role: LessonRole.driver,
    duration: 60 * 3.5,
  },
  {
    id: ProductId.driver1,
    type: ProductType.lesson,
    role: LessonRole.driver,
    duration: 60 * 1,
  },
  {
    id: ProductId.driver2,
    type: ProductType.lesson,
    role: LessonRole.driver,
    duration: 60 * 2,
  },
  {
    id: ProductId.observer1,
    type: ProductType.lesson,
    role: LessonRole.observer,
    duration: 60 * 1,
  },
  {
    id: ProductId.observer2,
    type: ProductType.lesson,
    role: LessonRole.observer,
    duration: 60 * 2,
  },
  {
    id: ProductId.course,
    type: ProductType.course,
  },
];

export const bundles: Bundle[] = [
  {
    id: BundleId.standard6,
    products: [{ id: ProductId.driver2, quantity: 3 }],
  },
  {
    id: BundleId.standard10,
    products: [{ id: ProductId.driver2, quantity: 5 }],
  },
  {
    id: BundleId.de6,
    products: [
      { id: ProductId.driver2, quantity: 3 },
      { id: ProductId.course, quantity: 1 },
    ],
  },
  {
    id: BundleId.de10,
    products: [
      { id: ProductId.driver2, quantity: 5 },
      { id: ProductId.course, quantity: 1 },
    ],
  },
  {
    id: BundleId.standard7x7,
    products: [
      { id: ProductId.driver1, quantity: 7 },
      { id: ProductId.observer1, quantity: 7 },
    ],
  },
];
