"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function DriverLoginRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return null;
}
