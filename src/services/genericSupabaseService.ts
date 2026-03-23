import { supabase } from '@/integrations/supabase/client';

export interface ResourceField {
    key: string;
    label: string;
    type: 'text' | 'number' | 'textarea' | 'image' | 'select' | 'boolean';
    /** Used when type === 'textarea' */
    textareaRows?: number;
    required?: boolean;
    options?: { label: string; value: string }[]; // For select
    bucketName?: string; // For image upload
}

export interface ResourceColumn {
    key: string;
    label: string;
    type: 'text' | 'image' | 'boolean' | 'date';
}

function cleanPayload(item: Record<string, unknown>, options?: { forInsert?: boolean }) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(item)) {
        if (v === undefined) continue;
        if (options?.forInsert && (k === 'id' || k === 'created_at' || k === 'updated_at')) continue;
        out[k] = v;
    }
    return out;
}

export const GenericSupabaseService = {
    async getAll(table: string) {
        const ordered = await supabase.from(table).select('*').order('created_at', { ascending: false });
        if (!ordered.error) return ordered.data || [];
        const fallback = await supabase.from(table).select('*');
        if (fallback.error) throw fallback.error;
        return fallback.data || [];
    },

    async create(table: string, item: Record<string, unknown>) {
        const payload = cleanPayload(item, { forInsert: true });
        const { data, error } = await supabase
            .from(table)
            .insert([payload])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(table: string, id: string, updates: Record<string, unknown>) {
        const payload = cleanPayload(updates);
        const { error } = await supabase.from(table).update(payload).eq('id', id);

        if (error) throw error;
        return true;
    },

    async delete(table: string, id: string) {
        const { error } = await supabase
            .from(table)
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    },

    async uploadImage(bucket: string, file: File) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
        return data.publicUrl;
    }
};
