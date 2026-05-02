export default function AuthContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 lg:flex-row">
      <div className="hidden min-h-56 bg-[url(/login/login-bg.jpg)] bg-cover bg-center sm:min-h-72 lg:inline-block lg:min-h-screen lg:w-1/3">
        <div className="flex h-full flex-col items-center justify-center bg-sky-700/60 px-5 py-10 sm:px-8 sm:py-12">
          <div className="w-full max-w-md">
            <h1 className="mb-5 text-center text-2xl font-semibold text-slate-50 sm:mb-8 sm:text-3xl">
              Smart <strong className="text-sky-400">Classroom</strong> Booking
              System
            </h1>
            <p className="text-center text-sm leading-6 text-slate-200 sm:text-base lg:text-left">
              reserve classroom easily, manage schedules efficiently, and make
              the most of your campus resources.
            </p>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
