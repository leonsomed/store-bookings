import { ChangeEventHandler, FocusEventHandler } from 'react';
import cx from 'classnames';

interface InputProps {
  name: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  value?: string;
  error?: string;
  type?: 'text' | 'password' | 'date' | 'time' | 'email' | 'number';
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
}

export function Input({
  name,
  label,
  placeholder,
  disabled,
  value,
  error,
  type = 'text',
  onChange,
  onBlur,
}: InputProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className={cx('block mb-2 text-sm font-medium', {
          'text-gray-900 dark:text-gray-400': !disabled,
          'text-gray-400 dark:text-gray-900': disabled,
        })}
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className={cx(
          'border dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5',
          {
            'border-red-400 bg-red-50 dark:bg-red-300': error,
            'bg-gray-100 text-gray-400 dark:text-white dark:bg-zinc-900':
              disabled,
            'bg-white dark:bg-zinc-700 text-gray-900 border-gray-300':
              !disabled && !error,
          }
        )}
        placeholder={placeholder}
        required
        disabled={disabled}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
    </div>
  );
}
