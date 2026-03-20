import { Helmet } from "react-helmet-async";
import { useQuery } from '@tanstack/react-query';
import { collection, getCountFromServer, query, where } from 'firebase/firestore';
import { db, collections } from '@/lib/firebase';
import { useRealtimeCollection } from '@/hooks/useFirestore';
import { useState } from 'react';

interface DashboardStats {
  totalSales: number;
  activeOrders: number;
  totalProducts: number;
  lowStockItems: number;
}

interface Activity {
  id: string;
  type: 'order' | 'stock' | 'user' | 'system';
  message: string;
  timestamp: Date;
  read?: boolean;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    activeOrders: 0,
    totalProducts: 0,
    lowStockItems: 0,
  });
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);

  // Fetch dashboard stats
  const { isLoading } = useQuery<DashboardStats, Error>({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      const [productsSnapshot, ordersSnapshot] = await Promise.all([
        getCountFromServer(collection(db, collections.products)),
        getCountFromServer(
          query(
            collection(db, collections.orders),
            where('status', 'in', ['pending', 'processing', 'shipped'])
          )
        ),
      ]);

      // In a real app, you would calculate these values from your orders collection
      const result: DashboardStats = {
        totalSales: 0, // TODO: Calculate from orders
        activeOrders: ordersSnapshot.data().count,
        totalProducts: productsSnapshot.data().count,
        lowStockItems: 0, // TODO: Calculate products with low stock
      };

      setStats(result);
      return result;
    },
  });

  // Subscribe to real-time activities
  useRealtimeCollection<Activity>(
    'activities',
    (activities) => {
      setRecentActivities(activities);
    },
    {
      limitCount: 5,
      orderByField: 'timestamp',
      orderDirection: 'desc',
    }
  );

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'order':
        return '🛒';
      case 'stock':
        return '📦';
      case 'user':
        return '👤';
      default:
        return 'ℹ️';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = Math.floor(seconds / 31536000);

    if (interval >= 1) return `${interval} year${interval === 1 ? '' : 's'} ago`;
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval} month${interval === 1 ? '' : 's'} ago`;
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} day${interval === 1 ? '' : 's'} ago`;
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval} hour${interval === 1 ? '' : 's'} ago`;
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval} minute${interval === 1 ? '' : 's'} ago`;
    return 'Just now';
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Helmet>
        <title>Dashboard — Admin | Mobizilla</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Sales */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Total Sales</h3>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v20m-8-8h16m-4-8 4 4-4 4m-8 0-4-4 4-4" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold mt-4">₨{stats.totalSales.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="text-green-500">+12%</span> from last month
          </p>
        </div>

        {/* Active Orders */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Active Orders</h3>
            <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold mt-4">{stats.activeOrders}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {stats.activeOrders > 0 ? `${stats.activeOrders} pending` : 'No pending orders'}
          </p>
        </div>

        {/* Products */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Products</h3>
            <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold mt-4">{stats.totalProducts}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {stats.lowStockItems > 0 ? (
              <span className="text-amber-500">{stats.lowStockItems} low in stock</span>
            ) : (
              'All products in stock'
            )}
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <button className="text-sm text-primary hover:underline">View All</button>
        </div>
        <div className="space-y-4">
          {isLoading ? (
            Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="animate-pulse flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              ))
          ) : recentActivities.length > 0 ? (
            recentActivities.map((activity) => (
              <div
                key={activity.id}
                className={`flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors ${
                  !activity.read ? 'bg-muted/20' : ''
                }`}
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    {getActivityIcon(activity.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{activity.message}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatTimeAgo(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
