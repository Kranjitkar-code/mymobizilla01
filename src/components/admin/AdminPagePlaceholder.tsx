import { Card } from "@/components/ui/card";
import { useLocation } from "react-router-dom";

export default function AdminPagePlaceholder() {
    const location = useLocation();
    const title = location.pathname.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            </div>
            <Card className="p-6">
                <p className="text-muted-foreground">This page is under construction.</p>
                <p className="text-sm text-muted-foreground mt-2">Path: {location.pathname}</p>
            </Card>
        </div>
    );
}
