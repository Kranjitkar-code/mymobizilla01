import React, { useState } from 'react';
import GenericResourcePage from '../GenericResourcePage';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { courses as staticCourses } from '@/data/trainingData';
import { GenericSupabaseService } from '@/services/genericSupabaseService';
import { useToast } from '@/hooks/use-toast';

export default function TrainingAdmin() {
    const [isImporting, setIsImporting] = useState(false);
    const { toast } = useToast();

    const handleImport = async () => {
        if (!confirm("This will import all 15 default courses into your database. Continue?")) return;

        setIsImporting(true);
        let successCount = 0;
        let failCount = 0;

        try {
            for (const course of staticCourses) {
                try {
                    await GenericSupabaseService.create('training_courses', {
                        title: course.title,
                        level: course.level,
                        duration: course.duration,
                        price: course.price,
                        image_url: course.imageUrl,
                        short_description: course.shortDescription,
                        detailed_description: course.detailedDescription,
                        google_form_url: course.googleFormUrl,
                        promotional_text: course.promotionalText,
                        key_learning_outcomes: course.keyLearningOutcomes,
                        target_audience: course.targetAudience,
                        highlights: course.highlights
                    });
                    successCount++;
                } catch (err) {
                    console.error(`Failed to import course: ${course.title}`, err);
                    failCount++;
                }
            }

            if (successCount > 0) {
                toast({
                    title: "Import Complete",
                    description: `Successfully imported ${successCount} courses. ${failCount > 0 ? `${failCount} failed.` : ''}`,
                });
                setTimeout(() => window.location.reload(), 2000);
            } else {
                toast({
                    title: "Import Failed",
                    description: "Could not import any courses. Please check if the table exists and RLS is disabled or set correctly.",
                    variant: "destructive"
                });
            }
        } catch (error: any) {
            console.error("Critical import error:", error);
            toast({
                title: "Error",
                description: `Import crashed. ${error.message}`,
                variant: "destructive"
            });
        } finally {
            setIsImporting(false);
        }
    };

    const importButton = (
        <div className="flex gap-2">
            <Button
                variant="outline"
                onClick={() => {
                    console.log('--- SUPABASE DEBUG ---');
                    console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
                    console.log('Project ID Check:', import.meta.env.VITE_SUPABASE_URL?.includes('nznmrvvlvpuxnxmvgxkx') ? '✅ Correct' : '❌ Wrong Project');
                    alert(`Current Supabase URL: ${import.meta.env.VITE_SUPABASE_URL}\nCheck browser console for more details.`);
                }}
            >
                Debug Connection
            </Button>
            <Button
                variant="outline"
                onClick={handleImport}
                disabled={isImporting}
            >
                {isImporting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Importing...
                    </>
                ) : (
                    <>
                        <Download className="mr-2 h-4 w-4" />
                        Import Static Courses
                    </>
                )}
            </Button>
        </div>
    );

    return (
        <GenericResourcePage
            title="Training Courses"
            entityLabel="Course"
            entityLabelPlural="Courses"
            tableName="training_courses"
            searchKey="title"
            headerActions={importButton}
            fallbackData={staticCourses.map(course => ({
                ...course,
                image_url: course.imageUrl,
                short_description: course.shortDescription,
                detailed_description: course.detailedDescription,
                google_form_url: course.googleFormUrl,
                promotional_text: course.promotionalText,
                key_learning_outcomes: course.keyLearningOutcomes,
                target_audience: course.targetAudience,
                highlights: course.highlights
            }))}
            columns={[
                { key: 'image_url', label: 'Image', type: 'image' },
                { key: 'title', label: 'Title', type: 'text' },
                { key: 'level', label: 'Level', type: 'text' },
                { key: 'duration', label: 'Duration', type: 'text' },
                { key: 'price', label: 'Price', type: 'text' },
            ]}
            fields={[
                { key: 'title', label: 'Title', type: 'text', required: true },
                {
                    key: 'level', label: 'Level', type: 'select', options: [
                        { label: 'Basic', value: 'Basic' },
                        { label: 'Medium', value: 'Medium' },
                        { label: 'Advanced', value: 'Advanced' },
                        { label: 'Specialized', value: 'Specialized' }
                    ], required: true
                },
                { key: 'duration', label: 'Duration', type: 'text' },
                { key: 'price', label: 'Price', type: 'text' },
                { key: 'image_url', label: 'Image', type: 'image', bucketName: 'training-images' },
                { key: 'short_description', label: 'Short Description', type: 'textarea' },
                { key: 'detailed_description', label: 'Detailed Description', type: 'textarea' },
                { key: 'google_form_url', label: 'Google Form URL', type: 'text' },
                { key: 'promotional_text', label: 'Promotional Text', type: 'text' },
                { key: 'key_learning_outcomes', label: 'Key Learning Outcomes (Comma separated)', type: 'textarea' },
                { key: 'target_audience', label: 'Target Audience (Comma separated)', type: 'textarea' },
                { key: 'highlights', label: 'Highlights (Comma separated)', type: 'textarea' },
            ]}
            onBeforeSave={(data) => {
                const listFields = ['key_learning_outcomes', 'target_audience', 'highlights'];
                const transformed = { ...data };
                listFields.forEach(field => {
                    if (typeof transformed[field] === 'string') {
                        transformed[field] = transformed[field].split(',').map((s: string) => s.trim()).filter(Boolean);
                    }
                });
                return transformed;
            }}
            onBeforeEdit={(data) => {
                const listFields = ['key_learning_outcomes', 'target_audience', 'highlights'];
                const transformed = { ...data };
                listFields.forEach(field => {
                    if (Array.isArray(transformed[field])) {
                        transformed[field] = transformed[field].join(', ');
                    }
                });
                return transformed;
            }}
        />
    );
}
