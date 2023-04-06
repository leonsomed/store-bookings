import { getServices } from 'database';
import { ModalWrapper } from '../../../../components/ModalWrapper';
import { PageParamsProps } from '../../../../services/navigation';
import { NewOrderForm } from './NewOrderForm';

export default async function NewOrderPage({ params }: PageParamsProps) {
  const { productService } = getServices();
  const [bundles, products] = await Promise.all([
    productService.getBundles(),
    productService.getProducts(),
  ]);

  return (
    <ModalWrapper>
      <NewOrderForm products={products} bundles={bundles} />
    </ModalWrapper>
  );
}
