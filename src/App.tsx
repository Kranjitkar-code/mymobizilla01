import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from './lib/cart';
import { ContentProvider } from './contexts/ContentContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { useContent } from './contexts/ContentContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Buy from './pages/Buy';
import Product from './pages/Product';
import Repair from './pages/Repair';
import BuyBack from './pages/BuyBack';
import Training from './pages/Training';
import CourseDetail from './pages/CourseDetail';
import AllCourses from './pages/AllCourses';
import TrainingAdmin from './components/admin/pages/TrainingAdmin';
import Gallery from './pages/Gallery';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Services from './pages/Services';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import Chatbot from './components/Chatbot';
import AdminLogin from './pages/AdminLogin';

// Admin Components
import { AdminLayout } from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminPagePlaceholder from './components/admin/AdminPagePlaceholder';
import AboutUsPage from './components/admin/pages/AboutUs';
import ContractInformationPage from './components/admin/pages/ContractInformation';
import BannersPage from './components/admin/pages/Banners';
import ServicesPage from './components/admin/pages/Services';
import WebsiteContentPage from './components/admin/pages/WebsiteContent';
import ColorsPage from './components/admin/pages/Colors';
import PoweredByPage from './components/admin/pages/PoweredBy';
import SkusPage from './components/admin/pages/Skus';
import BrandsPage from './components/admin/pages/Brands';
import ModelsPage from './components/admin/pages/Models';
import FaqPage from './components/admin/pages/Faq';

// New Admin Pages
import AccessoryBrandsPage from './components/admin/pages/AccessoryBrands';
import AccessoryCategoriesPage from './components/admin/pages/AccessoryCategories';
import AccessoriesPage from './components/admin/pages/Accessories';
import MachineryBrandsPage from './components/admin/pages/MachineryBrands';
import MachineryCategoriesPage from './components/admin/pages/MachineryCategories';
import MachineriesPage from './components/admin/pages/Machineries';
import PartsCategoriesPage from './components/admin/pages/PartsCategories';
import PartsPage from './components/admin/pages/Parts';
import TeamMembersPage from './components/admin/pages/TeamMembers';
import TestimonialsPage from './components/admin/pages/Testimonials';
import BlogsPage from './components/admin/pages/Blogs';
import RepairAdminPage from './components/admin/pages/Repair';
import WhyChooseUsPage from './components/admin/pages/WhyChooseUs';
import VideosPage from './components/admin/pages/Videos';
import TrainingVideosPage from './components/admin/pages/TrainingVideos';
import MachineryWorkingNaturesPage from './components/admin/pages/MachineryWorkingNatures';
import AccessorySubCategoriesPage from './components/admin/pages/AccessorySubCategories';
import MachinerySubCategoriesPage from './components/admin/pages/MachinerySubCategories';
import InventoriesPage from './components/admin/pages/Inventories';
import OrdersPage from './components/admin/pages/Orders';
import ContactMessagesPage from './components/admin/pages/ContactMessages';
import SecondhandInventoryPage from './components/admin/pages/SecondhandInventory';
import PermissionsPage from './components/admin/pages/Permissions';
import RolesPage from './components/admin/pages/Roles';
import UsersPage from './components/admin/pages/Users';

// SEO Pages
import BangaloreBestMobileRepair2025 from './pages/seo/BangaloreBestMobileRepair2025';
import IPhoneRepairJayanagar from './pages/seo/IPhoneRepairJayanagar';
import MacBookRepairBangalore from './pages/seo/MacBookRepairBangalore';
import ServicePageTemplate from './components/seo/ServicePageTemplate';
import { WhyMobizillaBest, IPhone15ScreenCost, MacBookReview, KathmanduPriceComparison, DoorstepVsShop } from './pages/seo/BlogPosts';

// Create a component that pre-loads content
function AppContent() {
  const [loading, setLoading] = useState(true);
  const [supabaseReady, setSupabaseReady] = useState(false);
  const { refreshContent } = useContent();

  useEffect(() => {
    // Pre-load content in the background
    const initApp = async () => {
      try {
        console.log('🚀 Initializing Mobizilla app...');

        // Pre-load content immediately
        refreshContent().catch(err => {
          console.log('Content pre-loading failed (will use cache):', err);
        });

        // Quick Supabase test (non-blocking)
        setTimeout(async () => {
          try {
            const { data, error } = await supabase.from('repair_orders').select('count').limit(1);
            if (error) {
              console.log('📋 Supabase table not found - will create when needed');
            } else {
              console.log('✅ Supabase connected successfully!');
            }
            setSupabaseReady(true);
          } catch (err) {
            console.log('🔍 Supabase connection will be tested later');
            setSupabaseReady(true);
          }
        }, 100); // Reduced from 500ms to 100ms

      } catch (error) {
        console.error('❌ App initialization error:', error);
      } finally {
        // Always allow app to load quickly
        setTimeout(() => setLoading(false), 50); // Very fast loading
      }
    };

    initApp();
  }, [refreshContent]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-900">Loading Mobizilla...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Routes>
        {/* Admin routes - these have their own layout */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="website-content" element={<WebsiteContentPage />} />
          <Route path="contact-messages" element={<ContactMessagesPage />} />

          {/* Settings Group */}
          <Route path="settings/about-us" element={<AboutUsPage />} />
          <Route path="settings/contract-information" element={<ContractInformationPage />} />
          <Route path="settings/banners" element={<BannersPage />} />
          <Route path="settings/services" element={<ServicesPage />} />
          <Route path="settings/colors" element={<ColorsPage />} />
          <Route path="settings/powered-by" element={<PoweredByPage />} />
          <Route path="settings/faq" element={<FaqPage />} />
          <Route path="settings/repair" element={<RepairAdminPage />} />
          <Route path="settings/team" element={<TeamMembersPage />} />
          <Route path="settings/testimonials" element={<TestimonialsPage />} />
          <Route path="settings/why-choose-us" element={<WhyChooseUsPage />} />
          <Route path="settings/videos" element={<VideosPage />} />

          {/* Ecommerce Group */}
          <Route path="ecommerce/skus" element={<SkusPage />} />
          <Route path="ecommerce/brands" element={<BrandsPage />} />
          <Route path="ecommerce/models" element={<ModelsPage />} />
          <Route path="ecommerce/accessory-brands" element={<AccessoryBrandsPage />} />
          <Route path="ecommerce/accessory-categories" element={<AccessoryCategoriesPage />} />
          <Route path="ecommerce/accessories" element={<AccessoriesPage />} />
          <Route path="ecommerce/machinery-brands" element={<MachineryBrandsPage />} />
          <Route path="ecommerce/machinery-categories" element={<MachineryCategoriesPage />} />
          <Route path="ecommerce/machineries" element={<MachineriesPage />} />
          <Route path="ecommerce/machinery-working-natures" element={<MachineryWorkingNaturesPage />} />
          <Route path="ecommerce/accessory-sub-categories" element={<AccessorySubCategoriesPage />} />
          <Route path="ecommerce/inventories" element={<InventoriesPage />} />
          <Route path="ecommerce/orders" element={<OrdersPage />} />
          <Route path="ecommerce/secondhand-inventory" element={<SecondhandInventoryPage />} />
          <Route path="ecommerce/machinery-sub-categories" element={<MachinerySubCategoriesPage />} />
          <Route path="ecommerce/parts-categories" element={<PartsCategoriesPage />} />
          <Route path="ecommerce/parts" element={<PartsPage />} />

          {/* System Management */}
          <Route path="system/permissions" element={<PermissionsPage />} />
          <Route path="system/roles" element={<RolesPage />} />
          <Route path="system/users" element={<UsersPage />} />

          {/* Blog Group */}
          <Route path="blog/blogs" element={<BlogsPage />} />

          {/* Training Group */}
          <Route path="training/courses" element={<TrainingAdmin />} />
          <Route path="training/videos" element={<TrainingVideosPage />} />

          {/* Fallback for unimplemented pages */}
          <Route path="*" element={<AdminPagePlaceholder />} />
        </Route>

        {/* Main website routes - these use the Header/Footer */}
        <Route path="*" element={
          <>
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                {/* Shop routes */}
                <Route path="/shop" element={<Buy />} />
                <Route path="/shop/:category" element={<Buy />} />
                <Route path="/shop/:category/:id" element={<Product />} />
                {/* Keep /buy as redirect to /shop */}
                <Route path="/buy" element={<Navigate to="/shop" replace />} />
                <Route path="/repair" element={<Repair />} />
                <Route path="/buyback" element={<BuyBack />} />
                <Route path="/training" element={<Training />} />
                <Route path="/training/all" element={<AllCourses />} />
                <Route path="/training/:id" element={<CourseDetail />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/services" element={<Services />} />
                <Route path="/checkout" element={<Checkout />} />

                {/* SEO Landing Pages */}
                <Route path="/kathmandu-best-mobile-repair" element={<BangaloreBestMobileRepair2025 />} />
                <Route path="/iphone-repair-new-road-kathmandu" element={<IPhoneRepairJayanagar />} />
                <Route path="/macbook-repair-kathmandu" element={<MacBookRepairBangalore />} />

                {/* Service SEO Pages */}
                <Route path="/iphone-screen-repair-kathmandu" element={<ServicePageTemplate serviceName="iPhone Screen Repair" priceStart="₨4,800" slug="iphone-screen-repair-kathmandu" />} />
                <Route path="/samsung-display-replacement-nepal" element={<ServicePageTemplate serviceName="Samsung Display Replacement" priceStart="₨8,000" slug="samsung-display-replacement-nepal" />} />
                <Route path="/macbook-keyboard-repair-nepal" element={<ServicePageTemplate serviceName="MacBook Keyboard Repair" priceStart="₨5,600" slug="macbook-keyboard-repair-nepal" />} />
                <Route path="/laptop-battery-replacement-nepal" element={<ServicePageTemplate serviceName="Laptop Battery Replacement" priceStart="₨4,000" slug="laptop-battery-replacement-nepal" />} />
                <Route path="/liquid-damage-repair-kathmandu" element={<ServicePageTemplate serviceName="Liquid Damage Repair" priceStart="₨2,400" slug="liquid-damage-repair-kathmandu" />} />
                <Route path="/data-recovery-kathmandu" element={<ServicePageTemplate serviceName="Data Recovery Service" priceStart="₨4,800" slug="data-recovery-kathmandu" />} />
                <Route path="/charger-port-repair-nepal" element={<ServicePageTemplate serviceName="Charger Port Repair" priceStart="₨1,600" slug="charger-port-repair-nepal" />} />
                <Route path="/motherboard-repair-kathmandu" element={<ServicePageTemplate serviceName="Motherboard Chip-Level Repair" priceStart="₨4,000" slug="motherboard-repair-kathmandu" />} />
                <Route path="/ipad-repair-kathmandu" element={<ServicePageTemplate serviceName="iPad Repair" priceStart="₨5,600" slug="ipad-repair-kathmandu" />} />
                <Route path="/surface-repair-nepal" element={<ServicePageTemplate serviceName="Microsoft Surface Repair" priceStart="₨8,000" slug="surface-repair-nepal" />} />

                {/* Blog Posts */}
                <Route path="/blog/why-mobizilla-best-repair-shop-kathmandu" element={<WhyMobizillaBest />} />
                <Route path="/blog/iphone-15-screen-replacement-cost-nepal" element={<IPhone15ScreenCost />} />
                <Route path="/blog/macbook-repair-kathmandu-honest-review" element={<MacBookReview />} />
                <Route path="/blog/kathmandu-mobile-repair-price-comparison" element={<KathmanduPriceComparison />} />
                <Route path="/blog/doorstep-repair-vs-shop-repair-kathmandu" element={<DoorstepVsShop />} />

                {/* Order tracking routes */}
                <Route path="/track" element={<OrderTracking />} />
                <Route path="/track/:code" element={<OrderTracking />} />


                {/* Redirect all other routes to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
            <Chatbot />
          </>
        } />
      </Routes>
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <AdminAuthProvider>
        <ContentProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </ContentProvider>
      </AdminAuthProvider>
    </HelmetProvider>
  );
}

export default App;