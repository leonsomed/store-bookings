import { getServices } from 'database';
import { ModalWrapper } from '../../../../../../../../components/ModalWrapper';
import {
  PageParamsProps,
  getParam,
  routes,
} from '../../../../../../../../services/navigation';
import { Subheading } from '../../../../../../../../components/Heading';
import { LabelPair } from '../../../../../../../../components/LabelPair';
import {
  formatCentsToDollars,
  formatDate,
} from '../../../../../../../../services/format';
import { SimpleTable } from '../../../../../../../../components/SimpleTable';
import { ActivityLog } from 'database';
import {
  activityLogLabels,
  getActivitySummary,
} from '../../../../../../../../services/activityLog';
import { SecondaryButton } from '../../../../../../../../components/Button';
import { Link } from '../../../../../../../../components/Link';

const ACTIVITY_LOG_COLUMNS = [
  {
    label: 'Date',
    getKey: (row: ActivityLog) => row.timestamp.toString(),
    getContent: (row: ActivityLog) => formatDate(row.timestamp),
  },
  {
    label: 'Event',
    getKey: (row: ActivityLog) => row.type,
    getContent: (row: ActivityLog) => activityLogLabels[row.type] ?? row.type,
  },
  {
    label: 'Description',
    getKey: (row: ActivityLog) => row.note,
    getContent: (row: ActivityLog) => getActivitySummary(row),
  },
];
const IDENTITY_FIELD = (row) => row.id;

export default async function ViewPage({ params }: PageParamsProps) {
  const { itemActivityService, productService } = getServices();
  const accountId = getParam('accountId', params);
  const orderId = getParam('orderId', params);
  const itemId = getParam('itemId', params);
  const [item, logs] = await Promise.all([
    itemActivityService.getOrderItem(accountId, orderId, itemId),
    itemActivityService.getOrderItemActivityLogs(accountId, orderId, itemId),
  ]);

  return (
    <ModalWrapper size="lg" closeHref={routes.accountDetails(accountId)}>
      <br />
      <Subheading>Summary</Subheading>
      <br />
      <div className="w-[400px]">
        <LabelPair label="Product" value={item.description} />
        <LabelPair label="Order ID" value={item.orderId} />
        <LabelPair
          label="Purchase Date"
          value={formatDate(item.purchaseDate)}
        />
        {item.productType === 'lesson' && (
          <LabelPair
            label="Lesson Date"
            value={item.lessonDate ? formatDate(item.lessonDate) : 'n/a'}
          />
        )}
        <LabelPair
          label="Price"
          value={formatCentsToDollars(item.priceCents)}
        />
        <LabelPair label="Is Void?" value={item.isVoid ? 'Yes' : 'No'} />
      </div>
      <br />
      <Subheading>Activity Log</Subheading>
      <br />
      <SimpleTable
        columns={ACTIVITY_LOG_COLUMNS}
        data={logs}
        getRowId={IDENTITY_FIELD}
      />
    </ModalWrapper>
  );
}
