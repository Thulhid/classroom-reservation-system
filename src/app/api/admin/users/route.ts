import { getAdminApiGuard } from "@/features/admin/lib/adminAccess";
import {
  getAdminCreateUserValidationMessage,
  parseAdminCreateUserPayload,
} from "@/features/admin/users/validators/adminUserFormSchema";
import {
  AdminUserServiceError,
  createAdminUser,
} from "@/features/admin/users/services/adminUserService";

export const runtime = "nodejs";

function getAdminUserErrorResponse(error: unknown, fallbackMessage: string) {
  if (error instanceof AdminUserServiceError) {
    return Response.json({ message: error.message }, { status: error.status });
  }

  return Response.json({ message: fallbackMessage }, { status: 500 });
}

export async function POST(request: Request) {
  const guard = await getAdminApiGuard("Only admins can manage user accounts.");

  if (!guard.ok) {
    return guard.response;
  }

  const body = await request.json().catch(() => null);
  const parsed = parseAdminCreateUserPayload(body);

  if (!parsed.success) {
    return Response.json(
      { message: getAdminCreateUserValidationMessage(parsed.error) },
      { status: 400 },
    );
  }

  try {
    const user = await createAdminUser(parsed.data);

    return Response.json(
      {
        user,
        message: "User account created successfully.",
      },
      { status: 201 },
    );
  } catch (error) {
    return getAdminUserErrorResponse(error, "Could not create user account.");
  }
}
