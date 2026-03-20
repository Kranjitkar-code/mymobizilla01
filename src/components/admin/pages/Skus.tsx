import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Plus, Filter } from 'lucide-react';
import {
    AdminCrudPage,
    AdminCrudToolbar,
    AdminCrudSearchInput,
} from '@/components/admin/crud/AdminCrudShell';

interface Sku {
    id: string;
    model: string;
    colors: string[];
    storage: number;
    memory: number;
}

const initialSkus: Sku[] = [
    { id: '1', model: 'iPhone 11', colors: ['#ef4444', '#a7f3d0', '#1f2937', '#a5b4fc', '#fef3c7'], storage: 128, memory: 4 },
    { id: '2', model: 'iPhone 11 pro', colors: ['#facc15', '#9ca3af', '#4b5563', '#6b7280'], storage: 256, memory: 4 },
    { id: '3', model: 'iPhone 11 Pro Max', colors: ['#facc15', '#9ca3af', '#4b5563', '#6b7280'], storage: 256, memory: 4 },
    { id: '4', model: 'iPhone 12', colors: ['#a7f3d0', '#1f2937', '#a5b4fc', '#1e3a8a', '#f3f4f6'], storage: 128, memory: 4 },
    { id: '5', model: 'iPhone 12 Pro', colors: ['#e5e7eb', '#fef3c7', '#4b5563', '#374151'], storage: 128, memory: 6 },
    { id: '6', model: 'iPhone 12 Pro Max', colors: ['#e5e7eb', '#fef3c7', '#4b5563', '#374151'], storage: 128, memory: 6 },
    { id: '7', model: 'iPhone 12 Mini', colors: ['#a7f3d0', '#1f2937', '#a5b4fc', '#1e3a8a', '#f3f4f6'], storage: 256, memory: 4 },
    { id: '8', model: 'iPhone 13', colors: ['#ef4444', '#fbcfe8', '#4b5563', '#374151', '#f3f4f6'], storage: 128, memory: 4 },
    { id: '9', model: 'iPhone 13 Pro', colors: ['#e5e7eb', '#fef3c7', '#4b5563', '#0f766e', '#9ca3af'], storage: 128, memory: 6 },
];

const SkusPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [skus] = useState<Sku[]>(initialSkus);

    const filteredSkus = skus.filter((sku) =>
        sku.model.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <AdminCrudPage>
            <AdminCrudToolbar
                title="SKUs"
                actions={
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add SKU
                    </Button>
                }
            />

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <CardTitle className="text-lg font-semibold">All SKUs</CardTitle>
                        <div className="flex w-full flex-wrap items-center justify-end gap-2 lg:w-auto">
                            <div className="w-full min-w-[220px] sm:w-72">
                                <AdminCrudSearchInput
                                    value={searchTerm}
                                    onChange={setSearchTerm}
                                    placeholder="Search SKUs…"
                                />
                            </div>
                            <Button variant="outline" size="icon" type="button" aria-label="Filter">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 md:px-6 md:pb-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="h-11 w-[300px] font-medium text-muted-foreground">Model</TableHead>
                                <TableHead className="h-11 font-medium text-muted-foreground">Color</TableHead>
                                <TableHead className="h-11 font-medium text-muted-foreground">Storage (GB)</TableHead>
                                <TableHead className="h-11 font-medium text-muted-foreground">Memory (GB)</TableHead>
                                <TableHead className="h-11 text-right font-medium text-muted-foreground">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSkus.map((sku) => (
                                <TableRow key={sku.id} className="align-middle">
                                    <TableCell className="py-3 font-medium">{sku.model}</TableCell>
                                    <TableCell className="py-3">
                                        <div className="flex gap-1">
                                            {sku.colors.map((color, index) => (
                                                <div
                                                    key={index}
                                                    className="h-6 w-6 rounded-full border shadow-sm"
                                                    style={{ backgroundColor: color }}
                                                    title={color}
                                                />
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-3">{sku.storage}</TableCell>
                                    <TableCell className="py-3">{sku.memory}</TableCell>
                                    <TableCell className="py-3 text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-green-600 hover:bg-green-50 hover:text-green-700"
                                        >
                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </AdminCrudPage>
    );
};

export default SkusPage;
