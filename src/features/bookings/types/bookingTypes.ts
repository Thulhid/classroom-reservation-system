export type BookingSummary = {
  canDelete: boolean;
  canEdit: boolean;
  id: string;
  roomId: string;
  roomName: string;
  purpose: string | null;
  startsAt: Date;
  endsAt: Date;
  teacherName: string;
};

export type BookingsPagination = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type TeacherBookingsPage = {
  bookings: BookingSummary[];
  pagination: BookingsPagination;
};

export type UpdateBookingPayload = {
  purpose: string;
  date: string;
  startTime: string;
  endTime: string;
};

export type CreateBookingPayload = UpdateBookingPayload & {
  roomId: string;
};

export type RoomAvailabilityMatrixCellStatus = "free" | "booked" | "mine";

export type RoomAvailabilityMatrixSlot = {
  date: string;
  endsAt: Date;
  endTime: string;
  label: string;
  startsAt: Date;
  startTime: string;
};

export type RoomAvailabilityMatrixCell = RoomAvailabilityMatrixSlot & {
  bookingId?: string;
  purpose?: string | null;
  status: RoomAvailabilityMatrixCellStatus;
  teacherName?: string;
};

export type RoomAvailabilityMatrixRow = {
  cells: RoomAvailabilityMatrixCell[];
  room: {
    capacity: number;
    floor: string;
    id: string;
    name: string;
    number: string;
  };
};

export type RoomAvailabilityMatrixData = {
  date: string;
  rows: RoomAvailabilityMatrixRow[];
  slots: RoomAvailabilityMatrixSlot[];
};
