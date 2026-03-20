import { ContentService } from '../services/contentService';

/**
 * Sync editable content to individual content items
 * This ensures changes in admin panel reflect on the website
 */
export async function syncEditableContentToItems() {
  console.log('🔄 Syncing editable content to content items...');
  
  try {
    // Get current editable content from Firebase
    const editableContent = await ContentService.getEditableContent();
    
    // Sync each field to its corresponding content item
    const syncTasks = [
      // Hero Section
      ContentService.updateContent({
        id: 'home-hero-title',
        title: 'Homepage Hero Title',
        content: editableContent.heroTitle,
        type: 'text',
        section: 'home'
      }),
      ContentService.updateContent({
        id: 'home-hero-subtitle',
        title: 'Homepage Hero Subtitle',
        content: editableContent.heroSubtitle,
        type: 'text',
        section: 'home'
      }),
      
      // Contact Info
      ContentService.updateContent({
        id: 'contact-phone',
        title: 'Contact Phone',
        content: editableContent.contactPhone,
        type: 'text',
        section: 'contact'
      }),
      ContentService.updateContent({
        id: 'contact-email',
        title: 'Contact Email',
        content: editableContent.contactEmail,
        type: 'text',
        section: 'contact'
      }),
      ContentService.updateContent({
        id: 'contact-address',
        title: 'Contact Address',
        content: editableContent.contactAddress,
        type: 'text',
        section: 'contact'
      }),
      
      // About & Services
      ContentService.updateContent({
        id: 'about-us-description',
        title: 'About Us Description',
        content: editableContent.aboutUs,
        type: 'text',
        section: 'about'
      }),
      ContentService.updateContent({
        id: 'services-page-subtitle',
        title: 'Services Page Subtitle',
        content: editableContent.servicesDescription,
        type: 'text',
        section: 'services'
      }),
      
      // Also sync to footer
      ContentService.updateContent({
        id: 'footer-description',
        title: 'Footer Description',
        content: editableContent.aboutUs.substring(0, 150) + '...',
        type: 'text',
        section: 'footer'
      })
    ];
    
    await Promise.all(syncTasks);
    
    console.log('✅ Sync complete! All content items updated.');
    console.log('🔄 Refresh the page to see changes on the website.');
    
    return true;
  } catch (error) {
    console.error('❌ Error syncing content:', error);
    throw error;
  }
}

// Make it available globally
if (typeof window !== 'undefined') {
  (window as any).syncEditableContentToItems = syncEditableContentToItems;
  console.log('💡 Run syncEditableContentToItems() to sync admin changes to website');
}
