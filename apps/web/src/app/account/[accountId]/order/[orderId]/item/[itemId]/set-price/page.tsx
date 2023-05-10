import { getServices } from 'database';
import { ModalWrapper } from '../../../../../../../../components/ModalWrapper';
import {
  PageParamsProps,
  getParam,
} from '../../../../../../../../services/navigation';
import { SetItemPriceForm } from './SetItemPriceForm';

export default async function SetPricePage({ params }: PageParamsProps) {
  const { itemActivityService } = getServices();
  const accountId = getParam('accountId', params);
  const orderId = getParam('orderId', params);
  const itemId = getParam('itemId', params);
  const item = await itemActivityService.getOrderItem(
    accountId,
    orderId,
    itemId
  );

  return (
    <ModalWrapper size="sm">
      {item ? <SetItemPriceForm item={item} /> : <span>Item not found</span>}
    </ModalWrapper>
  );
}
