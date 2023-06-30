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

interface CancelLessonFormProps {
  accountId: string;
  orderId: string;
  itemId: string;
}

interface CancelLessonFormState {
  note: string;
}

const DEFAULT_FORM_STATE: CancelLessonFormState = {
  note: '',
};

const cancelLessonSchema = yup.object().shape({
  note: yup.string().required(),
});

export function CancelLessonForm({
  accountId,
  orderId,
  itemId,
}: CancelLessonFormProps) {
  const router = useRouter();

  const handleSubmit = async (
    values: CancelLessonFormState,
    formik: FormikHelpers<CancelLessonFormState>
  ) => {
    formik.setStatus(undefined);
    formik.setSubmitting(true);

    try {
      const payload = {
        note: values.note,
        accountId,
        orderId,
        itemId,
        userId: 'c71d0998-1871-4e10-a76d-13d50ab76f54', // TODO from must ask for the user, since accounts have multiple
      };
      await api.cancelLesson(payload);
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
      validationSchema={cancelLessonSchema}
    >
      {(formikProps) => {
        return (
          <>
            <div className="flex flex-col space-y-2">
              <Subheading>Cancel Lesson</Subheading>
              <br />
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
                Cancel lesson
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
