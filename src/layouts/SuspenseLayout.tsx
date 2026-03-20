import React, { Suspense } from 'react';

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-pulse text-primary">Loading...</div>
  </div>
);

interface LayoutProps {
  children: React.ReactNode;
}

export default function SuspenseLayout({ children }: LayoutProps) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      {children}
    </Suspense>
  );
}
