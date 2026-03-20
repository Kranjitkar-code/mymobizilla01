import * as React from 'react';
import { Search, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

/** Root spacing for admin CRUD pages (layout already provides horizontal padding). */
export function AdminCrudPage({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <div className={cn('space-y-6 p-6', className)}>{children}</div>;
}

export function AdminCrudToolbar({
    title,
    description,
    actions,
}: {
    title: string;
    description?: string;
    actions: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                {description ? (
                    <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-2">{actions}</div>
        </div>
    );
}

export function AdminCrudSectionCard({
    title,
    search,
    children,
}: {
    title: string;
    search?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                    {search ? (
                        <div className="relative w-full sm:w-64 sm:shrink-0">{search}</div>
                    ) : null}
                </div>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}

export function AdminCrudSearchInput({
    value,
    onChange,
    placeholder,
    id,
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    id?: string;
}) {
    return (
        <div className="relative w-full">
            <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                id={id}
                className="pl-8"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

export function AdminCrudTableLoadingRow({ colSpan }: { colSpan: number }) {
    return (
        <TableRow>
            <TableCell colSpan={colSpan} className="py-12 text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
            </TableCell>
        </TableRow>
    );
}

export function AdminCrudTableEmptyRow({ colSpan, message }: { colSpan: number; message: string }) {
    return (
        <TableRow>
            <TableCell colSpan={colSpan} className="py-12 text-center text-sm text-muted-foreground">
                {message}
            </TableCell>
        </TableRow>
    );
}

export function AdminCrudImageCell({
    src,
    alt,
    emptyLabel = 'No image',
}: {
    src?: string | null;
    alt?: string;
    emptyLabel?: string;
}) {
    if (src) {
        return (
            <img
                src={src}
                alt={alt || ''}
                className="h-10 w-10 rounded-md border bg-muted/40 object-contain p-1"
            />
        );
    }
    return (
        <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted/30 text-muted-foreground">
            <ImageIcon className="h-4 w-4" aria-label={emptyLabel} />
        </div>
    );
}

/** Bordered empty state for non-table pages (e.g. FAQ accordion, custom layouts). */
export function AdminCrudEmptyPanel({
    message,
    hint,
    children,
}: {
    message: string;
    hint?: string;
    children?: React.ReactNode;
}) {
    return (
        <div className="rounded-lg border border-dashed bg-card py-12 text-center text-muted-foreground">
            <p className="text-sm font-medium text-foreground">{message}</p>
            {hint ? <p className="mt-2 text-sm">{hint}</p> : null}
            {children ? <div className="mt-6 flex justify-center">{children}</div> : null}
        </div>
    );
}
