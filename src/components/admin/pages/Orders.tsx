import { useEffect, useState } from 'react';
import { SupabaseOrdersService, type OrderRow } from '@/services/supabaseOrdersService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Loader2, Package, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const STATUS_OPTIONS = ['pending', 'in_progress', 'ready', 'completed', 'cancelled'] as const;

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  pending:     { color: 'text-gray-700',    bg: 'bg-gray-100',    label: 'Pending' },
  in_progress: { color: 'text-blue-700',    bg: 'bg-blue-100',    label: 'In Progress' },
  ready:       { color: 'text-green-700',   bg: 'bg-green-100',   label: 'Ready' },
  completed:   { color: 'text-emerald-800', bg: 'bg-emerald-100', label: 'Completed' },
  cancelled:   { color: 'text-red-700',     bg: 'bg-red-100',     label: 'Cancelled' },
};

const OrdersPage = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const data = await SupabaseOrdersService.getAllOrders();
    setOrders(data);
    setLoading(false);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await SupabaseOrdersService.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast({ title: 'Status updated', description: `Order status changed to ${STATUS_CONFIG[newStatus]?.label || newStatus}` });
    } catch {
      toast({ title: 'Update failed', description: 'Could not update order status.', variant: 'destructive' });
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = orders.filter(o => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (o.booking_ref || '').toLowerCase().includes(q) ||
      (o.customer_name || '').toLowerCase().includes(q) ||
      (o.customer_phone || '').toLowerCase().includes(q) ||
      (o.device_brand || '').toLowerCase().includes(q) ||
      (o.device_model || '').toLowerCase().includes(q) ||
      (o.status || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">All repair and buyback bookings from customers</p>
        </div>
        <Badge variant="outline" className="text-sm">{orders.length} total</Badge>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, phone, ref, brand..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {orders.length === 0 ? 'No orders yet' : 'No matching orders'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {orders.length === 0
              ? 'Orders will appear here when customers submit repair or buyback requests.'
              : 'Try a different search term.'}
          </p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Booking Ref</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Issues</TableHead>
                <TableHead className="w-[160px]">Status</TableHead>
                <TableHead className="w-[110px]">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(order => {
                const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono font-semibold text-purple-700">{order.booking_ref}</TableCell>
                    <TableCell className="font-medium">{order.customer_name}</TableCell>
                    <TableCell className="text-sm">{order.customer_phone}</TableCell>
                    <TableCell className="text-sm">{order.device_brand} {order.device_model}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs capitalize">{order.service_type}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{order.issues}</TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(val) => handleStatusChange(order.id, val)}
                        disabled={updatingId === order.id}
                      >
                        <SelectTrigger className={`h-8 text-xs font-medium ${sc.bg} ${sc.color} border-0`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map(s => (
                            <SelectItem key={s} value={s} className="text-xs">
                              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${STATUS_CONFIG[s].bg.replace('bg-', 'bg-')}`} />
                              {STATUS_CONFIG[s].label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
