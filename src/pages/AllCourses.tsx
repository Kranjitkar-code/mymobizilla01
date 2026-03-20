import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Course, courses as staticCourses } from '@/data/trainingData';
import { CourseCard } from '@/components/training/CourseCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { TrainingService } from '@/services/trainingService';

export default function AllCourses() {
    const [courses, setCourses] = useState<Course[]>(staticCourses);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadCourses() {
            try {
                const dbCourses = await TrainingService.getAllCourses();
                if (dbCourses && dbCourses.length > 0) {
                    setCourses(dbCourses);
                }
            } catch (error) {
                console.error("Failed to load courses from DB:", error);
            } finally {
                setLoading(false);
            }
        }
        loadCourses();
    }, []);

    return (
        <div className="min-h-screen bg-background pb-20">
            <Helmet>
                <title>All Training Programs - Mobizilla</title>
                <meta name="description" content="Browse our complete list of mobile repair training courses." />
            </Helmet>

            <div className="bg-muted py-12 mb-10">
                <div className="container px-4 mx-auto">
                    <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent" asChild>
                        <Link to="/training" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Training Overview
                        </Link>
                    </Button>
                    <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">All Training Programs</h1>
                    <p className="text-xl text-muted-foreground mt-4 max-w-2xl leading-relaxed">
                        Master the tools and techniques of modern electronic repair with our professional certification courses.
                    </p>
                </div>
            </div>

            <div className="container px-4 mx-auto">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">Loading complete course catalog...</p>
                    </div>
                ) : (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {courses.map((course) => (
                            <div key={course.id} className="h-full">
                                <CourseCard course={course} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
