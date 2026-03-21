import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Loader2, Plus, Trash2, Upload, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SupabaseBannersService, { type BannerRow } from "@/services/supabaseBannersService";

interface Banner {
    id: string;
    title: string;
    imageUrl: string;
    link: string;
    isActive: boolean;
}

const DEFAULT_BANNERS: Banner[] = [
    { id: "1", title: "Repair Services", imageUrl: "/images/01.webp", link: "/repair", isActive: true },
    { id: "2", title: "Sell Your Device", imageUrl: "/images/02.webp", link: "/buyback", isActive: true },
];

function toLocal(row: BannerRow): Banner {
    return { id: row.id, title: row.title, imageUrl: row.image_url || '', link: row.link_url || '', isActive: row.active };
}

export default function BannersPage() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        setIsLoading(true);
        try {
            const rows = await SupabaseBannersService.getAllBanners();
            setBanners(rows.length > 0 ? rows.map(toLocal) : DEFAULT_BANNERS);
        } catch (error) {
            console.error("Error loading banners:", error);
            setBanners(DEFAULT_BANNERS);
            toast({ title: "Error", description: "Failed to load banners", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const rows = banners.map(b => ({
                title: b.title,
                image_url: b.imageUrl || null,
                link_url: b.link || null,
                active: b.isActive,
            }));
            const result = await SupabaseBannersService.replaceAll(rows);
            if (!result.success) throw result.error;

            toast({ title: "Success", description: "Banners saved successfully" });
            await loadContent();
        } catch (error) {
            console.error("Error saving banners:", error);
            toast({ title: "Error", description: "Failed to save banners", variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    const addBanner = () => {
        const newBanner: Banner = {
            id: Date.now().toString(),
            title: "New Banner",
            imageUrl: "",
            link: "",
            isActive: true,
        };
        setBanners([...banners, newBanner]);
    };

    const removeBanner = (id: string) => {
        setBanners(banners.filter((b) => b.id !== id));
    };

    const updateBanner = (id: string, field: keyof Banner, value: string | boolean) => {
        setBanners(
            banners.map((b) => (b.id === id ? { ...b, [field]: value } : b))
        );
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
                    <h1 className="text-3xl font-bold tracking-tight">Banners</h1>
                    <p className="text-muted-foreground">Manage homepage banner images</p>
                </div>
                <Button onClick={addBanner}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Banner
                </Button>
            </div>

            <div className="space-y-4">
                {banners.map((banner) => (
                    <Card key={banner.id}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Banner #{banner.id.slice(0, 8)}</CardTitle>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => removeBanner(banner.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor={`title-${banner.id}`}>Title</Label>
                                    <Input
                                        id={`title-${banner.id}`}
                                        value={banner.title}
                                        onChange={(e) => updateBanner(banner.id, "title", e.target.value)}
                                        placeholder="Banner title"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor={`link-${banner.id}`}>Link URL</Label>
                                    <Input
                                        id={`link-${banner.id}`}
                                        value={banner.link}
                                        onChange={(e) => updateBanner(banner.id, "link", e.target.value)}
                                        placeholder="/repair"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor={`image-${banner.id}`} className="flex items-center gap-2">
                                    <ImageIcon className="h-4 w-4" />
                                    Image URL
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        id={`image-${banner.id}`}
                                        value={banner.imageUrl}
                                        onChange={(e) => updateBanner(banner.id, "imageUrl", e.target.value)}
                                        placeholder="/images/banner.webp"
                                        className="flex-1"
                                    />
                                    <Button variant="outline" size="icon">
                                        <Upload className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {banner.imageUrl && (
                                <div className="rounded-lg border overflow-hidden">
                                    <img
                                        src={banner.imageUrl}
                                        alt={banner.title}
                                        className="w-full h-48 object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = "https://via.placeholder.com/800x400?text=Banner+Image";
                                        }}
                                    />
                                </div>
                            )}

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id={`active-${banner.id}`}
                                    checked={banner.isActive}
                                    onChange={(e) => updateBanner(banner.id, "isActive", e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <Label htmlFor={`active-${banner.id}`} className="cursor-pointer">
                                    Active
                                </Label>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {banners.length === 0 && (
                    <Card className="p-12">
                        <div className="text-center text-muted-foreground">
                            <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No banners yet. Click "Add Banner" to create one.</p>
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
    );
}
