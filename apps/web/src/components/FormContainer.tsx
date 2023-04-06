'use client';

import { PrimaryButton, SecondaryButton } from '../components/Button';
import { Heading } from '../components/Heading';
import { CloseIcon } from '../components/icons/CloseIcon';

interface FormContainerProps {
  children: React.ReactNode;
  title: string;
  disabled: boolean;
  submitLabel?: string;
  dismissLabel?: string;
  onSubmit: () => void;
  onDismiss: () => void;
}

export function FormContainer({
  children,
  title,
  disabled,
  submitLabel = 'Submit',
  dismissLabel = 'Cancel',
  onDismiss,
  onSubmit,
}: FormContainerProps) {
  return (
    <div className="relative flex flex-col space-y-4">
      <div
        className="absolute right-0 top-0 text-2xl cursor-pointer"
        onClick={onDismiss}
      >
        <CloseIcon />
      </div>
      <Heading>{title}</Heading>
      {children}
      <div className="flex justify-end space-x-4">
        <SecondaryButton disabled={disabled} onClick={onDismiss}>
          {dismissLabel}
        </SecondaryButton>
        <PrimaryButton disabled={disabled} onClick={onSubmit}>
          {submitLabel}
        </PrimaryButton>
      </div>
    </div>
  );
}
