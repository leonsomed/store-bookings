'use client';

import { Formik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import { Input } from '../../../../../../../../components/Input';
import { Alert } from '../../../../../../../../components/Alert';
import { useRouter } from 'next/navigation';
import { api } from '../../../../../../../../services/api';
import {
  PrimaryButton,
  SecondaryButton,
} from '../../../../../../../../components/Button';
import { Subheading } from '../../../../../../../../components/Heading';
import { Select } from '../../../../../../../../components/Select';
import { VOID_REASONS } from '../../../../../../../../services/constants';
import { VoidItemLog } from 'database';

interface VoidItemFormProps {
  accountId: string;
  orderId: string;
  itemId: string;
}

interface VoidItemFormState {
  reason: string;
  note: string;
}

const DEFAULT_FORM_STATE: VoidItemFormState = {
  reason: '',
  note: '',
};

const setItemPriceSchema = yup.object().shape({
  reason: yup
    .string()
    .oneOf(VOID_REASONS.map((n) => n.value))
    .required(),
  note: yup.string().required(),
});

export function VoidItemForm({
  accountId,
  orderId,
  itemId,
}: VoidItemFormProps) {
  const router = useRouter();

  const handleSubmit = async (
    values: VoidItemFormState,
    formik: FormikHelpers<VoidItemFormState>
  ) => {
    formik.setStatus(undefined);
    formik.setSubmitting(true);

    try {
      const payload = {
        note: values.note,
        reason: values.reason as VoidItemLog['reason'],
        accountId,
        orderId,
        itemId,
        userId: 'c71d0998-1871-4e10-a76d-13d50ab76f54', // TODO from must ask for the user, since accounts have multiple
      };
      await api.voidOrderItem(payload);
      router.back();
      setTimeout(() => {
        router.refresh();
      }, 3000);
    } catch (e) {
      console.error(e);
      formik.setStatus({ message: 'There was a problem, please try again.' });
      formik.setSubmitting(false);
    }
  };

  return (
    <Formik
      isInitialValid={false}
      initialValues={DEFAULT_FORM_STATE}
      onSubmit={handleSubmit}
      validationSchema={setItemPriceSchema}
    >
      {(formikProps) => {
        return (
          <>
            <div className="flex flex-col space-y-2">
              <Subheading>Void Item</Subheading>
              <br />
              <Select
                label="Reason"
                placeholder="Select a reason"
                name="reason"
                value={formikProps.values.reason}
                error={formikProps.errors.reason}
                onChange={formikProps.handleChange}
                options={VOID_REASONS}
              />

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
                Void
              </PrimaryButton>
              <SecondaryButton
                disabled={formikProps.isSubmitting}
                onClick={router.back}
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
  );
}
