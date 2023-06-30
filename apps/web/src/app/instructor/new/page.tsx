import { PageParamsProps } from '../../../services/navigation';
import { ModalWrapper } from '../../../components/ModalWrapper';
import { NewInstructorForm } from './NewInstructorForm';

export default async function NewInstructorPage({ params }: PageParamsProps) {
  return (
    <ModalWrapper>
      <NewInstructorForm />
    </ModalWrapper>
  );
}
