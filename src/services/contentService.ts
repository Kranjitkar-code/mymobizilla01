import { supabase } from '@/integrations/supabase/client';

// Content item interface
export interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'image' | 'html';
  section: 'home' | 'services' | 'about' | 'contact' | 'settings' | 'footer';
  lastModified: string;
}

// Website settings interface
export interface WebsiteSettings {
  siteTitle: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  lastModified?: string;
}

// Editable content interface
export interface EditableContent {
  heroTitle: string;
  heroSubtitle: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  aboutUs: string;
  servicesDescription: string;
}

// Collection names
const CONTENT_TABLE = 'website_content';
const SETTINGS_TABLE = 'website_settings';
const EDITABLE_CONTENT_TABLE = 'editable_content';

/**
 * Firestore Content Service
 * Handles all content CRUD operations with Firestore
 */
export class ContentService {
  
  /**
   * Get all content items from Firestore
   */
  static async getAllContent(): Promise<ContentItem[]> {
    try {
      const { data, error } = await supabase
        .from(CONTENT_TABLE)
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(row => ({
        id: row.id,
        title: row.title || row.id,
        content: row.content || '',
        type: (row.type as ContentItem['type']) || 'text',
        section: (row.section as ContentItem['section']) || 'home',
        lastModified: row.updated_at || row.created_at || new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error fetching content from Supabase:', error);
      throw error;
    }
  }

  /**
   * Get a specific content item by ID
   */
  static async getContentById(id: string): Promise<ContentItem | null> {
    try {
      const { data, error } = await supabase
        .from(CONTENT_TABLE)
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        title: data.title || data.id,
        content: data.content || '',
        type: (data.type as ContentItem['type']) || 'text',
        section: (data.section as ContentItem['section']) || 'home',
        lastModified: data.updated_at || data.created_at || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching content by ID from Supabase:', error);
      throw error;
    }
  }

  /**
   * Get content by section
   */
  static async getContentBySection(section: string): Promise<ContentItem[]> {
    try {
      const { data, error } = await supabase
        .from(CONTENT_TABLE)
        .select('*')
        .eq('section', section)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(row => ({
        id: row.id,
        title: row.title || row.id,
        content: row.content || '',
        type: (row.type as ContentItem['type']) || 'text',
        section: (row.section as ContentItem['section']) || 'home',
        lastModified: row.updated_at || row.created_at || new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error fetching content by section from Supabase:', error);
      throw error;
    }
  }

  /**
   * Create or update a content item
   */
  static async updateContent(contentItem: Partial<ContentItem> & { id: string }): Promise<void> {
    try {
      const { id, ...data } = contentItem;

      const { error } = await supabase
        .from(CONTENT_TABLE)
        .upsert({
          id,
          title: data.title ?? id,
          content: data.content ?? '',
          type: data.type ?? 'text',
          section: data.section ?? 'home'
        }, { onConflict: 'id' });

      if (error) throw error;
      console.log(`✅ Content item '${id}' upserted in Supabase`);
    } catch (error) {
      console.error('Error updating content in Supabase:', error);
      throw error;
    }
  }

  /**
   * Delete a content item
   */
  static async deleteContent(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(CONTENT_TABLE)
        .delete()
        .eq('id', id);

      if (error) throw error;
      console.log(`✅ Content item '${id}' deleted from Supabase`);
    } catch (error) {
      console.error('Error deleting content from Supabase:', error);
      throw error;
    }
  }

  /**
   * Subscribe to real-time content updates
   */
  static subscribeToContent(callback: (content: ContentItem[]) => void): () => void {
    try {
      const channel = supabase
        .channel('realtime:website_content')
        .on('postgres_changes', { event: '*', schema: 'public', table: CONTENT_TABLE }, async () => {
          const data = await ContentService.getAllContent();
          callback(data);
        })
        .subscribe();

      // Initial load
      ContentService.getAllContent().then(callback).catch(err => {
        console.error('Initial content load failed:', err);
      });

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (error) {
      console.error('Error subscribing to content via Supabase:', error);
      return () => {};
    }
  }

  /**
   * Get website settings
   */
  static async getSettings(): Promise<WebsiteSettings> {
    try {
      const { data, error } = await supabase
        .from(SETTINGS_TABLE)
        .select('*')
        .eq('id', 'site_settings')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        return {
          siteTitle: data.site_title || 'Mobizilla',
          contactPhone: data.contact_phone || '+977-1-5354999',
          contactEmail: data.contact_email || 'support@mobizilla.com',
          contactAddress: data.contact_address || 'Ratna Plaza, New Road, Kathmandu 44600, Nepal',
          lastModified: data.updated_at || data.created_at || new Date().toISOString()
        };
      }

      return {
        siteTitle: 'Mobizilla',
        contactPhone: '+977-1-5354999',
        contactEmail: 'support@mobizilla.com',
        contactAddress: 'Ratna Plaza, New Road, Kathmandu 44600, Nepal'
      };
    } catch (error) {
      console.error('Error fetching settings from Supabase:', error);
      throw error;
    }
  }

  /**
   * Update website settings
   */
  static async updateSettings(settings: WebsiteSettings): Promise<void> {
    try {
      const { error } = await supabase.from(SETTINGS_TABLE).upsert({
        id: 'site_settings',
        site_title: settings.siteTitle,
        contact_phone: settings.contactPhone,
        contact_email: settings.contactEmail,
        contact_address: settings.contactAddress
      }, { onConflict: 'id' });

      if (error) throw error;

      const contentUpdates = [
        {
          id: 'contact-phone',
          title: 'Contact Phone',
          content: settings.contactPhone,
          type: 'text' as const,
          section: 'footer' as const
        },
        {
          id: 'contact-email',
          title: 'Contact Email',
          content: settings.contactEmail,
          type: 'text' as const,
          section: 'footer' as const
        },
        {
          id: 'contact-address',
          title: 'Contact Address',
          content: settings.contactAddress,
          type: 'text' as const,
          section: 'footer' as const
        }
      ];

      for (const item of contentUpdates) {
        await ContentService.updateContent(item);
      }

      console.log('✅ Settings and content items updated in Supabase');
    } catch (error) {
      console.error('Error updating settings in Supabase:', error);
      throw error;
    }
  }

  /**
   * Subscribe to real-time settings updates
   */
  static subscribeToSettings(callback: (settings: WebsiteSettings) => void): () => void {
    try {
      const channel = supabase
        .channel('realtime:website_settings')
        .on('postgres_changes', { event: '*', schema: 'public', table: SETTINGS_TABLE }, async () => {
          const settings = await ContentService.getSettings();
          callback(settings);
        })
        .subscribe();

      ContentService.getSettings().then(callback).catch(err => {
        console.error('Initial settings load failed:', err);
      });

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (error) {
      console.error('Error subscribing to settings via Supabase:', error);
      return () => {};
    }
  }

  /**
   * Get editable content (used by AdvancedDashboard)
   */
  static async getEditableContent(): Promise<EditableContent> {
    try {
      const { data, error } = await supabase
        .from(EDITABLE_CONTENT_TABLE)
        .select('*')
        .eq('id', 'default')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        return {
          heroTitle: data.hero_title || 'Your One-Stop Solution for Mobile Repairs & Buyback',
          heroSubtitle: data.hero_subtitle || 'Expert technicians, genuine parts, and hassle-free service for all your device needs.',
          contactPhone: data.contact_phone || '+977 9731852323',
          contactEmail: data.contact_email || 'rayyanbusinessofficial@gmail.com',
          contactAddress: data.contact_address || 'Ratna Plaza, New Road, Kathmandu 44600, Nepal',
          aboutUs: data.about_us || 'Mobizilla is your trusted partner for all device repair needs. With years of experience and certified technicians, we provide quality service you can rely on.',
          servicesDescription: data.services_description || 'From professional repairs to technical training, we provide comprehensive solutions for all your mobile device needs with expert care and quality guarantee.'
        };
      }

      return {
        heroTitle: 'Your One-Stop Solution for Mobile Repairs & Buyback',
        heroSubtitle: 'Expert technicians, genuine parts, and hassle-free service for all your device needs.',
        contactPhone: '+977 9731852323',
        contactEmail: 'rayyanbusinessofficial@gmail.com',
        contactAddress: 'Ratna Plaza, New Road, Kathmandu 44600, Nepal',
        aboutUs: 'Mobizilla is your trusted partner for all device repair needs. With years of experience and certified technicians, we provide quality service you can rely on.',
        servicesDescription: 'From professional repairs to technical training, we provide comprehensive solutions for all your mobile device needs with expert care and quality guarantee.'
      };
    } catch (error) {
      console.error('Error fetching editable content from Supabase:', error);
      throw error;
    }
  }

  /**
   * Update editable content
   */
  static async updateEditableContent(content: EditableContent): Promise<void> {
    try {
      const { error } = await supabase.from(EDITABLE_CONTENT_TABLE).upsert({
        id: 'default',
        hero_title: content.heroTitle,
        hero_subtitle: content.heroSubtitle,
        contact_phone: content.contactPhone,
        contact_email: content.contactEmail,
        contact_address: content.contactAddress,
        about_us: content.aboutUs,
        services_description: content.servicesDescription
      }, { onConflict: 'id' });

      if (error) throw error;
      console.log('✅ Editable content updated in Supabase');
    } catch (error) {
      console.error('Error updating editable content in Supabase:', error);
      throw error;
    }
  }

  /**
   * Subscribe to editable content updates
   */
  static subscribeToEditableContent(callback: (content: EditableContent) => void): () => void {
    try {
      const channel = supabase
        .channel('realtime:editable_content')
        .on('postgres_changes', { event: '*', schema: 'public', table: EDITABLE_CONTENT_TABLE }, async () => {
          const content = await ContentService.getEditableContent();
          callback(content);
        })
        .subscribe();

      ContentService.getEditableContent().then(callback).catch(err => {
        console.error('Initial editable content load failed:', err);
      });

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (error) {
      console.error('Error subscribing to editable content via Supabase:', error);
      return () => {};
    }
  }

  /**
   * Migrate localStorage data to Firestore (one-time migration utility)
   */
  static async migrateFromLocalStorage(): Promise<void> {
    try {
  console.log('🔄 Starting migration from localStorage to Supabase...');
      
      // Migrate editable content
      const editableContentStr = localStorage.getItem('editableWebsiteContent');
      if (editableContentStr) {
        const editableContent = JSON.parse(editableContentStr);
        await this.updateEditableContent(editableContent);
  console.log('✅ Migrated editable content');
      }
      
      // Migrate website settings
      const settingsStr = localStorage.getItem('websiteSettings');
      if (settingsStr) {
        const settings = JSON.parse(settingsStr);
        await this.updateSettings(settings);
  console.log('✅ Migrated website settings');
      }
      
      // Migrate content items
      const contentCacheStr = localStorage.getItem('contentCache');
      if (contentCacheStr) {
        const { data } = JSON.parse(contentCacheStr);
        if (Array.isArray(data)) {
          for (const item of data) {
            await this.updateContent(item);
          }
          console.log(`✅ Migrated ${data.length} content items`);
        }
      }
      
  console.log('🎉 Migration completed successfully!');
    } catch (error) {
  console.error('❌ Migration failed:', error);
      throw error;
    }
  }
}
