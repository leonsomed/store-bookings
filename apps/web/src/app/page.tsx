import { Heading } from '../components/Heading';
import { Link } from '../components/Link';
import { SimpleCard } from '../components/SimpleCard';
import { SimplePageLayout } from '../components/SimplePageLayout';
import { routes } from '../services/navigation';

export default async function AccountPage() {
  return (
    <SimplePageLayout>
      <SimpleCard>
        <Heading>Navigation</Heading>
        <ul className="w-96">
          <li className="w-full border-b-2 border-neutral-100 border-opacity-100 py-4 dark:border-opacity-50 last:border-0">
            <Link href={routes.accounts()}>Accounts</Link>
          </li>
        </ul>
      </SimpleCard>
    </SimplePageLayout>
  );
}
