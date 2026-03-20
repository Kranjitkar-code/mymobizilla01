import { supabase } from '@/integrations/supabase/client';
import { Course } from '@/data/trainingData';

const TRAINING_TABLE = 'training_courses';

export const TrainingService = {
    async getAllCourses(): Promise<Course[]> {
        try {
            const { data, error } = await supabase
                .from(TRAINING_TABLE)
                .select('*')
                .order('created_at', { ascending: true });

            if (error) throw error;

            return (data || []).map(row => ({
                id: row.id,
                title: row.title,
                level: row.level as 'Basic' | 'Medium' | 'Advanced' | 'Specialized',
                shortDescription: row.short_description || '',
                detailedDescription: row.detailed_description || '',
                keyLearningOutcomes: row.key_learning_outcomes || [],
                targetAudience: row.target_audience || [],
                duration: row.duration || '',
                price: row.price || '',
                highlights: row.highlights || [],
                promotionalText: row.promotional_text || '',
                imageUrl: row.image_url || '',
                googleFormUrl: row.google_form_url || '',
            }));
        } catch (error) {
            console.error('Error fetching courses from Supabase:', error);
            throw error;
        }
    },

    async getCourseById(id: string): Promise<Course | null> {
        try {
            const { data, error } = await supabase
                .from(TRAINING_TABLE)
                .select('*')
                .eq('id', id)
                .maybeSingle();

            if (error) throw error;
            if (!data) return null;

            return {
                id: data.id,
                title: data.title,
                level: data.level as 'Basic' | 'Medium' | 'Advanced' | 'Specialized',
                shortDescription: data.short_description || '',
                detailedDescription: data.detailed_description || '',
                keyLearningOutcomes: data.key_learning_outcomes || [],
                targetAudience: data.target_audience || [],
                duration: data.duration || '',
                price: data.price || '',
                highlights: data.highlights || [],
                promotionalText: data.promotional_text || '',
                imageUrl: data.image_url || '',
                googleFormUrl: data.google_form_url || '',
            };
        } catch (error) {
            console.error('Error fetching course by ID from Supabase:', error);
            throw error;
        }
    },

    async getAllVideos() {
        try {
            const { data, error } = await supabase
                .from('training_videos')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching training videos:', error);
            return [];
        }
    }
};
