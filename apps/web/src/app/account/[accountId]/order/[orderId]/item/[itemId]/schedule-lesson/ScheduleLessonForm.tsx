'use client';

import { Formik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import { uuid } from 'uuidv4';
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
import { ItemLine } from 'database';
import { timestampFromDateTime } from '../../../../../../../../services/format';

interface ScheduleLessonFormProps {
  item: ItemLine;
}

interface ScheduleLessonFormState {
  instructorId: string;
  studentId: string;
  date: string;
  time: string;
  address: string;
  note: string;
}

const DEFAULT_FORM_STATE: ScheduleLessonFormState = {
  studentId: '',
  instructorId: '',
  date: '',
  time: '',
  address: '',
  note: '',
};

const INSTRUCTORS = [
  { value: uuid(), label: 'Instructor I' },
  { value: uuid(), label: 'Instructor II' },
  { value: uuid(), label: 'Instructor III' },
];

const STUDENTS = [
  { value: uuid(), label: 'Student I' },
  { value: uuid(), label: 'Student II' },
  { value: uuid(), label: 'Student III' },
];

const scheduleLessonSchema = yup.object().shape({
  instructorId: yup.string().uuid().required(),
  studentId: yup.string().uuid().required(),
  date: yup.string().required(),
  time: yup.string().required(),
  address: yup.string().required(),
  note: yup.string().optional(),
});

export function ScheduleLessonForm({ item }: ScheduleLessonFormProps) {
  const { accountId, orderId, id: itemId } = item;
  const router = useRouter();

  const handleSubmit = async (
    values: ScheduleLessonFormState,
    formik: FormikHelpers<ScheduleLessonFormState>
  ) => {
    formik.setStatus(undefined);
    formik.setSubmitting(true);

    try {
      const payload = {
        note: values.note || 'Book lesson',
        instructorId: values.instructorId,
        studentId: values.studentId,
        address: values.address,
        timestamp: timestampFromDateTime(values.date, values.time),
        accountId,
        orderId,
        itemId,
        userId: 'c71d0998-1871-4e10-a76d-13d50ab76f54', // TODO from must ask for the user, since accounts have multiple
      };
      await api.scheduleLesson(payload);
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
      initialValues={DEFAULT_FORM_STATE}
      onSubmit={handleSubmit}
      validationSchema={scheduleLessonSchema}
    >
      {(formikProps) => {
        return (
          <>
            <div className="flex flex-col space-y-2">
              <Subheading>
                {item.lessonDate ? 'Reschedule' : 'Schedule'} Lesson
              </Subheading>
              <br />
              <Select
                label="Instructor"
                name="instructorId"
                placeholder="Select an instructor"
                value={formikProps.values.instructorId}
                error={formikProps.errors.instructorId}
                onChange={formikProps.handleChange}
                options={INSTRUCTORS}
              />

              <Select
                label="Student"
                name="studentId"
                placeholder="Select a student"
                value={formikProps.values.studentId}
                error={formikProps.errors.studentId}
                onChange={formikProps.handleChange}
                options={STUDENTS}
              />

              <Input
                label="Date"
                name="date"
                type="date"
                value={formikProps.values.date}
                error={formikProps.errors.date}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
              />

              <Input
                label="Time"
                name="time"
                type="time"
                value={formikProps.values.time}
                error={formikProps.errors.time}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
              />

              <Input
                label="Address"
                name="address"
                value={formikProps.values.address}
                error={formikProps.errors.address}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
              />

              {item.lessonDate && (
                <Input
                  label="Note"
                  name="note"
                  value={formikProps.values.note}
                  error={formikProps.errors.note}
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                />
              )}
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <PrimaryButton
                disabled={formikProps.isSubmitting}
                onClick={formikProps.submitForm}
              >
                {item.lessonDate ? 'Reschedule' : 'Schedule'}
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
