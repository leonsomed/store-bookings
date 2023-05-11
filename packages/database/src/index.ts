export * from './client';
export * from './services';

export const parseSlotId = (slotId: string) => {
  const parts = slotId.split(':');
  return {
    instructorId: parseInt(parts[0]),
    timestamp: parseInt(parts[1]),
    address: parseInt(parts[2]),
    studentId: parseInt(parts[3]),
  };
};

export const createSlotId = (
  instructorId: string,
  timestamp: number,
  address: string,
  studentId: string
) => {
  return `${instructorId}:${timestamp}:${address}:${studentId}`;
};
