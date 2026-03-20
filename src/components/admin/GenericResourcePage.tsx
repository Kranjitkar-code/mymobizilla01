import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Loader2, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { GenericSupabaseService, ResourceField, ResourceColumn } from '@/services/genericSupabaseService';
import { SchemaHelpDialog } from './SchemaHelpDialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    AdminCrudPage,
    AdminCrudToolbar,
    AdminCrudSectionCard,
    AdminCrudSearchInput,
    AdminCrudTableLoadingRow,
    AdminCrudTableEmptyRow,
    AdminCrudImageCell,
} from '@/components/admin/crud/AdminCrudShell';

export interface GenericResourcePageProps {
    title: string;
    tableName: string;
    columns: ResourceColumn[];
    fields: ResourceField[];
    /** Primary search field (used when searchKeys omitted). */
    searchKey?: string;
    /** If set, row matches when any key contains the search term. */
    searchKeys?: string[];
    onBeforeSave?: (data: any) => any;
    onBeforeEdit?: (data: any) => any;
    headerActions?: React.ReactNode;
    fallbackData?: any[];
    /** Singular label for buttons and modals, e.g. "Brand", "Testimonial". */
    entityLabel?: string;
    /** Plural for section title and copy, e.g. "Brands". Defaults to `${entityLabel}s`. */
    entityLabelPlural?: string;
    sectionTitle?: string;
    searchPlaceholder?: string;
    emptyStateMessage?: string;
    addButtonLabel?: string;
    modalAddTitle?: string;
    modalEditTitle?: string;
}

const GenericResourcePage: React.FC<GenericResourcePageProps> = ({
    title,
    tableName,
    columns,
    fields,
    searchKey = 'name',
    searchKeys,
    onBeforeSave,
    onBeforeEdit,
    headerActions,
    fallbackData = [],
    entityLabel,
    entityLabelPlural,
    sectionTitle: sectionTitleProp,
    searchPlaceholder: searchPlaceholderProp,
    emptyStateMessage: emptyStateMessageProp,
    addButtonLabel: addButtonLabelProp,
    modalAddTitle: modalAddTitleProp,
    modalEditTitle: modalEditTitleProp,
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

    const derived = useMemo(() => {
        if (!entityLabel) {
            return {
                sectionTitle: sectionTitleProp ?? 'All items',
                searchPlaceholder: searchPlaceholderProp ?? 'Search…',
                emptyStateMessage: emptyStateMessageProp ?? 'No items found.',
                addButtonLabel: addButtonLabelProp ?? 'Add new',
                modalAddTitle: modalAddTitleProp ?? 'Add item',
                modalEditTitle: modalEditTitleProp ?? 'Edit item',
            };
        }
        const plural = entityLabelPlural ?? `${entityLabel}s`;
        const pluralLower = plural.toLowerCase();
        return {
            sectionTitle: sectionTitleProp ?? `All ${plural}`,
            searchPlaceholder: searchPlaceholderProp ?? `Search ${pluralLower}…`,
            emptyStateMessage:
                emptyStateMessageProp ?? `No ${pluralLower} yet. Add one to get started.`,
            addButtonLabel: addButtonLabelProp ?? `Add ${entityLabel}`,
            modalAddTitle: modalAddTitleProp ?? `Add ${entityLabel}`,
            modalEditTitle: modalEditTitleProp ?? `Edit ${entityLabel}`,
        };
    }, [
        entityLabel,
        entityLabelPlural,
        sectionTitleProp,
        searchPlaceholderProp,
        emptyStateMessageProp,
        addButtonLabelProp,
        modalAddTitleProp,
        modalEditTitleProp,
    ]);

    const filterKeys = searchKeys?.length ? searchKeys : [searchKey];

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
            console.error('Upload failed', error);
            toast({ title: 'Upload failed', description: 'Could not upload image.', variant: 'destructive' });
        }
    };

    const handleSubmit = async () => {
        for (const field of fields) {
            if (field.required && (formData[field.key] === undefined || formData[field.key] === '' || formData[field.key] === null)) {
                toast({ title: 'Error', description: `${field.label} is required`, variant: 'destructive' });
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
                toast({ title: 'Saved', description: 'Changes were saved.' });
            } else {
                await GenericSupabaseService.create(tableName, dataToSave);
                toast({ title: 'Saved', description: 'New entry was created.' });
            }
            setIsDialogOpen(false);
            loadItems();
        } catch (error: any) {
            console.error('Submit failed', error);
            if (error?.code === '42P01' || error?.message?.includes('relation') || error?.message?.includes('does not exist')) {
                setShowSchemaHelp(true);
            }
            toast({
                title: 'Error',
                description: 'Operation failed. Database setup may be required.',
                variant: 'destructive',
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this row?')) return;
        try {
            await GenericSupabaseService.delete(tableName, id);
            toast({ title: 'Deleted', description: 'The row was removed.' });
            loadItems();
        } catch (error) {
            console.error('Delete failed', error);
            toast({ title: 'Error', description: 'Delete failed', variant: 'destructive' });
        }
    };

    const filteredItems = items.filter((item) =>
        filterKeys.some((k) => {
            const v = item[k];
            if (v === undefined || v === null) return false;
            return String(v).toLowerCase().includes(searchTerm.toLowerCase());
        }),
    );

    const dialogTitle = editingItem ? derived.modalEditTitle : derived.modalAddTitle;

    return (
        <AdminCrudPage>
            <AdminCrudToolbar
                title={title}
                actions={
                    <>
                        <Button variant="outline" onClick={() => setShowSchemaHelp(true)}>
                            Database Setup
                        </Button>
                        <Button onClick={() => handleOpenDialog()}>
                            <Plus className="mr-2 h-4 w-4" />
                            {derived.addButtonLabel}
                        </Button>
                        {headerActions}
                    </>
                }
            />

            <SchemaHelpDialog open={showSchemaHelp} onOpenChange={setShowSchemaHelp} />

            <AdminCrudSectionCard
                title={derived.sectionTitle}
                search={
                    <AdminCrudSearchInput
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder={derived.searchPlaceholder}
                    />
                }
            >
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((col) => (
                                <TableHead key={col.key} className="h-11 font-medium text-muted-foreground">
                                    {col.label}
                                </TableHead>
                            ))}
                            <TableHead className="h-11 w-[104px] text-right font-medium text-muted-foreground">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <AdminCrudTableLoadingRow colSpan={columns.length + 1} />
                        ) : filteredItems.length === 0 ? (
                            <AdminCrudTableEmptyRow
                                colSpan={columns.length + 1}
                                message={derived.emptyStateMessage}
                            />
                        ) : (
                            filteredItems.map((item) => (
                                <TableRow key={item.id} className="align-middle">
                                    {columns.map((col) => (
                                        <TableCell key={col.key} className="py-3">
                                            {col.type === 'image' ? (
                                                <AdminCrudImageCell src={item[col.key]} alt="" />
                                            ) : col.type === 'boolean' ? (
                                                <Switch checked={!!item[col.key]} disabled aria-readonly />
                                            ) : (
                                                item[col.key]
                                            )}
                                        </TableCell>
                                    ))}
                                    <TableCell className="py-3 text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(item)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(item.id)}
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

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="gap-0 sm:max-w-lg">
                    <DialogHeader className="space-y-1 pb-2">
                        <DialogTitle className="text-xl font-semibold tracking-tight">{dialogTitle}</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="max-h-[60vh] pr-4">
                        <div className="space-y-4 py-4">
                            {fields.map((field) => (
                                <div key={field.key} className="space-y-2">
                                    <Label className="text-sm font-medium">{field.label}</Label>
                                    {field.type === 'text' && (
                                        <Input
                                            value={formData[field.key] ?? ''}
                                            onChange={(e) => handleInputChange(field.key, e.target.value)}
                                        />
                                    )}
                                    {field.type === 'number' && (
                                        <Input
                                            type="number"
                                            value={formData[field.key] ?? ''}
                                            onChange={(e) => handleInputChange(field.key, e.target.value)}
                                        />
                                    )}
                                    {field.type === 'textarea' && (
                                        <Textarea
                                            value={formData[field.key] ?? ''}
                                            onChange={(e) => handleInputChange(field.key, e.target.value)}
                                        />
                                    )}
                                    {field.type === 'boolean' && (
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={!!formData[field.key]}
                                                onCheckedChange={(checked) => handleInputChange(field.key, checked)}
                                            />
                                            <span className="text-sm text-muted-foreground">
                                                {formData[field.key] ? 'Yes' : 'No'}
                                            </span>
                                        </div>
                                    )}
                                    {field.type === 'select' && field.options && (
                                        <Select
                                            value={formData[field.key] ? String(formData[field.key]) : undefined}
                                            onValueChange={(v) => handleInputChange(field.key, v)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {field.options.map((opt) => (
                                                    <SelectItem key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                    {field.type === 'image' && (
                                        <div className="space-y-2">
                                            {formData[field.key] && (
                                                <img
                                                    src={formData[field.key]}
                                                    alt="Preview"
                                                    className="h-20 w-20 rounded-md border bg-muted/40 object-contain p-1"
                                                />
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
                    <DialogFooter className="gap-2 border-t pt-4 sm:gap-0">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={submitting}>
                            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminCrudPage>
    );
};

export default GenericResourcePage;
