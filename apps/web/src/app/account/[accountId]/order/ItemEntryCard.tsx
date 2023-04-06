import React from 'react';
import { useFormikContext } from 'formik';
import _ from 'lodash';
import { SecondaryButton } from '../../../../components/Button';
import { Input } from '../../../../components/Input';
import { ItemEntry } from './NewOrderForm';
import { Select } from '../../../../components/Select';

interface ItemEntryCardProps extends ItemEntry {
  entryIndex: number;
  onRemove: (entryIndex: number) => void;
}

function getFieldPath(path: string, field: string) {
  return `${path}.${field}`;
}

const COURSE_STATES = [
  { value: 'california', label: 'California' },
  { value: 'texas', label: 'Texas' },
];

export function ItemEntryCard({
  entryIndex,
  description,
  items,
  onRemove,
}: ItemEntryCardProps) {
  return (
    <div className="flex flex-col space-y-4 rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-700">
      <h2 className="text-lg font-bold">{description}</h2>
      <div className="flex flex-col space-y-2 space-x-2">
        {items.map((item, lineIndex) => (
          <React.Fragment key={item.itemId}>
            {item.type === 'course' && (
              <CourseItem
                path={`items[${entryIndex}].items[${lineIndex}]`}
                item={item}
              />
            )}
            {item.type === 'lesson' && (
              <LessonItem
                path={`items[${entryIndex}].items[${lineIndex}]`}
                item={item}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <SecondaryButton onClick={() => onRemove(entryIndex)}>
        Remove
      </SecondaryButton>
    </div>
  );
}

interface CourseItemProps {
  item: ItemEntry['items'][0];
  path: string;
}

function CourseItem({ item, path }: CourseItemProps) {
  const formik = useFormikContext();

  if (item.type !== 'course') return null;

  return (
    <div className="m-b-2">
      <div className="flex space-x-4">
        <Select
          label="Course State"
          placeholder="Select a state"
          name={getFieldPath(path, 'state')}
          value={_.get(formik.values, getFieldPath(path, 'state'))}
          error={_.get(formik.errors, getFieldPath(path, 'state'))}
          onChange={formik.handleChange}
          options={COURSE_STATES}
        />
        <Input
          label="Price"
          name={getFieldPath(path, 'priceDollars')}
          value={_.get(formik.values, getFieldPath(path, 'priceDollars'))}
          error={_.get(formik.errors, getFieldPath(path, 'priceDollars'))}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </div>
    </div>
  );
}

interface LessonItemProps {
  item: ItemEntry['items'][0];
  path: string;
}

function LessonItem({ item, path }: LessonItemProps) {
  const formik = useFormikContext();

  if (item.type !== 'lesson') return null;

  return (
    <div className="m-b-2">
      <div className="flex space-x-4">
        <Input
          label="Role"
          name={getFieldPath(path, 'role')}
          value={_.get(formik.values, getFieldPath(path, 'role'))}
          error={_.get(formik.errors, getFieldPath(path, 'role'))}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled
        />
        <Input
          label="Duration (minutes)"
          name={getFieldPath(path, 'durationMinutes')}
          value={_.get(formik.values, getFieldPath(path, 'durationMinutes'))}
          error={_.get(formik.errors, getFieldPath(path, 'durationMinutes'))}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled
        />
        <Input
          label="Price"
          name={getFieldPath(path, 'priceDollars')}
          value={_.get(formik.values, getFieldPath(path, 'priceDollars'))}
          error={_.get(formik.errors, getFieldPath(path, 'priceDollars'))}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </div>
    </div>
  );
}
