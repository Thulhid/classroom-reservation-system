import { ManagedUserRole } from "../types/AdminTypes";

export const ADMIN_USERS_PAGE_SIZE = 10;

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
