import { ShieldCheck } from "lucide-react";
import ProfilePhotoUploader from "./ProfilePhotoUploader";

export default function ProfileDetails({
  dbUserImage,
  userImage,
  initials,
  fullName,
  roleLabel,
  email,
}: {
  dbUserImage?: string | null;
  userImage?: string | null;
  initials: string;
  fullName: string;
  roleLabel: string;
  email?: string | null;
}) {
  return (
    <aside className="rounded-2xl bg-white p-5 shadow-xl sm:rounded-3xl sm:p-8">
      <div className="flex flex-col items-center text-center">
        <ProfilePhotoUploader
          image={dbUserImage ?? userImage}
          initials={initials}
          name={fullName}
        />

        <h2 className="mt-5 text-2xl font-semibold break-words text-slate-800">
          {fullName}
        </h2>
        <p className="mt-1 text-sm break-all text-slate-500">{email}</p>

        <div className="mt-4 flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
          <ShieldCheck size={16} className="text-sky-600" />
          {roleLabel}
        </div>
      </div>
    </aside>
  );
}
