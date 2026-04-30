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
