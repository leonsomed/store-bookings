import type { LessonRole, ProductType } from '@prisma/client';

export enum ProductId {
  dmvLesson = 'dmvLesson',
  driver1 = 'driver1',
  driver2 = 'driver2',
  observer1 = 'observer1',
  observer2 = 'observer2',
  course = 'course',
}

export enum BundleId {
  standard6 = 'standard6',
  standard10 = 'standard10',
  de6 = 'de6',
  de10 = 'de10',
  standard7x7 = 'standard7x7',
}

export interface LessonProduct {
  id: ProductId;
  description: string;
  type: typeof ProductType.lesson;
  role: LessonRole;
  durationMinutes: number;
}

export interface CourseProduct {
  id: ProductId;
  description: string;
  type: typeof ProductType.course;
}

export type Product = LessonProduct | CourseProduct;

export interface Bundle {
  id: BundleId;
  description: string;
  products: Array<{ id: ProductId; quantity: number }>;
}
