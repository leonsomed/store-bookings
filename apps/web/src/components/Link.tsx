import cx from 'classnames';
import NextLink, { LinkProps } from 'next/link';

interface ButtonProps {
  href: LinkProps<any>['href'];
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  children: React.ReactNode | string;
}

export const Link = ({ href, children }: ButtonProps) => {
  return (
    <NextLink
      className="inline-block rounded border-2 border-primary px-6 pt-2 pb-[6px] text-xs font-medium uppercase leading-normal text-primary transition duration-150 ease-in-out hover:border-primary-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-primary-600 focus:border-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:border-primary-700 active:text-primary-700"
      href={href}
    >
      {children}
    </NextLink>
  );
};

export const IconLink = ({
  href,
  children,
  size = 'sm',
  color = 'text-primary',
}: ButtonProps) => {
  return (
    <NextLink
      href={href}
      className={cx(
        'inline-block font-medium uppercase leading-normal transition duration-150 ease-in-out hover:border-primary-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-primary-600 focus:border-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:border-primary-700 active:text-primary-700',
        color,
        {
          'text-lg': size === 'sm',
          'text-xl': size === 'md',
          'text-2xl': size === 'lg',
        }
      )}
    >
      {children}
    </NextLink>
  );
};
