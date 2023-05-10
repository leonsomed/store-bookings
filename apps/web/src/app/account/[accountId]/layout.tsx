import cx from 'classnames';
import { ItemLine, OrderLine, getServices } from 'database';
import { Heading } from '../../../components/Heading';
import { IconLink, Link } from '../../../components/Link';
import { SimplePageLayout } from '../../../components/SimplePageLayout';
import { SimpleTable } from '../../../components/SimpleTable';
import { getParam, routes } from '../../../services/navigation';
import { formatCentsToDollars, formatDate } from '../../../services/format';
import { SecondaryButton } from '../../../components/Button';

export const REVALIDATE_SECONDS = 1;

const ORDER_COLUMNS = [
  {
    label: 'Order ID',
    getKey: (row: OrderLine) => row.id,
    getContent: (row: OrderLine) => row.id,
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
        <Link href={routes.accountOrderNewProducts(row.accountId, row.id)}>
          Add product
        </Link>
        <Link href={routes.accountOrderTransactions(row.accountId, row.id)}>
          Transactions
        </Link>
      </div>
    ),
  },
];
const ITEM_COLUMNS = [
  {
    label: 'Order ID',
    getKey: (row: ItemLine) => row.orderId,
    getContent: (row: ItemLine) => row.orderId,
  },
  {
    label: 'Purchase Date',
    getKey: (row: ItemLine) => row.purchaseDate.toString(),
    getContent: (row: ItemLine) => formatDate(row.purchaseDate),
  },
  {
    label: 'Description',
    getKey: (row: ItemLine) => row.description,
    getContent: (row: ItemLine) => row.description,
  },
  {
    label: 'Lesson Date',
    getKey: (row: ItemLine) => row.lessonDate?.toString(),
    getContent: (row: ItemLine) => formatDate(row.lessonDate),
  },
  {
    label: 'Price',
    getKey: (row: ItemLine) => row.priceCents.toString(),
    getContent: (row: ItemLine) => formatCentsToDollars(row.priceCents),
  },
  {
    label: 'Actions',
    getKey: (row: ItemLine) => 'actions',
    getContent: (row: ItemLine) => <></>,
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
      <div className="flex justify-between">
        <Heading>Orders</Heading>
        <Link href={routes.accountOrderNew(accountId)}>Add Order</Link>
      </div>
      <SimpleTable<OrderLine>
        columns={ORDER_COLUMNS}
        data={orderLines}
        getRowId={IDENTITY_FIELD}
      />

      <div className="my-8"></div>
      <Heading>Items</Heading>
      <SimpleTable
        columns={ITEM_COLUMNS}
        data={itemLines}
        getRowId={IDENTITY_FIELD}
      />
      {children}
    </SimplePageLayout>
  );
}
