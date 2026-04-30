"use client";

import { useState } from "react";

export function useShowPassword() {
  const [IsEyeOpen, setIsEyeOpen] = useState(false);
  return { IsEyeOpen, setIsEyeOpen };
}
