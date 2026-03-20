import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Loader2, Plus, Trash2, Palette } from "lucide-react";
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

interface Color {
    id: string;
    name: string;
    hexCode: string;
}

export default function ColorsPage() {
    const [colors, setColors] = useState<Color[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingColor, setEditingColor] = useState<Color | null>(null);
    const [newColor, setNewColor] = useState({ name: "", hexCode: "#000000" });
    const { toast } = useToast();

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        setIsLoading(true);
        try {
            const saved = localStorage.getItem("deviceColors");
            if (saved) {
                setColors(JSON.parse(saved));
            } else {
                // Default colors for devices
                setColors([
                    { id: "1", name: "Space Gray", hexCode: "#4A4A4A" },
                    { id: "2", name: "Silver", hexCode: "#C0C0C0" },
                    { id: "3", name: "Gold", hexCode: "#FFD700" },
                    { id: "4", name: "Rose Gold", hexCode: "#B76E79" },
                    { id: "5", name: "Midnight Black", hexCode: "#1C1C1C" },
                    { id: "6", name: "Pacific Blue", hexCode: "#4A90E2" },
                    { id: "7", name: "Green", hexCode: "#34C759" },
                    { id: "8", name: "Purple", hexCode: "#AF52DE" },
                    { id: "9", name: "Red", hexCode: "#FF3B30" },
                    { id: "10", name: "White", hexCode: "#FFFFFF" },
                ]);
            }
        } catch (error) {
            console.error("Error loading colors:", error);
            toast({
                title: "Error",
                description: "Failed to load colors",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            localStorage.setItem("deviceColors", JSON.stringify(colors));

            toast({
                title: "Success",
                description: "Colors saved successfully",
            });
        } catch (error) {
            console.error("Error saving colors:", error);
            toast({
                title: "Error",
                description: "Failed to save colors",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddColor = () => {
        if (!newColor.name || !newColor.hexCode) {
            toast({
                title: "Error",
                description: "Please fill in all fields",
                variant: "destructive",
            });
            return;
        }

        const color: Color = {
            id: Date.now().toString(),
            name: newColor.name,
            hexCode: newColor.hexCode,
        };

        setColors([...colors, color]);
        setNewColor({ name: "", hexCode: "#000000" });
        setIsDialogOpen(false);

        toast({
            title: "Success",
            description: "Color added successfully",
        });
    };

    const handleEditColor = (color: Color) => {
        setEditingColor(color);
        setNewColor({ name: color.name, hexCode: color.hexCode });
        setIsDialogOpen(true);
    };

    const handleUpdateColor = () => {
        if (!editingColor) return;

        setColors(
            colors.map((c) =>
                c.id === editingColor.id
                    ? { ...c, name: newColor.name, hexCode: newColor.hexCode }
                    : c
            )
        );

        setEditingColor(null);
        setNewColor({ name: "", hexCode: "#000000" });
        setIsDialogOpen(false);

        toast({
            title: "Success",
            description: "Color updated successfully",
        });
    };

    const handleDeleteColor = (id: string) => {
        setColors(colors.filter((c) => c.id !== id));
        toast({
            title: "Success",
            description: "Color deleted successfully",
        });
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setEditingColor(null);
        setNewColor({ name: "", hexCode: "#000000" });
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
                    <h1 className="text-3xl font-bold tracking-tight">Device Colors</h1>
                    <p className="text-muted-foreground">Manage available device colors for your inventory</p>
                </div>
                <div className="flex gap-2">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => setEditingColor(null)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add New Color
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingColor ? "Edit Color" : "Add New Color"}</DialogTitle>
                                <DialogDescription>
                                    {editingColor ? "Update the color details below" : "Add a new device color to your inventory"}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="colorName">Color Name</Label>
                                    <Input
                                        id="colorName"
                                        value={newColor.name}
                                        onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                                        placeholder="e.g., Midnight Black"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="hexCode">Hex Color Code</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="hexCode"
                                            value={newColor.hexCode}
                                            onChange={(e) => setNewColor({ ...newColor, hexCode: e.target.value })}
                                            placeholder="#000000"
                                            className="flex-1"
                                        />
                                        <input
                                            type="color"
                                            value={newColor.hexCode}
                                            onChange={(e) => setNewColor({ ...newColor, hexCode: e.target.value })}
                                            className="w-12 h-10 rounded border cursor-pointer"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Click the color box to use the color picker
                                    </p>
                                </div>
                                <div className="rounded-lg border p-4 flex items-center gap-3">
                                    <div
                                        className="w-16 h-16 rounded-lg border-2 border-gray-300 shadow-sm"
                                        style={{ backgroundColor: newColor.hexCode }}
                                    />
                                    <div>
                                        <p className="font-medium">{newColor.name || "Preview"}</p>
                                        <p className="text-sm text-muted-foreground">{newColor.hexCode}</p>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={handleDialogClose}>
                                    Cancel
                                </Button>
                                <Button onClick={editingColor ? handleUpdateColor : handleAddColor}>
                                    {editingColor ? "Update Color" : "Add Color"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

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
                </div>
            </div>

            {colors.length === 0 ? (
                <Card className="p-12">
                    <div className="text-center text-muted-foreground">
                        <Palette className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No colors yet. Click "Add New Color" to create one.</p>
                    </div>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {colors.map((color) => (
                        <Card key={color.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div
                                className="h-32 w-full"
                                style={{ backgroundColor: color.hexCode }}
                            />
                            <CardContent className="p-4">
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-lg">{color.name}</h3>
                                    <p className="text-sm text-muted-foreground font-mono">{color.hexCode}</p>
                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => handleEditColor(color)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDeleteColor(color.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
