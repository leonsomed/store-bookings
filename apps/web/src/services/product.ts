export enum LessonRole {
  driver,
  observer,
}

export enum Product {
  lesson,
  course,
}

export enum State {
  california,
  texas,
}

export interface BaseActivityLog {
  id: string;
  orderId: string;
  timestamp: number;
  reason: string;
}

export interface VoidProductLog extends BaseActivityLog {
  targetId: string;
}
// ==========================================================
export interface NewLessonProductLog extends BaseActivityLog {
  product: Product.lesson;
  role: LessonRole;
  duration: number;
  price: number;
}
// ==========================================================
export interface NewCourseProductLog extends BaseActivityLog {
  product: Product.course;
  state: State;
  price: number;
}
// ==========================================================
export type ActivityLog = NewLessonProductLog | NewCourseProductLog;
