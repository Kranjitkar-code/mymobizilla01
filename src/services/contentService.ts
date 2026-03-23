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

const CONTENT_TABLE = 'website_content';
const SETTINGS_TABLE = 'website_settings';
const EDITABLE_CONTENT_TABLE = 'editable_content';

type CmsSection = 'hero' | 'about' | 'contact' | 'services';

/** Legacy ids used by Home / ContentContext map to jsonb keys under each `section` row. */
const LEGACY_KEYS: Record<
  string,
  { section: CmsSection; jsonKey: string; type: ContentItem['type']; sectionUi: ContentItem['section'] }
> = {
  'home-hero-title': { section: 'hero', jsonKey: 'title', type: 'text', sectionUi: 'home' },
  'home-hero-subtitle': { section: 'hero', jsonKey: 'subtitle', type: 'text', sectionUi: 'home' },
  'about-us-content': { section: 'about', jsonKey: 'html', type: 'html', sectionUi: 'about' },
  'contact-phone': { section: 'contact', jsonKey: 'phone', type: 'text', sectionUi: 'contact' },
  'contact-email': { section: 'contact', jsonKey: 'email', type: 'text', sectionUi: 'contact' },
  'contact-address': { section: 'contact', jsonKey: 'address', type: 'text', sectionUi: 'contact' },
  'services-description': { section: 'services', jsonKey: 'description', type: 'text', sectionUi: 'services' },
};

export interface WebsiteContentFormState {
  heroTitle: string;
  heroSubtitle: string;
  aboutUs: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  servicesDescription: string;
}

/** Supabase-backed website copy: one row per `section`, JSON in `content`. */
export class ContentService {
  private static async fetchCmsRows(): Promise<
    { section: string; content: Record<string, unknown>; updated_at: string | null }[]
  > {
    const { data, error } = await supabase.from(CONTENT_TABLE).select('section, content, updated_at');
    if (error) throw error;
    return (data || []).map((row: { section: string; content: unknown; updated_at: string | null }) => ({
      section: row.section,
      content: (row.content && typeof row.content === 'object' ? row.content : {}) as Record<string, unknown>,
      updated_at: row.updated_at ?? null,
    }));
  }

  private static sectionMap(
    rows: Awaited<ReturnType<typeof ContentService.fetchCmsRows>>,
  ): Record<string, Record<string, unknown>> {
    const m: Record<string, Record<string, unknown>> = {};
    for (const r of rows) {
      m[r.section] = r.content || {};
    }
    return m;
  }

  static loadWebsiteContentFormDefaults(): WebsiteContentFormState {
    return {
      heroTitle: 'Your One-Stop Solution for Mobile Repairs & Buyback',
      heroSubtitle: 'Expert technicians, genuine parts, and hassle-free service for all your device needs.',
      aboutUs: `<h2>About Mobizilla</h2>
<p>Mobizilla is your trusted partner for all device repair needs.</p>`,
      contactPhone: '+977-1-5354999',
      contactEmail: 'mobizillanepal@gmail.com',
      contactAddress: 'Ratna Plaza, New Road, Kathmandu 44600, Nepal',
      servicesDescription:
        'From professional repairs to technical training, we provide comprehensive solutions for all your mobile device needs with expert care and quality guarantee.',
    };
  }

  static async loadWebsiteContentForm(): Promise<WebsiteContentFormState> {
    const def = ContentService.loadWebsiteContentFormDefaults();
    try {
      const rows = await ContentService.fetchCmsRows();
      const sm = ContentService.sectionMap(rows);
      const hero = sm.hero || {};
      const about = sm.about || {};
      const contact = sm.contact || {};
      const services = sm.services || {};
      return {
        heroTitle: String(hero.title ?? def.heroTitle),
        heroSubtitle: String(hero.subtitle ?? def.heroSubtitle),
        aboutUs: String(about.html ?? def.aboutUs),
        contactPhone: String(contact.phone ?? def.contactPhone),
        contactEmail: String(contact.email ?? def.contactEmail),
        contactAddress: String(contact.address ?? def.contactAddress),
        servicesDescription: String(services.description ?? def.servicesDescription),
      };
    } catch {
      return def;
    }
  }

  static async saveWebsiteContentForm(state: WebsiteContentFormState): Promise<void> {
    const now = new Date().toISOString();
    const { error } = await supabase.from(CONTENT_TABLE).upsert(
      [
        { section: 'hero', content: { title: state.heroTitle, subtitle: state.heroSubtitle }, updated_at: now },
        { section: 'about', content: { html: state.aboutUs }, updated_at: now },
        {
          section: 'contact',
          content: { phone: state.contactPhone, email: state.contactEmail, address: state.contactAddress },
          updated_at: now,
        },
        { section: 'services', content: { description: state.servicesDescription }, updated_at: now },
      ],
      { onConflict: 'section' },
    );
    if (error) throw error;
  }

  static async getAllContent(): Promise<ContentItem[]> {
    const rows = await ContentService.fetchCmsRows();
    const sm = ContentService.sectionMap(rows);
    const ts =
      rows.reduce((max, r) => {
        const t = r.updated_at ? new Date(r.updated_at).getTime() : 0;
        return Math.max(max, t);
      }, 0) || Date.now();
    const lastModified = new Date(ts).toISOString();

    return Object.keys(LEGACY_KEYS).map((id) => {
      const meta = LEGACY_KEYS[id];
      const raw = sm[meta.section]?.[meta.jsonKey];
      const content = raw === undefined || raw === null ? '' : String(raw);
      return {
        id,
        title: id,
        content,
        type: meta.type,
        section: meta.sectionUi,
        lastModified,
      };
    });
  }

  static async getContentById(id: string): Promise<ContentItem | null> {
    const meta = LEGACY_KEYS[id];
    if (!meta) return null;
    const rows = await ContentService.fetchCmsRows();
    const sm = ContentService.sectionMap(rows);
    const row = rows.find((r) => r.section === meta.section);
    const raw = sm[meta.section]?.[meta.jsonKey];
    const content = raw === undefined || raw === null ? '' : String(raw);
    return {
      id,
      title: id,
      content,
      type: meta.type,
      section: meta.sectionUi,
      lastModified: row?.updated_at || new Date().toISOString(),
    };
  }

  static async getContentBySection(section: string): Promise<ContentItem[]> {
    const all = await ContentService.getAllContent();
    return all.filter((i) => LEGACY_KEYS[i.id]?.sectionUi === section);
  }

  static async updateContent(contentItem: Partial<ContentItem> & { id: string }): Promise<void> {
    const meta = LEGACY_KEYS[contentItem.id];
    if (!meta) {
      throw new Error(`Unknown website content id: ${contentItem.id}`);
    }
    const rows = await ContentService.fetchCmsRows();
    const sm = ContentService.sectionMap(rows);
    const cur = { ...(sm[meta.section] || {}) };
    cur[meta.jsonKey] = contentItem.content ?? '';
    const now = new Date().toISOString();
    const { error } = await supabase
      .from(CONTENT_TABLE)
      .upsert({ section: meta.section, content: cur, updated_at: now }, { onConflict: 'section' });
    if (error) throw error;
  }

  static async deleteContent(id: string): Promise<void> {
    const meta = LEGACY_KEYS[id];
    if (!meta) return;
    const rows = await ContentService.fetchCmsRows();
    const sm = ContentService.sectionMap(rows);
    const cur = { ...(sm[meta.section] || {}) };
    delete cur[meta.jsonKey];
    const now = new Date().toISOString();
    const { error } = await supabase
      .from(CONTENT_TABLE)
      .upsert({ section: meta.section, content: cur, updated_at: now }, { onConflict: 'section' });
    if (error) throw error;
  }

  static subscribeToContent(callback: (content: ContentItem[]) => void): () => void {
    try {
      const channel = supabase
        .channel('realtime:website_content')
        .on('postgres_changes', { event: '*', schema: 'public', table: CONTENT_TABLE }, async () => {
          const data = await ContentService.getAllContent();
          callback(data);
        })
        .subscribe();

      ContentService.getAllContent().then(callback).catch((err) => {
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
          lastModified: data.updated_at || data.created_at || new Date().toISOString(),
        };
      }

      return {
        siteTitle: 'Mobizilla',
        contactPhone: '+977-1-5354999',
        contactEmail: 'support@mobizilla.com',
        contactAddress: 'Ratna Plaza, New Road, Kathmandu 44600, Nepal',
      };
    } catch (error) {
      console.error('Error fetching settings from Supabase:', error);
      throw error;
    }
  }

  static async updateSettings(settings: WebsiteSettings): Promise<void> {
    try {
      const { error } = await supabase.from(SETTINGS_TABLE).upsert(
        {
          id: 'site_settings',
          site_title: settings.siteTitle,
          contact_phone: settings.contactPhone,
          contact_email: settings.contactEmail,
          contact_address: settings.contactAddress,
        },
        { onConflict: 'id' },
      );

      if (error) throw error;

      const contentUpdates = [
        {
          id: 'contact-phone',
          title: 'Contact Phone',
          content: settings.contactPhone,
          type: 'text' as const,
          section: 'footer' as const,
        },
        {
          id: 'contact-email',
          title: 'Contact Email',
          content: settings.contactEmail,
          type: 'text' as const,
          section: 'footer' as const,
        },
        {
          id: 'contact-address',
          title: 'Contact Address',
          content: settings.contactAddress,
          type: 'text' as const,
          section: 'footer' as const,
        },
      ];

      for (const item of contentUpdates) {
        await ContentService.updateContent(item);
      }
    } catch (error) {
      console.error('Error updating settings in Supabase:', error);
      throw error;
    }
  }

  static subscribeToSettings(callback: (settings: WebsiteSettings) => void): () => void {
    try {
      const channel = supabase
        .channel('realtime:website_settings')
        .on('postgres_changes', { event: '*', schema: 'public', table: SETTINGS_TABLE }, async () => {
          const settings = await ContentService.getSettings();
          callback(settings);
        })
        .subscribe();

      ContentService.getSettings().then(callback).catch((err) => {
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
          aboutUs:
            data.about_us ||
            'Mobizilla is your trusted partner for all device repair needs. With years of experience and certified technicians, we provide quality service you can rely on.',
          servicesDescription:
            data.services_description ||
            'From professional repairs to technical training, we provide comprehensive solutions for all your mobile device needs with expert care and quality guarantee.',
        };
      }

      return {
        heroTitle: 'Your One-Stop Solution for Mobile Repairs & Buyback',
        heroSubtitle: 'Expert technicians, genuine parts, and hassle-free service for all your device needs.',
        contactPhone: '+977 9731852323',
        contactEmail: 'rayyanbusinessofficial@gmail.com',
        contactAddress: 'Ratna Plaza, New Road, Kathmandu 44600, Nepal',
        aboutUs:
          'Mobizilla is your trusted partner for all device repair needs. With years of experience and certified technicians, we provide quality service you can rely on.',
        servicesDescription:
          'From professional repairs to technical training, we provide comprehensive solutions for all your mobile device needs with expert care and quality guarantee.',
      };
    } catch (error) {
      console.error('Error fetching editable content from Supabase:', error);
      throw error;
    }
  }

  static async updateEditableContent(content: EditableContent): Promise<void> {
    try {
      const { error } = await supabase.from(EDITABLE_CONTENT_TABLE).upsert(
        {
          id: 'default',
          hero_title: content.heroTitle,
          hero_subtitle: content.heroSubtitle,
          contact_phone: content.contactPhone,
          contact_email: content.contactEmail,
          contact_address: content.contactAddress,
          about_us: content.aboutUs,
          services_description: content.servicesDescription,
        },
        { onConflict: 'id' },
      );

      if (error) throw error;
    } catch (error) {
      console.error('Error updating editable content in Supabase:', error);
      throw error;
    }
  }

  static subscribeToEditableContent(callback: (content: EditableContent) => void): () => void {
    try {
      const channel = supabase
        .channel('realtime:editable_content')
        .on('postgres_changes', { event: '*', schema: 'public', table: EDITABLE_CONTENT_TABLE }, async () => {
          const content = await ContentService.getEditableContent();
          callback(content);
        })
        .subscribe();

      ContentService.getEditableContent().then(callback).catch((err) => {
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

  static async migrateFromLocalStorage(): Promise<void> {
    try {
      const editableContentStr = localStorage.getItem('editableWebsiteContent');
      if (editableContentStr) {
        const editableContent = JSON.parse(editableContentStr);
        await this.updateEditableContent(editableContent);
      }

      const settingsStr = localStorage.getItem('websiteSettings');
      if (settingsStr) {
        const settings = JSON.parse(settingsStr);
        await this.updateSettings(settings);
      }

      const contentCacheStr = localStorage.getItem('contentCache');
      if (contentCacheStr) {
        const { data } = JSON.parse(contentCacheStr);
        if (Array.isArray(data)) {
          for (const item of data) {
            await this.updateContent(item);
          }
        }
      }
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  }
}
