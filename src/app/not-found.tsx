import Link from "next/link";
import { Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-sky-100 text-sky-600">
          <SearchX size={38} />
        </div>

        <p className="mt-8 text-sm font-semibold tracking-[0.3em] text-sky-600 uppercase">
          404 Error
        </p>

        <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-5xl">
          Page not found
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
          The page you are trying to access does not exist or may have been
          moved. Please return to the dashboard or go back to the previous page.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700"
          >
            <Home size={18} />
            Go to Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
