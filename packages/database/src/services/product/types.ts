import { LessonRole, ProductType, State } from '../activity/types';

export enum ProductId {
  dmvLesson,
  driver1,
  driver2,
  observer1,
  observer2,
  course,
}

export enum BundleId {
  standard6,
  standard10,
  de6,
  de10,
  standard7x7,
}

export interface LessonProduct {
  id: ProductId;
  type: ProductType.lesson;
  role: LessonRole;
  duration: number;
}

export interface CourseProduct {
  id: ProductId;
  type: ProductType.course;
}

export type Product = LessonProduct | CourseProduct;

export interface Bundle {
  id: BundleId;
  products: Array<{ id: ProductId; quantity: number }>;
}
