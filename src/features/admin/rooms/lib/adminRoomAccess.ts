import {
  getAdminApiGuard as getSharedAdminApiGuard,
  isAdminUser,
  requireAdminUser,
} from "@/features/admin/lib/adminAccess";

export { isAdminUser, requireAdminUser };

export function getAdminApiGuard() {
  return getSharedAdminApiGuard("Only admins can manage rooms.");
}
