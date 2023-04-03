import {
  Initiator,
  LessonRole,
  State,
  TransactionCategory,
  VoidReason,
} from '@prisma/client';

interface BaseActivityLog {
  id: string;
  accountId: string;
  orderId: string;
  userId: string;
  authorId: string;
  timestamp: number;
  note: string;
}

export interface TransactionLog extends BaseActivityLog {
  type: 'TransactionLog';
  category: TransactionCategory;
  amount: number;
  stripeChargeId?: string;
  stripeCustomerId?: string;
}

export interface UpdateByProductPriceLog extends BaseActivityLog {
  type: 'UpdateByProductPriceLog';
  productId: string;
  priceDiff: number;
}

export interface ScheduleLessonProductLog extends BaseActivityLog {
  type: 'ScheduleLessonProductLog';
  productId: string;
  instructorId: string;
  studentId: string;
  slotId: string;
  // TODO when scheduling you must validate the regionId of the product matches the region for the address
  // otherwise the product can have a price mismatch
}

export interface CancelScheduleLessonProductLog extends BaseActivityLog {
  type: 'CancelScheduleLessonProductLog';
  productId: string;
  initiator: Initiator;
}

export interface ReleaseProductFundsLog extends BaseActivityLog {
  type: 'ReleaseProductFundsLog';
  productId: string;
}

export interface CancelReleaseProductFundsLog extends BaseActivityLog {
  type: 'CancelReleaseProductFundsLog';
  productId: string;
}

export interface VoidProductLog extends BaseActivityLog {
  type: 'VoidProductLog';
  productId: string;
  reason: VoidReason;
}
export interface CancelVoidProductLog extends BaseActivityLog {
  type: 'CancelVoidProductLog';
  productId: string;
}
export interface SetProductRegionLog extends BaseActivityLog {
  type: 'SetProductRegionLog';
  productId: string;
  regionId: string;
}
export interface NewLessonProductLog extends BaseActivityLog {
  type: 'NewLessonProductLog';
  regionId: string;
  productId: string;
  productType: 'lesson';
  role: LessonRole;
  duration: number;
  price: number;
}
export interface NewCourseProductLog extends BaseActivityLog {
  type: 'NewCourseProductLog';
  regionId: string;
  productId: string;
  productType: 'course';
  state: State;
  price: number;
}

export type ActivityLog =
  | TransactionLog
  | UpdateByProductPriceLog
  | ScheduleLessonProductLog
  | CancelScheduleLessonProductLog
  | ReleaseProductFundsLog
  | CancelReleaseProductFundsLog
  | VoidProductLog
  | CancelVoidProductLog
  | NewLessonProductLog
  | NewCourseProductLog
  | SetProductRegionLog;
