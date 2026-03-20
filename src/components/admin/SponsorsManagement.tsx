import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSponsors } from "@/lib/sponsors";
import { useToast } from "@/components/ui/use-toast";

export function SponsorsManagement() {
  const { sponsors, addSponsor, updateSponsor, deleteSponsor, toggleSponsor } =
    useSponsors();
  const [newSponsor, setNewSponsor] = useState({
    name: "",
    link: "",
    image: "",
    isActive: true,
  });
  const { toast } = useToast();

  const handleAddSponsor = () => {
    if (!newSponsor.name || !newSponsor.link) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    addSponsor(newSponsor);
    setNewSponsor({ name: "", link: "", image: "", isActive: true });
    toast({
      title: "Success",
      description: "Sponsor added successfully",
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Sponsors Management</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Sponsor</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Sponsor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newSponsor.name}
                  onChange={(e) =>
                    setNewSponsor({ ...newSponsor, name: e.target.value })
                  }
                  placeholder="Sponsor name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link">Link</Label>
                <Input
                  id="link"
                  value={newSponsor.link}
                  onChange={(e) =>
                    setNewSponsor({ ...newSponsor, link: e.target.value })
                  }
                  placeholder="https://example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={newSponsor.image}
                  onChange={(e) =>
                    setNewSponsor({ ...newSponsor, image: e.target.value })
                  }
                  placeholder="Image URL"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={newSponsor.isActive}
                  onCheckedChange={(checked) =>
                    setNewSponsor({ ...newSponsor, isActive: checked })
                  }
                />
                <Label htmlFor="active">Active</Label>
              </div>
              <Button onClick={handleAddSponsor} className="w-full">
                Add Sponsor
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sponsors.map((sponsor) => (
          <div
            key={sponsor.id}
            className="border rounded-lg p-4 space-y-4 bg-white shadow-sm"
          >
            <div className="aspect-video bg-muted rounded-md overflow-hidden">
              {sponsor.image ? (
                <img
                  src={sponsor.image}
                  alt={sponsor.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No Image
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold">{sponsor.name}</h3>
              <a
                href={sponsor.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:underline"
              >
                {sponsor.link}
              </a>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={sponsor.isActive}
                  onCheckedChange={() => toggleSponsor(sponsor.id)}
                />
                <span className="text-sm text-muted-foreground">
                  {sponsor.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteSponsor(sponsor.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
