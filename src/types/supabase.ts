export type Database = {
  public: {
    Tables: {
      buyback_models: {
        Row: { id: string; brand: string; model: string; base_price_npr: number };
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
          status: "pending" | "in_progress" | "ready" | "completed" | "cancelled";
          tracking_code: string;
          estimated_cost: number;
          created_at: string;
          updated_at: string;
          vat_amount_npr?: number | null;
          city?: string | null;
          customer_source?: string | null;
          admin_notes?: string | null;
          technician_name?: string | null;
          service_type?: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["repair_orders"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["repair_orders"]["Insert"]>;
      };
      blogs: {
        Row: {
          id: string;
          title: string;
          excerpt: string | null;
          content: string | null;
          cover_url: string | null;
          published: boolean;
          created_at: string;
        };
      };
      brands: {
        Row: {
          id: string;
          name: string;
          slug: string | null;
          sort_order: number | null;
          created_at: string;
        };
      };
      training_courses: {
        Row: Record<string, unknown>;
      };
      training_videos: {
        Row: Record<string, unknown>;
      };
      orders: {
        Row: Record<string, unknown>;
      };
      order_items: {
        Row: Record<string, unknown>;
      };
      contact_messages: {
        Row: {
          id: string;
          name: string | null;
          email: string | null;
          phone: string | null;
          interest: string | null;
          message: string;
          status: string | null;
          admin_reply: string | null;
          replied_at: string | null;
          created_at: string | null;
        };
      };
      phone_models: {
        Row: {
          id: string;
          brand: string;
          model: string;
          series: string | null;
          description: string | null;
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
          section: string;
          content: Record<string, unknown>;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          section: string;
          content?: Record<string, unknown>;
          updated_at?: string | null;
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
