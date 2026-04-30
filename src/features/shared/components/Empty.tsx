function Empty({ resourceName }: { resourceName: string }) {
  return (
    <p className="mt-5 bg-white p-6 text-center text-xs text-slate-800 shadow sm:text-base">
      No {resourceName} could be found!
    </p>
  );
}

export default Empty;
