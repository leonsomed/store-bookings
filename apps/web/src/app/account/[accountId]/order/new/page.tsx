import { getServices } from 'database';
import { ModalWrapper } from '../../../../../components/ModalWrapper';
import { PageParamsProps, getParam } from '../../../../../services/navigation';
import { NewOrderItemsForm } from '../../../../../items/NewOrderItemsForm';

export default async function NewOrderPage({ params }: PageParamsProps) {
  const { productService } = getServices();
  const [bundles, products] = await Promise.all([
    productService.getBundles(),
    productService.getProducts(),
  ]);
  const accountId = getParam('accountId', params);

  return (
    <ModalWrapper>
      <NewOrderItemsForm
        accountId={accountId}
        products={products}
        bundles={bundles}
      />
    </ModalWrapper>
  );
}
