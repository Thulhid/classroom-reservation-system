import LoginForm from "@/features/login/components/LoginForm";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 lg:flex-row">
      <div className="min-h-70 bg-[url(/login/login-bg.jpg)] bg-cover bg-center lg:min-h-screen lg:w-1/3">
        <div className="flex h-full flex-col items-center justify-center bg-sky-700/60 px-8 py-12">
          <div className="w-full max-w-md">
            <h1 className="mb-10 text-center text-3xl font-semibold text-slate-50">
              Smart <strong className="text-sky-400">Classroom</strong> Booking
              System
            </h1>
            <p className="text-slate-200">
              reserve classroom easily, manage schedules efficiently, and make
              the most of your campus resources.
            </p>
          </div>
        </div>
      </div>
      <LoginForm />
    </div>
  );
}
