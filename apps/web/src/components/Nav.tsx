import Link from 'next/link';
import { routes } from '../services/navigation';

export function Nav() {
  return (
    <nav className="relative flex w-full items-center justify-between bg-primary-600 py-4 shadow-lg dark:bg-zinc-900">
      <ul className="flex justify-start px-6">
        <li>
          <Link
            href={routes.home() as any}
            className="text-white font-bold uppercase text-xl"
          >
            Driving School
          </Link>
        </li>
      </ul>
    </nav>
  );
}
