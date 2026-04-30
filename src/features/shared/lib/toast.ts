"use client";

import { toast } from "react-hot-toast";

export function showErrorToast(message: string) {
  toast.error(message);
}

export function showSuccessToast(message: string) {
  toast.success(message);
}
