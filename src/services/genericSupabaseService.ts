import { supabase } from '@/integrations/supabase/client';

export interface ResourceField {
    key: string;
    label: string;
    type: 'text' | 'number' | 'textarea' | 'image' | 'select' | 'boolean';
    required?: boolean;
    options?: { label: string; value: string }[]; // For select
    bucketName?: string; // For image upload
}

export interface ResourceColumn {
    key: string;
    label: string;
    type: 'text' | 'image' | 'boolean' | 'date';
}

export const GenericSupabaseService = {
    async getAll(table: string) {
        const { data, error } = await supabase
            .from(table)
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async create(table: string, item: any) {
        const { data, error } = await supabase
            .from(table)
            .insert([item])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(table: string, id: string, updates: any) {
        const { error } = await supabase
            .from(table)
            .update(updates)
            .eq('id', id);

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
