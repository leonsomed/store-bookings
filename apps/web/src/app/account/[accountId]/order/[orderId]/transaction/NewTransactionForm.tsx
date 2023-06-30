'use client';

import { Formik, FormikHelpers } from 'formik';
import { nanoid } from 'nanoid';
import * as yup from 'yup';
import { ChangeEventHandler, useMemo, useState } from 'react';
import { Select } from '../../../../../..//components/Select';
import { Input } from '../../../../../..//components/Input';
import {
  dollarsToCents,
  formatDollars,
} from '../../../../../..//services/format';
import { Checkbox } from '../../../../../..//components/Checkbox';
import { Alert } from '../../../../../..//components/Alert';
import { NewOrderItemsPayload, NewOrderTransactionPayload } from 'database';
import { useRouter } from 'next/navigation';
import { api } from '../../../../../..//services/api';
import { routes } from '../../../../../..//services/navigation';
import {
  PrimaryButton,
  SecondaryButton,
} from '../../../../../../components/Button';

interface NewTransactionFormProps {
  accountId: string;
  orderId: string;
}

interface NewTransactionFormState {
  category: string;
  cents: string;
  stripeChargeId: string;
  stripeCustomerId: string;
  note: string;
}

const DEFAULT_FORM_STATE: NewTransactionFormState = {
  category: 'stripe',
  cents: '',
  note: '',
  stripeChargeId: '',
  stripeCustomerId: '',
};

const newTransactionFormSchema = yup.object().shape({
  category: yup.string().oneOf(['stripe', 'cash']).required(),
  cents: yup.number().required(),
  stripeChargeId: yup.string().optional(),
  stripeCustomerId: yup.string().optional(),
  note: yup.string().required(),
});

const TRANSACTION_CATEGORY_OPTIONS = [
  { value: 'cash', label: 'Cash' },
  { value: 'stripe', label: 'Stripe' },
];

export function NewTransactionForm({
  accountId,
  orderId,
}: NewTransactionFormProps) {
  const router = useRouter();
  const [showAddButton, setShowAddButton] = useState(true);

  const handleSubmit = async (
    values: NewTransactionFormState,
    formik: FormikHelpers<NewTransactionFormState>
  ) => {
    formik.setStatus(undefined);
    formik.setSubmitting(true);

    try {
      const payload = {
        cents: parseInt(values.cents),
        note: values.note,
        category: values.category as NewOrderTransactionPayload['category'],
        stripeChargeId: values.stripeChargeId,
        stripeCustomerId: values.stripeCustomerId,
        accountId,
        orderId,
        userId: 'c71d0998-1871-4e10-a76d-13d50ab76f54', // TODO from must ask for the user, since accounts have multiple
      };
      await api.newOrderTransaction(payload);
      setTimeout(() => {
        router.refresh();
      }, 3000);
      formik.resetForm();
    } catch (e) {
      console.error(e);
      formik.setStatus({ message: 'There was a problem, please try again.' });
      formik.setSubmitting(false);
    }
  };

  return (
    <>
      {showAddButton ? (
        <div className="flex justify-center">
          <PrimaryButton onClick={() => setShowAddButton(false)}>
            Add transaction
          </PrimaryButton>
        </div>
      ) : (
        <Formik
          isInitialValid={false}
          initialValues={DEFAULT_FORM_STATE}
          onSubmit={handleSubmit}
          validationSchema={newTransactionFormSchema}
        >
          {(formikProps) => {
            return (
              <>
                <div className="flex space-x-2 justify-evenly">
                  <Select
                    label="Category"
                    name="category"
                    value={formikProps.values.category}
                    error={formikProps.errors.category}
                    onChange={formikProps.handleChange}
                    options={TRANSACTION_CATEGORY_OPTIONS}
                  />

                  <Input
                    label="Amount"
                    name="cents"
                    value={formikProps.values.cents}
                    error={formikProps.errors.cents}
                    onChange={formikProps.handleChange}
                    onBlur={formikProps.handleBlur}
                  />

                  {formikProps.values.category === 'stripe' && (
                    <>
                      <Input
                        label="Stripe Charge ID"
                        name="stripeChargeId"
                        value={formikProps.values.stripeChargeId}
                        error={formikProps.errors.stripeChargeId}
                        onChange={formikProps.handleChange}
                        onBlur={formikProps.handleBlur}
                      />

                      <Input
                        label="Stripe Customer ID"
                        name="stripeCustomerId"
                        value={formikProps.values.stripeCustomerId}
                        error={formikProps.errors.stripeCustomerId}
                        onChange={formikProps.handleChange}
                        onBlur={formikProps.handleBlur}
                      />
                    </>
                  )}

                  <Input
                    label="Note"
                    name="note"
                    value={formikProps.values.note}
                    error={formikProps.errors.note}
                    onChange={formikProps.handleChange}
                    onBlur={formikProps.handleBlur}
                  />
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <PrimaryButton
                    disabled={formikProps.isSubmitting}
                    onClick={formikProps.submitForm}
                  >
                    Create
                  </PrimaryButton>
                  <SecondaryButton
                    disabled={formikProps.isSubmitting}
                    onClick={() => {
                      setShowAddButton(true);
                      formikProps.resetForm();
                    }}
                  >
                    Cancel
                  </SecondaryButton>
                </div>

                {formikProps.status?.message && (
                  <div className="mt-4">
                    <Alert severity="error">{formikProps.status.message}</Alert>
                  </div>
                )}
              </>
            );
          }}
        </Formik>
      )}
    </>
  );
}
