import { useEffect, useState } from 'react';
import { SupabaseContactService, type ContactMessageRow } from '@/services/supabaseContactService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Loader2, Mail, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const INTEREST_COLORS: Record<string, string> = {
  'Device Repair': 'bg-blue-100 text-blue-700',
  'BuyBack Program': 'bg-green-100 text-green-700',
  'Technical Training': 'bg-purple-100 text-purple-700',
  'Device Sales': 'bg-amber-100 text-amber-700',
  'Warranty Support': 'bg-orange-100 text-orange-700',
  'General Inquiry': 'bg-gray-100 text-gray-700',
};

const ContactMessagesPage = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ContactMessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMsg, setSelectedMsg] = useState<ContactMessageRow | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    const data = await SupabaseContactService.getAllMessages();
    setMessages(data);
    setLoading(false);
  };

  const handleRowClick = async (msg: ContactMessageRow) => {
    setSelectedMsg(msg);
    if (msg.status === 'unread') {
      try {
        await SupabaseContactService.markAsRead(msg.id);
        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, status: 'read' } : m));
      } catch {
        toast({ title: 'Failed to mark as read', variant: 'destructive' });
      }
    }
  };

  const filtered = messages.filter(m => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (m.name || '').toLowerCase().includes(q) ||
      (m.email || '').toLowerCase().includes(q) ||
      (m.phone || '').toLowerCase().includes(q) ||
      (m.interest || '').toLowerCase().includes(q) ||
      (m.message || '').toLowerCase().includes(q)
    );
  });

  const unreadCount = messages.filter(m => m.status === 'unread').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contact Messages</h1>
          <p className="text-muted-foreground">Messages from the contact form</p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Badge className="bg-orange-100 text-orange-700">{unreadCount} unread</Badge>
          )}
          <Badge variant="outline" className="text-sm">{messages.length} total</Badge>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, phone..."
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
          <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {messages.length === 0 ? 'No messages yet' : 'No matching messages'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {messages.length === 0
              ? 'Messages will appear here when customers submit the contact form.'
              : 'Try a different search term.'}
          </p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Status</TableHead>
                <TableHead className="w-[110px]">Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Interest</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(msg => {
                const isUnread = msg.status === 'unread';
                const interestColor = INTEREST_COLORS[msg.interest] || 'bg-gray-100 text-gray-700';
                return (
                  <TableRow
                    key={msg.id}
                    className={`cursor-pointer hover:bg-muted/50 ${isUnread ? 'font-medium bg-orange-50/30' : ''}`}
                    onClick={() => handleRowClick(msg)}
                  >
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs ${isUnread ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-gray-50 text-gray-400 border-gray-200'}`}
                      >
                        {isUnread ? 'New' : 'Read'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(msg.created_at).toLocaleDateString()}<br />
                      <span className="text-[10px]">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </TableCell>
                    <TableCell className={isUnread ? 'font-semibold' : ''}>{msg.name}</TableCell>
                    <TableCell className="text-sm">{msg.phone}</TableCell>
                    <TableCell className="text-sm">{msg.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`text-xs ${interestColor}`}>
                        {msg.interest}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[250px] truncate">
                      {msg.message}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!selectedMsg} onOpenChange={(open) => { if (!open) setSelectedMsg(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Message from {selectedMsg?.name}</DialogTitle>
          </DialogHeader>
          {selectedMsg && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-400 text-xs">Name</span>
                  <p className="font-medium">{selectedMsg.name}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-xs">Phone</span>
                  <p className="font-medium">{selectedMsg.phone || '—'}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-xs">Email</span>
                  <p className="font-medium">{selectedMsg.email}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-xs">Interest</span>
                  <Badge variant="secondary" className={`text-xs ${INTEREST_COLORS[selectedMsg.interest] || ''}`}>
                    {selectedMsg.interest}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-400 text-xs">Date</span>
                  <p className="font-medium">{new Date(selectedMsg.created_at).toLocaleString()}</p>
                </div>
              </div>
              <div>
                <span className="text-gray-400 text-xs">Message</span>
                <div className="mt-1 p-4 bg-gray-50 rounded-lg text-sm whitespace-pre-wrap">{selectedMsg.message}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactMessagesPage;
