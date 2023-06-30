'use client';

import { Formik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import { api } from '../../../../services/api';
import { Subheading } from '../../../../components/Heading';
import { Input } from '../../../../components/Input';
import { PrimaryButton, SecondaryButton } from '../../../../components/Button';
import { Alert } from '../../../../components/Alert';
import { Address, EditInstructorPayload } from 'database';
import { FullInstructor } from './page';
import { getAddressLine } from '../../../../services/format';
import { AddressSearchBox } from '../../../../components/AddressSearchBox';

interface EditInstructorFormProps {
  instructor: FullInstructor;
}

interface EditInstructorFormState {
  email: string;
  firstName: string;
  lastName: string;
  addressId: string;
}

const getDefaultFormState = (
  instructor: FullInstructor
): EditInstructorFormState => ({
  email: instructor.user.email,
  firstName: instructor.user.firstName,
  lastName: instructor.user.lastName,
  addressId: instructor.user.addressId,
});

const schema = yup.object().shape({
  email: yup.string().email().required(),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  addressId: yup.string().required(),
});

export function EditInstructorForm({ instructor }: EditInstructorFormProps) {
  const router = useRouter();

  const handleSubmit = async (
    values: EditInstructorFormState,
    formik: FormikHelpers<EditInstructorFormState>
  ) => {
    formik.setStatus(undefined);
    formik.setSubmitting(true);

    try {
      const payload: EditInstructorPayload = {
        id: instructor.id,
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        addressId: values.addressId,
      };
      await api.instructor.edit(payload);
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
      initialValues={getDefaultFormState(instructor)}
      onSubmit={handleSubmit}
      validationSchema={schema}
    >
      {(formikProps) => {
        return (
          <>
            <div className="flex flex-col space-y-2">
              <Subheading>Edit Instructor</Subheading>
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
              <br />
              <AddressSearchBox
                initialAddress={getAddressLine(instructor.user.address)}
                onAddress={(response) => {
                  formikProps.setFieldValue('addressId', response.address.id);
                }}
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <PrimaryButton
                disabled={formikProps.isSubmitting}
                onClick={formikProps.submitForm}
              >
                Save
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
