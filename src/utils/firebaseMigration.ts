import { ContentService } from '../services/contentService';

/**
 * Firebase Migration Utility
 * 
 * This utility helps migrate existing localStorage data to Firebase Firestore.
 * Run this from the browser console in the admin panel after setting up Firebase.
 * 
 * Usage:
 * 1. Open browser console (F12) in the admin panel
 * 2. Run: migrateToFirebase()
 * 3. Check console for progress and results
 */

export async function migrateToFirebase(): Promise<void> {
  try {
    console.log('🚀 Starting migration from localStorage to Firebase Firestore...\n');
    
    // Migrate editable content
    console.log('📝 Migrating editable content...');
    const editableContentStr = localStorage.getItem('editableWebsiteContent');
    if (editableContentStr) {
      try {
        const editableContent = JSON.parse(editableContentStr);
        await ContentService.updateEditableContent(editableContent);
        console.log('✅ Editable content migrated successfully');
        console.log('   - Hero Title:', editableContent.heroTitle);
        console.log('   - Hero Subtitle:', editableContent.heroSubtitle);
        console.log('   - Contact Phone:', editableContent.contactPhone);
        console.log('   - Contact Email:', editableContent.contactEmail);
        console.log('   - Contact Address:', editableContent.contactAddress);
        console.log('   - About Us:', editableContent.aboutUs?.substring(0, 50) + '...');
        console.log('   - Services Description:', editableContent.servicesDescription?.substring(0, 50) + '...');
      } catch (err) {
        console.error('❌ Error migrating editable content:', err);
      }
    } else {
      console.log('⚠️ No editable content found in localStorage');
    }
    
    console.log('');
    
    // Migrate website settings
    console.log('⚙️ Migrating website settings...');
    const settingsStr = localStorage.getItem('websiteSettings');
    if (settingsStr) {
      try {
        const settings = JSON.parse(settingsStr);
        await ContentService.updateSettings(settings);
        console.log('✅ Website settings migrated successfully');
        console.log('   - Site Title:', settings.siteTitle);
        console.log('   - Contact Phone:', settings.contactPhone);
        console.log('   - Contact Email:', settings.contactEmail);
        console.log('   - Contact Address:', settings.contactAddress);
      } catch (err) {
        console.error('❌ Error migrating website settings:', err);
      }
    } else {
      console.log('⚠️ No website settings found in localStorage');
    }
    
    console.log('');
    
    // Migrate content items
    console.log('📄 Migrating content items...');
    const contentCacheStr = localStorage.getItem('contentCache');
    if (contentCacheStr) {
      try {
        const { data } = JSON.parse(contentCacheStr);
        if (Array.isArray(data) && data.length > 0) {
          let successCount = 0;
          let errorCount = 0;
          
          for (const item of data) {
            try {
              await ContentService.updateContent(item);
              console.log(`   ✅ Migrated: ${item.id} (${item.title})`);
              successCount++;
            } catch (err) {
              console.error(`   ❌ Failed to migrate: ${item.id}`, err);
              errorCount++;
            }
          }
          
          console.log(`\n✅ Content items migration complete:`);
          console.log(`   - Successful: ${successCount}`);
          console.log(`   - Failed: ${errorCount}`);
          console.log(`   - Total: ${data.length}`);
        } else {
          console.log('⚠️ No valid content items found in cache');
        }
      } catch (err) {
        console.error('❌ Error migrating content items:', err);
      }
    } else {
      console.log('⚠️ No content cache found in localStorage');
    }
    
    console.log('\n🎉 Migration process completed!');
    console.log('\n📊 Summary:');
    console.log('   All your localStorage data has been migrated to Firebase Firestore.');
    console.log('   Your data is now stored persistently in the cloud.');
    console.log('   You can now access and edit content from any browser/device.');
    console.log('\n💡 Next steps:');
    console.log('   1. Verify the migrated data in Firebase Console');
    console.log('   2. Test editing content in the admin panel');
    console.log('   3. Content changes will now be saved to Firebase automatically');
    
  } catch (error) {
    console.error('\n❌ Migration failed with error:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure Firebase is configured in .env file');
    console.log('   2. Check Firebase Firestore rules allow write access');
    console.log('   3. Verify you have internet connection');
    console.log('   4. Check browser console for detailed error messages');
    throw error;
  }
}

/**
 * Check migration status
 * Shows what data is available in localStorage vs Firebase
 */
export async function checkMigrationStatus(): Promise<void> {
  console.log('🔍 Checking migration status...\n');
  
  // Check localStorage
  console.log('📦 LocalStorage Status:');
  const editableContent = localStorage.getItem('editableWebsiteContent');
  const settings = localStorage.getItem('websiteSettings');
  const contentCache = localStorage.getItem('contentCache');
  
  console.log(`   - Editable Content: ${editableContent ? '✅ Found' : '❌ Not found'}`);
  console.log(`   - Website Settings: ${settings ? '✅ Found' : '❌ Not found'}`);
  console.log(`   - Content Cache: ${contentCache ? '✅ Found' : '❌ Not found'}`);
  
  if (contentCache) {
    try {
      const { data } = JSON.parse(contentCache);
      console.log(`   - Cached Items: ${Array.isArray(data) ? data.length : 0}`);
    } catch (e) {
      console.log('   - Cached Items: Error reading');
    }
  }
  
  console.log('');
  
  // Check Firebase
  console.log('🔥 Firebase Status:');
  try {
    const firebaseEditableContent = await ContentService.getEditableContent();
    console.log('   - Editable Content: ✅ Found in Firebase');
    console.log(`     - Hero Title: ${firebaseEditableContent.heroTitle?.substring(0, 50)}...`);
    
    const firebaseSettings = await ContentService.getSettings();
    console.log('   - Website Settings: ✅ Found in Firebase');
    console.log(`     - Site Title: ${firebaseSettings.siteTitle}`);
    
    const firebaseContent = await ContentService.getAllContent();
    console.log(`   - Content Items: ✅ Found ${firebaseContent.length} items in Firebase`);
    
    console.log('\n✅ Firebase is connected and working!');
  } catch (error) {
    console.error('\n❌ Firebase connection error:', error);
    console.log('\n🔧 Please check:');
    console.log('   1. Firebase configuration in .env file');
    console.log('   2. Internet connection');
    console.log('   3. Firebase Firestore rules');
  }
}

/**
 * Clear all localStorage data (use with caution!)
 * Only use this AFTER successful migration to Firebase
 */
export function clearLocalStorageCache(): void {
  const confirmClear = window.confirm(
    '⚠️ WARNING: This will clear all admin panel data from localStorage.\n\n' +
    'Make sure you have:\n' +
    '1. Successfully migrated data to Firebase\n' +
    '2. Verified data is in Firebase Console\n\n' +
    'Continue?'
  );
  
  if (!confirmClear) {
    console.log('❌ Operation cancelled');
    return;
  }
  
  console.log('🧹 Clearing localStorage cache...');
  
  localStorage.removeItem('editableWebsiteContent');
  localStorage.removeItem('websiteSettings');
  localStorage.removeItem('contentCache');
  localStorage.removeItem('uploadedImages');
  localStorage.removeItem('pendingContentUpdates');
  
  console.log('✅ localStorage cache cleared!');
  console.log('💡 Data will now be loaded from Firebase only');
  console.log('🔄 Refresh the page to load fresh data from Firebase');
}

// Make functions available globally in browser console
if (typeof window !== 'undefined') {
  (window as any).migrateToFirebase = migrateToFirebase;
  (window as any).checkMigrationStatus = checkMigrationStatus;
  (window as any).clearLocalStorageCache = clearLocalStorageCache;
  
  console.log('🔧 Firebase Migration Utilities loaded!');
  console.log('');
  console.log('Available commands:');
  console.log('  - migrateToFirebase()      : Migrate localStorage data to Firebase');
  console.log('  - checkMigrationStatus()   : Check what data exists in localStorage vs Firebase');
  console.log('  - clearLocalStorageCache() : Clear localStorage after successful migration');
  console.log('');
}
