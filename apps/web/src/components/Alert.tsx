import cx from 'classnames';

interface AlertProps {
  children: React.ReactNode;
  severity: 'success' | 'warning' | 'error';
}

export function Alert({ children, severity }: AlertProps) {
  return (
    <div
      className={cx('mb-4 rounded-lg  px-6 py-5 text-base', {
        'bg-success-100': severity === 'success',
        'text-success-700': severity === 'success',
        'bg-danger-100': severity === 'error',
        'text-danger-700': severity === 'error',
        'bg-warning-100': severity === 'warning',
        'text-warning-800': severity === 'warning',
      })}
      role="alert"
    >
      {children}
    </div>
  );
}
