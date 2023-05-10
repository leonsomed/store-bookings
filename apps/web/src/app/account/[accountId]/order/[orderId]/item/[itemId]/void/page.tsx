import { getServices } from 'database';
import { ModalWrapper } from '../../../../../../../../components/ModalWrapper';
import {
  PageParamsProps,
  getParam,
} from '../../../../../../../../services/navigation';

export default async function SetPricePage({ params }: PageParamsProps) {
  const { itemActivityService } = getServices();
  const accountId = getParam('accountId', params);
  const orderId = getParam('orderId', params);
  const itemId = getParam('itemId', params);

  return <ModalWrapper size="sm">TODO</ModalWrapper>;
}
