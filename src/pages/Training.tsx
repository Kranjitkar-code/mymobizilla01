import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Course, courses as staticCourses } from '@/data/trainingData';
import { CourseCard } from '@/components/training/CourseCard';
import { CheckCircle2, Award, Users, Wrench, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TrainingService } from '@/services/trainingService';

export default function Training() {
  const [courses, setCourses] = useState<Course[]>(staticCourses);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const categories = ['Basic', 'Medium', 'Advanced', 'Specialized'];

  useEffect(() => {
    async function loadData() {
      try {
        const [dbCourses, dbVideos] = await Promise.all([
          TrainingService.getAllCourses(),
          TrainingService.getAllVideos()
        ]);

        if (dbCourses && dbCourses.length > 0) {
          setCourses(dbCourses);
        }
        setVideos(dbVideos || []);
      } catch (error) {
        console.error('Failed to load training data', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Mobile Repair Training Nepal — Mobizilla Academy</title>
        <meta name="description" content="Learn professional mobile phone repair. Basic to advanced chip-level training. Get certified at Mobizilla Academy, Kathmandu." />
        <link rel="canonical" href="https://mymobizilla.com/training" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container px-4 mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-primary/10 text-primary border border-primary/20">
            <Award className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Mobizilla Academy — Certified Training</span>
          </div>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-6xl text-foreground">
            Mobizilla Academy — <span className="text-primary italic">Learn Mobile Repair</span>
          </h1>
          <p className="max-w-2xl mx-auto mb-10 text-lg text-muted-foreground leading-relaxed">
            Nepal's premier mobile repair training center. Whether you're starting a new career or upgrading your skills, our hands-on courses at New Road, Kathmandu make you an expert technician.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row justify-center">
            <Button size="lg" asChild className="shadow-lg shadow-primary/20 transition-all hover:scale-105">
              <a href="#courses">View Courses</a>
            </Button>
            <Button size="lg" variant="outline" asChild className="transition-all hover:bg-muted/50">
              <Link to="/contact">Contact for Enquiry</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30 border-y border-border/50">
        <div className="container px-4 mx-auto">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: Wrench, title: "Hands-on Practice", desc: "Learn by doing with real devices and state-of-the-art tools in our dedicated labs." },
              { icon: Users, title: "Expert Mentors", desc: "Get trained by industry veterans with years of experience in mobile diagnostics and repair." },
              { icon: CheckCircle2, title: "100% Job Assistance", desc: "We support your career growth with placement assistance and business setup guidance." }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center p-8 bg-card rounded-2xl shadow-sm border border-border/50 transition-all hover:shadow-md hover:border-primary/20">
                <div className="p-4 mb-6 rounded-2xl bg-primary/10 text-primary ring-4 ring-primary/5">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="mb-3 text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-24">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold md:text-5xl tracking-tight mb-4">Training Programs</h2>
            <p className="max-w-xl mx-auto text-lg text-muted-foreground leading-relaxed">
              Choose the right path for your career goals from our curated selection of professional courses.
            </p>
          </div>

          <Tabs defaultValue="Basic" className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="grid w-full max-w-xl grid-cols-4 p-1 bg-muted/50 border border-border/50 rounded-xl">
                {categories.map((cat) => (
                  <TabsTrigger key={cat} value={cat} className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    {cat}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground animate-pulse">Fetching latest courses...</p>
              </div>
            ) : (
              categories.map((level) => (
                <TabsContent key={level} value={level} className="mt-0 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {courses
                      .filter((c) => c.level === level)
                      .map((course) => (
                        <div key={course.id} className="h-full">
                          <CourseCard course={course} />
                        </div>
                      ))}
                    {courses.filter((c) => c.level === level).length === 0 && (
                      <div className="col-span-full text-center py-24 bg-muted/20 rounded-3xl border-2 border-dashed border-border/50">
                        <Users className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                        <h4 className="text-xl font-medium text-muted-foreground">New courses coming soon!</h4>
                        <p className="text-sm text-muted-foreground/60 mt-2">Check back later or contact us for custom training requests.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))
            )}
          </Tabs>

          <div className="flex justify-center mt-20">
            <Button variant="outline" size="lg" asChild className="rounded-full px-10 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all">
              <Link to="/training/all">Browse More Programs</Link>
            </Button>
          </div>
        </div>
      </section>
      {/* Videos Section */}
      {videos.length > 0 && (
        <section id="videos" className="py-24 bg-muted/30 border-t border-border/50">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold md:text-5xl tracking-tight mb-4">Training Videos</h2>
              <p className="max-w-xl mx-auto text-lg text-muted-foreground leading-relaxed">
                Watch our latest training sessions and repair demonstrations.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => {
                // simple youtube link converter
                let embedUrl = video.video_url;
                if (video.video_url.includes('youtube.com/watch?v=')) {
                  embedUrl = video.video_url.replace('watch?v=', 'embed/');
                } else if (video.video_url.includes('youtu.be/')) {
                  embedUrl = video.video_url.replace('youtu.be/', 'youtube.com/embed/');
                }

                return (
                  <div key={video.id} className="flex flex-col bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm transition-all hover:shadow-md">
                    <div className="aspect-video w-full bg-slate-900">
                      <iframe
                        src={embedUrl}
                        title={video.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{video.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">{video.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
