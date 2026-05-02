function Empty({ resourceName }: { resourceName: string }) {
  return (
    <p className="mt-5 rounded-lg bg-white p-5 text-center text-sm text-slate-800 shadow sm:p-6 sm:text-base">
      No {resourceName} could be found!
    </p>
  );
}

export default Empty;
