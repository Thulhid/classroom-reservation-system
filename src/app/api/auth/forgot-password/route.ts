import {
  ForgotPasswordServiceError,
  requestForgotPasswordPin,
  resetForgottenPassword,
} from "@/features/forgot-password/services/forgotPasswordService";

export const runtime = "nodejs";

function getForgotPasswordErrorResponse(
  error: unknown,
  fallbackMessage: string,
) {
  if (error instanceof ForgotPasswordServiceError) {
    return Response.json({ message: error.message }, { status: error.status });
  }

  return Response.json({ message: fallbackMessage }, { status: 500 });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  try {
    const result = await requestForgotPasswordPin(body);

    return Response.json(result);
  } catch (error) {
    return getForgotPasswordErrorResponse(
      error,
      "Could not send password reset PIN.",
    );
  }
}

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null);

  try {
    const result = await resetForgottenPassword(body);

    return Response.json(result);
  } catch (error) {
    return getForgotPasswordErrorResponse(
      error,
      "Could not reset password.",
    );
  }
}
