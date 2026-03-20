import SupabasePhonesService from '@/services/supabasePhonesService';

/**
 * initializeSupabaseSchema
 * Try to create/ensure the Supabase tables used by admin (phone_models).
 * It will attempt to invoke an Edge Function named `init-phone-models` if available.
 * If not available, it prints SQL statements you can run in Supabase SQL editor.
 *
 * Usage: run initializeSupabaseSchema() in browser console from admin panel.
 */
export async function initializeSupabaseSchema() {
  console.log('🔄 Checking Supabase schema for phone_models...');

  const res = await SupabasePhonesService.ensureSchema();
  if (res.success) {
    console.log('✅ Supabase schema appears OK:', res.message);
  } else {
    console.warn('⚠️ Supabase schema not ready:', res.message);
    console.log('Please run the SQL printed above in Supabase SQL editor, or deploy an Edge Function named `init-phone-models` that creates the table and storage bucket.');
  }

  return res;
}

// Expose on window for console usage
if (typeof window !== 'undefined') {
  (window as any).initializeSupabaseSchema = initializeSupabaseSchema;
  console.log('🔧 initializeSupabaseSchema() available in console');
}

export default initializeSupabaseSchema;
