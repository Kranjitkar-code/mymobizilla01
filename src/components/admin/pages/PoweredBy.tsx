import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Loader2, Plus, Trash2, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { AdminCrudPage, AdminCrudToolbar } from "@/components/admin/crud/AdminCrudShell";

interface Partner {
    id: string;
    name: string;
    logoUrl: string;
    website?: string;
}

export default function PoweredByPage() {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
    const [newPartner, setNewPartner] = useState({ name: "", logoUrl: "", website: "" });
    const { toast } = useToast();

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        setIsLoading(true);
        try {
            const saved = localStorage.getItem("poweredByPartners");
            if (saved) {
                setPartners(JSON.parse(saved));
            } else {
                // Start with empty array - no pre-loaded partners
                setPartners([]);
            }
        } catch (error) {
            console.error("Error loading partners:", error);
            toast({
                title: "Error",
                description: "Failed to load partners",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            localStorage.setItem("poweredByPartners", JSON.stringify(partners));

            toast({
                title: "Success",
                description: "Partners saved successfully",
            });
        } catch (error) {
            console.error("Error saving partners:", error);
            toast({
                title: "Error",
                description: "Failed to save partners",
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
            setNewPartner({ ...newPartner, logoUrl: result });
        };
        reader.readAsDataURL(file);
    };

    const handleAddPartner = () => {
        if (!newPartner.name || !newPartner.logoUrl) {
            toast({
                title: "Error",
                description: "Please provide partner name and logo",
                variant: "destructive",
            });
            return;
        }

        const partner: Partner = {
            id: Date.now().toString(),
            name: newPartner.name,
            logoUrl: newPartner.logoUrl,
            website: newPartner.website,
        };

        setPartners([...partners, partner]);
        setNewPartner({ name: "", logoUrl: "", website: "" });
        setIsDialogOpen(false);

        toast({
            title: "Success",
            description: "Partner added successfully",
        });
    };

    const handleEditPartner = (partner: Partner) => {
        setEditingPartner(partner);
        setNewPartner({
            name: partner.name,
            logoUrl: partner.logoUrl,
            website: partner.website || "",
        });
        setIsDialogOpen(true);
    };

    const handleUpdatePartner = () => {
        if (!editingPartner) return;

        setPartners(
            partners.map((p) =>
                p.id === editingPartner.id
                    ? {
                        ...p,
                        name: newPartner.name,
                        logoUrl: newPartner.logoUrl,
                        website: newPartner.website,
                    }
                    : p
            )
        );

        setEditingPartner(null);
        setNewPartner({ name: "", logoUrl: "", website: "" });
        setIsDialogOpen(false);

        toast({
            title: "Success",
            description: "Partner updated successfully",
        });
    };

    const handleDeletePartner = (id: string) => {
        setPartners(partners.filter((p) => p.id !== id));
        toast({
            title: "Success",
            description: "Partner deleted successfully",
        });
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setEditingPartner(null);
        setNewPartner({ name: "", logoUrl: "", website: "" });
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
            <AdminCrudToolbar
                title="Powered By Partners"
                description="Manage your business partners and sponsors"
                actions={
                    <>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => setEditingPartner(null)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Partner
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>{editingPartner ? "Edit Partner" : "Add Partner"}</DialogTitle>
                                <DialogDescription>
                                    {editingPartner ? "Update partner information" : "Add a new business partner or sponsor"}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="partnerName">Partner Name</Label>
                                    <Input
                                        id="partnerName"
                                        value={newPartner.name}
                                        onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                                        placeholder="e.g., TechCorp Solutions"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="website">Website (Optional)</Label>
                                    <Input
                                        id="website"
                                        value={newPartner.website}
                                        onChange={(e) => setNewPartner({ ...newPartner, website: e.target.value })}
                                        placeholder="https://example.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="logo">Partner Logo</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="logo"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="cursor-pointer"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Upload a logo image (PNG, JPG, or SVG recommended)
                                    </p>
                                </div>

                                {newPartner.logoUrl && (
                                    <div className="rounded-lg border p-4 bg-gray-50">
                                        <p className="text-sm font-medium mb-2">Logo Preview:</p>
                                        <div className="bg-white rounded border p-4 flex items-center justify-center">
                                            <img
                                                src={newPartner.logoUrl}
                                                alt="Partner logo preview"
                                                className="max-h-24 max-w-full object-contain"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <DialogFooter className="gap-2 border-t pt-4 sm:gap-0">
                                <Button variant="outline" onClick={handleDialogClose}>
                                    Cancel
                                </Button>
                                <Button onClick={editingPartner ? handleUpdatePartner : handleAddPartner}>
                                    Save
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {partners.length > 0 && (
                        <Button onClick={handleSave} disabled={isSaving} variant="default">
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
                    )}
                    </>
                }
            />

            {partners.length === 0 ? (
                <Card className="p-12">
                    <div className="text-center text-muted-foreground">
                        <Building2 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold mb-2">No Partners Yet</h3>
                        <p className="mb-4">Start by adding your first business partner or sponsor</p>
                        <Button onClick={() => setIsDialogOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Partner
                        </Button>
                    </div>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {partners.map((partner) => (
                        <Card key={partner.id} className="overflow-hidden hover:shadow-lg transition-all group">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg">{partner.name}</CardTitle>
                                {partner.website && (
                                    <CardDescription className="text-xs truncate">
                                        <a
                                            href={partner.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:underline text-blue-600"
                                        >
                                            {partner.website}
                                        </a>
                                    </CardDescription>
                                )}
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-center min-h-[120px] border">
                                    <img
                                        src={partner.logoUrl}
                                        alt={partner.name}
                                        className="max-h-20 max-w-full object-contain"
                                        onError={(e) => {
                                            e.currentTarget.src = "https://via.placeholder.com/200x80?text=Logo";
                                        }}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => handleEditPartner(partner)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDeletePartner(partner.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </AdminCrudPage>
    );
}
