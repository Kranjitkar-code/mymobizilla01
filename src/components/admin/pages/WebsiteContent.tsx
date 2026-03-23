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
import { ContentService, type WebsiteContentFormState } from "@/services/contentService";

export default function WebsiteContentPage() {
    const [content, setContent] = useState<WebsiteContentFormState>({
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
            const loaded = await ContentService.loadWebsiteContentForm();
            setContent(loaded);
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "Failed to load website content";
            setContent(ContentService.loadWebsiteContentFormDefaults());
            toast({
                title: "Error",
                description: msg,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await ContentService.saveWebsiteContentForm(content);
            toast({
                title: "Success",
                description: "Website content saved successfully! Changes are now live on your website.",
            });
        } catch (error: unknown) {
            const msg =
                error && typeof error === "object" && "message" in error
                    ? String((error as { message: string }).message)
                    : "Failed to save website content. Please try again.";
            toast({
                title: "Error",
                description: msg,
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const updateField = (field: keyof WebsiteContentFormState, value: string) => {
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
