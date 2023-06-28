import cx from 'classnames';
import NextLink, { LinkProps } from 'next/link';

interface BaseProps {
  children: React.ReactNode | string;
  href: LinkProps<any>['href'];
}

interface MyLinkProps extends BaseProps {
  variant?: 'error' | 'neutral' | 'primary';
  borderless?: boolean;
  tooltipTitle?: string;
}

export const LinkButton = ({
  href,
  children,
  borderless,
  tooltipTitle,
  variant = 'neutral',
}: MyLinkProps) => {
  return (
    <NextLink
      className={cx(
        'inline-block rounded  pt-2 pb-[6px] text-xs font-medium uppercase leading-normal transition duration-150 ease-in-out hover:border-primary-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-primary-600 focus:border-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:border-primary-700 active:text-primary-700',
        {
          ['border-2']: !borderless,
          ['px-6']: !borderless,
          ['bg-primary-600']: variant === 'primary',
          ['text-white']: variant === 'primary',
          ['border-primary-600']: variant === 'primary',
          'border-primary': variant === 'neutral',
          'text-primary': variant === 'neutral',
          'border-red-500': variant === 'error',
          'text-red-500': variant === 'error',
        }
      )}
      title={tooltipTitle}
      data-te-toggle="tooltip"
      href={href}
    >
      {children}
    </NextLink>
  );
};

export const Link = ({ href, children, variant = 'neutral' }: MyLinkProps) => {
  return (
    <NextLink
      className={cx(
        'inline-block rounded p-1 text-xs font-medium uppercase leading-normal transition duration-150 ease-in-out underline hover:text-primary-400 focus:text-primary-400 focus:outline-none focus:ring-0 active:text-primary-400',
        {
          'text-primary': variant === 'neutral',
          'text-red-500': variant === 'error',
        }
      )}
      href={href}
    >
      {children}
    </NextLink>
  );
};

interface IconLinkProps extends BaseProps {
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const IconLink = ({
  href,
  children,
  size = 'sm',
  color = 'text-primary',
}: IconLinkProps) => {
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
