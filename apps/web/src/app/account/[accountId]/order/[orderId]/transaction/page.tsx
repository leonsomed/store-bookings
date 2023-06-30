import cx from 'classnames';
import { TransactionLog, getServices } from 'database';
import { ModalWrapper } from '../../../../../../components/ModalWrapper';
import {
  PageParamsProps,
  getParam,
  routes,
} from '../../../../../../services/navigation';
import { NewOrderItemsForm } from '../../../../../../items/NewOrderItemsForm';
import { LabelPair } from '../../../../../../components/LabelPair';
import { Heading, Subheading } from '../../../../../../components/Heading';
import {
  formatCentsToDollars,
  formatDate,
} from '../../../../../../services/format';
import { SimpleTable } from '../../../../../../components/SimpleTable';
import { PrimaryButton } from '../../../../../../components/Button';
import { NewTransactionForm } from './NewTransactionForm';
import { WarningIcon } from '../../../../../../components/icons/WarningIcon';

const TRANSACTION_COLUMNS = [
  {
    label: 'Date',
    getKey: (row: TransactionLog) => row.timestamp.toString(),
    getContent: (row: TransactionLog) => formatDate(row.timestamp),
  },
  {
    label: 'Category',
    getKey: (row: TransactionLog) => row.category.toString(),
    getContent: (row: TransactionLog) => row.category,
  },
  {
    label: 'Amount',
    getKey: (row: TransactionLog) => row.cents.toString(),
    getContent: (row: TransactionLog) => (
      <span className={row.cents > 0 ? 'text-green-500' : 'text-red-500'}>
        {formatCentsToDollars(row.cents)}
      </span>
    ),
  },
  {
    label: 'Note',
    getKey: (row: TransactionLog) => row.note,
    getContent: (row: TransactionLog) => (console.log(row.note), row.note),
  },
  {
    label: 'Stripe Charge ID',
    getKey: (row: TransactionLog) => row.stripeChargeId,
    getContent: (row: TransactionLog) => row.stripeChargeId,
  },
  {
    label: 'Stripe Customer ID',
    getKey: (row: TransactionLog) => row.stripeCustomerId,
    getContent: (row: TransactionLog) => row.stripeCustomerId,
  },
];
const IDENTITY_FIELD = (row: TransactionLog) => row.id;

export default async function TransactionsPage({ params }: PageParamsProps) {
  const accountId = getParam('accountId', params);
  const orderId = getParam('orderId', params);
  const { itemActivityService } = getServices();
  const state = await itemActivityService.getOrderTransactionState(
    accountId,
    orderId
  );
  const diff = state.transactionsTotal - state.itemsTotal;

  return (
    <ModalWrapper size="lg" closeHref={routes.account.details(accountId)}>
      <Subheading>Order #{orderId}</Subheading>
      <br />
      <div className="w-[200px]">
        <LabelPair
          label="Items Total"
          value={formatCentsToDollars(state.itemsTotal)}
        />
        <LabelPair
          label="Transactions Total"
          value={formatCentsToDollars(state.transactionsTotal)}
        />
        <LabelPair
          label="Difference Total"
          value={
            <div
              className={cx('relative', {
                'text-red-500': diff < 0,
                'text-green-500': diff > 0,
              })}
            >
              {formatCentsToDollars(diff)}
              {diff !== 0 && (
                <div className="absolute text-sm w-6 right-[-30px] top-0 text-yellow-500">
                  <WarningIcon />
                </div>
              )}
            </div>
          }
        />
      </div>
      <br />
      <Subheading>Transactions</Subheading>
      <SimpleTable
        columns={TRANSACTION_COLUMNS}
        data={state.transactions}
        getRowId={IDENTITY_FIELD}
      />
      <br />
      <NewTransactionForm accountId={accountId} orderId={orderId} />
    </ModalWrapper>
  );
}
