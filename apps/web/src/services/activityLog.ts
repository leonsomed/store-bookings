import type { ActivityLog } from 'database';
import { formatCentsToDollars } from './format';

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
    // case 'ScheduleLessonItemLog':
    //   start = `${row.instructorId} ${row.slotId}`;
    //   break;
    // case 'CancelScheduleLessonItemLog':
    //   start = `Lesson canceled`;
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
