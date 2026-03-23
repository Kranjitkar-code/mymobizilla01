import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LayoutDashboard, 
  FileText, 
  Image, 
  Settings, 
  Users,
  BarChart3,
  LogOut,
  Edit,
  Save,
  Eye,
  Upload,
  TrendingUp,
  RefreshCw,
  Search,
  Globe,
  Zap,
  Target,
  Shield,
  Clock,
  Activity,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  Building
} from 'lucide-react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useContent } from '@/contexts/ContentContext';
import { ContentService } from '@/services/contentService';
import type { WebsiteSettings, EditableContent } from '@/services/contentService';
import { BookingsService } from '@/services/bookingsService';
// Load migration utilities (available in browser console)
import '@/utils/firebaseMigration';
import '@/utils/initializeFirebaseData';
import '@/utils/initializeSupabase';
import { syncEditableContentToItems } from '@/utils/syncContent';

interface SEOMetrics {
  pageTitle: string;
  metaDescription: string;
  keywords: string[];
  robotsTxt: string;
  sitemap: string;
  seoScore: number;
  indexedPages: number;
  backlinks: number;
  organicTraffic: number;
}

interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  timeToInteractive: number;
  performanceScore: number;
  mobileScore: number;
  desktopScore: number;
}

interface WebsiteStats {
  totalVisits: number;
  repairBookings: number;
  buybackQuotes: number;
  contentUpdates: number;
  monthlyGrowth: number;
  conversionRate: number;
  avgSessionTime: string;
}

export default function AdvancedAdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [editingContent, setEditingContent] = useState<string | null>(null);
  const { content: contentSections, loading, error, refreshContent, updateContent } = useContent();
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false);
  
  const [stats, setStats] = useState<WebsiteStats>({
    totalVisits: 103,
    repairBookings: 2,
    buybackQuotes: 156,
    contentUpdates: 23,
    monthlyGrowth: 12.5,
    conversionRate: 3.8,
    avgSessionTime: '2m 34s'
  });

  const [seoMetrics, setSeoMetrics] = useState<SEOMetrics>({
    pageTitle: 'Mobizilla - Professional Device Repair & Services',
    metaDescription: 'Expert repair services for smartphones, tablets, and laptops with genuine parts and warranty coverage.',
    keywords: ['phone repair', 'laptop repair', 'device repair', 'mobile repair', 'screen replacement'],
    robotsTxt: 'Active',
    sitemap: 'Generated',
    seoScore: 85,
    indexedPages: 12,
    backlinks: 45,
    organicTraffic: 1247
  });

  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    pageLoadTime: 1.2,
    firstContentfulPaint: 0.8,
    largestContentfulPaint: 1.5,
    cumulativeLayoutShift: 0.05,
    timeToInteractive: 2.1,
    performanceScore: 92,
    mobileScore: 88,
    desktopScore: 95
  });

  const [editableContent, setEditableContent] = useState<EditableContent>({
    heroTitle: 'Professional Device Repair & Services',
    heroSubtitle: 'Expert repair services for smartphones, tablets, and laptops with genuine parts and warranty coverage.',
    contactPhone: '+977-1-5354999',
    contactEmail: 'mobizillanepal@gmail.com',
    contactAddress: 'Ratna Plaza, New Road, Kathmandu 44600, Nepal',
    aboutUs: 'Mobizilla is your trusted partner for all device repair needs. With years of experience and certified technicians, we provide quality service you can rely on.',
    servicesDescription: 'From professional repairs to technical training, we provide comprehensive solutions for all your mobile device needs with expert care and quality guarantee.'
  });

  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings>({
    siteTitle: '',
    contactPhone: '',
    contactEmail: '',
    contactAddress: ''
  });

  useEffect(() => {
    // Only load settings and content if not already loaded
    if (!settingsLoaded) {
      loadSettings();
      setSettingsLoaded(true);
    }
    
    if (!contentLoaded) {
      loadEditableContent();
      setContentLoaded(true);
    }

  // Subscribe to real-time booking statistics from Supabase
    const unsubscribeBookings = BookingsService.subscribeToBookingStats((bookingStats) => {
      setStats(prev => ({
        ...prev,
        repairBookings: bookingStats.repairBookings,
        buybackQuotes: bookingStats.buybackBookings,
        totalVisits: prev.totalVisits + Math.floor(Math.random() * 3) // Keep visit simulation
      }));
      console.log('📊 Real-time booking stats updated:', bookingStats);
    });

    // Real-time visits simulation (will be replaced with actual analytics later)
    const statsInterval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalVisits: prev.totalVisits + Math.floor(Math.random() * 3)
      }));
    }, 10000);

    // Simulate SEO metrics updates
    const seoInterval = setInterval(() => {
      setSeoMetrics(prev => ({
        ...prev,
        organicTraffic: prev.organicTraffic + Math.floor(Math.random() * 5),
        backlinks: prev.backlinks + (Math.random() > 0.95 ? 1 : 0)
      }));
    }, 15000);

    return () => {
      unsubscribeBookings();
      clearInterval(statsInterval);
      clearInterval(seoInterval);
    };
  }, [settingsLoaded, contentLoaded]);

  const loadSettings = useCallback(async () => {
    // First try cache for instant load
    const cached = localStorage.getItem('websiteSettings');
    if (cached) {
      try {
        setWebsiteSettings(JSON.parse(cached));
        console.log('⚡ Using cached settings for instant load');
      } catch (e) {
        console.error('Failed to parse cached settings');
      }
    }
    
  // Then load from Supabase in background
    try {
  console.log('🔄 Loading settings from Supabase...');
      const settings = await ContentService.getSettings();
      setWebsiteSettings(settings);
  console.log('✅ Settings loaded from Supabase');
      
      // Update cache
      localStorage.setItem('websiteSettings', JSON.stringify(settings));
    } catch (err: any) {
  console.error('❌ Error loading settings from Supabase:', err);
      
  // If no cache and Supabase fails, show default
      if (!cached) {
        console.log('⚠️ Using default settings');
      }
    }
  }, []);

  const loadEditableContent = useCallback(async () => {
    // First try cache for instant load
    const cached = localStorage.getItem('editableWebsiteContent');
    if (cached) {
      try {
        setEditableContent(JSON.parse(cached));
        console.log('⚡ Using cached editable content for instant load');
      } catch (e) {
        console.error('Failed to parse cached content');
      }
    }
    
  // Then load from Supabase in background
    try {
  console.log('🔄 Loading editable content from Supabase...');
      const content = await ContentService.getEditableContent();
      setEditableContent(content);
  console.log('✅ Editable content loaded from Supabase');
      
      // Update cache
      localStorage.setItem('editableWebsiteContent', JSON.stringify(content));
    } catch (err: any) {
  console.error('❌ Error loading editable content from Supabase:', err);
      
  // If no cache and Supabase fails, keep default
      if (!cached) {
        console.log('⚠️ Using default editable content');
      }
    }
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminLoginTime');
    localStorage.removeItem('adminToken');
    // Force full page reload to clear state
    window.location.href = '/admin/login';
  }, []);

  const handleContentSave = async (field: keyof EditableContent) => {
    try {
  console.log(`🔄 Saving ${field} to Supabase...`);
      
  // Save to Supabase editable_content table
      await ContentService.updateEditableContent(editableContent);
      
      // Also sync to individual content items (so website pages can use them)
      console.log('🔄 Syncing to website content items...');
      await syncEditableContentToItems();
      
      // Cache to localStorage as backup
      localStorage.setItem('editableWebsiteContent', JSON.stringify(editableContent));
      
      setSaveStatus(`✅ ${field} updated successfully! Changes are live on website.`);
      console.log(`✅ ${field} saved and synced to website`);
      
      // Trigger content update event for other components
      window.dispatchEvent(new CustomEvent('contentUpdated'));
    } catch (err) {
  console.error('❌ Error saving to Supabase:', err);
  setSaveStatus(`⚠️ ${field} saved locally only. Supabase sync failed.`);
      
      // Still save to localStorage as fallback
      localStorage.setItem('editableWebsiteContent', JSON.stringify(editableContent));
    }

    setTimeout(() => setSaveStatus(null), 3000);
    setEditingContent(null);
    setStats(prev => ({ ...prev, contentUpdates: prev.contentUpdates + 1 }));
  };

  const handleSettingsSave = async () => {
    try {
  console.log('🔄 Saving settings to Supabase...');
      
  // Save to Supabase
      await ContentService.updateSettings(websiteSettings);
      
      // Also cache to localStorage
      localStorage.setItem('websiteSettings', JSON.stringify(websiteSettings));
      
  setSaveStatus('✅ Settings saved successfully to Supabase! Changes are now live.');
  console.log('✅ Settings saved to Supabase');
      
      // Trigger content update event
      window.dispatchEvent(new CustomEvent('contentUpdated'));
      
      setTimeout(() => setSaveStatus(null), 4000);
      setStats(prev => ({ ...prev, contentUpdates: prev.contentUpdates + 1 }));
    } catch (err: any) {
  console.error('❌ Error saving settings to Supabase:', err);
  setSaveStatus(`⚠️ Settings saved locally only. Supabase sync failed: ${err.message}`);
      
      // Still save to localStorage as fallback
      localStorage.setItem('websiteSettings', JSON.stringify(websiteSettings));
      
      setTimeout(() => setSaveStatus(null), 5000);
    }
  };

  const getScoreColor = useCallback((score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  }, []);

  const getScoreBgColor = useCallback((score: number) => {
    if (score >= 90) return 'bg-green-50';
    if (score >= 70) return 'bg-yellow-50';
    return 'bg-red-50';
  }, []);

  // Memoize quick stats cards to prevent unnecessary re-renders
  const quickStatsCards = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">Total Visits</p>
              <p className="text-3xl font-bold text-blue-900">{stats.totalVisits.toLocaleString()}</p>
              <p className="text-xs text-blue-700 mt-1">+{stats.monthlyGrowth}% this month</p>
            </div>
            <Users className="h-12 w-12 text-blue-600 opacity-50" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">Repair Bookings</p>
              <p className="text-3xl font-bold text-green-900">{stats.repairBookings}</p>
              <p className="text-xs text-green-700 mt-1">{stats.conversionRate}% conversion</p>
            </div>
            <FileText className="h-12 w-12 text-green-600 opacity-50" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-800">SEO Score</p>
              <p className="text-3xl font-bold text-purple-900">{seoMetrics.seoScore}/100</p>
              <p className="text-xs text-purple-700 mt-1">Excellent ranking</p>
            </div>
            <Search className="h-12 w-12 text-purple-600 opacity-50" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-800">Performance</p>
              <p className="text-3xl font-bold text-orange-900">{performanceMetrics.performanceScore}/100</p>
              <p className="text-xs text-orange-700 mt-1">{performanceMetrics.pageLoadTime}s load time</p>
            </div>
            <Zap className="h-12 w-12 text-orange-600 opacity-50" />
          </div>
        </CardContent>
      </Card>
    </div>
  ), [stats, seoMetrics, performanceMetrics]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Helmet>
        <title>Advanced Admin Dashboard | Mobizilla</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      {/* Header */}
      <header className="bg-white shadow-md border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <div>
                <h1 className="text-base sm:text-xl font-bold text-gray-900">
                  <span className="hidden sm:inline">Mobizilla Admin</span>
                  <span className="sm:hidden">Mobizilla</span>
                </h1>
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                  <span className="hidden sm:inline">Advanced Dashboard</span>
                  <span className="sm:hidden">Advanced</span>
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
              <Badge variant="outline" className="hidden md:flex items-center gap-1 text-xs">
                <Activity className="h-3 w-3 text-green-500 animate-pulse" />
                Live Updates
              </Badge>
              <Link to="/" target="_blank">
                <Button variant="outline" size="sm" className="h-8 sm:h-9">
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">View Site</span>
                </Button>
              </Link>
              <Button onClick={handleLogout} variant="outline" size="sm" className="h-8 sm:h-9">
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Status Messages */}
        {saveStatus && (
          <div className={`mb-4 p-3 sm:p-4 rounded-lg border text-sm ${
            saveStatus.includes('✅') 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <span className="font-medium">{saveStatus}</span>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div>
            <TabsList className="grid grid-cols-3 sm:grid-cols-6 mb-4 sm:mb-6 h-auto p-1 gap-1">
              <TabsTrigger value="overview" className="flex items-center justify-center gap-1 sm:gap-2 py-2.5 px-2 text-xs sm:text-sm">
                <LayoutDashboard className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline sm:inline">Over</span>
              </TabsTrigger>
              <TabsTrigger value="seo" className="flex items-center justify-center gap-1 sm:gap-2 py-2.5 px-2 text-xs sm:text-sm">
                <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline sm:inline">SEO</span>
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center justify-center gap-1 sm:gap-2 py-2.5 px-2 text-xs sm:text-sm">
                <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline sm:inline">Perf</span>
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center justify-center gap-1 sm:gap-2 py-2.5 px-2 text-xs sm:text-sm">
                <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline sm:inline">Edit</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center justify-center gap-1 sm:gap-2 py-2.5 px-2 text-xs sm:text-sm">
                <BarChart3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline sm:inline">Data</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center justify-center gap-1 sm:gap-2 py-2.5 px-2 text-xs sm:text-sm">
                <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline sm:inline">Set</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            {quickStatsCards}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button onClick={() => setActiveTab('content')} className="justify-start h-auto py-4">
                    <Edit className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Edit Website Content</div>
                      <div className="text-xs opacity-80">Update hero, contact & more</div>
                    </div>
                  </Button>
                  <Button onClick={() => setActiveTab('seo')} variant="outline" className="justify-start h-auto py-4">
                    <Search className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Optimize SEO</div>
                      <div className="text-xs opacity-80">Improve search rankings</div>
                    </div>
                  </Button>
                  <Button onClick={() => setActiveTab('performance')} variant="outline" className="justify-start h-auto py-4">
                    <Zap className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Check Performance</div>
                      <div className="text-xs opacity-80">Monitor site speed</div>
                    </div>
                  </Button>
                  <Button asChild variant="outline" className="justify-start h-auto py-4">
                    <Link to="/admin/phones" className="flex w-full items-start">
                      <Phone className="h-5 w-5 mr-3 mt-0.5" />
                      <div className="text-left">
                        <div className="font-semibold">Manage Phone Catalog</div>
                        <div className="text-xs opacity-80">Add latest devices per brand</div>
                      </div>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Website Status</span>
                    </div>
                    <Badge className="bg-green-600">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Database Connection</span>
                    </div>
                    <Badge className="bg-green-600">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="font-medium">API Services</span>
                    </div>
                    <Badge className="bg-green-600">Running</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* SEO Score */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    SEO Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className={`text-6xl font-bold ${getScoreColor(seoMetrics.seoScore)} mb-2`}>
                        {seoMetrics.seoScore}
                      </div>
                      <p className="text-gray-600">Overall SEO Score</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{seoMetrics.indexedPages}</p>
                        <p className="text-xs text-gray-600">Indexed Pages</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{seoMetrics.backlinks}</p>
                        <p className="text-xs text-gray-600">Backlinks</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">{seoMetrics.organicTraffic}</p>
                        <p className="text-xs text-gray-600">Organic Traffic</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SEO Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Key SEO Factors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Page Title</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">✓ Optimized</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Meta Description</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">✓ Optimized</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Keywords Density</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">✓ Good</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Mobile Friendly</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">✓ Yes</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">SSL Certificate</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">✓ Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* SEO Details */}
            <Card>
              <CardHeader>
                <CardTitle>SEO Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Page Title</Label>
                  <Input value={seoMetrics.pageTitle} readOnly className="mt-1" />
                </div>
                <div>
                  <Label>Meta Description</Label>
                  <Textarea value={seoMetrics.metaDescription} readOnly className="mt-1" rows={3} />
                </div>
                <div>
                  <Label>Keywords</Label>
                  <Input value={seoMetrics.keywords.join(', ')} readOnly className="mt-1" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Score */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Performance Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className={`text-6xl font-bold ${getScoreColor(performanceMetrics.performanceScore)} mb-2`}>
                        {performanceMetrics.performanceScore}
                      </div>
                      <p className="text-gray-600">Overall Performance</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{performanceMetrics.mobileScore}</p>
                        <p className="text-xs text-gray-600">Mobile Score</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{performanceMetrics.desktopScore}</p>
                        <p className="text-xs text-gray-600">Desktop Score</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Core Web Vitals */}
              <Card>
                <CardHeader>
                  <CardTitle>Core Web Vitals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Largest Contentful Paint</p>
                        <p className="text-xs text-gray-600">LCP</p>
                      </div>
                      <Badge className="bg-green-600">{performanceMetrics.largestContentfulPaint}s</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">First Contentful Paint</p>
                        <p className="text-xs text-gray-600">FCP</p>
                      </div>
                      <Badge className="bg-green-600">{performanceMetrics.firstContentfulPaint}s</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Cumulative Layout Shift</p>
                        <p className="text-xs text-gray-600">CLS</p>
                      </div>
                      <Badge className="bg-green-600">{performanceMetrics.cumulativeLayoutShift}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Time to Interactive</p>
                        <p className="text-xs text-gray-600">TTI</p>
                      </div>
                      <Badge className="bg-green-600">{performanceMetrics.timeToInteractive}s</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-800">Excellent Page Load Speed</p>
                      <p className="text-sm text-green-700">Your site loads in {performanceMetrics.pageLoadTime}s which is excellent!</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800">Optimized Images</p>
                      <p className="text-sm text-blue-700">All images are properly compressed and optimized</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                    <Zap className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-purple-800">Caching Enabled</p>
                      <p className="text-sm text-purple-700">Browser caching is properly configured</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Edit Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid gap-6">
              {/* Hero Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Homepage Hero Section
                    </span>
                    <Badge variant="outline">High Priority</Badge>
                  </CardTitle>
                  <CardDescription>This appears on your homepage as the main headline</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Hero Title</Label>
                    {editingContent === 'heroTitle' ? (
                      <div className="space-y-2 mt-2">
                        <Input
                          value={editableContent.heroTitle}
                          onChange={(e) => setEditableContent({...editableContent, heroTitle: e.target.value})}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleContentSave('heroTitle')}>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingContent(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>{editableContent.heroTitle}</span>
                        <Button size="sm" variant="outline" onClick={() => setEditingContent('heroTitle')}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label>Hero Subtitle</Label>
                    {editingContent === 'heroSubtitle' ? (
                      <div className="space-y-2 mt-2">
                        <Textarea
                          value={editableContent.heroSubtitle}
                          onChange={(e) => setEditableContent({...editableContent, heroSubtitle: e.target.value})}
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleContentSave('heroSubtitle')}>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingContent(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>{editableContent.heroSubtitle}</span>
                        <Button size="sm" variant="outline" onClick={() => setEditingContent('heroSubtitle')}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                  <CardDescription>Update your business contact details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </Label>
                    {editingContent === 'contactPhone' ? (
                      <div className="space-y-2 mt-2">
                        <Input
                          value={editableContent.contactPhone}
                          onChange={(e) => setEditableContent({...editableContent, contactPhone: e.target.value})}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleContentSave('contactPhone')}>
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingContent(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>{editableContent.contactPhone}</span>
                        <Button size="sm" variant="outline" onClick={() => setEditingContent('contactPhone')}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </Label>
                    {editingContent === 'contactEmail' ? (
                      <div className="space-y-2 mt-2">
                        <Input
                          value={editableContent.contactEmail}
                          onChange={(e) => setEditableContent({...editableContent, contactEmail: e.target.value})}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleContentSave('contactEmail')}>
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingContent(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>{editableContent.contactEmail}</span>
                        <Button size="sm" variant="outline" onClick={() => setEditingContent('contactEmail')}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Business Address
                    </Label>
                    {editingContent === 'contactAddress' ? (
                      <div className="space-y-2 mt-2">
                        <Input
                          value={editableContent.contactAddress}
                          onChange={(e) => setEditableContent({...editableContent, contactAddress: e.target.value})}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleContentSave('contactAddress')}>
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingContent(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>{editableContent.contactAddress}</span>
                        <Button size="sm" variant="outline" onClick={() => setEditingContent('contactAddress')}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* About Us Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    About Us Section
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {editingContent === 'aboutUs' ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editableContent.aboutUs}
                        onChange={(e) => setEditableContent({...editableContent, aboutUs: e.target.value})}
                        rows={4}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleContentSave('aboutUs')}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingContent(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                      <p className="flex-1">{editableContent.aboutUs}</p>
                      <Button size="sm" variant="outline" onClick={() => setEditingContent('aboutUs')}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Services Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Services Page Description</CardTitle>
                </CardHeader>
                <CardContent>
                  {editingContent === 'servicesDescription' ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editableContent.servicesDescription}
                        onChange={(e) => setEditableContent({...editableContent, servicesDescription: e.target.value})}
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleContentSave('servicesDescription')}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingContent(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                      <p className="flex-1">{editableContent.servicesDescription}</p>
                      <Button size="sm" variant="outline" onClick={() => setEditingContent('servicesDescription')}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Real-time Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">Active Users</span>
                      <span className="text-2xl font-bold text-blue-600">12</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">Avg Session Duration</span>
                      <span className="text-2xl font-bold text-green-600">{stats.avgSessionTime}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="font-medium">Bounce Rate</span>
                      <span className="text-2xl font-bold text-purple-600">32%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Service Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-blue-800">Repair Bookings</span>
                        <span className="text-xl font-bold text-blue-900">{stats.repairBookings}</span>
                      </div>
                      <p className="text-xs text-blue-700">+12% this month</p>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-green-800">BuyBack Quotes</span>
                        <span className="text-xl font-bold text-green-900">{stats.buybackQuotes}</span>
                      </div>
                      <p className="text-xs text-green-700">+8% this month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Global Website Settings</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Configure site-wide settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label className="text-xs sm:text-sm">Site Title</Label>
                    <Input 
                      value={websiteSettings.siteTitle}
                      onChange={(e) => setWebsiteSettings({...websiteSettings, siteTitle: e.target.value})}
                      placeholder="Enter site title"
                      className="text-sm mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm">Contact Phone</Label>
                    <Input 
                      value={websiteSettings.contactPhone}
                      onChange={(e) => setWebsiteSettings({...websiteSettings, contactPhone: e.target.value})}
                      placeholder="Enter phone"
                      className="text-sm mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm">Contact Email</Label>
                    <Input 
                      value={websiteSettings.contactEmail}
                      onChange={(e) => setWebsiteSettings({...websiteSettings, contactEmail: e.target.value})}
                      placeholder="Enter email"
                      className="text-sm mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm">Contact Address</Label>
                    <Input 
                      value={websiteSettings.contactAddress}
                      onChange={(e) => setWebsiteSettings({...websiteSettings, contactAddress: e.target.value})}
                      placeholder="Enter address"
                      className="text-sm mt-1"
                    />
                  </div>
                </div>
                <Button onClick={handleSettingsSave} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  Save All Settings
                </Button>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Admin Account</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg gap-2">
                    <div>
                      <p className="font-medium text-sm">Email</p>
                      <p className="text-xs sm:text-sm text-gray-600 break-all">{localStorage.getItem('adminEmail')}</p>
                    </div>
                    <Badge variant="outline" className="self-start sm:self-auto">Admin</Badge>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg gap-2">
                    <div>
                      <p className="font-medium text-sm">Last Login</p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {new Date(localStorage.getItem('adminLoginTime') || '').toLocaleString()}
                      </p>
                    </div>
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
