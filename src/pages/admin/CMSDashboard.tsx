import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Plus,
  Trash2,
  Upload,
  Monitor,
  TrendingUp,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ContentSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'image' | 'html';
  section: 'home' | 'services' | 'about' | 'contact';
  lastModified: string;
}

interface WebsiteStats {
  totalVisits: number;
  repairBookings: number;
  buybackQuotes: number;
  contentUpdates: number;
  monthlyGrowth: number;
  conversionRate: number;
  avgSessionTime: string;
  topPages: { page: string; views: number }[];
}

interface UploadedImage {
  id: string;
  name: string;
  url: string;
  size: number;
  uploadedAt: string;
}

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [editingContent, setEditingContent] = useState<string | null>(null);
  const [contentSections, setContentSections] = useState<ContentSection[]>([]);
  const [stats, setStats] = useState<WebsiteStats>({
    totalVisits: 1247,
    repairBookings: 89,
    buybackQuotes: 156,
    contentUpdates: 23,
    monthlyGrowth: 12.5,
    conversionRate: 3.8,
    avgSessionTime: '2m 34s',
    topPages: [
      { page: '/repair', views: 456 },
      { page: '/buyback', views: 234 },
      { page: '/services', views: 189 },
      { page: '/', views: 368 }
    ]
  });
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    
    // Load content sections from localStorage
    const savedContent = localStorage.getItem('websiteContent');
    if (savedContent) {
      setContentSections(JSON.parse(savedContent));
    } else {
      // Initialize with default content
      const defaultContent: ContentSection[] = [
        {
          id: 'home-hero-title',
          title: 'Homepage Hero Title',
          content: 'Professional Device Repair & Services',
          type: 'text',
          section: 'home',
          lastModified: new Date().toISOString()
        },
        {
          id: 'home-hero-subtitle',
          title: 'Homepage Hero Subtitle',
          content: 'Expert repair services for smartphones, tablets, and laptops with genuine parts and warranty coverage.',
          type: 'text',
          section: 'home',
          lastModified: new Date().toISOString()
        },
        {
          id: 'services-page-title',
          title: 'Services Page Main Title',
          content: 'Our Services',
          type: 'text',
          section: 'services',
          lastModified: new Date().toISOString()
        },
        {
          id: 'services-page-subtitle',
          title: 'Services Page Subtitle',
          content: 'From professional repairs to technical training, we provide comprehensive solutions for all your mobile device needs with expert care and quality guarantee.',
          type: 'text',
          section: 'services',
          lastModified: new Date().toISOString()
        },
        {
          id: 'services-repair-title',
          title: 'Repair Services Title',
          content: 'Device Repair Services',
          type: 'text',
          section: 'services',
          lastModified: new Date().toISOString()
        },
        {
          id: 'services-repair-description',
          title: 'Repair Services Description',
          content: 'Professional repair services for all your devices with expert technicians and genuine parts.',
          type: 'text',
          section: 'services',
          lastModified: new Date().toISOString()
        },
        {
          id: 'services-buyback-title',
          title: 'BuyBack Program Title',
          content: 'Device BuyBack Program',
          type: 'text',
          section: 'services',
          lastModified: new Date().toISOString()
        },
        {
          id: 'services-buyback-description',
          title: 'BuyBack Program Description',
          content: 'Get instant cash for your old devices with our hassle-free buyback program.',
          type: 'text',
          section: 'services',
          lastModified: new Date().toISOString()
        },
        {
          id: 'services-training-title',
          title: 'Training Program Title',
          content: 'Technical Training Programs',
          type: 'text',
          section: 'services',
          lastModified: new Date().toISOString()
        },
        {
          id: 'services-training-description',
          title: 'Training Program Description',
          content: 'Learn professional device repair skills with hands-on training and certification.',
          type: 'text',
          section: 'services',
          lastModified: new Date().toISOString()
        },
        {
          id: 'services-store-title',
          title: 'Device Store Title',
          content: 'Device Store',
          type: 'text',
          section: 'services',
          lastModified: new Date().toISOString()
        },
        {
          id: 'services-store-description',
          title: 'Device Store Description',
          content: 'Premium devices and accessories coming soon with competitive pricing.',
          type: 'text',
          section: 'services',
          lastModified: new Date().toISOString()
        },
        {
          id: 'contact-phone',
          title: 'Contact Phone Number',
          content: '+977-1-5354999',
          type: 'text',
          section: 'contact',
          lastModified: new Date().toISOString()
        },
        {
          id: 'contact-email',
          title: 'Contact Email',
          content: 'mobizillanepal@gmail.com',
          type: 'text',
          section: 'contact',
          lastModified: new Date().toISOString()
        }
      ];
      setContentSections(defaultContent);
      localStorage.setItem('websiteContent', JSON.stringify(defaultContent));
    }
  }, []);

  if (!isLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminLoginTime');
    setIsLoggedIn(false);
  };

  const handleContentEdit = (sectionId: string, newContent: string) => {
    const updatedSections = contentSections.map(section => 
      section.id === sectionId 
        ? { ...section, content: newContent, lastModified: new Date().toISOString() }
        : section
    );
    setContentSections(updatedSections);
    localStorage.setItem('websiteContent', JSON.stringify(updatedSections));
    setEditingContent(null);
    
    // Update stats
    setStats(prev => ({ ...prev, contentUpdates: prev.contentUpdates + 1 }));
  };

  const addNewContent = () => {
    const newSection: ContentSection = {
      id: `custom-${Date.now()}`,
      title: 'New Content Section',
      content: 'Enter your content here...',
      type: 'text',
      section: 'home',
      lastModified: new Date().toISOString()
    };
    const updatedSections = [...contentSections, newSection];
    setContentSections(updatedSections);
    localStorage.setItem('websiteContent', JSON.stringify(updatedSections));
  };

  const deleteContent = (sectionId: string) => {
    const updatedSections = contentSections.filter(section => section.id !== sectionId);
    setContentSections(updatedSections);
    localStorage.setItem('websiteContent', JSON.stringify(updatedSections));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Admin Dashboard - Content Management | Mobizilla</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-gray-900">Mobizilla CMS</h1>
              <Badge className="bg-green-100 text-green-800">Admin Dashboard</Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <Link to="/" target="_blank">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Website
                </Button>
              </Link>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="content">
              <FileText className="h-4 w-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="media">
              <Image className="h-4 w-4 mr-2" />
              Media
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Visits</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalVisits.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FileText className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Repair Bookings</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.repairBookings}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <BarChart3 className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">BuyBack Quotes</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.buybackQuotes}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Edit className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Content Updates</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.contentUpdates}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button onClick={() => setActiveTab('content')} className="justify-start">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Content
                  </Button>
                  <Button onClick={() => setActiveTab('media')} variant="outline" className="justify-start">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Media
                  </Button>
                  <Button onClick={() => setActiveTab('analytics')} variant="outline" className="justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Management Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Content Management</h2>
              <Button onClick={addNewContent}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Content
              </Button>
            </div>

            <div className="grid gap-6">
              {contentSections.map((section) => (
                <Card key={section.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                        <p className="text-sm text-gray-500">
                          Section: {section.section} • Type: {section.type} • 
                          Last modified: {new Date(section.lastModified).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingContent(section.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteContent(section.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {editingContent === section.id ? (
                      <div className="space-y-4">
                        <Textarea
                          value={section.content}
                          onChange={(e) => {
                            const updatedSections = contentSections.map(s =>
                              s.id === section.id ? { ...s, content: e.target.value } : s
                            );
                            setContentSections(updatedSections);
                          }}
                          rows={4}
                          className="w-full"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleContentEdit(section.id, section.content)}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingContent(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-700">{section.content}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Enhanced Media Tab */}
          <TabsContent value="media" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Upload Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Upload Images
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Images</h3>
                    <p className="text-gray-500 mb-4">Drag and drop your images here, or click to browse</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload">
                      <Button disabled={isUploading} className="cursor-pointer">
                        {isUploading ? 'Uploading...' : 'Browse Files'}
                      </Button>
                    </label>
                    <p className="text-xs text-gray-400 mt-2">Supports: JPG, PNG, GIF, WebP (Max 10MB each)</p>
                  </div>
                </CardContent>
              </Card>
          
              {/* Upload Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    Media Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">Total Images</span>
                      <span className="text-xl font-bold text-blue-600">{uploadedImages.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">Storage Used</span>
                      <span className="text-xl font-bold text-green-600">
                        {formatFileSize(uploadedImages.reduce((total, img) => total + img.size, 0))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="font-medium">Recent Uploads</span>
                      <span className="text-xl font-bold text-purple-600">
                        {uploadedImages.filter(img => 
                          new Date(img.uploadedAt).toDateString() === new Date().toDateString()
                        ).length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          
            {/* Image Gallery */}
            <Card>
              <CardHeader>
                <CardTitle>Media Library</CardTitle>
              </CardHeader>
              <CardContent>
                {uploadedImages.length === 0 ? (
                  <div className="text-center py-8">
                    <Image className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No images uploaded yet</p>
                    <p className="text-sm text-gray-400">Upload your first image to get started</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {uploadedImages.map((image) => (
                      <div key={image.id} className="relative group rounded-lg overflow-hidden border">
                        <img 
                          src={image.url} 
                          alt={image.name}
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteImage(image.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="p-2 bg-white">
                          <p className="text-xs font-medium truncate">{image.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(image.size)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Real-time Metrics */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Real-time Metrics
                  </CardTitle>
                  <RefreshCw className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">Page Views Today</span>
                      <span className="text-xl font-bold text-blue-600">{stats.totalVisits}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">Conversion Rate</span>
                      <span className="text-xl font-bold text-green-600">{stats.conversionRate}%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="font-medium">Avg. Session Time</span>
                      <span className="text-xl font-bold text-purple-600">{stats.avgSessionTime}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="font-medium">Monthly Growth</span>
                      <span className="text-xl font-bold text-orange-600">+{stats.monthlyGrowth}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
          
              {/* Top Pages */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Top Performing Pages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.topPages.map((page, index) => (
                      <div key={page.page} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <span className="font-medium">{page.page}</span>
                        </div>
                        <span className="text-gray-600">{page.views} views</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          
            {/* Service Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Service Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                    <h4 className="font-bold text-blue-800 mb-2">🔧 Repair Bookings</h4>
                    <p className="text-2xl font-bold text-blue-600">{stats.repairBookings}</p>
                    <p className="text-sm text-blue-700">+12% this month</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                    <h4 className="font-bold text-green-800 mb-2">💰 BuyBack Quotes</h4>
                    <p className="text-2xl font-bold text-green-600">{stats.buybackQuotes}</p>
                    <p className="text-sm text-green-700">+8% this month</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                    <h4 className="font-bold text-purple-800 mb-2">📚 Training Inquiries</h4>
                    <p className="text-2xl font-bold text-purple-600">42</p>
                    <p className="text-sm text-purple-700">+25% this month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Website Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="site-title">Site Title</Label>
                    <Input id="site-title" defaultValue="Mobizilla - Professional Device Repair" />
                  </div>
                  <div>
                    <Label htmlFor="site-description">Site Description</Label>
                    <Input id="site-description" defaultValue="Expert repair services for all devices" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input id="contact-email" defaultValue="mobizillanepal@gmail.com" />
                </div>
                <div>
                  <Label htmlFor="contact-phone">Contact Phone</Label>
                  <Input id="contact-phone" defaultValue="+977-1-5354999" />
                </div>
                <Button>Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}