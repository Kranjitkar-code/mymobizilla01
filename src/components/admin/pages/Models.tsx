import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Trash2, Loader2, Smartphone, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import SupabasePhonesService, { PhoneModelRow } from '@/services/supabasePhonesService';
import SupabaseBrandsService, { BrandRow } from '@/services/supabaseBrandsService';
import { SchemaHelpDialog } from "../SchemaHelpDialog";

const DEFAULT_MODELS = [
    // Apple
    { brand: 'Apple', model: 'iPhone 15 Pro Max', series: 'iPhone 15' },
    { brand: 'Apple', model: 'iPhone 15 Pro', series: 'iPhone 15' },
    { brand: 'Apple', model: 'iPhone 15 Plus', series: 'iPhone 15' },
    { brand: 'Apple', model: 'iPhone 15', series: 'iPhone 15' },
    { brand: 'Apple', model: 'iPhone 14 Pro Max', series: 'iPhone 14' },
    { brand: 'Apple', model: 'iPhone 14 Pro', series: 'iPhone 14' },
    { brand: 'Apple', model: 'iPhone 14 Plus', series: 'iPhone 14' },
    { brand: 'Apple', model: 'iPhone 14', series: 'iPhone 14' },
    { brand: 'Apple', model: 'iPhone 13 Pro Max', series: 'iPhone 13' },
    { brand: 'Apple', model: 'iPhone 13 Pro', series: 'iPhone 13' },
    { brand: 'Apple', model: 'iPhone 13', series: 'iPhone 13' },
    { brand: 'Apple', model: 'iPhone 13 Mini', series: 'iPhone 13' },
    { brand: 'Apple', model: 'iPhone 12 Pro Max', series: 'iPhone 12' },
    { brand: 'Apple', model: 'iPhone 12 Pro', series: 'iPhone 12' },
    { brand: 'Apple', model: 'iPhone 12', series: 'iPhone 12' },
    { brand: 'Apple', model: 'iPhone 12 Mini', series: 'iPhone 12' },
    { brand: 'Apple', model: 'iPhone 11 Pro Max', series: 'iPhone 11' },
    { brand: 'Apple', model: 'iPhone 11 Pro', series: 'iPhone 11' },
    { brand: 'Apple', model: 'iPhone 11', series: 'iPhone 11' },
    { brand: 'Apple', model: 'iPhone SE (2022)', series: 'SE' },
    { brand: 'Apple', model: 'iPhone SE (2020)', series: 'SE' },
    { brand: 'Apple', model: 'iPhone XS Max', series: 'X Series' },
    { brand: 'Apple', model: 'iPhone XS', series: 'X Series' },
    { brand: 'Apple', model: 'iPhone XR', series: 'X Series' },
    { brand: 'Apple', model: 'iPhone X', series: 'X Series' },
    { brand: 'Apple', model: 'iPhone 8 Plus', series: 'Legacy' },
    { brand: 'Apple', model: 'iPhone 8', series: 'Legacy' },

    // Samsung
    { brand: 'Samsung', model: 'Galaxy S24 Ultra', series: 'S Series' },
    { brand: 'Samsung', model: 'Galaxy S24+', series: 'S Series' },
    { brand: 'Samsung', model: 'Galaxy S24', series: 'S Series' },
    { brand: 'Samsung', model: 'Galaxy S23 Ultra', series: 'S Series' },
    { brand: 'Samsung', model: 'Galaxy S23+', series: 'S Series' },
    { brand: 'Samsung', model: 'Galaxy S23', series: 'S Series' },
    { brand: 'Samsung', model: 'Galaxy S22 Ultra', series: 'S Series' },
    { brand: 'Samsung', model: 'Galaxy S22+', series: 'S Series' },
    { brand: 'Samsung', model: 'Galaxy S22', series: 'S Series' },
    { brand: 'Samsung', model: 'Galaxy S21 Ultra', series: 'S Series' },
    { brand: 'Samsung', model: 'Galaxy S21+', series: 'S Series' },
    { brand: 'Samsung', model: 'Galaxy S21', series: 'S Series' },
    { brand: 'Samsung', model: 'Galaxy Z Fold 5', series: 'Z Series' },
    { brand: 'Samsung', model: 'Galaxy Z Flip 5', series: 'Z Series' },
    { brand: 'Samsung', model: 'Galaxy Z Fold 4', series: 'Z Series' },
    { brand: 'Samsung', model: 'Galaxy Z Flip 4', series: 'Z Series' },
    { brand: 'Samsung', model: 'Galaxy A54', series: 'A Series' },
    { brand: 'Samsung', model: 'Galaxy A34', series: 'A Series' },
    { brand: 'Samsung', model: 'Galaxy A53', series: 'A Series' },
    { brand: 'Samsung', model: 'Galaxy A33', series: 'A Series' },
    { brand: 'Samsung', model: 'Galaxy Note 20 Ultra', series: 'Note Series' },
    { brand: 'Samsung', model: 'Galaxy Note 20', series: 'Note Series' },

    // Google
    { brand: 'Google', model: 'Pixel 8 Pro', series: 'Pixel 8' },
    { brand: 'Google', model: 'Pixel 8', series: 'Pixel 8' },
    { brand: 'Google', model: 'Pixel 7 Pro', series: 'Pixel 7' },
    { brand: 'Google', model: 'Pixel 7', series: 'Pixel 7' },
    { brand: 'Google', model: 'Pixel 7a', series: 'Pixel 7' },
    { brand: 'Google', model: 'Pixel 6 Pro', series: 'Pixel 6' },
    { brand: 'Google', model: 'Pixel 6', series: 'Pixel 6' },
    { brand: 'Google', model: 'Pixel 6a', series: 'Pixel 6' },
    { brand: 'Google', model: 'Pixel Fold', series: 'Fold' },

    // OnePlus
    { brand: 'OnePlus', model: 'OnePlus 12', series: 'Number Series' },
    { brand: 'OnePlus', model: 'OnePlus 12R', series: 'R Series' },
    { brand: 'OnePlus', model: 'OnePlus 11', series: 'Number Series' },
    { brand: 'OnePlus', model: 'OnePlus 11R', series: 'R Series' },
    { brand: 'OnePlus', model: 'OnePlus 10 Pro', series: 'Number Series' },
    { brand: 'OnePlus', model: 'OnePlus 10T', series: 'T Series' },
    { brand: 'OnePlus', model: 'OnePlus 9 Pro', series: 'Number Series' },
    { brand: 'OnePlus', model: 'OnePlus 9', series: 'Number Series' },
    { brand: 'OnePlus', model: 'OnePlus Nord 3', series: 'Nord Series' },
    { brand: 'OnePlus', model: 'OnePlus Nord CE 3', series: 'Nord Series' },

    // Xiaomi
    { brand: 'Xiaomi', model: 'Xiaomi 14 Ultra', series: 'Number Series' },
    { brand: 'Xiaomi', model: 'Xiaomi 14', series: 'Number Series' },
    { brand: 'Xiaomi', model: 'Xiaomi 13 Pro', series: 'Number Series' },
    { brand: 'Xiaomi', model: 'Xiaomi 13', series: 'Number Series' },
    { brand: 'Xiaomi', model: 'Redmi Note 13 Pro+', series: 'Redmi Note' },
    { brand: 'Xiaomi', model: 'Redmi Note 13 Pro', series: 'Redmi Note' },
    { brand: 'Xiaomi', model: 'Redmi Note 13', series: 'Redmi Note' },

    // Nothing
    { brand: 'Nothing', model: 'Phone (2)', series: 'Phone' },
    { brand: 'Nothing', model: 'Phone (1)', series: 'Phone' },
    { brand: 'Nothing', model: 'Phone (2a)', series: 'Phone' },

    // Vivo
    { brand: 'VIVO', model: 'X100 Pro', series: 'X Series' },
    { brand: 'VIVO', model: 'X100', series: 'X Series' },
    { brand: 'VIVO', model: 'X90 Pro', series: 'X Series' },
    { brand: 'VIVO', model: 'V29 Pro', series: 'V Series' },
    { brand: 'VIVO', model: 'V29', series: 'V Series' },

    // Oppo
    { brand: 'OPPO', model: 'Find X7 Ultra', series: 'Find X' },
    { brand: 'OPPO', model: 'Find N3 Flip', series: 'Find N' },
    { brand: 'OPPO', model: 'Reno 11 Pro', series: 'Reno' },
    { brand: 'OPPO', model: 'Reno 11', series: 'Reno' },

    // Realme
    { brand: 'Realme', model: 'GT 5 Pro', series: 'GT' },
    { brand: 'Realme', model: '12 Pro+', series: 'Number Series' },
    { brand: 'Realme', model: '12 Pro', series: 'Number Series' },

    // Motorola
    { brand: 'Motorola', model: 'Razr 40 Ultra', series: 'Razr' },
    { brand: 'Motorola', model: 'Edge 40 Pro', series: 'Edge' },
    { brand: 'Motorola', model: 'Edge 40', series: 'Edge' },

    // Asus
    { brand: 'ASUS', model: 'ROG Phone 8 Pro', series: 'ROG' },
    { brand: 'ASUS', model: 'ROG Phone 7', series: 'ROG' },
    { brand: 'ASUS', model: 'Zenfone 10', series: 'Zenfone' },

    // Huawei
    { brand: 'Huawei', model: 'P60 Pro', series: 'P Series' },
    { brand: 'Huawei', model: 'Mate 60 Pro', series: 'Mate Series' },

    // POCO
    { brand: 'POCO', model: 'F5 Pro', series: 'F Series' },
    { brand: 'POCO', model: 'X6 Pro', series: 'X Series' },
    { brand: 'POCO', model: 'M6 Pro', series: 'M Series' },

    // IQOO
    { brand: 'IQOO', model: '12', series: 'Number Series' },
    { brand: 'IQOO', model: 'Neo 9 Pro', series: 'Neo' },
];

const ModelsPage = () => {
    const [models, setModels] = useState<PhoneModelRow[]>([]);
    const [brands, setBrands] = useState<BrandRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Form state
    const [selectedBrandId, setSelectedBrandId] = useState('');
    const [selectedBrandName, setSelectedBrandName] = useState('');
    const [newModelName, setNewModelName] = useState('');
    const [newModelSeries, setNewModelSeries] = useState('');
    const [newModelImage, setNewModelImage] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [showSchemaHelp, setShowSchemaHelp] = useState(false);

    const { toast } = useToast();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [modelsData, brandsData] = await Promise.all([
            SupabasePhonesService.getAllModels(),
            SupabaseBrandsService.getAllBrands()
        ]);
        setModels(modelsData);
        setBrands(brandsData);
        setLoading(false);
    };

    const handleAddSubmit = async () => {
        if (!selectedBrandName || !newModelName.trim()) {
            toast({ title: "Error", description: "Brand and Model Name are required", variant: "destructive" });
            return;
        }

        setSubmitting(true);
        const result = await SupabasePhonesService.addModel({
            brand: selectedBrandName,
            model: newModelName,
            series: newModelSeries || null,
            imageFile: newModelImage || undefined
        });

        if (result.success) {
            toast({ title: "Success", description: "Model added successfully" });
            setIsAddDialogOpen(false);
            setNewModelName('');
            setNewModelSeries('');
            setNewModelImage(null);
            loadData();
        } else {
            console.error('Add model failed:', result.error);
            const msg =
                result.error && typeof result.error === 'object' && 'message' in result.error
                    ? String((result.error as { message?: string }).message)
                    : String(result.error);
            if (
                (result.error as { code?: string })?.code === '42P01' ||
                msg.includes('relation') ||
                msg.includes('does not exist') ||
                msg.toLowerCase().includes('permission')
            ) {
                setShowSchemaHelp(true);
            }
            toast({ title: 'Error', description: msg || 'Failed to add model', variant: 'destructive' });
        }
        setSubmitting(false);
    };

    const handleLoadDefaults = async () => {
        if (!confirm(`This will attempt to add ${DEFAULT_MODELS.length} common phone models. This may take a moment. Continue?`)) return;

        setLoading(true);

        const brandMap = new Map(brands.map((b) => [b.name.toLowerCase(), b]));
        const brandNamesNeeded = new Set(DEFAULT_MODELS.map((i) => i.brand.toLowerCase()));

        for (const lower of brandNamesNeeded) {
            if (brandMap.has(lower)) continue;
            const displayName = DEFAULT_MODELS.find((i) => i.brand.toLowerCase() === lower)?.brand ?? lower;
            try {
                const newBrand = await SupabaseBrandsService.addBrand({ name: displayName });
                if (newBrand.success && newBrand.row) {
                    brandMap.set(lower, newBrand.row);
                }
            } catch {
                /* next */
            }
        }

        const latestBrands = await SupabaseBrandsService.getAllBrands();
        const result = await SupabasePhonesService.bulkSeedPhoneModels(DEFAULT_MODELS, latestBrands, models);

        setLoading(false);
        await loadData();

        const detail = result.lastError ? ` ${result.lastError}` : '';
        if (result.inserted > 0) {
            toast({
                title: 'Success',
                description: `Added ${result.inserted} models (${result.skipped} skipped, ${result.failed} failed).${detail}`,
            });
        } else if (result.failed > 0) {
            toast({
                title: 'Error',
                description: `Failed to add models.${detail || ' Sign in with Supabase Auth (admin) and run Database Setup / migrations if needed.'}`,
                variant: 'destructive',
            });
            const err = result.lastError ?? '';
            if (err.includes('42P01') || err.includes('does not exist') || err.toLowerCase().includes('permission')) {
                setShowSchemaHelp(true);
            }
        } else {
            toast({
                title: 'Info',
                description: `No new rows inserted (${result.skipped} skipped — often duplicates or brands not in database).`,
            });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this model?')) return;

        const result = await SupabasePhonesService.deleteModel(id);
        if (result.success) {
            toast({ title: "Success", description: "Model deleted" });
            loadData();
        } else {
            toast({ title: "Error", description: "Failed to delete model", variant: "destructive" });
        }
    };

    const filteredModels = models.filter((m) => {
        const q = searchTerm.toLowerCase();
        return (
            (m.model ?? '').toLowerCase().includes(q) ||
            (m.brand ?? '').toLowerCase().includes(q)
        );
    });

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Phone Models</h1>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowSchemaHelp(true)}>
                        Database Setup
                    </Button>
                    <Button variant="outline" onClick={handleLoadDefaults}>
                        <RefreshCw className="mr-2 h-4 w-4" /> Load Defaults
                    </Button>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="mr-2 h-4 w-4" /> Add Model
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Phone Model</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Brand</Label>
                                    {brands.length === 0 ? (
                                        <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 p-3 rounded-md">
                                            No brands found. You must <a href="/admin/ecommerce/brands" className="font-semibold underline hover:text-amber-800">add a brand</a> before adding a model.
                                        </div>
                                    ) : (
                                        <Select
                                            value={selectedBrandId}
                                            onValueChange={(val) => {
                                                setSelectedBrandId(val);
                                                const brand = brands.find(b => b.id === val);
                                                if (brand) setSelectedBrandName(brand.name);
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Brand" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {brands.map(b => (
                                                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="model">Model Name</Label>
                                    <Input
                                        id="model"
                                        placeholder="e.g. iPhone 15 Pro"
                                        value={newModelName}
                                        onChange={(e) => setNewModelName(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="series">Series (Optional)</Label>
                                    <Input
                                        id="series"
                                        placeholder="e.g. Series S"
                                        value={newModelSeries}
                                        onChange={(e) => setNewModelSeries(e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground">Used for categorizing models (e.g. Samsung Series S)</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="image">Image</Label>
                                    <Input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setNewModelImage(e.target.files?.[0] || null)}
                                        className="cursor-pointer"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleAddSubmit} disabled={submitting}>
                                    {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Save Model
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <SchemaHelpDialog open={showSchemaHelp} onOpenChange={setShowSchemaHelp} />

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle>All Models</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search models..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Image</TableHead>
                                <TableHead>Brand</TableHead>
                                <TableHead>Model</TableHead>
                                <TableHead>Series</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">
                                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                                    </TableCell>
                                </TableRow>
                            ) : filteredModels.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No models found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredModels.map((model) => (
                                    <TableRow key={model.id}>
                                        <TableCell>
                                            {model.image_url ? (
                                                <img src={model.image_url} alt={model.model} className="h-10 w-10 object-contain rounded-md bg-gray-50 p-1" />
                                            ) : (
                                                <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center text-gray-400">
                                                    <Smartphone className="h-5 w-5" />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>{model.brand}</TableCell>
                                        <TableCell className="font-medium">{model.model}</TableCell>
                                        <TableCell className="text-muted-foreground">{model.series || '-'}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(model.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default ModelsPage;
