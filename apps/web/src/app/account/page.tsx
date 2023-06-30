import { prisma } from 'database';
import { Heading } from '../../components/Heading';
import { ExternalLinkIcon } from '../../components/icons/ExternalLinkIcon';
import { IconLink } from '../../components/Link';
import { SimplePageLayout } from '../../components/SimplePageLayout';
import { SimpleTable } from '../../components/SimpleTable';
import { routes } from '../../services/navigation';
import { SimpleCard } from '../../components/SimpleCard';
import dynamic from 'next/dynamic';
import type { IDProps } from '../../components/ID';

const IDLazy = dynamic<IDProps>(() => import('../../components/ID'), {
  ssr: false,
});

async function getAccounts() {
  const accounts = await prisma.account.findMany({});
  return accounts;
}

const ACCOUNT_COLUMNS = [
  {
    label: 'ID',
    getKey: (row) => row.id,
    getContent: (row) => <IDLazy id={row.id} />,
  },
  { label: 'Name', getKey: (row) => row.name, getContent: (row) => row.name },
  {
    label: 'Actions',
    getKey: (row) => row.id + row.name,
    getContent: (row) => (
      <IconLink href={routes.account.details(row.id)}>
        <ExternalLinkIcon />
      </IconLink>
    ),
  },
];
const IDENTITY_FIELD = (row) => row.id;

export default async function AccountPage() {
  const accounts = await getAccounts();

  return (
    <SimplePageLayout>
      <SimpleCard>
        <Heading>Accounts</Heading>
        <SimpleTable
          disableHighlight
          columns={ACCOUNT_COLUMNS}
          data={accounts}
          getRowId={IDENTITY_FIELD}
        />
      </SimpleCard>
    </SimplePageLayout>
  );
}
