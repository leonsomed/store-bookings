import cx from 'classnames';

interface SimpleCardProps {
  children: React.ReactNode;
  marginX?: boolean;
  marginY?: boolean;
}

export function SimpleCard({ children, marginX, marginY }: SimpleCardProps) {
  return (
    <div
      className={cx(
        'block rounded-lg bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-zinc-900',
        { 'mx-4': marginX, 'my-4': marginY }
      )}
    >
      {children}
    </div>
  );
}
