'use client';

import { Formik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import { api } from '../../../services/api';
import { Subheading } from '../../../components/Heading';
import { Input } from '../../../components/Input';
import { PrimaryButton, SecondaryButton } from '../../../components/Button';
import { Alert } from '../../../components/Alert';
import { NewInstructorPayload } from 'database';

interface NewInstructorFormProps {}

interface NewInstructorFormState {
  email: string;
  firstName: string;
  lastName: string;
}

const getDefaultFormState = (): NewInstructorFormState => ({
  email: '',
  firstName: '',
  lastName: '',
});

const schema = yup.object().shape({
  email: yup.string().email().required(),
});

export function NewInstructorForm(props: NewInstructorFormProps) {
  const router = useRouter();

  const handleSubmit = async (
    values: NewInstructorFormState,
    formik: FormikHelpers<NewInstructorFormState>
  ) => {
    formik.setStatus(undefined);
    formik.setSubmitting(true);

    try {
      const payload: NewInstructorPayload = {
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
      };
      await api.instructor.create(payload);
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
      initialValues={getDefaultFormState()}
      onSubmit={handleSubmit}
      validationSchema={schema}
    >
      {(formikProps) => {
        return (
          <>
            <div className="flex flex-col space-y-2">
              <Subheading>New Instructor</Subheading>
              <br />
              <Input
                label="Email"
                name="email"
                value={formikProps.values.email}
                error={formikProps.errors.email}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
              />
              <br />
              <Input
                label="First Name"
                name="firstName"
                value={formikProps.values.firstName}
                error={formikProps.errors.firstName}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
              />
              <br />
              <Input
                label="Last Name"
                name="lastName"
                value={formikProps.values.lastName}
                error={formikProps.errors.lastName}
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
