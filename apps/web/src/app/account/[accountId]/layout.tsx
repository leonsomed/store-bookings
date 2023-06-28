import cx from 'classnames';
import { ItemLine, OrderLine, getServices } from 'database';
import dynamic from 'next/dynamic';
import { Heading } from '../../../components/Heading';
import { LinkButton } from '../../../components/Link';
import { SimplePageLayout } from '../../../components/SimplePageLayout';
import { SimpleTable } from '../../../components/SimpleTable';
import { getParam, routes } from '../../../services/navigation';
import { formatCentsToDollars, formatDate } from '../../../services/format';
import { ColoredText } from '../../../components/ColoredText';
import { SimpleCard } from '../../../components/SimpleCard';
import { ScheduleLessonIcon } from '../../../components/icons/ScheduleLessonIcon';
import { AddProductIcon } from '../../../components/icons/AddProductIcon';
import { TransactionsIcon } from '../../../components/icons/TransactionsIcon';
import { ViewIcon } from '../../../components/icons/ViewIcon';
import { ReverseVoidIcon } from '../../../components/icons/ReverseVoidIcon';
import { VoidIcon } from '../../../components/icons/VoidIcon';
import { SetPriceIcon } from '../../../components/icons/SetPriceIcon';
import { CancelLessonIcon } from '../../../components/icons/CancelLessonIcon';
import type { IDProps } from '../../../components/ID';

const IDLazy = dynamic<IDProps>(() => import('../../../components/ID'), {
  ssr: false,
});

export const REVALIDATE_SECONDS = 1;

const ORDER_COLUMNS = [
  {
    label: 'Order ID',
    getKey: (row: OrderLine) => row.id,
    getContent: (row: OrderLine) => <IDLazy id={row.id} />,
  },
  {
    label: 'Purchase Date',
    getKey: (row: OrderLine) => row.purchaseDate.toString(),
    getContent: (row: OrderLine) => formatDate(row.purchaseDate),
  },
  {
    label: 'Description',
    getKey: (row: OrderLine) => row.description,
    getContent: (row: OrderLine) => row.description,
  },
  {
    label: 'Items Total',
    getKey: (row: OrderLine) => row.centsItemsTotal.toString(),
    getContent: (row: OrderLine) => formatCentsToDollars(row.centsItemsTotal),
  },
  {
    label: 'Transactions Total',
    getKey: (row: OrderLine) => row.centsTransactionsTotal.toString(),
    getContent: (row: OrderLine) =>
      formatCentsToDollars(row.centsTransactionsTotal),
  },
  {
    label: 'Difference Total',
    getKey: (row: OrderLine) =>
      (row.centsTransactionsTotal - row.centsItemsTotal).toString(),
    getContent: (row: OrderLine) => (
      <span
        className={cx({
          'text-red-500': row.centsTransactionsTotal - row.centsItemsTotal < 0,
          'text-green-500':
            row.centsTransactionsTotal - row.centsItemsTotal > 0,
        })}
      >
        {formatCentsToDollars(row.centsTransactionsTotal - row.centsItemsTotal)}
      </span>
    ),
  },
  {
    label: 'Actions',
    getKey: (row: OrderLine) => 'actions',
    getContent: (row: OrderLine) => (
      <div className="flex space-x-2">
        <LinkButton
          borderless
          tooltipTitle="Add product to order"
          href={routes.accountOrderNewItems(row.accountId, row.id)}
        >
          <AddProductIcon />
        </LinkButton>
        <LinkButton
          borderless
          tooltipTitle="View transactions"
          href={routes.accountOrderTransactions(row.accountId, row.id)}
        >
          <TransactionsIcon />
        </LinkButton>
      </div>
    ),
  },
];
const ITEM_COLUMNS = [
  {
    label: 'Order ID',
    getKey: (row: ItemLine) => row.orderId,
    getContent: (row: ItemLine) => (
      <ColoredText color={row.isVoid ? 'text-gray-400' : 'text-black'}>
        <IDLazy id={row.orderId} />
      </ColoredText>
    ),
  },
  {
    label: 'Purchase Date',
    getKey: (row: ItemLine) => row.purchaseDate.toString(),
    getContent: (row: ItemLine) => (
      <ColoredText color={row.isVoid ? 'text-gray-400' : 'text-black'}>
        {formatDate(row.purchaseDate)}
      </ColoredText>
    ),
  },
  {
    label: 'Description',
    getKey: (row: ItemLine) => row.description,
    getContent: (row: ItemLine) => (
      <ColoredText color={row.isVoid ? 'text-gray-400' : 'text-black'}>
        {row.description}
      </ColoredText>
    ),
  },
  {
    label: 'Lesson Date',
    getKey: (row: ItemLine) => row.lessonDate?.toString(),
    getContent: (row: ItemLine) => (
      <ColoredText color={row.isVoid ? 'text-gray-400' : 'text-black'}>
        {formatDate(row.lessonDate)}
      </ColoredText>
    ),
  },
  {
    label: 'Price',
    getKey: (row: ItemLine) => row.priceCents.toString(),
    getContent: (row: ItemLine) => (
      <ColoredText color={row.isVoid ? 'text-gray-400' : 'text-black'}>
        {formatCentsToDollars(row.priceCents)}
      </ColoredText>
    ),
  },
  {
    label: 'Actions',
    getKey: (row: ItemLine) => 'actions',
    getContent: (row: ItemLine) => (
      <div className="flex space-x-2">
        <LinkButton
          borderless
          tooltipTitle="View details"
          href={routes.accountOrderItemView(row.accountId, row.orderId, row.id)}
        >
          <ViewIcon />
        </LinkButton>
        {row.isVoid ? (
          <>
            <LinkButton
              borderless
              tooltipTitle="Reverse void item"
              href={routes.accountOrderItemReverseVoid(
                row.accountId,
                row.orderId,
                row.id
              )}
            >
              <ReverseVoidIcon />
            </LinkButton>
          </>
        ) : (
          <>
            <LinkButton
              borderless
              tooltipTitle="Void item"
              href={routes.accountOrderItemVoid(
                row.accountId,
                row.orderId,
                row.id
              )}
              variant="error"
            >
              <VoidIcon />
            </LinkButton>
            {row.productType === 'lesson' && (
              <LinkButton
                borderless
                tooltipTitle="Schedule lesson"
                href={routes.accountOrderScheduleLesson(
                  row.accountId,
                  row.orderId,
                  row.id
                )}
              >
                <ScheduleLessonIcon />
              </LinkButton>
            )}
            {row.productType === 'lesson' && row.lessonDate && (
              <LinkButton
                borderless
                tooltipTitle="Cancel lesson"
                href={routes.accountOrderCancelLesson(
                  row.accountId,
                  row.orderId,
                  row.id
                )}
                variant="error"
              >
                <CancelLessonIcon />
              </LinkButton>
            )}
          </>
        )}
        <LinkButton
          borderless
          tooltipTitle="Set item price"
          href={routes.accountOrderItemSetPrice(
            row.accountId,
            row.orderId,
            row.id
          )}
        >
          <SetPriceIcon />
        </LinkButton>
      </div>
    ),
  },
];
const IDENTITY_FIELD = (row) => row.id;

export default async function AccountLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  const accountId = getParam('accountId', params);
  const { orderLines, itemLines } =
    await getServices().itemActivityService.getOrderAndItemLines(accountId);

  return (
    <SimplePageLayout>
      <SimpleCard>
        <div className="flex justify-between">
          <Heading>Orders</Heading>
          <LinkButton
            variant="primary"
            href={routes.accountOrderNew(accountId)}
          >
            Add Order
          </LinkButton>
        </div>
        <SimpleTable<OrderLine>
          disableHighlight
          columns={ORDER_COLUMNS}
          data={orderLines}
          getRowId={IDENTITY_FIELD}
        />
      </SimpleCard>

      <SimpleCard marginY>
        <Heading>Items</Heading>
        <SimpleTable
          disableHighlight
          columns={ITEM_COLUMNS}
          data={itemLines}
          getRowId={IDENTITY_FIELD}
        />
      </SimpleCard>
      {children}
    </SimplePageLayout>
  );
}
