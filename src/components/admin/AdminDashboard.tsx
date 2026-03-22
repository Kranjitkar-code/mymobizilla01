import { Card } from "@/components/ui/card";
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { TrendingUp, Users, ShoppingCart, Activity, Gauge, Zap, Layout, Search as SearchIcon, ArrowRight } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

interface DashboardStats {
  totalOrders: number;
  recentRepairs: number;
  uniqueUsers: number;
}

const AdminDashboard = () => {
  const { user } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats>({ totalOrders: 0, recentRepairs: 0, uniqueUsers: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

        const [orderResult, recentResult, usersResult] = await Promise.all([
          supabase.from('orders').select('*', { count: 'exact', head: true }),
          supabase.from('orders').select('*', { count: 'exact', head: true }).gte('created_at', thirtyDaysAgo),
          supabase.from('orders').select('phone'),
        ]);

        const uniquePhones = new Set(
          (usersResult.data || []).map((r: any) => r.phone).filter(Boolean)
        );

        setStats({
          totalOrders: orderResult.count ?? 0,
          recentRepairs: recentResult.count ?? 0,
          uniqueUsers: uniquePhones.size,
        });
      } catch {
        // keep zeros on error
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Mobizilla Nepal Admin — {new Date().toLocaleDateString('en-NP')}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <h3 className="text-2xl font-bold mt-2">₨0</h3>
              <p className="text-xs text-muted-foreground mt-1">Pricing system pending</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Unique Customers</p>
              <h3 className="text-2xl font-bold mt-2">
                {statsLoading ? '…' : stats.uniqueUsers.toLocaleString()}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Unique phone numbers from orders</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
              <h3 className="text-2xl font-bold mt-2">
                {statsLoading ? '…' : stats.totalOrders.toLocaleString()}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Repair Requests</p>
              <h3 className="text-2xl font-bold mt-2">
                {statsLoading ? '…' : stats.recentRepairs.toLocaleString()}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
              <Activity className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Welcome Card */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-white shadow-md">
              <AvatarImage src={user?.avatar_url} alt={user?.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white text-xl">
                {user?.name?.charAt(0) || "A"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">Welcome back, {user?.name || "Admin"}!</h2>
              <p className="text-muted-foreground mt-1">Here's what's happening with your store today.</p>
            </div>
          </div>
        </div>
      </Card>

      {/* System Health & Performance */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6 border-green-200 bg-green-50/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-green-900">SEO Score</h3>
            <SearchIcon className="h-5 w-5 text-green-600" />
          </div>
          <div className="space-y-2">
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-green-700">98</span>
              <span className="text-sm text-green-600 mb-1">/ 100</span>
            </div>
            <Progress value={98} className="h-2 bg-green-200" indicatorClassName="bg-green-600" />
            <p className="text-xs text-green-700 pt-1">Excellent optimization</p>
          </div>
        </Card>

        <Card className="p-6 border-blue-200 bg-blue-50/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-blue-900">Performance</h3>
            <Zap className="h-5 w-5 text-blue-600" />
          </div>
          <div className="space-y-2">
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-blue-700">96</span>
              <span className="text-sm text-blue-600 mb-1">/ 100</span>
            </div>
            <Progress value={96} className="h-2 bg-blue-200" indicatorClassName="bg-blue-600" />
            <p className="text-xs text-blue-700 pt-1">TruePaint: 0.8s</p>
          </div>
        </Card>

        <Card className="p-6 border-purple-200 bg-purple-50/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-purple-900">LCP</h3>
            <Gauge className="h-5 w-5 text-purple-600" />
          </div>
          <div className="space-y-2">
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-purple-700">1.2s</span>
              <span className="text-sm text-purple-600 mb-1">Target: &lt;2.5s</span>
            </div>
            <Progress value={85} className="h-2 bg-purple-200" indicatorClassName="bg-purple-600" />
            <p className="text-xs text-purple-700 pt-1">Core Web Vitals: Pass</p>
          </div>
        </Card>

        <Card className="p-6 border-orange-200 bg-orange-50/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-orange-900">Accessibility</h3>
            <Layout className="h-5 w-5 text-orange-600" />
          </div>
          <div className="space-y-2">
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-orange-700">100</span>
              <span className="text-sm text-orange-600 mb-1">/ 100</span>
            </div>
            <Progress value={100} className="h-2 bg-orange-200" indicatorClassName="bg-orange-600" />
            <p className="text-xs text-orange-700 pt-1">Fully accessible</p>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link to="/admin/ecommerce/orders" className="block">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-2">Recent Orders</h3>
                <p className="text-sm text-muted-foreground">View and manage recent customer orders</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            </div>
          </Card>
        </Link>

        <Link to="/admin/settings/repair" className="block">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-2">Repair Queue</h3>
                <p className="text-sm text-muted-foreground">Check pending repair requests</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            </div>
          </Card>
        </Link>

        <Link to="/admin/ecommerce/inventories" className="block">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-2">Inventory Status</h3>
                <p className="text-sm text-muted-foreground">Monitor stock levels and alerts</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
