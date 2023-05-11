import { uuid } from 'uuidv4';
import { Product, Services } from '..';
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
  NewOrderItemsPayload,
  NewOrderTransactionPayload,
  OrderTransactionState,
  ReverseVoidOrderItemPayload,
  ScheduleLessonPayload,
  SetOrderItemPricePayload,
  VoidOrderItemPayload,
} from './types';
import { createSlotId, parseSlotId } from '../..';

const getInitialItemActivityState = (
  products: Product[]
): ItemActivityState => ({
  products: products.reduce(
    (acc, product) => ({ ...acc, [product.id]: product }),
    {}
  ),
  orderLines: [],
  itemLines: [],
});

const INITIAL_ORDER_TRANSACTION_STATE: OrderTransactionState = {
  itemsTotal: 0,
  transactionsTotal: 0,
  transactions: [],
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
      case ActivityLogType.updateByItemPriceLog:
        return {
          ...baseLog,
          type: 'UpdateByItemPriceLog',
          itemId: log.itemId!,
          centsDiff: log.centsDiff!,
        };
      case ActivityLogType.scheduleLessonItemLog:
        return {
          ...baseLog,
          type: 'ScheduleLessonItemLog',
          itemId: log.itemId!,
          instructorId: log.instructorId!,
          studentId: log.studentId!,
          slotId: log.slotId!,
        };
      case ActivityLogType.cancelScheduleLessonItemLog:
        return {
          ...baseLog,
          type: 'CancelScheduleLessonItemLog',
          itemId: log.itemId!,
          initiator: log.initiator!,
        };
      case ActivityLogType.releaseItemFundsLog:
        return {
          ...baseLog,
          type: 'ReleaseItemFundsLog',
          itemId: log.itemId!,
        };
      case ActivityLogType.cancelReleaseItemFundsLog:
        return {
          ...baseLog,
          type: 'CancelReleaseItemFundsLog',
          itemId: log.itemId!,
        };
      case ActivityLogType.voidItemLog:
        return {
          ...baseLog,
          type: 'VoidItemLog',
          itemId: log.itemId!,
          reason: log.reason!,
        };
      case ActivityLogType.cancelVoidItemLog:
        return {
          ...baseLog,
          type: 'CancelVoidItemLog',
          itemId: log.itemId!,
        };
      case ActivityLogType.newLessonItemLog:
        return {
          ...baseLog,
          type: 'NewLessonItemLog',
          regionId: log.regionId!,
          productId: log.productId!,
          itemId: log.itemId!,
          productType: 'lesson',
          role: log.role!,
          durationMinutes: log.durationMinutes!,
          priceCents: log.cents!,
        };
      case ActivityLogType.newCourseItemLog:
        return {
          ...baseLog,
          type: 'NewCourseItemLog',
          regionId: log.regionId!,
          productId: log.productId!,
          itemId: log.itemId!,
          productType: 'course',
          state: log.state!,
          priceCents: log.cents!,
        };
      case ActivityLogType.setItemRegionLog:
        return {
          ...baseLog,
          type: 'SetItemRegionLog',
          itemId: log.itemId!,
          regionId: log.regionId!,
        };
      default:
        throw new Error(`Unknown activity log type: ${log.type}`);
    }
  }

  static orderTransactionReducer(
    state: OrderTransactionState,
    log: ActivityLog
  ): OrderTransactionState {
    switch (log.type) {
      case 'NewLessonItemLog':
      case 'NewCourseItemLog':
        return { ...state, itemsTotal: state.itemsTotal + log.priceCents };
      case 'UpdateByItemPriceLog':
        return { ...state, itemsTotal: state.itemsTotal + log.centsDiff };
      case 'TransactionLog':
        return {
          ...state,
          transactionsTotal: state.transactionsTotal + log.cents,
          transactions: [...state.transactions, log],
        };
      default:
        return state;
    }
  }

  static itemActivityReducer(
    state: ItemActivityState,
    log: ActivityLog
  ): ItemActivityState {
    switch (log.type) {
      case 'NewLessonItemLog':
      case 'NewCourseItemLog':
        const order = state.orderLines.find(
          (order) => order.id === log.orderId
        );
        const itemLines = state.itemLines.concat({
          id: log.id,
          productId: log.productId,
          accountId: log.accountId,
          orderId: log.orderId,
          productType: log.productType,
          description: state.products[log.productId].description,
          priceCents: log.priceCents,
          purchaseDate: log.timestamp,
          isVoid: false,
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
        return {
          ...state,
          orderLines: state.orderLines.map((order) => {
            if (order.id !== log.orderId) {
              return order;
            }

            return {
              ...order,
              centsTransactionsTotal: order.centsTransactionsTotal + log.cents,
            };
          }),
        };
      case 'UpdateByItemPriceLog':
        return {
          ...state,
          itemLines: state.itemLines.map((item) => {
            if (item.id !== log.itemId) {
              return item;
            }

            return {
              ...item,
              priceCents: item.priceCents + log.centsDiff,
            };
          }),
          orderLines: state.orderLines.map((order) => {
            if (order.id !== log.orderId) {
              return order;
            }

            return {
              ...order,
              centsItemsTotal: order.centsItemsTotal + log.centsDiff,
            };
          }),
        };
      case 'CancelVoidItemLog':
      case 'VoidItemLog':
        return {
          ...state,
          itemLines: state.itemLines.map((item) => {
            if (item.id !== log.itemId) {
              return item;
            }

            return {
              ...item,
              isVoid: log.type === 'VoidItemLog',
            };
          }),
        };
      case 'ScheduleLessonItemLog':
        return {
          ...state,
          itemLines: state.itemLines.map((item) => {
            if (item.id !== log.itemId) {
              return item;
            }

            const { timestamp } = parseSlotId(log.slotId);

            return {
              ...item,
              lessonDate: new Date(timestamp),
            };
          }),
        };
      case 'CancelScheduleLessonItemLog':
        return {
          ...state,
          itemLines: state.itemLines.map((item) => {
            if (item.id !== log.itemId) {
              return item;
            }

            return {
              ...item,
              lessonDate: undefined,
            };
          }),
        };
      case 'SetItemRegionLog':
      case 'ReleaseItemFundsLog':
      case 'CancelReleaseItemFundsLog':
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
    const products = await this.services.productService.getProducts();

    return logs.reduce(
      ItemActivityService.itemActivityReducer,
      getInitialItemActivityState(products)
    );
  }

  async getOrderItemActivityLogs(
    accountId: string,
    orderId: string,
    itemId: string
  ) {
    const logs = (
      await prisma.activityLog.findMany({
        where: { accountId, orderId, itemId },
      })
    ).map(ItemActivityService.formatActivityLog);

    return logs;
  }

  async newOrderItems(payload: NewOrderItemsPayload) {
    const tasks = payload.items.map(async (item) => {
      const product = await this.services.productService.getProduct(item.id);

      if (!product) {
        throw new Error('Invalid product id');
      }

      const base = {
        id: uuid(),
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
            type: 'newLessonItemLog',
            regionId: payload.regionId,
            itemId: base.id,
            productId: product.id,
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
            type: 'newCourseItemLog',
            regionId: payload.regionId,
            itemId: base.id,
            productId: product.id,
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

  async newOrderTransaction(payload: NewOrderTransactionPayload) {
    const base = {
      accountId: payload.accountId,
      orderId: payload.orderId,
      userId: payload.userId,
      authorId: payload.authorId,
      note: payload.note,
      timestamp: new Date(),
    };

    return prisma.activityLog.create({
      data: {
        ...base,
        type: 'transactionLog',
        transactionCategory: payload.category,
        cents: payload.cents,
        optionalStripeChargeId: payload.stripeChargeId,
        optionalStripeCustomerId: payload.stripeCustomerId,
      },
    });
  }

  async getOrderTransactionState(accountId: string, orderId: string) {
    const logs = (
      await prisma.activityLog.findMany({ where: { accountId, orderId } })
    ).map(ItemActivityService.formatActivityLog);

    return logs.reduce(
      ItemActivityService.orderTransactionReducer,
      INITIAL_ORDER_TRANSACTION_STATE
    );
  }

  async getOrderItem(accountId: string, orderId: string, itemId: string) {
    const state = await this.getOrderAndItemLines(accountId);

    return state.itemLines.find(
      (item) => item.id === itemId && item.orderId === orderId
    );
  }

  async setOrderItemPrice(payload: SetOrderItemPricePayload) {
    const base = {
      accountId: payload.accountId,
      orderId: payload.orderId,
      userId: payload.userId,
      authorId: payload.authorId,
      note: payload.note,
      timestamp: new Date(),
    };

    return prisma.activityLog.create({
      data: {
        ...base,
        type: 'updateByItemPriceLog',
        itemId: payload.itemId,
        centsDiff: payload.newPriceCents - payload.currentPriceCents,
      },
    });
  }

  async voidOrderItem(payload: VoidOrderItemPayload) {
    const base = {
      accountId: payload.accountId,
      orderId: payload.orderId,
      userId: payload.userId,
      authorId: payload.authorId,
      note: payload.note,
      timestamp: new Date(),
    };

    return prisma.activityLog.create({
      data: {
        ...base,
        type: 'voidItemLog',
        itemId: payload.itemId,
        reason: payload.reason,
      },
    });
  }

  async reverseVoidOrderItem(payload: ReverseVoidOrderItemPayload) {
    const base = {
      accountId: payload.accountId,
      orderId: payload.orderId,
      userId: payload.userId,
      authorId: payload.authorId,
      note: payload.note,
      timestamp: new Date(),
    };

    return prisma.activityLog.create({
      data: {
        ...base,
        type: 'cancelVoidItemLog',
        itemId: payload.itemId,
      },
    });
  }

  async scheduleLesson(payload: ScheduleLessonPayload) {
    const base = {
      accountId: payload.accountId,
      orderId: payload.orderId,
      userId: payload.userId,
      authorId: payload.authorId,
      note: payload.note,
      timestamp: new Date(),
    };

    return prisma.activityLog.create({
      data: {
        ...base,
        type: 'scheduleLessonItemLog',
        itemId: payload.itemId,
        instructorId: payload.instructorId,
        studentId: payload.studentId,
        slotId: createSlotId(
          payload.instructorId,
          payload.timestamp,
          payload.address,
          payload.studentId
        ),
      },
    });
  }
}
