import { ChangeEventHandler, FocusEventHandler } from 'react';
import cx from 'classnames';

interface InputProps {
  name: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  value?: string;
  error?: string;
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
  onChange,
  onBlur,
}: InputProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className={cx('block mb-2 text-sm font-medium', {
          'text-gray-900': !disabled,
          'text-gray-400': disabled,
        })}
      >
        {label}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        className={cx(
          'border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5',
          {
            'border-red-400': error,
            'bg-red-50': error,
            'bg-gray-100': disabled,
            'text-gray-400': disabled,
            'bg-white': !disabled && !error,
            'border-gray-300': !disabled && !error,
            'text-gray-900': !disabled && !error,
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
