import { prisma } from 'database';
import { Heading } from '../../components/Heading';
import { ExternalLinkIcon } from '../../components/icons/ExternalLinkIcon';
import { IconLink, LinkButton } from '../../components/Link';
import { SimplePageLayout } from '../../components/SimplePageLayout';
import { SimpleTable } from '../../components/SimpleTable';
import { routes } from '../../services/navigation';
import { SimpleCard } from '../../components/SimpleCard';
import dynamic from 'next/dynamic';
import type { IDProps } from '../../components/ID';

export const REVALIDATE_SECONDS = 1;

const IDLazy = dynamic<IDProps>(() => import('../../components/ID'), {
  ssr: false,
});

async function getInstructors() {
  const instructors = await prisma.instructor.findMany({
    include: { user: true },
  });
  return instructors;
}

type FullInstructor = Awaited<ReturnType<typeof getInstructors>>[number];

const INSTRUCTOR_COLUMNS = [
  {
    label: 'ID',
    getKey: (row) => row.id,
    getContent: (row) => <IDLazy id={row.id} />,
  },
  {
    label: 'First Name',
    getKey: (row) => row.name,
    getContent: (row: FullInstructor) => row.user.firstName,
  },
  {
    label: 'Last Name',
    getKey: (row) => row.name,
    getContent: (row: FullInstructor) => row.user.lastName,
  },
  {
    label: 'Email',
    getKey: (row) => row.name,
    getContent: (row: FullInstructor) => row.user.email,
  },
  {
    label: 'Actions',
    getKey: (row) => row.id + row.name,
    getContent: (row) => (
      <IconLink href={routes.instructor.details(row.id)}>
        <ExternalLinkIcon />
      </IconLink>
    ),
  },
];
const IDENTITY_FIELD = (row) => row.id;

export default async function InstructorPage() {
  const instructors = await getInstructors();

  return (
    <SimplePageLayout>
      <SimpleCard>
        <div className="flex justify-between">
          <Heading>Instructors</Heading>
          <LinkButton
            variant="primary"
            href={routes.instructor.newInstructor()}
          >
            Add Instructor
          </LinkButton>
        </div>
        <SimpleTable
          disableHighlight
          columns={INSTRUCTOR_COLUMNS}
          data={instructors}
          getRowId={IDENTITY_FIELD}
        />
      </SimpleCard>
    </SimplePageLayout>
  );
}
