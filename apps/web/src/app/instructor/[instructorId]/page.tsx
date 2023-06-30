import { prisma } from 'database';
import { Heading } from '../../../components/Heading';
import { SimplePageLayout } from '../../../components/SimplePageLayout';
import {
  PageParamsProps,
  getParam,
  routes,
} from '../../../services/navigation';
import { SimpleCard } from '../../../components/SimpleCard';
import { LabelPair } from '../../../components/LabelPair';
import { LinkButton } from '../../../components/Link';
import { getAddressLine } from '../../../services/format';

export const REVALIDATE_SECONDS = 1;

async function getInstructor(id: string) {
  const instructor = await prisma.instructor.findFirst({
    where: { id },
    include: { user: { include: { address: true } } },
  });
  return instructor;
}

export default async function InstructorPage({ params }: PageParamsProps) {
  const instructorId = getParam('instructorId', params);
  const instructor = await getInstructor(instructorId);

  return (
    <SimplePageLayout>
      <SimpleCard>
        <div className="flex justify-between">
          <Heading>Instructor</Heading>
          <LinkButton
            variant="primary"
            href={routes.instructor.edit(instructorId)}
          >
            Edit
          </LinkButton>
        </div>
        <br />
        <div className="w-[500px]">
          <LabelPair label="Email" value={instructor.user.email} />
          <LabelPair label="First Name" value={instructor.user.firstName} />
          <LabelPair label="Last Name" value={instructor.user.lastName} />
          <LabelPair
            label="Address"
            value={getAddressLine(instructor.user.address)}
          />
        </div>
      </SimpleCard>
    </SimplePageLayout>
  );
}
