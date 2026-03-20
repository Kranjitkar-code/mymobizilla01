import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Plus, Search, Filter } from 'lucide-react';

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
    const [skus, setSkus] = useState<Sku[]>(initialSkus);

    const filteredSkus = skus.filter(sku =>
        sku.model.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Skus</h1>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <Plus className="mr-2 h-4 w-4" /> New sku
                </Button>
            </div>

            <div className="bg-card rounded-lg border shadow-sm">
                <div className="p-4 flex items-center justify-end gap-2 border-b">
                    <div className="relative w-72">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search"
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[300px]">Model</TableHead>
                            <TableHead>Color</TableHead>
                            <TableHead>Storage (GB)</TableHead>
                            <TableHead>Memory (GB)</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredSkus.map((sku) => (
                            <TableRow key={sku.id}>
                                <TableCell className="font-medium">{sku.model}</TableCell>
                                <TableCell>
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
                                <TableCell>{sku.storage}</TableCell>
                                <TableCell>{sku.memory}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50">
                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default SkusPage;
