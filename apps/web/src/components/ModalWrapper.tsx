import cx from 'classnames';
import { CloseIcon } from './icons/CloseIcon';
import { IconLink } from './Link';

interface ModalWrapperProps {
  children: React.ReactNode | string;
  closeHref?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ModalWrapper = ({
  children,
  closeHref,
  size = 'md',
}: ModalWrapperProps) => {
  return (
    <div className="bg-black dark:bg-zinc-400 bg-opacity-80 fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center overflow-y-scroll">
      <div
        className={cx('bg-white dark:bg-zinc-900 p-6 rounded-sm relative', {
          'w-1/4': size === 'sm',
          'w-1/2': size === 'md',
          'w-3/4': size === 'lg',
        })}
      >
        {closeHref && (
          <div className="absolute right-[20px] top-[20px]">
            <IconLink
              color="text-black dark:text-white"
              size="lg"
              href={closeHref}
            >
              <CloseIcon />
            </IconLink>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
