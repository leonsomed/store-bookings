'use client';

import { Formik, FormikHelpers } from 'formik';
import { nanoid } from 'nanoid';
import { uuid } from 'uuidv4';
import * as yup from 'yup';
import { Bundle, Product } from 'database';
import { ChangeEventHandler, useMemo } from 'react';
import { Select } from '../components/Select';
import { FormContainer } from '../components/FormContainer';
import { dollarsToCents, formatDollars } from '../services/format';
import { Checkbox } from '../components/Checkbox';
import { ItemEntryCard } from './ItemEntryCard';
import { Alert } from '../components/Alert';
import { useRouter } from 'next/navigation';
import { api } from '../services/api';
import { routes } from '../services/navigation';

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
  items: Item[];
}

interface NewOrderItemsFormProps {
  products: Product[];
  bundles: Bundle[];
  accountId: string;
  orderId?: string;
}

interface NewOrderItemsFormState {
  items: ItemEntry[];
}

const DEFAULT_FORM_STATE: NewOrderItemsFormState = { items: [] };

const getTotalDollars = (items: ItemEntry[]) =>
  items.reduce(
    (total, item) =>
      item.items.reduce(
        (sub, next) => sub + parseFloat(next.priceDollars),
        total
      ),
    0
  );

const NewOrderItemsFormSchema = yup.object().shape({
  items: yup
    .array(
      yup.object().shape({
        items: yup.array(
          yup.object().shape({
            type: yup.string().required('Required'),
            priceDollars: yup
              .number()
              .min(1, 'Please add a price')
              .required('Required'),
            state: yup.string().when('type', {
              is: (type) => type === 'course',
              then: (schema) => schema.required('Required'),
            }),
          })
        ),
      })
    )
    .min(1, 'Please add at least one item'),
});

export function NewOrderItemsForm({
  products,
  bundles,
  accountId,
  orderId,
}: NewOrderItemsFormProps) {
  const router = useRouter();
  const handleSubmit = async (
    values: NewOrderItemsFormState,
    formik: FormikHelpers<NewOrderItemsFormState>
  ) => {
    formik.setStatus(undefined);
    formik.setSubmitting(true);

    try {
      const description = values.items
        .map((item) => item.description)
        .join(', ');
      const items = values.items.flatMap((item) =>
        item.items.map((subItem) => ({
          id: subItem.id,
          state: subItem.state,
          priceCents: dollarsToCents(subItem.priceDollars),
        }))
      );
      const payload = {
        items,
        description,
        accountId,
        orderId: orderId ?? uuid(),
        regionId: 'c71d0998-1871-4e10-a76d-13d50ab76f54', // TODO form must ask for the region
        userId: 'c71d0998-1871-4e10-a76d-13d50ab76f54', // TODO from must ask for the user, since accounts have multiple
      };
      await api.newOrderItems(payload);
      router?.push(routes.accountDetails(accountId));
    } catch (e) {
      console.error(e);
      formik.setStatus({ message: 'There was a problem, please try again.' });
      formik.setSubmitting(false);
    }
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
      validationSchema={NewOrderItemsFormSchema}
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
            title={orderId ? 'New Order' : 'Add Products'}
            disabled={!formikProps.isValid || formikProps.isSubmitting}
            onDismiss={router.back}
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
