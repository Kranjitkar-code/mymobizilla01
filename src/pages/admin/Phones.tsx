import { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SupabasePhonesService, { PhoneModelRow } from '@/services/supabasePhonesService';
import initializeSupabaseSchema from '@/utils/initializeSupabase';

export default function AdminPhones() {
  const isLoggedIn = useMemo(() => {
    const loggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    const token = localStorage.getItem('adminToken');
    return loggedIn && !!token;
  }, []);

  if (!isLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  const [models, setModels] = useState<PhoneModelRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [brand, setBrand] = useState('');
  const [modelName, setModelName] = useState('');
  const [price, setPrice] = useState<string>('');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [schemaMsg, setSchemaMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const loadAll = async () => {
    setLoading(true);
    try {
      const rows = await SupabasePhonesService.getAllModels();
      setModels(rows || []);
    } catch (err) {
      console.error('Failed to load phone models', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const handleAdd = async () => {
    if (!brand || !modelName) {
      setStatusMsg('Please enter brand and model');
      return;
    }

    const file = fileRef.current?.files?.[0];
    setStatusMsg('Adding...');

    const base_price = price ? parseFloat(price) : undefined;
    const res = await SupabasePhonesService.addModel(brand.trim(), modelName.trim(), file, base_price);

    if (res.success) {
      setStatusMsg('Phone model added');
      setBrand('');
      setModelName('');
      setPrice('');
      if (fileRef.current) fileRef.current.value = '';
      await loadAll();
    } else {
      setStatusMsg('Failed to add: ' + (res.error?.message || JSON.stringify(res.error)));
    }

    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleEnsureSchema = async () => {
    setSchemaMsg('Checking Supabase schema...');
    const res = await initializeSupabaseSchema();
    if (res.success) {
      setSchemaMsg(res.message || 'Supabase schema ready.');
    } else {
      setSchemaMsg(res.message || 'Could not verify schema. Check console for SQL.');
    }
    setTimeout(() => setSchemaMsg(null), 5000);
  };

  const groupedByBrand = useMemo(() => {
    const map = new Map<string, PhoneModelRow[]>();
    for (const item of models) {
      const key = item.brand;
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(item);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [models]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Helmet>
        <title>Phone Models — Admin | Mobizilla</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Phone Catalog Manager</h1>
            <p className="text-sm text-slate-600 mt-1">Add upcoming launches so they surface instantly on the Browse by Brand grid.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEnsureSchema}>Ensure Supabase Schema</Button>
            <Button variant="outline" onClick={loadAll}>Refresh</Button>
          </div>
        </div>

        {schemaMsg && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            {schemaMsg}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>Add New Phone Model</CardTitle>
              <CardDescription>Boost conversions by pre-listing launch-day devices from your suppliers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs uppercase tracking-wide">Brand</Label>
                  <Input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Samsung" className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wide">Model Name</Label>
                  <Input value={modelName} onChange={(e) => setModelName(e.target.value)} placeholder="e.g. Galaxy S24 Ultra" className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wide">Base Price (optional)</Label>
                  <Input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 89999" className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wide">Photo (optional)</Label>
                  <input ref={fileRef} type="file" accept="image/*" className="mt-1 text-sm" />
                  <p className="text-xs text-muted-foreground mt-1">Square PNG/WebP works best. Max 1MB recommended.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleAdd}>Add Phone</Button>
                <Button variant="outline" onClick={() => {
                  setBrand('');
                  setModelName('');
                  setPrice('');
                  if (fileRef.current) fileRef.current.value = '';
                }}>Clear</Button>
              </div>
              {statusMsg && <div className="text-sm text-slate-600">{statusMsg}</div>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Workflow Tips</CardTitle>
              <CardDescription>Operate like a Filament panel – fast edits, instant feedback.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <p>• Added phones jump to the front of the Browse grid so users see launches immediately.</p>
              <p>• Photos land in the <Badge variant="outline" className="px-2 py-0.5">phone-models</Badge> storage bucket.</p>
              <p>• Use <code className="bg-slate-100 px-1 rounded">initializeSupabaseSchema()</code> from console if tables are missing.</p>
              <p>• Need to tweak copy? The Content tab in the main dashboard now saves directly to Supabase.</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Brand Inventory</CardTitle>
                <CardDescription>{loading ? 'Syncing from Supabase…' : `Tracking ${models.length} devices across ${groupedByBrand.length} brands.`}</CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">Supabase synced</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-10 text-center text-sm text-muted-foreground">Loading device catalog…</div>
            ) : models.length === 0 ? (
              <div className="py-10 text-center text-sm text-muted-foreground">No phone models found yet. Add your first launch above.</div>
            ) : (
              <div className="space-y-6">
                {groupedByBrand.map(([brandName, entries]) => (
                  <div key={brandName} className="border border-slate-100 rounded-lg">
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
                      <div className="font-semibold text-slate-900">{brandName}</div>
                      <div className="text-xs text-slate-500">{entries.length} models</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                      {entries.map((entry) => (
                        <div key={entry.id} className="rounded-lg border border-slate-100 bg-white p-3 shadow-sm">
                          <div className="flex items-start gap-3">
                            <div className="w-16 h-16 rounded-md bg-slate-100 flex items-center justify-center overflow-hidden">
                              {entry.image_url ? (
                                <img src={entry.image_url} alt={entry.model} className="w-full h-full object-contain" />
                              ) : (
                                <span className="text-[11px] text-slate-400">No Image</span>
                              )}
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="text-sm font-medium text-slate-900">{entry.model}</div>
                              <div className="text-xs text-slate-500">{entry.base_price ? `Starting ₨${entry.base_price}` : 'Price TBD'}</div>
                              <div className="text-[11px] text-slate-400">Added {entry.created_at ? new Date(entry.created_at).toLocaleDateString() : 'recently'}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
