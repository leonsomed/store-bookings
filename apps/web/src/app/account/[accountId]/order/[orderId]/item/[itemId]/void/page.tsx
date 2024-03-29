import { ModalWrapper } from '../../../../../../../../components/ModalWrapper';
import {
  PageParamsProps,
  getParam,
} from '../../../../../../../../services/navigation';
import { VoidItemForm } from './VoidItemForm';

export default async function VoidPage({ params }: PageParamsProps) {
  const accountId = getParam('accountId', params);
  const orderId = getParam('orderId', params);
  const itemId = getParam('itemId', params);

  return (
    <ModalWrapper size="sm">
      <VoidItemForm accountId={accountId} orderId={orderId} itemId={itemId} />
    </ModalWrapper>
  );
}
