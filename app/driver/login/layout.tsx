import { Suspense } from 'react';

export default function DriverLoginLayout({ children }: { children: React.ReactNode }) {
  return <Suspense>{children}</Suspense>;
}
