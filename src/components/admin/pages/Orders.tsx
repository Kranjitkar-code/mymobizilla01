import { useEffect, useState } from 'react';
import { SupabaseOrdersService, type OrderRow } from '@/services/supabaseOrdersService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Package, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const STATUS_OPTIONS = ['pending', 'in_progress', 'ready', 'completed', 'cancelled'] as const;

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  pending: { color: 'text-gray-700', bg: 'bg-gray-100', label: 'Pending' },
  in_progress: { color: 'text-blue-700', bg: 'bg-blue-100', label: 'In Progress' },
  ready: { color: 'text-green-700', bg: 'bg-green-100', label: 'Ready' },
  completed: { color: 'text-emerald-800', bg: 'bg-emerald-100', label: 'Completed' },
  cancelled: { color: 'text-red-700', bg: 'bg-red-100', label: 'Cancelled' },
};

const FILTER_CHIPS: { key: 'all' | typeof STATUS_OPTIONS[number]; label: string }[] = [
  { key: 'all', label: 'All' },
  ...STATUS_OPTIONS.map((s) => ({ key: s, label: STATUS_CONFIG[s].label })),
];

function telHref(phone: string): string {
  const d = phone.replace(/\D/g, '');
  const n = d.startsWith('977') ? `+${d}` : `+977${d}`;
  return `tel:${n}`;
}

function whatsappHref(phone: string, message: string): string {
  const d = phone.replace(/\D/g, '');
  const n = d.startsWith('977') && d.length > 3 ? d : `977${d}`;
  return `https://wa.me/${n}?text=${encodeURIComponent(message)}`;
}

function issueTokens(issues: string | null | undefined): string[] {
  if (!issues?.trim()) return [];
  return issues
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

const OrdersPage = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<(typeof FILTER_CHIPS)[number]['key']>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<OrderRow | null>(null);
  const [panelNotes, setPanelNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    if (selected) {
      setPanelNotes(selected.admin_notes ?? '');
    }
  }, [selected]);

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
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
      setSelected((prev) => (prev && prev.id === orderId ? { ...prev, status: newStatus } : prev));
      toast({
        title: 'Status updated',
        description: `Order status changed to ${STATUS_CONFIG[newStatus]?.label || newStatus}`,
      });
    } catch (e: unknown) {
      const err = e as { message?: string };
      toast({ title: 'Update failed', description: err?.message || 'Could not update order status.', variant: 'destructive' });
    } finally {
      setUpdatingId(null);
    }
  };

  const saveAdminNotes = async () => {
    if (!selected) return;
    setSavingNotes(true);
    try {
      await SupabaseOrdersService.updateOrderFields(selected.id, { admin_notes: panelNotes });
      setOrders((prev) =>
        prev.map((o) => (o.id === selected.id ? { ...o, admin_notes: panelNotes } : o)),
      );
      setSelected({ ...selected, admin_notes: panelNotes });
      toast({ title: 'Saved', description: 'Admin notes updated.' });
    } catch (e: unknown) {
      const err = e as { message?: string };
      toast({ title: 'Save failed', description: err?.message || 'Could not save notes.', variant: 'destructive' });
    } finally {
      setSavingNotes(false);
    }
  };

  const filtered = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
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

  const waMessage = (o: OrderRow) =>
    `Namaste ${o.customer_name}! Regarding your ${o.device_brand} ${o.device_model} repair (Ref: ${o.booking_ref}). `;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">All repair and buyback bookings from customers</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {orders.length} total
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTER_CHIPS.map((chip) => (
          <button
            key={chip.key}
            type="button"
            onClick={() => setStatusFilter(chip.key)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm font-medium transition-colors',
              statusFilter === chip.key
                ? 'border-blue-600 bg-blue-600 text-white'
                : 'border-border bg-background text-muted-foreground hover:bg-muted/60',
            )}
          >
            {chip.label}
          </button>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, phone, ref, brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
              : 'Try a different search term or filter.'}
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
              {filtered.map((order) => {
                const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                return (
                  <TableRow
                    key={order.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelected(order)}
                  >
                    <TableCell className="font-mono font-semibold text-purple-700">{order.booking_ref}</TableCell>
                    <TableCell className="font-medium">{order.customer_name}</TableCell>
                    <TableCell className="text-sm">{order.customer_phone}</TableCell>
                    <TableCell className="text-sm">
                      {order.device_brand} {order.device_model}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Badge variant="outline" className="text-xs capitalize">
                        {order.service_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {order.issues}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Select
                        value={order.status}
                        onValueChange={(val) => handleStatusChange(order.id, val)}
                        disabled={updatingId === order.id}
                      >
                        <SelectTrigger className={`h-8 text-xs font-medium ${sc.bg} ${sc.color} border-0`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((s) => (
                            <SelectItem key={s} value={s} className="text-xs">
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

      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="text-2xl font-bold font-mono text-purple-700">
                  {selected.booking_ref}
                </SheetTitle>
                <SheetDescription>Booking reference</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-5 text-sm">
                <div>
                  <h4 className="font-semibold text-base mb-2">Customer</h4>
                  <p className="font-medium">{selected.customer_name}</p>
                  <p className="text-muted-foreground">{selected.customer_email}</p>
                  <p className="text-muted-foreground">{selected.customer_phone}</p>
                  {selected.customer_address && (
                    <p className="text-muted-foreground mt-1">{selected.customer_address}</p>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold text-base mb-1">Device</h4>
                  <p>
                    {selected.device_brand} {selected.device_model}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-base mb-2">Service type</h4>
                  <Badge variant="outline" className="capitalize">
                    {selected.service_type}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-semibold text-base mb-2">Issues</h4>
                  <div className="flex flex-wrap gap-1">
                    {issueTokens(selected.issues).map((t) => (
                      <Badge key={t} variant="secondary" className="text-xs font-normal">
                        {t}
                      </Badge>
                    ))}
                    {issueTokens(selected.issues).length === 0 && (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </div>
                </div>

                {selected.additional_details && (
                  <div>
                    <h4 className="font-semibold text-base mb-1">Additional details</h4>
                    <p className="text-muted-foreground whitespace-pre-wrap">{selected.additional_details}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-base mb-1">Submitted</h4>
                  <p>{new Date(selected.created_at).toLocaleString()}</p>
                </div>

                <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                  <Label>Status</Label>
                  <Select
                    value={selected.status}
                    onValueChange={(val) => handleStatusChange(selected.id, val)}
                    disabled={updatingId === selected.id}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {STATUS_CONFIG[s].label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-notes">Admin notes</Label>
                  <Textarea
                    id="admin-notes"
                    rows={5}
                    value={panelNotes}
                    onChange={(e) => setPanelNotes(e.target.value)}
                    placeholder="Internal notes (not shown to customer)"
                  />
                  <Button type="button" size="sm" onClick={saveAdminNotes} disabled={savingNotes}>
                    {savingNotes ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save notes'}
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={telHref(selected.customer_phone)}>📞 Call Customer</a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={whatsappHref(selected.customer_phone, waMessage(selected))}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default OrdersPage;
