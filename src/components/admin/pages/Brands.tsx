import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Trash2, Upload, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import SupabaseBrandsService, { BrandRow } from '@/services/supabaseBrandsService';
import { SchemaHelpDialog } from "../SchemaHelpDialog";

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
            logoFile: newBrandLogo || undefined
        });

        if (result.success) {
            toast({ title: "Success", description: "Brand added successfully" });
            setIsAddDialogOpen(false);
            setNewBrandName('');
            setNewBrandLogo(null);
            loadBrands();
        } else {
            console.error("Add brand failed:", result.error);
            // Check if error is related to missing table
            if (result.error?.code === '42P01' || result.error?.message?.includes('relation') || result.error?.message?.includes('does not exist')) {
                setShowSchemaHelp(true);
            }
            toast({ title: "Error", description: "Failed to add brand. Database setup may be required.", variant: "destructive" });
        }
        setSubmitting(false);
    };

    const handleDeleteBrand = async (id: string) => {
        if (!confirm('Are you sure you want to delete this brand?')) return;

        const result = await SupabaseBrandsService.deleteBrand(id);
        if (result.success) {
            toast({ title: "Success", description: "Brand deleted" });
            loadBrands();
        } else {
            toast({ title: "Error", description: "Failed to delete brand", variant: "destructive" });
        }
    };

    const filteredBrands = brands.filter(b =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Brands</h1>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowSchemaHelp(true)}>
                        Database Setup
                    </Button>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="mr-2 h-4 w-4" /> Add Brand
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Brand</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Brand Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. Samsung"
                                        value={newBrandName}
                                        onChange={(e) => setNewBrandName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="logo">Logo</Label>
                                    <div className="flex items-center gap-4">
                                        <Input
                                            id="logo"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setNewBrandLogo(e.target.files?.[0] || null)}
                                            className="cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleAddBrand} disabled={submitting}>
                                    {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Save Brand
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
                        <CardTitle>All Brands</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search brands..."
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
                                <TableHead>Logo</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-8">
                                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                                    </TableCell>
                                </TableRow>
                            ) : filteredBrands.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                        No brands found. Add one to get started.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredBrands.map((brand) => (
                                    <TableRow key={brand.id}>
                                        <TableCell>
                                            {brand.logo_url ? (
                                                <img src={brand.logo_url} alt={brand.name} className="h-10 w-10 object-contain rounded-md bg-gray-50 p-1" />
                                            ) : (
                                                <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center text-xs text-gray-500">No img</div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">{brand.name}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteBrand(brand.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
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

export default BrandsPage;
