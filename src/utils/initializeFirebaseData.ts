import { ContentService } from '../services/contentService'

/**
 * Initialize Supabase with default CMS data.
 * Run this once to seed the tables with starter content.
 */
export async function initializeFirebaseData() {
  console.log('🔄 Initializing Supabase with default data...')

  try {
    const defaultEditableContent = {
      heroTitle: 'Your One-Stop Solution for Mobile Repairs & Buyback',
      heroSubtitle: 'Expert technicians, genuine parts, and hassle-free service for all your device needs.',
      contactPhone: '+977-1-5354999',
      contactEmail: 'support@mobizilla.com',
      contactAddress: 'Ratna Plaza, New Road, Kathmandu 44600, Nepal',
      aboutUs: 'Mobizilla is your trusted partner for all device repair needs. With years of experience and certified technicians, we provide quality service you can rely on.',
      servicesDescription: 'From professional repairs to technical training, we provide comprehensive solutions for all your mobile device needs with expert care and quality guarantee.'
    }

    console.log('📝 Saving editable content...')
    await ContentService.updateEditableContent(defaultEditableContent)
    console.log('✅ Editable content saved to Supabase')

    const defaultSettings = {
      siteTitle: 'Mobizilla - Professional Device Repair & Services',
      contactPhone: '+977-1-5354999',
      contactEmail: 'support@mobizilla.com',
      contactAddress: 'Ratna Plaza, New Road, Kathmandu 44600, Nepal'
    }

    console.log('⚙️ Saving website settings...')
    await ContentService.updateSettings(defaultSettings)
    console.log('✅ Website settings saved to Supabase')

    const defaultContentItems = [
      {
        id: 'home-hero-title',
        title: 'Homepage Hero Title',
        content: 'Your One-Stop Solution for Mobile Repairs & Buyback',
        type: 'text' as const,
        section: 'home' as const
      },
      {
        id: 'home-hero-subtitle',
        title: 'Homepage Hero Subtitle',
        content: 'Expert technicians, genuine parts, and hassle-free service for all your device needs.',
        type: 'text' as const,
        section: 'home' as const
      },
      {
        id: 'contact-phone',
        title: 'Contact Phone',
        content: '+977-1-5354999',
        type: 'text' as const,
        section: 'contact' as const
      },
      {
        id: 'contact-email',
        title: 'Contact Email',
        content: 'support@mobizilla.com',
        type: 'text' as const,
        section: 'contact' as const
      },
      {
        id: 'contact-address',
        title: 'Contact Address',
        content: 'Ratna Plaza, New Road, Kathmandu 44600, Nepal',
        type: 'text' as const,
        section: 'contact' as const
      },
      {
        id: 'about-us-description',
        title: 'About Us Description',
        content: 'Mobizilla is your trusted partner for all device repair needs. With years of experience and certified technicians, we provide quality service you can rely on.',
        type: 'text' as const,
        section: 'about' as const
      },
      {
        id: 'services-page-subtitle',
        title: 'Services Page Subtitle',
        content: 'From professional repairs to technical training, we provide comprehensive solutions for all your mobile device needs with expert care and quality guarantee.',
        type: 'text' as const,
        section: 'services' as const
      }
    ]

    console.log('📄 Saving default content items...')
    for (const item of defaultContentItems) {
      await ContentService.updateContent(item)
      console.log(`  ✅ Saved: ${item.id}`)
    }

    console.log('\n🎉 Supabase initialization complete!')
    console.log('✅ All default data has been saved to Supabase')
    console.log('🔄 Refresh the page to see the changes')

    return true
  } catch (error) {
    console.error('❌ Error initializing Supabase data:', error)
    throw error
  }
}

if (typeof window !== 'undefined') {
  ;(window as any).initializeFirebaseData = initializeFirebaseData
  console.log('💡 Run initializeFirebaseData() in console to populate Supabase with default data')
}
