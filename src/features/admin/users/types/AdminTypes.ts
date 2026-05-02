export const MANAGED_USER_ROLES = ["STUDENT", "TEACHER"] as const;

export type ManagedUserRole = (typeof MANAGED_USER_ROLES)[number];
export type AdminManagedUser = {
  id: string;
  role: ManagedUserRole;
  firstName: string;
  lastName: string;
  email: string;
  uniID: string;
  image: string | null;
  bookingCount: number;
};
