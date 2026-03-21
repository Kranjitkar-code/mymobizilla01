import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, Loader2, Plus, Trash2, Wrench } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AdminCrudPage } from "@/components/admin/crud/AdminCrudShell";
import SupabaseServicesService, { type ServiceRow } from "@/services/supabaseServicesService";

interface Service {
    id: string;
    title: string;
    description: string;
    price: string;
    icon: string;
}

const DEFAULT_SERVICES: Service[] = [
    { id: "1", title: "Screen Replacement", description: "Professional screen replacement for all smartphone models with genuine parts", price: "₨1,500 - ₨8,000", icon: "📱" },
    { id: "2", title: "Battery Replacement", description: "High-quality battery replacement with 1-year warranty", price: "₨800 - ₨3,500", icon: "🔋" },
    { id: "3", title: "Water Damage Repair", description: "Expert water damage treatment and motherboard repair", price: "₨3,999+", icon: "💧" },
];

function toLocal(row: ServiceRow): Service {
    return { id: row.id, title: row.title, description: row.description || '', price: row.price_range || '', icon: row.icon || '🔧' };
}

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        setIsLoading(true);
        try {
            const rows = await SupabaseServicesService.getAll();
            setServices(rows.length > 0 ? rows.map(toLocal) : DEFAULT_SERVICES);
        } catch (error) {
            console.error("Error loading services:", error);
            setServices(DEFAULT_SERVICES);
            toast({ title: "Error", description: "Failed to load services", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const rows = services.map(s => ({
                title: s.title,
                description: s.description || null,
                price_range: s.price || null,
                icon: s.icon || null,
            }));
            const result = await SupabaseServicesService.replaceAll(rows);
            if (!result.success) throw result.error;

            toast({ title: "Success", description: "Services saved successfully" });
            await loadContent();
        } catch (error) {
            console.error("Error saving services:", error);
            toast({ title: "Error", description: "Failed to save services", variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    const addService = () => {
        const newService: Service = {
            id: Date.now().toString(),
            title: "New Service",
            description: "",
            price: "",
            icon: "🔧",
        };
        setServices([...services, newService]);
    };

    const removeService = (id: string) => {
        setServices(services.filter((s) => s.id !== id));
    };

    const updateService = (id: string, field: keyof Service, value: string) => {
        setServices(
            services.map((s) => (s.id === id ? { ...s, [field]: value } : s))
        );
    };

    if (isLoading) {
        return (
            <AdminCrudPage>
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            </AdminCrudPage>
        );
    }

    return (
        <AdminCrudPage>
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Services</h1>
                    <p className="text-muted-foreground">Manage your service offerings</p>
                </div>
                <Button onClick={addService}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Service
                </Button>
            </div>

            <div className="space-y-4">
                {services.map((service) => (
                    <Card key={service.id}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <span className="text-2xl">{service.icon}</span>
                                    {service.title}
                                </CardTitle>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => removeService(service.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor={`title-${service.id}`}>Service Title</Label>
                                    <Input
                                        id={`title-${service.id}`}
                                        value={service.title}
                                        onChange={(e) => updateService(service.id, "title", e.target.value)}
                                        placeholder="Screen Replacement"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor={`price-${service.id}`}>Price Range</Label>
                                    <Input
                                        id={`price-${service.id}`}
                                        value={service.price}
                                        onChange={(e) => updateService(service.id, "price", e.target.value)}
                                        placeholder="₨1,500 - ₨8,000"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor={`icon-${service.id}`}>Icon (Emoji)</Label>
                                <Input
                                    id={`icon-${service.id}`}
                                    value={service.icon}
                                    onChange={(e) => updateService(service.id, "icon", e.target.value)}
                                    placeholder="📱"
                                    className="w-24"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor={`description-${service.id}`}>Description</Label>
                                <Textarea
                                    id={`description-${service.id}`}
                                    value={service.description}
                                    onChange={(e) => updateService(service.id, "description", e.target.value)}
                                    placeholder="Describe your service..."
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {services.length === 0 && (
                    <Card className="p-12">
                        <div className="text-center text-muted-foreground">
                            <Wrench className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No services yet. Click "Add Service" to create one.</p>
                        </div>
                    </Card>
                )}
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
                            Save All Changes
                        </>
                    )}
                </Button>
            </div>
        </div>
        </AdminCrudPage>
    );
}
