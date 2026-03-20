import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RichTextEditor from "../RichTextEditor";
import { ContentService } from "@/services/contentService";

interface WebsiteContent {
    heroTitle: string;
    heroSubtitle: string;
    aboutUs: string;
    contactPhone: string;
    contactEmail: string;
    contactAddress: string;
    servicesDescription: string;
}

export default function WebsiteContentPage() {
    const [content, setContent] = useState<WebsiteContent>({
        heroTitle: "",
        heroSubtitle: "",
        aboutUs: "",
        contactPhone: "",
        contactEmail: "",
        contactAddress: "",
        servicesDescription: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        setIsLoading(true);
        try {
            // Try to load from Supabase first
            const [heroTitle, heroSubtitle, aboutUs, contactPhone, contactEmail, contactAddress, servicesDesc] = await Promise.all([
                ContentService.getContentById("home-hero-title"),
                ContentService.getContentById("home-hero-subtitle"),
                ContentService.getContentById("about-us-content"),
                ContentService.getContentById("contact-phone"),
                ContentService.getContentById("contact-email"),
                ContentService.getContentById("contact-address"),
                ContentService.getContentById("services-description"),
            ]);

            setContent({
                heroTitle: heroTitle?.content || "Your One-Stop Solution for Mobile Repairs & Buyback",
                heroSubtitle: heroSubtitle?.content || "Expert technicians, genuine parts, and hassle-free service for all your device needs.",
                aboutUs: aboutUs?.content || `<h2>About Mobizilla</h2>
<p>Mobizilla is your trusted partner for all device repair needs. With years of experience and certified technicians, we provide quality service you can rely on.</p>

<p>At <strong>Mobizilla</strong>, we believe in transforming the mobile experience for everyone. Since our inception, we've been at the forefront of <em>mobile repair</em>, <em>device refurbishing</em>, and <em>mobile accessory solutions</em>, offering high-quality services at affordable prices.</p>

<h3>Why Choose Mobizilla?</h3>

<ul>
  <li><strong>Expert Mobile Repair Services</strong><br>Our certified technicians specialize in all major brands, including Apple, Samsung, Xiaomi, Oppo, Vivo, and more.</li>
  
  <li><strong>Buy, Sell & Exchange Phones</strong><br>Looking to upgrade your phone or sell your old one? Mobizilla offers honest device evaluations and competitive pricing.</li>
  
  <li><strong>Advanced Repair Lab</strong><br>Our lab is fully equipped with dust-free zones, laser machines, CNC glass cutting, and flex bonding tools.</li>
</ul>`,
                contactPhone: contactPhone?.content || "+977-1-5354999",
                contactEmail: contactEmail?.content || "mobizillanepal@gmail.com",
                contactAddress: contactAddress?.content || "Ratna Plaza, New Road, Kathmandu 44600, Nepal",
                servicesDescription: servicesDesc?.content || "From professional repairs to technical training, we provide comprehensive solutions for all your mobile device needs with expert care and quality guarantee.",
            });
        } catch (error) {
            console.error("Error loading content:", error);
            toast({
                title: "Error",
                description: "Failed to load website content",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Save to Supabase
            await Promise.all([
                ContentService.updateContent({
                    id: "home-hero-title",
                    title: "Homepage Hero Title",
                    content: content.heroTitle,
                    type: "text",
                    section: "home",
                    lastModified: new Date().toISOString(),
                }),
                ContentService.updateContent({
                    id: "home-hero-subtitle",
                    title: "Homepage Hero Subtitle",
                    content: content.heroSubtitle,
                    type: "text",
                    section: "home",
                    lastModified: new Date().toISOString(),
                }),
                ContentService.updateContent({
                    id: "about-us-content",
                    title: "About Us Content",
                    content: content.aboutUs,
                    type: "html",
                    section: "about",
                    lastModified: new Date().toISOString(),
                }),
                ContentService.updateContent({
                    id: "contact-phone",
                    title: "Contact Phone",
                    content: content.contactPhone,
                    type: "text",
                    section: "contact",
                    lastModified: new Date().toISOString(),
                }),
                ContentService.updateContent({
                    id: "contact-email",
                    title: "Contact Email",
                    content: content.contactEmail,
                    type: "text",
                    section: "contact",
                    lastModified: new Date().toISOString(),
                }),
                ContentService.updateContent({
                    id: "contact-address",
                    title: "Contact Address",
                    content: content.contactAddress,
                    type: "text",
                    section: "contact",
                    lastModified: new Date().toISOString(),
                }),
                ContentService.updateContent({
                    id: "services-description",
                    title: "Services Description",
                    content: content.servicesDescription,
                    type: "text",
                    section: "services",
                    lastModified: new Date().toISOString(),
                }),
            ]);

            toast({
                title: "Success",
                description: "Website content saved successfully! Changes are now live on your website.",
            });
        } catch (error) {
            console.error("Error saving content:", error);
            toast({
                title: "Error",
                description: "Failed to save website content. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const updateField = (field: keyof WebsiteContent, value: string) => {
        setContent((prev) => ({ ...prev, [field]: value }));
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Website Content</h1>
                    <p className="text-muted-foreground">Edit all content displayed on your website</p>
                </div>
                <Button onClick={handleSave} disabled={isSaving} size="lg">
                    {isSaving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Save All Changes
                        </>
                    )}
                </Button>
            </div>

            <Tabs defaultValue="hero" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="hero">Hero Section</TabsTrigger>
                    <TabsTrigger value="about">About Us</TabsTrigger>
                    <TabsTrigger value="contact">Contact Info</TabsTrigger>
                    <TabsTrigger value="services">Services</TabsTrigger>
                </TabsList>

                <TabsContent value="hero">
                    <Card>
                        <CardHeader>
                            <CardTitle>Homepage Hero Section</CardTitle>
                            <CardDescription>
                                Main headline and subtitle displayed on the homepage
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="heroTitle">Hero Title</Label>
                                <Input
                                    id="heroTitle"
                                    value={content.heroTitle}
                                    onChange={(e) => updateField("heroTitle", e.target.value)}
                                    placeholder="Your One-Stop Solution for Mobile Repairs & Buyback"
                                />
                                <p className="text-xs text-muted-foreground">
                                    This is the main headline visitors see first
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                                <Textarea
                                    id="heroSubtitle"
                                    value={content.heroSubtitle}
                                    onChange={(e) => updateField("heroSubtitle", e.target.value)}
                                    placeholder="Expert technicians, genuine parts..."
                                    rows={3}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Supporting text below the main headline
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="about">
                    <Card>
                        <CardHeader>
                            <CardTitle>About Us Content</CardTitle>
                            <CardDescription>
                                Company description and mission statement
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>About Us Description</Label>
                                <RichTextEditor
                                    content={content.aboutUs}
                                    onChange={(value) => updateField("aboutUs", value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Use the toolbar to format text, add images, and create lists
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="contact">
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                            <CardDescription>
                                Business contact details displayed across the website
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="contactPhone">Phone Number</Label>
                                <Input
                                    id="contactPhone"
                                    value={content.contactPhone}
                                    onChange={(e) => updateField("contactPhone", e.target.value)}
                                    placeholder="+977-1-XXXXXXX"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="contactEmail">Email Address</Label>
                                <Input
                                    id="contactEmail"
                                    type="email"
                                    value={content.contactEmail}
                                    onChange={(e) => updateField("contactEmail", e.target.value)}
                                    placeholder="contact@mobizilla.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="contactAddress">Address</Label>
                                <Textarea
                                    id="contactAddress"
                                    value={content.contactAddress}
                                    onChange={(e) => updateField("contactAddress", e.target.value)}
                                    placeholder="Kathmandu, Nepal"
                                    rows={2}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="services">
                    <Card>
                        <CardHeader>
                            <CardTitle>Services Description</CardTitle>
                            <CardDescription>
                                Overview of your service offerings
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="servicesDescription">Services Overview</Label>
                                <Textarea
                                    id="servicesDescription"
                                    value={content.servicesDescription}
                                    onChange={(e) => updateField("servicesDescription", e.target.value)}
                                    placeholder="From professional repairs to technical training..."
                                    rows={4}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Brief description of your services
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="flex justify-end pt-4">
                <Button onClick={handleSave} disabled={isSaving} size="lg">
                    {isSaving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Save All Changes
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
