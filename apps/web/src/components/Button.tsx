import cx from 'classnames';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode | string;
  disabled?: boolean;
}

export const PrimaryButton = ({ onClick, children, disabled }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      type="button"
      disabled={disabled}
      className={cx(
        'inline-block cursor-pointer text-white rounded px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal',
        {
          'bg-primary': !disabled,
          'bg-gray-200': disabled,
        }
      )}
    >
      {children}
    </button>
  );
};

export const SecondaryButton = ({
  onClick,
  children,
  disabled,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      type="button"
      disabled={disabled}
      className={cx(
        'inline-block rounded cursor-pointer px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal ',
        {
          'bg-primary-100': !disabled,
          'text-primary-700': !disabled,
          'bg-gray-200': disabled,
          'text-white': disabled,
        }
      )}
    >
      {children}
    </button>
  );
};
