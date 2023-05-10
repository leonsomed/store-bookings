import { ModalWrapper } from '../../../../../../../../components/ModalWrapper';
import {
  PageParamsProps,
  getParam,
} from '../../../../../../../../services/navigation';
import { ReverseVoidItemForm } from './ReverseVoidItemForm';

export default async function SetPricePage({ params }: PageParamsProps) {
  const accountId = getParam('accountId', params);
  const orderId = getParam('orderId', params);
  const itemId = getParam('itemId', params);

  return (
    <ModalWrapper size="sm">
      <ReverseVoidItemForm
        accountId={accountId}
        orderId={orderId}
        itemId={itemId}
      />
    </ModalWrapper>
  );
}
