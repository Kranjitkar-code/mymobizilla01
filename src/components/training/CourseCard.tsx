
import { Course } from '@/data/trainingData';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CourseCardProps {
    course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
    const levelColor = {
        Basic: 'bg-green-100 text-green-800',
        Medium: 'bg-blue-100 text-blue-800',
        Advanced: 'bg-purple-100 text-purple-800',
        Specialized: 'bg-orange-100 text-orange-800',
    };

    const fallbackImage = "https://images.unsplash.com/photo-1540340334547-494005aa4a46?q=80&w=800&auto=format&fit=crop";

    return (
        <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg border-muted">
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
                <img
                    src={course.imageUrl || fallbackImage}
                    alt={course.title}
                    className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = fallbackImage;
                    }}
                />
                <Badge className={`absolute top-4 right-4 ${levelColor[course.level as keyof typeof levelColor] || levelColor.Basic} hover:${levelColor[course.level as keyof typeof levelColor] || levelColor.Basic} border-none`}>
                    {course.level}
                </Badge>
            </div>
            <CardHeader>
                <CardTitle className="line-clamp-2 text-xl">{course.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
                <p className="text-muted-foreground line-clamp-3 text-sm">
                    {course.shortDescription}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1 font-semibold text-primary">
                        <span className="text-sm">₨</span>
                        <span>{course.price}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full group">
                    <Link to={`/training/${course.id}`}>
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
