import { Services } from '..';
import {
  ActivityLog as DBActivityLog,
  ActivityLogType,
  TransactionCategory,
} from '@prisma/client';
import { prisma } from '../../client';
import { ActivityLog, BaseActivityLog, ItemActivityState } from './types';

const INITIAL_ITEM_ACTIVITY_STATE: ItemActivityState = {
  orderLines: [],
  itemLines: [],
};

export class ItemActivityService {
  private services: Services = null as unknown as Services;

  static formatActivityLog(log: DBActivityLog): ActivityLog {
    const baseLog: BaseActivityLog = {
      id: log.id,
      accountId: log.accountId,
      orderId: log.orderId,
      userId: log.userId,
      authorId: log.authorId,
      timestamp: log.timestamp,
      note: log.note,
    };

    switch (log.type) {
      case ActivityLogType.transactionLog:
        return {
          ...baseLog,
          type: 'TransactionLog',
          category: log.transactionCategory ?? TransactionCategory.cash,
          cents: log.cents!,
          stripeChargeId: log.optionalStripeChargeId,
          stripeCustomerId: log.optionalStripeCustomerId,
        };
      case ActivityLogType.updateByProductPriceLog:
        return {
          ...baseLog,
          type: 'UpdateByProductPriceLog',
          productId: log.productId!,
          centsDiff: log.centsDiff!,
        };
      case ActivityLogType.scheduleLessonProductLog:
        return {
          ...baseLog,
          type: 'ScheduleLessonProductLog',
          productId: log.productId!,
          instructorId: log.instructorId!,
          studentId: log.studentId!,
          slotId: log.slotId!,
        };
      case ActivityLogType.cancelScheduleLessonProductLog:
        return {
          ...baseLog,
          type: 'CancelScheduleLessonProductLog',
          productId: log.productId!,
          initiator: log.initiator!,
        };
      case ActivityLogType.releaseProductFundsLog:
        return {
          ...baseLog,
          type: 'ReleaseProductFundsLog',
          productId: log.productId!,
        };
      case ActivityLogType.cancelReleaseProductFundsLog:
        return {
          ...baseLog,
          type: 'CancelReleaseProductFundsLog',
          productId: log.productId!,
        };
      case ActivityLogType.voidProductLog:
        return {
          ...baseLog,
          type: 'VoidProductLog',
          productId: log.productId!,
          reason: log.reason!,
        };
      case ActivityLogType.cancelVoidProductLog:
        return {
          ...baseLog,
          type: 'CancelVoidProductLog',
          productId: log.productId!,
        };
      case ActivityLogType.newLessonProductLog:
        return {
          ...baseLog,
          type: 'NewLessonProductLog',
          regionId: log.regionId!,
          productId: log.productId!,
          productType: 'lesson',
          role: log.role!,
          durationMinutes: log.durationMinutes!,
          priceCents: log.cents!,
        };
      case ActivityLogType.newCourseProductLog:
        return {
          ...baseLog,
          type: 'NewCourseProductLog',
          regionId: log.regionId!,
          productId: log.productId!,
          productType: 'course',
          state: log.state!,
          priceCents: log.cents!,
        };
      case ActivityLogType.setProductRegionLog:
        return {
          ...baseLog,
          type: 'SetProductRegionLog',
          productId: log.productId!,
          regionId: log.regionId!,
        };
      default:
        throw new Error(`Unknown activity log type: ${log.type}`);
    }
  }

  static itemActivityReducer(state: ItemActivityState, log: ActivityLog) {
    return state;
  }

  init(services: Services) {
    this.services = services;
  }

  async getOrderAndItemLines(accountId: string): Promise<ItemActivityState> {
    const logs = (
      await prisma.activityLog.findMany({ where: { accountId } })
    ).map(ItemActivityService.formatActivityLog);

    return logs.reduce(
      ItemActivityService.itemActivityReducer,
      INITIAL_ITEM_ACTIVITY_STATE
    );
  }
}
