import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SchemaHelpDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SchemaHelpDialog({ open, onOpenChange }: SchemaHelpDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Database Setup Required</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        It looks like the required database tables or storage buckets are missing.
                        Please run the following SQL in your Supabase SQL Editor to set them up.
                    </p>

                    <div className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-x-auto">
                        <pre className="text-xs font-mono">
                            {`-- 1. Create Brands Table
CREATE TABLE IF NOT EXISTS public.brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  logo_url text,
  created_at timestamptz DEFAULT now()
);

-- 2. Create Phone Models Table
CREATE TABLE IF NOT EXISTS public.phone_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand text NOT NULL,
  model text NOT NULL,
  series text,
  image_url text,
  base_price numeric,
  created_at timestamptz DEFAULT now()
);

-- 3. Create FAQs Table
CREATE TABLE IF NOT EXISTS public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 4. Create Training Courses Table
CREATE TABLE IF NOT EXISTS public.training_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  level text NOT NULL,
  duration text,
  price text,
  image_url text,
  short_description text,
  detailed_description text,
  google_form_url text,
  promotional_text text,
  key_learning_outcomes jsonb DEFAULT '[]',
  target_audience jsonb DEFAULT '[]',
  highlights jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

-- 5. Create Training Videos Table
CREATE TABLE IF NOT EXISTS public.training_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  video_url text NOT NULL,
  description text,
  thumbnail_url text,
  created_at timestamptz DEFAULT now()
);

-- 6. Enable Storage
-- You need to create these buckets in the Storage section of Supabase dashboard:
-- - 'brand-logos' (Public)
-- - 'phone-models' (Public)
-- - 'training-images' (Public)
-- - 'training-videos' (Public)

-- Add RLS Policies
ALTER TABLE public.training_courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Access" ON public.training_courses FOR SELECT USING (true);
CREATE POLICY "Full Access" ON public.training_courses FOR ALL USING (true);

ALTER TABLE public.training_videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Access" ON public.training_videos FOR SELECT USING (true);
CREATE POLICY "Full Access" ON public.training_videos FOR ALL USING (true);
`}
                        </pre>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Note: For storage buckets, go to Storage in Supabase dashboard, create new public buckets named 'brand-logos' and 'phone-models'.
                    </p>
                </div>
                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
