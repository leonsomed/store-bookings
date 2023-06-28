import { ChangeEventHandler, FocusEventHandler } from 'react';
import cx from 'classnames';

interface SelectProps {
  options: { value: string; label: string }[];
  label?: string;
  name: string;
  placeholder?: string;
  value?: string;
  error?: string;
  disabled?: boolean;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  onBlur?: FocusEventHandler<HTMLSelectElement>;
}

export function Select({
  options,
  value,
  name,
  label,
  onChange,
  onBlur,
  placeholder,
  disabled,
  error,
}: SelectProps) {
  return (
    <div>
      {label && (
        <label
          htmlFor={name}
          className={cx(
            'block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400',
            {
              'text-gray-400': disabled,
            }
          )}
        >
          {label}
        </label>
      )}
      <select
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        className={cx(
          'bg-white dark:bg-zinc-700 border border-gray-300 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5',
          {
            'border-red-400': error,
            'bg-red-50': error,
            'bg-gray-100': disabled,
            'text-gray-400': disabled,
          }
        )}
      >
        {placeholder && <option value={placeholder}>{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
