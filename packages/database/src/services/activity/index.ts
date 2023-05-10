import { uuid } from 'uuidv4';
import { Services } from '..';
import {
  ActivityLog as DBActivityLog,
  ActivityLogType,
  TransactionCategory,
  ProductId,
  State,
} from '@prisma/client';
import { prisma } from '../../client';
import {
  ActivityLog,
  BaseActivityLog,
  ItemActivityState,
  NewOrderProductsPayload,
} from './types';

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
    switch (log.type) {
      case 'NewLessonProductLog':
      case 'NewCourseProductLog':
        const order = state.orderLines.find(
          (order) => order.id === log.orderId
        );
        const itemLines = state.itemLines.concat({
          id: log.id,
          accountId: log.accountId,
          orderId: log.orderId,
          productType: log.productType,
          description: log.note,
          priceCents: log.priceCents,
          purchaseDate: log.timestamp,
        });

        if (order) {
          return {
            ...state,
            itemLines,
            orderLines: state.orderLines.map((order) => {
              if (order.id !== log.orderId) {
                return order;
              }

              return {
                ...order,
                centsItemsTotal: order.centsItemsTotal + log.priceCents,
              };
            }),
          };
        }

        return {
          ...state,
          itemLines,
          orderLines: [
            ...state.orderLines,
            {
              id: log.orderId,
              accountId: log.accountId,
              purchaseDate: log.timestamp,
              description: log.note,
              centsItemsTotal: log.priceCents,
              centsTransactionsTotal: 0,
            },
          ],
        };
      case 'TransactionLog':
      case 'UpdateByProductPriceLog':
      case 'SetProductRegionLog':
      case 'ReleaseProductFundsLog':
      case 'CancelReleaseProductFundsLog':
      case 'ScheduleLessonProductLog':
      case 'CancelScheduleLessonProductLog':
      case 'VoidProductLog':
      case 'CancelVoidProductLog':
        return state;
      default:
        // @ts-ignore
        throw new Error(`Unknown activity log type: ${log.type}`);
    }
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

  async newOrderProducts(payload: NewOrderProductsPayload) {
    const tasks = payload.items.map(async (item) => {
      const product = await this.services.productService.getProduct(item.id);

      if (!product) {
        throw new Error('Invalid product id');
      }

      const base = {
        accountId: payload.accountId,
        orderId: payload.orderId ?? uuid(),
        userId: payload.userId,
        authorId: payload.authorId,
        timestamp: new Date(),
        note: payload.description,
      };

      if (product.type === 'lesson') {
        return prisma.activityLog.create({
          data: {
            ...base,
            type: 'newLessonProductLog',
            regionId: payload.regionId,
            productId: item.id as ProductId,
            productType: product.type,
            role: product.role,
            durationMinutes: product.durationMinutes,
            cents: item.priceCents,
          },
        });
      } else if (product.type === 'course') {
        return prisma.activityLog.create({
          data: {
            ...base,
            type: 'newCourseProductLog',
            regionId: payload.regionId,
            productId: item.id as ProductId,
            productType: product.type,
            state: item.state as State,
            cents: item.priceCents,
          },
        });
      } else {
        // @ts-ignore
        throw new Error(`product type not supported ${product.type}`);
      }
    });

    await Promise.all(tasks);
  }
}
