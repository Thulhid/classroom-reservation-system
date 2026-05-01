import { getAdminApiGuard } from "@/features/shared/lib/adminAccess";
import {
  getAdminUserValidationMessage,
  parseAdminUserPayload,
} from "@/features/users/validators/adminUserFormSchema";
import {
  AdminUserServiceError,
  deleteAdminUser,
  updateAdminUser,
} from "@/features/users/services/adminUserService";

export const runtime = "nodejs";

type AdminUserRouteContext = {
  params: Promise<{
    userId: string;
  }>;
};

function getAdminUserErrorResponse(error: unknown, fallbackMessage: string) {
  if (error instanceof AdminUserServiceError) {
    return Response.json({ message: error.message }, { status: error.status });
  }

  return Response.json({ message: fallbackMessage }, { status: 500 });
}

export async function PUT(
  request: Request,
  { params }: AdminUserRouteContext,
) {
  const guard = await getAdminApiGuard("Only admins can manage user accounts.");

  if (!guard.ok) {
    return guard.response;
  }

  const { userId } = await params;
  const body = await request.json().catch(() => null);
  const parsed = parseAdminUserPayload(body);

  if (!parsed.success) {
    return Response.json(
      { message: getAdminUserValidationMessage(parsed.error) },
      { status: 400 },
    );
  }

  try {
    const user = await updateAdminUser(userId, parsed.data);

    return Response.json({
      user,
      message: "User account updated successfully.",
    });
  } catch (error) {
    return getAdminUserErrorResponse(error, "Could not update user account.");
  }
}

export async function DELETE(
  _request: Request,
  { params }: AdminUserRouteContext,
) {
  const guard = await getAdminApiGuard("Only admins can manage user accounts.");

  if (!guard.ok) {
    return guard.response;
  }

  const { userId } = await params;

  try {
    const user = await deleteAdminUser(userId);

    return Response.json({
      user,
      message: "User account deleted successfully.",
    });
  } catch (error) {
    return getAdminUserErrorResponse(error, "Could not delete user account.");
  }
}
