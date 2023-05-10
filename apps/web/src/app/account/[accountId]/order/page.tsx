import { getServices } from 'database';
import { ModalWrapper } from '../../../../components/ModalWrapper';
import { PageParamsProps, getParam } from '../../../../services/navigation';
import { NewOrderProductsForm } from '../../../../products/NewOrderProductsForm';

export default async function NewOrderPage({ params }: PageParamsProps) {
  const { productService } = getServices();
  const [bundles, products] = await Promise.all([
    productService.getBundles(),
    productService.getProducts(),
  ]);
  const accountId = getParam('accountId', params);

  return (
    <ModalWrapper>
      <NewOrderProductsForm
        accountId={accountId}
        products={products}
        bundles={bundles}
      />
    </ModalWrapper>
  );
}
