export type Database = {
  public: {
    Tables: {
      buyback_models: {
        Row: { id: string; brand: string; model: string; base_price: number };
      };
      buyback_quotes: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          phone: string;
          brand: string;
          model: string;
          condition: "excellent" | "good" | "fair" | "poor";
          estimated_price_npr: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["buyback_quotes"]["Row"], "id" | "created_at">;
      };
      courses: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          level: string | null;
          price_npr: number | null;
        };
      };
      enrollments: {
        Row: {
          id: string;
          course_id: string;
          name: string;
          email: string | null;
          phone: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["enrollments"]["Row"], "id" | "created_at">;
      };
      videos: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          youtube_id: string;
          published_at: string;
        };
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          excerpt: string | null;
          content: string | null;
          cover_image_url: string | null;
          published_at: string;
          status: "draft" | "published";
        };
      };
      repair_orders: {
        Row: {
          id: string;
          device_category: string;
          brand: string;
          model: string;
          issue: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          description: string | null;
          status: "pending" | "in_progress" | "completed" | "cancelled";
          tracking_code: string;
          estimated_cost: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["repair_orders"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["repair_orders"]["Insert"]>;
      };
      phone_models: {
        Row: {
          id: string;
          brand: string;
          model: string;
          image_url: string | null;
          base_price: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          brand: string;
          model: string;
          image_url?: string | null;
          base_price?: number | null;
        };
        Update: Partial<Database["public"]["Tables"]["phone_models"]["Insert"]>;
      };
      website_content: {
        Row: {
          id: string;
          title: string | null;
          content: string | null;
          type: 'text' | 'image' | 'html' | null;
          section: 'home' | 'services' | 'about' | 'contact' | 'settings' | 'footer' | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          title?: string | null;
          content?: string | null;
          type?: 'text' | 'image' | 'html' | null;
          section?: 'home' | 'services' | 'about' | 'contact' | 'settings' | 'footer' | null;
        };
        Update: Partial<Database["public"]["Tables"]["website_content"]["Insert"]>;
      };
      website_settings: {
        Row: {
          id: string;
          site_title: string | null;
          contact_phone: string | null;
          contact_email: string | null;
          contact_address: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          site_title?: string | null;
          contact_phone?: string | null;
          contact_email?: string | null;
          contact_address?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["website_settings"]["Insert"]>;
      };
      editable_content: {
        Row: {
          id: string;
          hero_title: string | null;
          hero_subtitle: string | null;
          contact_phone: string | null;
          contact_email: string | null;
          contact_address: string | null;
          about_us: string | null;
          services_description: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          hero_title?: string | null;
          hero_subtitle?: string | null;
          contact_phone?: string | null;
          contact_email?: string | null;
          contact_address?: string | null;
          about_us?: string | null;
          services_description?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["editable_content"]["Insert"]>;
      };
    };
  };
};
