import { ModalWrapper } from '../../../../../../../../components/ModalWrapper';
import {
  PageParamsProps,
  getParam,
} from '../../../../../../../../services/navigation';
import { CancelLessonForm } from './CancelLessonForm';

export default async function CancelLessonPage({ params }: PageParamsProps) {
  const accountId = getParam('accountId', params);
  const orderId = getParam('orderId', params);
  const itemId = getParam('itemId', params);

  return (
    <ModalWrapper size="md">
      <CancelLessonForm
        accountId={accountId}
        orderId={orderId}
        itemId={itemId}
      />
    </ModalWrapper>
  );
}
