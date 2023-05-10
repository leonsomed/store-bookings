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
import { ItemLine } from 'database';
import { Subheading } from '../../../../../../../../components/Heading';

interface SetItemPriceFormProps {
  item: ItemLine;
}

interface SetItemPriceFormState {
  currentPriceCents: string;
  newPriceCents: string;
  note: string;
}

const getDefaultFormState = (
  currentPriceCents: number
): SetItemPriceFormState => ({
  currentPriceCents: currentPriceCents.toString(),
  newPriceCents: '',
  note: '',
});

const setItemPriceSchema = yup.object().shape({
  currentPriceCents: yup.string().required(),
  newPriceCents: yup.string().required(),
  note: yup.string().required(),
});

export function SetItemPriceForm({ item }: SetItemPriceFormProps) {
  const { accountId, orderId, id: itemId } = item;
  const router = useRouter();

  const handleSubmit = async (
    values: SetItemPriceFormState,
    formik: FormikHelpers<SetItemPriceFormState>
  ) => {
    formik.setStatus(undefined);
    formik.setSubmitting(true);

    try {
      const payload = {
        note: values.note,
        currentPriceCents: parseInt(values.currentPriceCents),
        newPriceCents: parseInt(values.newPriceCents),
        accountId,
        orderId,
        itemId,
        userId: 'c71d0998-1871-4e10-a76d-13d50ab76f54', // TODO from must ask for the user, since accounts have multiple
      };
      await api.setOrderItemPrice(payload);
      router.back();
      router.refresh();
    } catch (e) {
      console.error(e);
      formik.setStatus({ message: 'There was a problem, please try again.' });
      formik.setSubmitting(false);
    }
  };

  return (
    <Formik
      isInitialValid={false}
      initialValues={getDefaultFormState(item.priceCents)}
      onSubmit={handleSubmit}
      validationSchema={setItemPriceSchema}
    >
      {(formikProps) => {
        return (
          <>
            <div className="flex flex-col space-y-2">
              <Subheading>{item.description}</Subheading>
              <br />
              <Input
                label="Current Price"
                name="currentPriceCents"
                disabled
                value={formikProps.values.currentPriceCents}
                error={formikProps.errors.currentPriceCents}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
              />

              <Input
                label="New Price"
                name="newPriceCents"
                value={formikProps.values.newPriceCents}
                error={formikProps.errors.newPriceCents}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
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
                Set Price
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
