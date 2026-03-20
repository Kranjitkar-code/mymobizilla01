import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Loader2, Upload, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RichTextEditor from "../RichTextEditor";

export default function AboutUsPage() {
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        setIsLoading(true);
        try {
            const saved = localStorage.getItem("aboutUs");
            const savedImage = localStorage.getItem("aboutUsImage");

            if (saved) {
                setDescription(saved);
            } else {
                // Default content with HTML formatting
                setDescription(`<h2>About Mobizilla</h2>
<p>Mobizilla is your trusted partner for all device repair needs. With years of experience and certified technicians, we provide quality service you can rely on.</p>

<p>At <strong>Mobizilla</strong>, we believe in transforming the mobile experience for everyone. Since our inception, we've been at the forefront of <em>mobile repair</em>, <em>device refurbishing</em>, and <em>mobile accessory solutions</em>, offering high-quality services at affordable prices.</p>

<h3>Why Choose Mobizilla?</h3>

<ul>
  <li><strong>Expert Mobile Repair Services</strong><br>Our certified technicians specialize in all major brands, including Apple, Samsung, Xiaomi, Oppo, Vivo, and more. We use premium parts and cutting-edge machines to ensure every repair meets the highest standards.</li>
  
  <li><strong>Buy, Sell &amp; Exchange Phones</strong><br>Looking to upgrade your phone or sell your old one? Mobizilla offers honest device evaluations and competitive pricing so you get the best value.</li>
  
  <li><strong>Advanced Repair Lab</strong><br>Our lab is fully equipped with dust-free zones, laser machines, CNC glass cutting, and flex bonding tools to handle even the most complex repairs.</li>
</ul>

<h3>Our Mission</h3>
<p>To make mobile repair and accessory shopping <strong>convenient, affordable, and trustworthy</strong> for every customer.</p>

<h3>Our Vision</h3>
<p>To become Nepal's leading name in <strong>mobile repair innovation</strong>, known for our quality, customer satisfaction, and technological excellence.</p>`);
            }

            if (savedImage) {
                setImage(savedImage);
            }
        } catch (error) {
            console.error("Error loading content:", error);
            toast({
                title: "Error",
                description: "Failed to load content",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            localStorage.setItem("aboutUs", description);
            localStorage.setItem("aboutUsImage", image);

            toast({
                title: "Success",
                description: "About Us content saved successfully",
            });
        } catch (error) {
            console.error("Error saving content:", error);
            toast({
                title: "Error",
                description: "Failed to save content",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            setImage(result);
        };
        reader.readAsDataURL(file);
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
            <div>
                <h1 className="text-3xl font-bold tracking-tight">About Us</h1>
                <p className="text-muted-foreground">Manage your company's About Us content</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Information</CardTitle>
                    <CardDescription>
                        Edit the About Us content that appears on your website
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <RichTextEditor
                            content={description}
                            onChange={setDescription}
                        />
                        <p className="text-xs text-muted-foreground">
                            Use the toolbar to format text, add images, and create lists
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image" className="flex items-center gap-2">
                            <ImageIcon className="h-4 w-4" />
                            Featured Image
                        </Label>
                        <div className="flex gap-4 items-start">
                            <div className="flex-1">
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="cursor-pointer"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Upload a featured image for your About Us section
                                </p>
                            </div>
                        </div>

                        {image && (
                            <div className="mt-4 rounded-lg border overflow-hidden max-w-md">
                                <img
                                    src={image}
                                    alt="About Us"
                                    className="w-full h-auto"
                                />
                            </div>
                        )}
                    </div>

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
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
