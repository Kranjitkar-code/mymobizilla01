import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { courses as staticCourses } from '@/data/trainingData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, ArrowLeft, Clock, ShieldCheck, MapPin, Loader2, Send, Phone, Mail, User, MessageSquare, Upload, QrCode } from 'lucide-react';
import { TrainingService } from '@/services/trainingService';
import { MOBIZILLA } from '@/config/mobizilla';
import { useToast } from '@/hooks/use-toast';

export default function CourseDetail() {
    const { id } = useParams<{ id: string }>();
    const [course, setCourse] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const enrollRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        message: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        async function loadCourse() {
            setLoading(true);
            try {
                if (id) {
                    const dbCourse = await TrainingService.getCourseById(id);
                    if (dbCourse) {
                        setCourse(dbCourse);
                    } else {
                        const staticCourse = staticCourses.find(c => c.id === id);
                        setCourse(staticCourse || null);
                    }
                }
            } catch (error) {
                console.error("Error loading course:", error);
                const staticCourse = staticCourses.find(c => c.id === id);
                setCourse(staticCourse || null);
            } finally {
                setLoading(false);
            }
        }
        loadCourse();
    }, [id]);

    const scrollToEnroll = () => {
        enrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleWhatsAppEnroll = () => {
        const text = `Hi Mobizilla! I want to enroll in *${course?.title}* (${course?.price}).%0A%0AName: ${formData.fullName}%0APhone: ${formData.phone}%0AEmail: ${formData.email}${formData.message ? `%0AMessage: ${formData.message}` : ''}`;
        window.open(`https://wa.me/${MOBIZILLA.contact.whatsapp}?text=${text}`, '_blank');
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.fullName.trim() || !formData.phone.trim()) {
            toast({
                title: 'Missing Information',
                description: 'Please fill in your name and phone number.',
                variant: 'destructive',
            });
            return;
        }

        setSubmitting(true);

        setTimeout(() => {
            setSubmitting(false);
            setSubmitted(true);
            toast({
                title: 'Enrollment Request Sent!',
                description: 'We will contact you shortly to confirm your enrollment.',
            });
            handleWhatsAppEnroll();
        }, 800);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="container py-20 text-center">
                <h1 className="text-4xl font-bold mb-4">Course Not Found</h1>
                <p className="mb-8 text-muted-foreground">The course you are looking for does not exist.</p>
                <Button asChild>
                    <Link to="/training">Back to Training</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            <Helmet>
                <title>{course.title} - Mobizilla Training</title>
                <meta name="description" content={course.shortDescription} />
            </Helmet>

            {/* Breadcrumb / Back */}
            <div className="bg-muted py-4">
                <div className="container px-4 mx-auto">
                    <Button variant="ghost" size="sm" asChild className="pl-0 hover:bg-transparent">
                        <Link to="/training" className="flex items-center text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Training Programs
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Hero Content */}
            <section className="bg-muted pb-12 pt-4">
                <div className="container px-4 mx-auto">
                    <div className="grid gap-8 lg:grid-cols-2">
                        <div>
                            <Badge className="mb-4 text-sm" variant="secondary">{course.level} Level</Badge>
                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
                                {course.title}
                            </h1>
                            <p className="text-lg text-muted-foreground mb-6">
                                {course.shortDescription}
                            </p>

                            <div className="flex flex-wrap gap-4 mb-8 text-sm font-medium">
                                <div className="flex items-center gap-2 px-3 py-1 bg-background rounded-full border">
                                    <Clock className="w-4 h-4 text-primary" />
                                    {course.duration}
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 bg-background rounded-full border">
                                    <ShieldCheck className="w-4 h-4 text-primary" />
                                    Certificate Included
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 bg-background rounded-full border">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    Kathmandu
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 items-center">
                                <div className="text-3xl font-bold text-primary">{course.price}</div>
                                <Button size="lg" onClick={scrollToEnroll} className="w-full sm:w-auto">
                                    Enroll Now
                                </Button>
                            </div>
                        </div>

                        <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg border-4 border-background">
                            <img
                                src={course.imageUrl}
                                alt={course.title}
                                className="object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Details Grid */}
            <section className="py-12 container px-4 mx-auto">
                <div className="grid gap-12 lg:grid-cols-3">

                    {/* Left Column: Description & Syllabus */}
                    <div className="lg:col-span-2 space-y-12">
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Course Overview</h2>
                            <div className="prose max-w-none text-muted-foreground">
                                <p>{course.detailedDescription}</p>
                            </div>
                        </div>

                        {course.keyLearningOutcomes && course.keyLearningOutcomes.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold mb-6">Key Learning Outcomes</h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {course.keyLearningOutcomes.map((outcome: string, idx: number) => (
                                        <div key={idx} className="flex gap-3 items-start p-4 rounded-lg bg-secondary/20 border">
                                            <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                            <span className="text-sm font-medium">{outcome}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {course.targetAudience && course.targetAudience.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold mb-4">Who Should Attend?</h2>
                                <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                                    {course.targetAudience.map((audience: string, idx: number) => (
                                        <li key={idx}>{audience}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Highlights & Sticky Enroll */}
                    <div className="space-y-8">
                        {course.highlights && course.highlights.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Course Highlights</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {course.highlights.map((highlight: string, idx: number) => (
                                        <div key={idx} className="flex items-center gap-3 text-sm">
                                            <div className="w-2 h-2 rounded-full bg-primary" />
                                            {highlight}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        <div className="bg-primary/5 p-6 rounded-xl border border-primary/20">
                            <h3 className="font-bold text-lg mb-2 text-primary">Ready to Start?</h3>
                            <p className="text-sm text-muted-foreground mb-4">{course.promotionalText}</p>
                            <Button className="w-full" onClick={scrollToEnroll}>
                                Secure Your Spot
                            </Button>
                        </div>
                    </div>

                </div>
            </section>

            {/* Course Video Preview (Specific to Basic Course) */}
            {(course.id === 'basic-mobile-repair' || course.title === 'Basic Mobile Repair Training') && (
                <section className="py-16 bg-background border-t">
                    <div className="container px-4 mx-auto max-w-4xl text-center">
                        <div className="mb-10">
                            <Badge className="mb-4" variant="outline">Course Preview</Badge>
                            <h2 className="text-3xl font-bold mb-4">Watch Our Training in Action</h2>
                            <p className="text-muted-foreground">Get a glimpse of what you'll learn in our basic mobile repair program.</p>
                        </div>
                        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-background ring-1 ring-border">
                            <iframe
                                src="https://www.youtube.com/embed/kT4o4Vmvr3M"
                                title="Basic Mobile Repair Training Preview"
                                className="absolute inset-0 w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </section>
            )}

            {/* Enrollment Section */}
            <section id="enrollment" ref={enrollRef} className="py-16 bg-muted/30 border-t">
                <div className="container px-4 mx-auto max-w-5xl">
                    <div className="text-center mb-12">
                        <Badge className="mb-4">Registration</Badge>
                        <h2 className="text-3xl font-bold mb-4">Enrollment Process</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">Follow these simple steps to confirm your admission in <strong>{course.title}</strong>.</p>
                    </div>

                    {/* Steps */}
                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        {/* Step 1 */}
                        <Card className="relative overflow-hidden border-t-4 border-t-primary">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full" />
                            <CardContent className="pt-6">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-lg shadow-md">1</div>
                                    <h3 className="font-bold text-lg">Scan & Pay</h3>
                                </div>
                                <p className="text-sm text-muted-foreground mb-5">
                                    Pay the course fee of <span className="font-bold text-primary text-base">{course.price}</span> via eSewa, Khalti, or bank transfer.
                                </p>

                                <div className="flex flex-col items-center gap-3">
                                    <div className="relative p-5 bg-white rounded-2xl border-2 border-dashed border-primary/30 shadow-inner">
                                        <div className="flex flex-col items-center gap-3">
                                            <QrCode className="w-24 h-24 text-primary/80" strokeWidth={1} />
                                            <span className="text-xs text-muted-foreground font-medium">Payment QR Code</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground text-center">
                                        Contact us on WhatsApp for the payment QR code
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-green-700 border-green-300 hover:bg-green-50"
                                        asChild
                                    >
                                        <a
                                            href={`https://wa.me/${MOBIZILLA.contact.whatsapp}?text=Hi!+I+want+to+pay+for+${encodeURIComponent(course.title)}+(${encodeURIComponent(course.price)}).+Please+share+the+payment+QR+code.`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <MessageSquare className="w-4 h-4 mr-1" />
                                            Get QR on WhatsApp
                                        </a>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Step 2 */}
                        <Card className="relative overflow-hidden border-t-4 border-t-blue-500">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-bl-full" />
                            <CardContent className="pt-6">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white font-bold text-lg shadow-md">2</div>
                                    <h3 className="font-bold text-lg">Fill the Form</h3>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Complete the enrollment form below with your details.
                                </p>
                                <ul className="space-y-3 text-sm text-muted-foreground">
                                    <li className="flex gap-2 items-center">
                                        <CheckCircle className="w-4 h-4 text-blue-500 shrink-0" />
                                        Enter your full name & phone
                                    </li>
                                    <li className="flex gap-2 items-center">
                                        <CheckCircle className="w-4 h-4 text-blue-500 shrink-0" />
                                        Add email for confirmation
                                    </li>
                                    <li className="flex gap-2 items-center">
                                        <CheckCircle className="w-4 h-4 text-blue-500 shrink-0" />
                                        Include any special requests
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Step 3 */}
                        <Card className="relative overflow-hidden border-t-4 border-t-green-500">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/5 rounded-bl-full" />
                            <CardContent className="pt-6">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white font-bold text-lg shadow-md">3</div>
                                    <h3 className="font-bold text-lg">Get Confirmed</h3>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Our team will verify your payment and send a confirmation via WhatsApp.
                                </p>
                                <ul className="space-y-3 text-sm text-muted-foreground">
                                    <li className="flex gap-2 items-center">
                                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                        Quick verification within 24 hrs
                                    </li>
                                    <li className="flex gap-2 items-center">
                                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                        Receive class schedule
                                    </li>
                                    <li className="flex gap-2 items-center">
                                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                        Start your training journey!
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Enrollment Form */}
                    <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
                        <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
                            <h3 className="text-xl font-bold">Enrollment Form — {course.title}</h3>
                            <p className="text-sm opacity-90 mt-1">Fill in your details and we'll get back to you within 24 hours.</p>
                        </div>

                        {submitted ? (
                            <div className="p-10 text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Enrollment Request Sent!</h3>
                                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                    Thank you, <strong>{formData.fullName}</strong>! Our team will contact you on <strong>{formData.phone}</strong> to confirm your spot in <strong>{course.title}</strong>.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Button asChild className="bg-green-600 hover:bg-green-700">
                                        <a
                                            href={`https://wa.me/${MOBIZILLA.contact.whatsapp}?text=Hi!+I+just+submitted+my+enrollment+for+${encodeURIComponent(course.title)}.+My+name+is+${encodeURIComponent(formData.fullName)}.`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <MessageSquare className="w-4 h-4 mr-2" />
                                            Chat on WhatsApp
                                        </a>
                                    </Button>
                                    <Button variant="outline" asChild>
                                        <a href={`tel:${MOBIZILLA.contact.phone1}`}>
                                            <Phone className="w-4 h-4 mr-2" />
                                            Call Us
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleFormSubmit} className="p-6 sm:p-8 space-y-6">
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName" className="flex items-center gap-2 text-sm font-medium">
                                            <User className="w-4 h-4 text-muted-foreground" />
                                            Full Name <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="fullName"
                                            name="fullName"
                                            placeholder="Your full name"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            required
                                            className="h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium">
                                            <Phone className="w-4 h-4 text-muted-foreground" />
                                            Phone Number <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            placeholder="+977-98XXXXXXXX"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                            className="h-11"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                        Email Address
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="your.email@example.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="h-11"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message" className="flex items-center gap-2 text-sm font-medium">
                                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                                        Message (optional)
                                    </Label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        placeholder="Any questions or special requests..."
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows={3}
                                    />
                                </div>

                                <div className="bg-muted/50 rounded-lg p-4 border">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Course:</span>
                                        <span className="font-medium">{course.title}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm mt-1">
                                        <span className="text-muted-foreground">Duration:</span>
                                        <span className="font-medium">{course.duration}</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-sm text-muted-foreground">Fee:</span>
                                        <span className="text-lg font-bold text-primary">{course.price}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="flex-1"
                                        disabled={submitting}
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4 mr-2" />
                                                Submit Enrollment
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="lg"
                                        className="flex-1 border-green-300 text-green-700 hover:bg-green-50"
                                        asChild
                                    >
                                        <a
                                            href={`https://wa.me/${MOBIZILLA.contact.whatsapp}?text=Hi!+I+want+to+enroll+in+${encodeURIComponent(course.title)}+(${encodeURIComponent(course.price)}).+Please+help+me+with+the+enrollment+process.`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <MessageSquare className="w-4 h-4 mr-2" />
                                            Enroll via WhatsApp
                                        </a>
                                    </Button>
                                </div>

                                <p className="text-xs text-center text-muted-foreground">
                                    By submitting, you agree to be contacted by Mobizilla regarding this course. We'll reach out within 24 hours.
                                </p>
                            </form>
                        )}
                    </div>

                    {/* Direct Contact */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-muted-foreground mb-3">Need help with enrollment? Contact us directly:</p>
                        <div className="flex flex-wrap justify-center gap-3">
                            <Button variant="outline" size="sm" asChild>
                                <a href={`tel:${MOBIZILLA.contact.phone1}`}>
                                    <Phone className="w-4 h-4 mr-1" />
                                    {MOBIZILLA.contact.phone1}
                                </a>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                                <a href={`mailto:${MOBIZILLA.contact.email}?subject=Enrollment: ${course.title}`}>
                                    <Mail className="w-4 h-4 mr-1" />
                                    {MOBIZILLA.contact.email}
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

