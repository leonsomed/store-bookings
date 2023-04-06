import { prisma } from 'database';
import { Heading } from '../../components/Heading';
import { ExternalLinkIcon } from '../../components/icons/ExternalLinkIcon';
import { IconLink } from '../../components/Link';
import { SimplePageLayout } from '../../components/SimplePageLayout';
import { SimpleTable } from '../../components/SimpleTable';
import { routes } from '../../services/navigation';

async function getAccounts() {
  // const accounts = await prisma.account.findMany({});
  const accounts = [
    { id: '6b4a4de5-41b2-47bf-a7a2-4bbfcfa0ed39', name: 'Some account' },
  ];
  return accounts;
}

const ACCOUNT_COLUMNS = [
  { label: 'ID', getKey: (row) => row.id, getContent: (row) => row.id },
  { label: 'Name', getKey: (row) => row.name, getContent: (row) => row.name },
  {
    label: 'Actions',
    getKey: (row) => row.id + row.name,
    getContent: (row) => (
      <IconLink href={routes.accountDetails(row.id)}>
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
      <Heading>Accounts</Heading>
      <SimpleTable
        columns={ACCOUNT_COLUMNS}
        data={accounts}
        getRowId={IDENTITY_FIELD}
      />
    </SimplePageLayout>
  );
}
