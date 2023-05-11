import {
  Initiator,
  LessonRole,
  ProductType,
  State,
  TransactionCategory,
  VoidReason,
} from '@prisma/client';
import { Product } from '../product/types';

export interface OrderLine {
  id: string;
  accountId: string;
  purchaseDate: Date;
  description: string;
  centsItemsTotal: number;
  centsTransactionsTotal: number;
}

export interface ItemLine {
  id: string;
  accountId: string;
  orderId: string;
  productId: string;
  productType: ProductType;
  purchaseDate: Date;
  lessonDate?: Date;
  description: string;
  priceCents: number;
  isVoid: boolean;
}

export interface ItemActivityState {
  products: { [productId: string]: Product };
  orderLines: OrderLine[];
  itemLines: ItemLine[];
}

export interface BaseActivityLog {
  id: string;
  accountId: string;
  orderId: string;
  userId: string;
  authorId: string;
  timestamp: Date;
  note: string;
}

export interface TransactionLog extends BaseActivityLog {
  type: 'TransactionLog';
  category: TransactionCategory;
  cents: number;
  stripeChargeId?: string | null;
  stripeCustomerId?: string | null;
}

export interface UpdateByItemPriceLog extends BaseActivityLog {
  type: 'UpdateByItemPriceLog';
  itemId: string;
  centsDiff: number;
}

export interface ScheduleLessonItemLog extends BaseActivityLog {
  type: 'ScheduleLessonItemLog';
  itemId: string;
  instructorId: string;
  studentId: string;
  slotId: string;
  // TODO when scheduling you must validate the regionId of the product matches the region for the address
  // otherwise the product can have a price mismatch
}

export interface CancelScheduleLessonItemLog extends BaseActivityLog {
  type: 'CancelScheduleLessonItemLog';
  itemId: string;
  initiator: Initiator;
}

export interface ReleaseItemFundsLog extends BaseActivityLog {
  type: 'ReleaseItemFundsLog';
  itemId: string;
}

export interface CancelReleaseItemFundsLog extends BaseActivityLog {
  type: 'CancelReleaseItemFundsLog';
  itemId: string;
}

export interface VoidItemLog extends BaseActivityLog {
  type: 'VoidItemLog';
  itemId: string;
  reason: VoidReason;
}
export interface CancelVoidItemLog extends BaseActivityLog {
  type: 'CancelVoidItemLog';
  itemId: string;
}
export interface SetItemRegionLog extends BaseActivityLog {
  type: 'SetItemRegionLog';
  itemId: string;
  regionId: string;
}
export interface NewLessonItemLog extends BaseActivityLog {
  type: 'NewLessonItemLog';
  regionId: string;
  productId: string;
  itemId: string;
  productType: 'lesson';
  role: LessonRole;
  durationMinutes: number;
  priceCents: number;
}
export interface NewCourseItemLog extends BaseActivityLog {
  type: 'NewCourseItemLog';
  regionId: string;
  productId: string;
  itemId: string;
  productType: 'course';
  state: State;
  priceCents: number;
}

export type ActivityLog =
  | TransactionLog
  | UpdateByItemPriceLog
  | ScheduleLessonItemLog
  | CancelScheduleLessonItemLog
  | ReleaseItemFundsLog
  | CancelReleaseItemFundsLog
  | VoidItemLog
  | CancelVoidItemLog
  | NewLessonItemLog
  | NewCourseItemLog
  | SetItemRegionLog;

export interface NewOrderItemsPayload {
  userId: string;
  orderId?: string;
  authorId: string;
  accountId: string;
  regionId: string;
  description: string;
  items: Array<{
    id: string;
    priceCents: number;
    state?: string;
  }>;
}

export interface NewOrderTransactionPayload {
  cents: number;
  note: string;
  category: TransactionCategory;
  stripeChargeId?: string | null;
  stripeCustomerId?: string | null;
  accountId: string;
  orderId: string;
  userId: string;
  authorId: string;
}

export interface SetOrderItemPricePayload {
  currentPriceCents: number;
  newPriceCents: number;
  accountId: string;
  orderId: string;
  itemId: string;
  userId: string;
  note: string;
  authorId: string;
}

export interface VoidOrderItemPayload {
  reason: VoidReason;
  accountId: string;
  orderId: string;
  itemId: string;
  userId: string;
  note: string;
  authorId: string;
}

export type ReverseVoidOrderItemPayload = Omit<VoidOrderItemPayload, 'reason'>;

export interface ScheduleLessonPayload {
  instructorId: string;
  studentId: string;
  timestamp: number;
  address: string;
  accountId: string;
  orderId: string;
  itemId: string;
  userId: string;
  note: string;
  authorId: string;
}

export interface OrderTransactionState {
  itemsTotal: number;
  transactionsTotal: number;
  transactions: TransactionLog[];
}
