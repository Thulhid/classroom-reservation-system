export const MANAGED_USER_ROLES = ["STUDENT", "TEACHER"] as const;

export type ManagedUserRole = (typeof MANAGED_USER_ROLES)[number];
export const ADMIN_USERS_PAGE_SIZE = 10;

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

export function getManagedUserLabel(role: ManagedUserRole) {
  return role === "TEACHER" ? "Teacher" : "Student";
}

export function getManagedUsersRouteSegment(role: ManagedUserRole) {
  return role === "TEACHER" ? "teachers" : "students";
}

export function getManagedUsersRoute(role: ManagedUserRole) {
  return `/admin/users/${getManagedUsersRouteSegment(role)}`;
}

export function getManagedUserSearchPlaceholder(role: ManagedUserRole) {
  return role === "TEACHER"
    ? "Search teachers by name, university ID, or email"
    : "Search students by name, university ID, or email";
}

export function getManagedUsersCountLabel(count: number) {
  return `accounts: ${count}`;
}
