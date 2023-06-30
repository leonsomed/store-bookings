import { prisma } from 'database';
import { PageParamsProps, getParam } from '../../../../services/navigation';
import { ModalWrapper } from '../../../../components/ModalWrapper';
import { EditInstructorForm } from './EditInstructorForm';

export const REVALIDATE_SECONDS = 1;

async function getInstructor(id: string) {
  const instructor = await prisma.instructor.findFirst({
    where: { id },
    include: { user: { include: { address: true } } },
  });
  return instructor;
}

export type FullInstructor = Awaited<ReturnType<typeof getInstructor>>;

export default async function EditInstructorPage({ params }: PageParamsProps) {
  const instructorId = getParam('instructorId', params);
  const instructor = await getInstructor(instructorId);

  return (
    <ModalWrapper>
      <EditInstructorForm instructor={instructor} />
    </ModalWrapper>
  );
}
