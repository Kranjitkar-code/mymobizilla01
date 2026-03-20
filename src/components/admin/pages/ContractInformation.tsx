import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Loader2, Phone, Mail, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContactInfo {
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
}

export default function ContractInformationPage() {
    const [contactInfo, setContactInfo] = useState<ContactInfo>({
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
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
            const saved = localStorage.getItem("contactInfo");
            if (saved) {
                setContactInfo(JSON.parse(saved));
            } else {
                // Default content
                setContactInfo({
                    phone: "+977-1-5354999",
                    email: "mobizillanepal@gmail.com",
                    address: "Ratna Plaza, New Road",
                    city: "Kathmandu",
                    state: "Bagmati Province",
                    pincode: "44600",
                });
            }
        } catch (error) {
            console.error("Error loading content:", error);
            toast({
                title: "Error",
                description: "Failed to load contact information",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            localStorage.setItem("contactInfo", JSON.stringify(contactInfo));

            toast({
                title: "Success",
                description: "Contact information saved successfully",
            });
        } catch (error) {
            console.error("Error saving content:", error);
            toast({
                title: "Error",
                description: "Failed to save contact information",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const updateField = (field: keyof ContactInfo, value: string) => {
        setContactInfo((prev) => ({ ...prev, [field]: value }));
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
                <h1 className="text-3xl font-bold tracking-tight">Contact Information</h1>
                <p className="text-muted-foreground">Manage your business contact details</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Contact Details</CardTitle>
                    <CardDescription>
                        Update your contact information displayed on the website
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                Phone Number
                            </Label>
                            <Input
                                id="phone"
                                value={contactInfo.phone}
                                onChange={(e) => updateField("phone", e.target.value)}
                                placeholder="+977-1-XXXXXXX"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={contactInfo.email}
                                onChange={(e) => updateField("email", e.target.value)}
                                placeholder="contact@mobizilla.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address" className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Street Address
                        </Label>
                        <Input
                            id="address"
                            value={contactInfo.address}
                            onChange={(e) => updateField("address", e.target.value)}
                            placeholder="123 Tech Street"
                        />
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                                id="city"
                                value={contactInfo.city}
                                onChange={(e) => updateField("city", e.target.value)}
                                placeholder="Kathmandu"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input
                                id="state"
                                value={contactInfo.state}
                                onChange={(e) => updateField("state", e.target.value)}
                                placeholder="Bagmati Province"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="pincode">Pincode</Label>
                            <Input
                                id="pincode"
                                value={contactInfo.pincode}
                                onChange={(e) => updateField("pincode", e.target.value)}
                                placeholder="44600"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={handleSave} disabled={isSaving}>
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
