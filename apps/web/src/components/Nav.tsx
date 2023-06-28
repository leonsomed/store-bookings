import { routes } from '../services/navigation';
import { Link } from './Link';

export function Nav() {
  return (
    <nav
      className="relative flex w-full items-center justify-between bg-blue-600 py-4 text-neutral-600 shadow-lg hover:text-neutral-700 focus:text-neutral-700 dark:bg-zinc-900 dark:text-neutral-200"
      data-te-navbar-ref
    >
      <div
        className="grow basis-[100%] items-center"
        id="navbarSupportedContentY"
        data-te-collapse-item
      >
        <ul className="flex items-center justify-center" data-te-navbar-nav-ref>
          <li data-te-nav-item-ref>
            <Link href={routes.home()}>Home</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
