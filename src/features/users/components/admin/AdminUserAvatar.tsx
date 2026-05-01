import { UserRound } from "lucide-react";

import CloudinaryImage from "@/features/shared/components/CloudinaryImage";
import { cn } from "@/lib/utils";

type AdminUserAvatarProps = {
  firstName: string;
  lastName: string;
  image?: string | null;
  size?: "sm" | "lg";
};

function getInitials(firstName: string, lastName: string) {
  return `${firstName.at(0) ?? ""}${lastName.at(0) ?? ""}`.toUpperCase();
}

export default function AdminUserAvatar({
  firstName,
  lastName,
  image,
  size = "sm",
}: AdminUserAvatarProps) {
  const fullName = `${firstName} ${lastName}`.trim();
  const initials = getInitials(firstName, lastName);
  const sizeClassName = size === "lg" ? "size-20 text-2xl" : "size-11 text-sm";
  const iconSize = size === "lg" ? 32 : 18;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-full bg-sky-100 font-semibold text-sky-700 ring-4 ring-sky-50",
        sizeClassName,
      )}
    >
      {image ? (
        <CloudinaryImage
          src={image}
          alt={fullName ? `${fullName} profile photo` : "Profile photo"}
          fill
          crop={{
            type: "thumb",
            gravity: "face",
          }}
          format="webp"
          quality="auto"
          sizes={size === "lg" ? "80px" : "44px"}
          className="object-cover"
        />
      ) : initials ? (
        <span>{initials}</span>
      ) : (
        <UserRound size={iconSize} />
      )}
    </div>
  );
}
