import type { ActivityLog } from 'database';
import { formatCentsToDollars, formatDate } from './format';

export const activityLogLabels: { [type: string]: string } = {
  TransactionLog: 'New Transaction',
  UpdateByItemPriceLog: 'Price Update',
  ScheduleLessonItemLog: 'Lesson Scheduled',
  CancelScheduleLessonItemLog: 'Lesson Canceled',
  ReleaseItemFundsLog: 'Funds Released',
  CancelReleaseItemFundsLog: 'Reverse Funds Release',
  VoidItemLog: 'Void',
  CancelVoidItemLog: 'Reverse Void',
  NewLessonItemLog: 'New Lesson',
  NewCourseItemLog: 'New Course',
  SetItemRegionLog: 'Region Change',
};

export const parseSlotId = (slotId: string) => {
  const parts = slotId.split(':');
  return {
    instructorId: parseInt(parts[0]),
    timestamp: parseInt(parts[1]),
    address: parseInt(parts[2]),
    studentId: parseInt(parts[3]),
  };
};

export const getActivitySummary = (row: ActivityLog) => {
  let start: string;

  switch (row.type) {
    case 'TransactionLog':
      start = `${row.category} ${formatCentsToDollars(row.cents)}`;
      break;
    case 'UpdateByItemPriceLog':
      start = `${
        row.centsDiff > 0 ? 'Added' : 'Subtracted'
      } ${formatCentsToDollars(row.centsDiff)}`;
      break;
    case 'ScheduleLessonItemLog':
      start = formatDate(new Date(parseSlotId(row.slotId).timestamp));
      break;
    // case 'CancelScheduleLessonItemLog':
    //   start = formatDate(new Date(parseSlotId(row.slotId).timestamp));
    //   break;
    // case 'ReleaseItemFundsLog':
    //   start = `Funds released`;
    //   break;
    // case 'CancelReleaseItemFundsLog':
    //   start = `Reverse funds release`;
    //   break;
    // case 'VoidItemLog':
    //   start = `Voided`;
    //   break;
    // case 'CancelVoidItemLog':
    //   start = `Reverse void`;
    //   break;
    // case 'NewLessonItemLog':
    //   start = `New lesson`;
    //   break;
    // case 'NewCourseItemLog':
    //   start = `New course`;
    //   break;
    // case 'SetItemRegionLog':
    //   start = `Region changed`;
    //   break;
  }

  if (start) {
    return `${start} - ${row.note}`;
  }

  return row.note;
};
