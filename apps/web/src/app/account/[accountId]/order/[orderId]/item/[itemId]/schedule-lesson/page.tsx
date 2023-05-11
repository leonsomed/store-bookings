import { getServices } from 'database';
import { ModalWrapper } from '../../../../../../../../components/ModalWrapper';
import {
  PageParamsProps,
  getParam,
} from '../../../../../../../../services/navigation';
import { ScheduleLessonForm } from './ScheduleLessonForm';

export default async function ScheduleLessonPage({ params }: PageParamsProps) {
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
    <ModalWrapper size="md">
      <ScheduleLessonForm item={item} />
    </ModalWrapper>
  );
}
