import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import SupabaseBrandsService, { BrandRow } from '@/services/supabaseBrandsService';
import { SchemaHelpDialog } from '../SchemaHelpDialog';
import {
    AdminCrudPage,
    AdminCrudToolbar,
    AdminCrudSectionCard,
    AdminCrudSearchInput,
    AdminCrudTableLoadingRow,
    AdminCrudTableEmptyRow,
    AdminCrudImageCell,
} from '@/components/admin/crud/AdminCrudShell';

const BrandsPage = () => {
    const [brands, setBrands] = useState<BrandRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newBrandName, setNewBrandName] = useState('');
    const [newBrandLogo, setNewBrandLogo] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const { toast } = useToast();
    const [showSchemaHelp, setShowSchemaHelp] = useState(false);

    useEffect(() => {
        loadBrands();
    }, []);

    const loadBrands = async () => {
        setLoading(true);
        const data = await SupabaseBrandsService.getAllBrands();
        setBrands(data);
        setLoading(false);
    };

    const handleAddBrand = async () => {
        if (!newBrandName.trim()) return;

        setSubmitting(true);
        const result = await SupabaseBrandsService.addBrand({
            name: newBrandName,
            logoFile: newBrandLogo || undefined,
        });

        if (result.success) {
            toast({ title: 'Saved', description: 'Brand was added.' });
            setIsAddDialogOpen(false);
            setNewBrandName('');
            setNewBrandLogo(null);
            loadBrands();
        } else {
            console.error('Add brand failed:', result.error);
            if (
                result.error?.code === '42P01' ||
                result.error?.message?.includes('relation') ||
                result.error?.message?.includes('does not exist')
            ) {
                setShowSchemaHelp(true);
            }
            toast({
                title: 'Error',
                description: 'Failed to add brand. Database setup may be required.',
                variant: 'destructive',
            });
        }
        setSubmitting(false);
    };

    const handleDeleteBrand = async (id: string) => {
        if (!confirm('Are you sure you want to delete this brand?')) return;

        const result = await SupabaseBrandsService.deleteBrand(id);
        if (result.success) {
            toast({ title: 'Deleted', description: 'Brand was removed.' });
            loadBrands();
        } else {
            toast({ title: 'Error', description: 'Failed to delete brand', variant: 'destructive' });
        }
    };

    const filteredBrands = brands.filter((b) => b.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <AdminCrudPage>
            <AdminCrudToolbar
                title="Brands"
                actions={
                    <>
                        <Button variant="outline" onClick={() => setShowSchemaHelp(true)}>
                            Database Setup
                        </Button>
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" /> Add Brand
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="gap-0 sm:max-w-lg">
                                <DialogHeader className="space-y-1 pb-2">
                                    <DialogTitle className="text-xl font-semibold tracking-tight">Add Brand</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-sm font-medium">
                                            Brand name
                                        </Label>
                                        <Input
                                            id="name"
                                            placeholder="e.g. Samsung"
                                            value={newBrandName}
                                            onChange={(e) => setNewBrandName(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="logo" className="text-sm font-medium">
                                            Logo
                                        </Label>
                                        <Input
                                            id="logo"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setNewBrandLogo(e.target.files?.[0] || null)}
                                            className="cursor-pointer"
                                        />
                                    </div>
                                </div>
                                <DialogFooter className="gap-2 border-t pt-4 sm:gap-0">
                                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleAddBrand} disabled={submitting}>
                                        {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        Save
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </>
                }
            />

            <SchemaHelpDialog open={showSchemaHelp} onOpenChange={setShowSchemaHelp} />

            <AdminCrudSectionCard
                title="All Brands"
                search={
                    <AdminCrudSearchInput
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Search brands…"
                    />
                }
            >
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="h-11 font-medium text-muted-foreground">Logo</TableHead>
                            <TableHead className="h-11 font-medium text-muted-foreground">Name</TableHead>
                            <TableHead className="h-11 w-[104px] text-right font-medium text-muted-foreground">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <AdminCrudTableLoadingRow colSpan={3} />
                        ) : filteredBrands.length === 0 ? (
                            <AdminCrudTableEmptyRow
                                colSpan={3}
                                message="No brands yet. Add one to get started."
                            />
                        ) : (
                            filteredBrands.map((brand) => (
                                <TableRow key={brand.id} className="align-middle">
                                    <TableCell className="py-3">
                                        <AdminCrudImageCell src={brand.logo_url} alt={brand.name} />
                                    </TableCell>
                                    <TableCell className="py-3 font-medium">{brand.name}</TableCell>
                                    <TableCell className="py-3 text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteBrand(brand.id)}
                                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </AdminCrudSectionCard>
        </AdminCrudPage>
    );
};

export default BrandsPage;
