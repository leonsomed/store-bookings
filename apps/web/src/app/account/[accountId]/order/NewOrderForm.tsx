'use client';

import { Formik, FormikHelpers } from 'formik';
import { nanoid } from 'nanoid';
import * as Yup from 'yup';
import { Bundle, Product } from 'database';
import { Select } from '../../../../components/Select';
import { ChangeEventHandler, useMemo } from 'react';
import { FormContainer } from '../../../../components/FormContainer';
import { useRouter } from 'next/navigation';
import { formatDollars } from '../../../../services/format';
import { Checkbox } from '../../../../components/Checkbox';
import { ItemEntryCard } from './ItemEntryCard';
import { api } from '../../../../services/api';
import { Alert } from '../../../../components/Alert';
import { routes } from '../../../../services/navigation';

export type Item = Product & {
  priceDollars: string;
  itemId: string;
  state?: string;
};

export interface ItemEntry {
  id: string;
  itemId: string;
  description: string;
  isBundle: boolean;
  items: Array<Item>;
}

interface NewOrderFormProps {
  products: Product[];
  bundles: Bundle[];
  accountId: string;
}

interface NewOrderFormState {
  items: ItemEntry[];
}

const DEFAULT_FORM_STATE: NewOrderFormState = { items: [] };

const getTotalDollars = (items: ItemEntry[]) =>
  items.reduce(
    (total, item) =>
      item.items.reduce(
        (sub, next) => sub + parseFloat(next.priceDollars),
        total
      ),
    0
  );

const newOrderFormSchema = Yup.object().shape({
  items: Yup.array(
    Yup.object().shape({
      items: Yup.array(
        Yup.object().shape({
          type: Yup.string().required('Required'),
          priceDollars: Yup.number()
            .min(1, 'Please add a price')
            .required('Required'),
          state: Yup.string().when('type', {
            is: (type) => type === 'course',
            then: (schema) => schema.required('Required'),
          }),
        })
      ),
    })
  ).min(1, 'Please add at least one item'),
});

export function NewOrderForm({
  products,
  bundles,
  accountId,
}: NewOrderFormProps) {
  const router = useRouter();

  const handleSubmit = async (
    values: NewOrderFormState,
    formik: FormikHelpers<NewOrderFormState>
  ) => {
    formik.setStatus(undefined);
    formik.setSubmitting(true);

    try {
      await api.newOrder({ items: values.items, accountId });
      router.push(routes.accountDetails(accountId));
    } catch (e) {
      console.error(e);
      formik.setStatus({ message: 'There was a problem, please try again.' });
      formik.setSubmitting(false);
    }
  };

  const handleDismiss = () => {
    router.back();
  };

  const options = useMemo(() => {
    return [
      ...products.map((product) => ({
        value: product.id.toString(),
        label: product.description,
      })),
      ...bundles.map((bundle) => ({
        value: bundle.id.toString(),
        label: bundle.description,
      })),
    ];
  }, []);

  return (
    <Formik
      isInitialValid={false}
      initialValues={DEFAULT_FORM_STATE}
      onSubmit={handleSubmit}
      validationSchema={newOrderFormSchema}
    >
      {(formikProps) => {
        const handleRemoveItem = (entryIndex: number) => {
          const newItems = formikProps.values.items.filter(
            (_, index) => entryIndex !== index
          );
          formikProps.setFieldValue('items', newItems);
        };

        const handleSelectProduct: ChangeEventHandler<HTMLSelectElement> = (
          e
        ) => {
          const id = e.target.value;
          const product = products.find((next) => next.id === id);

          if (product) {
            const newItems = [
              ...formikProps.values.items,
              {
                id,
                itemId: nanoid(),
                description: product.description,
                isBundle: false,
                items: [{ ...product, priceDollars: '0', itemId: nanoid() }],
              },
            ];
            formikProps.setFieldValue('items', newItems);
            return;
          }

          const bundle = bundles.find((next) => next.id === id);

          if (!bundle) {
            throw new Error(`Invalid product or bundle selected ${id}`);
          }

          const newItems = [
            ...formikProps.values.items,
            {
              id,
              isBundle: true,
              itemId: nanoid(),
              description: bundle.description,
              items: bundle.products.flatMap((next) =>
                Array.from({ length: next.quantity }).map(() => ({
                  ...products.find((foo) => foo.id === next.id),
                  priceDollars: '0',
                  itemId: nanoid(),
                }))
              ),
            },
          ];
          formikProps.setFieldValue('items', newItems);
        };

        return (
          <FormContainer
            title="New Order"
            disabled={!formikProps.isValid || formikProps.isSubmitting}
            onDismiss={handleDismiss}
            onSubmit={formikProps.submitForm}
          >
            <div className="text-xl">
              Total&nbsp;
              <span className="font-light">
                {formatDollars(getTotalDollars(formikProps.values.items))}
              </span>
            </div>
            <Select
              name="product"
              value={'n/a'}
              placeholder="Select a product"
              onChange={handleSelectProduct}
              options={options}
            />
            <Checkbox
              checked={false}
              disabled
              onChange={() => {}}
              label="Lookup prices by address"
            />

            {formikProps.values.items.map((item, index) => (
              <ItemEntryCard
                {...item}
                key={item.itemId}
                entryIndex={index}
                onRemove={handleRemoveItem}
              />
            ))}

            {formikProps.status?.message && (
              <Alert severity="error">{formikProps.status.message}</Alert>
            )}
          </FormContainer>
        );
      }}
    </Formik>
  );
}
