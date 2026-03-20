import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Trash2, Loader2, Edit, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { GenericSupabaseService, ResourceField, ResourceColumn } from '@/services/genericSupabaseService';
import { SchemaHelpDialog } from './SchemaHelpDialog';
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";

interface GenericResourcePageProps {
    title: string;
    tableName: string;
    columns: ResourceColumn[];
    fields: ResourceField[];
    searchKey?: string;
    onBeforeSave?: (data: any) => any;
    onBeforeEdit?: (data: any) => any;
    headerActions?: React.ReactNode;
    fallbackData?: any[];
}

const GenericResourcePage: React.FC<GenericResourcePageProps> = ({
    title,
    tableName,
    columns,
    fields,
    searchKey = 'name',
    onBeforeSave,
    onBeforeEdit,
    headerActions,
    fallbackData = []
}) => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [formData, setFormData] = useState<any>({});
    const [submitting, setSubmitting] = useState(false);
    const [showSchemaHelp, setShowSchemaHelp] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        loadItems();
    }, [tableName]);

    const loadItems = async () => {
        setLoading(true);
        try {
            const data = await GenericSupabaseService.getAll(tableName);
            if (data && data.length > 0) {
                setItems(data);
            } else if (fallbackData.length > 0) {
                setItems(fallbackData);
            } else {
                setItems([]);
            }
        } catch (error: any) {
            console.error(`Error loading ${tableName}:`, error);
            if (fallbackData.length > 0) {
                setItems(fallbackData);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (item?: any) => {
        setEditingItem(item || null);
        let initialData = item || {};
        if (item && onBeforeEdit) {
            initialData = onBeforeEdit(item);
        }
        setFormData(initialData);
        setIsDialogOpen(true);
    };

    const handleInputChange = (key: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [key]: value }));
    };

    const handleFileChange = async (key: string, bucket: string, file: File) => {
        try {
            const url = await GenericSupabaseService.uploadImage(bucket, file);
            handleInputChange(key, url);
        } catch (error) {
            console.error("Upload failed", error);
            toast({ title: "Upload Failed", description: "Could not upload image.", variant: "destructive" });
        }
    };

    const handleSubmit = async () => {
        // Validate required
        for (const field of fields) {
            if (field.required && !formData[field.key]) {
                toast({ title: "Error", description: `${field.label} is required`, variant: "destructive" });
                return;
            }
        }

        setSubmitting(true);
        try {
            let dataToSave = { ...formData };
            if (onBeforeSave) {
                dataToSave = onBeforeSave(dataToSave);
            }

            if (editingItem) {
                await GenericSupabaseService.update(tableName, editingItem.id, dataToSave);
                toast({ title: "Success", description: "Item updated successfully" });
            } else {
                await GenericSupabaseService.create(tableName, dataToSave);
                toast({ title: "Success", description: "Item created successfully" });
            }
            setIsDialogOpen(false);
            loadItems();
        } catch (error: any) {
            console.error("Submit failed", error);
            if (error?.code === '42P01' || error?.message?.includes('relation') || error?.message?.includes('does not exist')) {
                setShowSchemaHelp(true);
            }
            toast({ title: "Error", description: "Operation failed. Database setup may be required.", variant: "destructive" });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            await GenericSupabaseService.delete(tableName, id);
            toast({ title: "Success", description: "Item deleted" });
            loadItems();
        } catch (error) {
            console.error("Delete failed", error);
            toast({ title: "Error", description: "Delete failed", variant: "destructive" });
        }
    };

    const filteredItems = items.filter(item =>
        item[searchKey]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                <div className="flex gap-2">
                    {headerActions}
                    <Button variant="outline" onClick={() => setShowSchemaHelp(true)}>
                        Database Setup
                    </Button>
                    <Button onClick={() => handleOpenDialog()}>
                        <Plus className="mr-2 h-4 w-4" /> Add New
                    </Button>
                </div>
            </div>

            <SchemaHelpDialog open={showSchemaHelp} onOpenChange={setShowSchemaHelp} />

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle>All Items</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search..."
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
                                {columns.map(col => (
                                    <TableHead key={col.key}>{col.label}</TableHead>
                                ))}
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length + 1} className="text-center py-8">
                                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                                    </TableCell>
                                </TableRow>
                            ) : filteredItems.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length + 1} className="text-center py-8 text-muted-foreground">
                                        No items found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredItems.map((item) => (
                                    <TableRow key={item.id}>
                                        {columns.map(col => (
                                            <TableCell key={col.key}>
                                                {col.type === 'image' ? (
                                                    item[col.key] ? <img src={item[col.key]} alt="img" className="h-10 w-10 object-contain bg-gray-50 rounded" /> : <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center"><ImageIcon className="h-4 w-4 text-gray-400" /></div>
                                                ) : col.type === 'boolean' ? (
                                                    <Switch checked={item[col.key]} disabled />
                                                ) : (
                                                    item[col.key]
                                                )}
                                            </TableCell>
                                        ))}
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(item)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
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

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="max-h-[60vh] pr-4 py-4">
                        <div className="space-y-4">
                            {fields.map(field => (
                                <div key={field.key} className="space-y-2">
                                    <Label>{field.label}</Label>
                                    {field.type === 'text' && (
                                        <Input
                                            value={formData[field.key] || ''}
                                            onChange={(e) => handleInputChange(field.key, e.target.value)}
                                        />
                                    )}
                                    {field.type === 'number' && (
                                        <Input
                                            type="number"
                                            value={formData[field.key] || ''}
                                            onChange={(e) => handleInputChange(field.key, e.target.value)}
                                        />
                                    )}
                                    {field.type === 'textarea' && (
                                        <Textarea
                                            value={formData[field.key] || ''}
                                            onChange={(e) => handleInputChange(field.key, e.target.value)}
                                        />
                                    )}
                                    {field.type === 'boolean' && (
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                checked={formData[field.key] || false}
                                                onCheckedChange={(checked) => handleInputChange(field.key, checked)}
                                            />
                                            <span>{formData[field.key] ? 'Yes' : 'No'}</span>
                                        </div>
                                    )}
                                    {field.type === 'image' && (
                                        <div className="space-y-2">
                                            {formData[field.key] && (
                                                <img src={formData[field.key]} alt="Preview" className="h-20 w-20 object-contain bg-gray-50 rounded border" />
                                            )}
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    if (e.target.files?.[0]) {
                                                        handleFileChange(field.key, field.bucketName || 'images', e.target.files[0]);
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={submitting}>
                            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default GenericResourcePage;
