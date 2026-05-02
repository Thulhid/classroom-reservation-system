import ForgotPasswordForm from "@/features/forgot-password/components/ForgotPasswordForm";
import AuthContainer from "@/features/shared/components/AuthContainer";

export default function Page() {
  return (
    <AuthContainer>
      <ForgotPasswordForm />
    </AuthContainer>
  );
}
