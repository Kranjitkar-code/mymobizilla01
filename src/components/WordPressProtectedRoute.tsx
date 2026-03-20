import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useWordPressAuth } from '@/contexts/WordPressAuthContext';
import { Loader2 } from 'lucide-react';

interface WordPressProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

export default function WordPressProtectedRoute({ 
  children, 
  adminOnly = false 
}: WordPressProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useWordPressAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    } else if (!isLoading && isAuthenticated && adminOnly && !user?.roles?.includes('administrator')) {
      router.push('/admin/unauthorized');
    }
  }, [isAuthenticated, isLoading, router, adminOnly, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || (adminOnly && !user?.roles?.includes('administrator'))) {
    return null;
  }

  return <>{children}</>;
}
