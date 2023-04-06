import { getServices } from 'database';
import { Heading } from '../../../components/Heading';
import { Link } from '../../../components/Link';
import { SimplePageLayout } from '../../../components/SimplePageLayout';
import { SimpleTable } from '../../../components/SimpleTable';
import { getParam, routes } from '../../../services/navigation';

const ORDER_COLUMNS = [
  {
    label: 'Order ID',
    getKey: (row) => row.name,
    getContent: (row) => row.name,
  },
  {
    label: 'Purchase Date',
    getKey: (row) => row.id,
    getContent: (row) => row.id,
  },
  { label: 'Bundle', getKey: (row) => row.name, getContent: (row) => row.name },
  {
    label: 'Order Total',
    getKey: (row) => row.name,
    getContent: (row) => row.name,
  },
  {
    label: 'Transactions Total',
    getKey: (row) => row.name,
    getContent: (row) => row.name,
  },
  {
    label: 'Actions',
    getKey: (row) => row.name,
    getContent: (row) => row.name,
  },
];
const ITEM_COLUMNS = [
  { label: 'Order ID', getKey: (row) => row.id, getContent: (row) => row.id },
  {
    label: 'Purchase Date',
    getKey: (row) => row.name,
    getContent: (row) => row.name,
  },
  {
    label: 'Description',
    getKey: (row) => row.name,
    getContent: (row) => row.name,
  },
  {
    label: 'Lesson Date',
    getKey: (row) => row.name,
    getContent: (row) => row.name,
  },
  { label: 'Price', getKey: (row) => row.name, getContent: (row) => row.name },
  {
    label: 'Actions',
    getKey: (row) => row.name,
    getContent: (row) => row.name,
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
        <Link href={routes.accountOrderNew(accountId)}>New Order</Link>
      </div>
      <SimpleTable
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
