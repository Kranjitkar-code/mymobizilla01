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
  RefreshCw
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { contentAPI, ContentItem, WebsiteSettings } from '@/api/content';
import { useContent } from '@/contexts/ContentContext';

interface WebsiteStats {
  totalVisits: number;
  repairBookings: number;
  buybackQuotes: number;
  contentUpdates: number;
  monthlyGrowth: number;
  conversionRate: number;
  avgSessionTime: string;
}

interface UploadedImage {
  id: string;
  name: string;
  url: string;
  size: number;
  uploadedAt: string;
}

export default function CMSDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [editingContent, setEditingContent] = useState<string | null>(null);
  const { content: contentSections, loading, error, refreshContent, updateContent } = useContent();
  const [stats, setStats] = useState<WebsiteStats>({
    totalVisits: 1247,
    repairBookings: 89,
    buybackQuotes: 156,
    contentUpdates: 23,
    monthlyGrowth: 12.5,
    conversionRate: 3.8,
    avgSessionTime: '2m 34s'
  });
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings>({
    siteTitle: '',
    contactPhone: '',
    contactEmail: '',
    contactAddress: ''
  });
  const [dragActive, setDragActive] = useState(false);
  // Add state for tracking which content is being saved
  const [savingContentId, setSavingContentId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<Record<string, string>>({});

  useEffect(() => {
    const loggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    
    // Load uploaded images from localStorage (keeping this as is for now)
    const savedImages = localStorage.getItem('uploadedImages');
    if (savedImages) {
      setUploadedImages(JSON.parse(savedImages));
    }

    // Load website settings from backend
    loadSettings();

    // Real-time stats simulation
    const statsInterval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalVisits: prev.totalVisits + Math.floor(Math.random() * 3),
        repairBookings: prev.repairBookings + (Math.random() > 0.9 ? 1 : 0),
        buybackQuotes: prev.buybackQuotes + (Math.random() > 0.8 ? 1 : 0)
      }));
    }, 10000);

    return () => clearInterval(statsInterval);
  }, []);

  const loadSettings = async () => {
    try {
      const response = await contentAPI.getSettings();
      if (response.success) {
        setWebsiteSettings(response.data);
      } else {
        //setError('Failed to load settings');
      }
    } catch (err: any) {
      console.error('Error loading settings:', err);
      //setError(err.message || 'Failed to load settings');
    }
  };

  if (!isLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    // Call backend logout API
    const token = localStorage.getItem('adminToken');
    if (token) {
      fetch('http://localhost:8000/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }).catch(err => {
        console.error('Error during logout:', err);
      });
    }
    
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminLoginTime');
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
  };

  const handleContentEdit = async (sectionId: string, newContent: string) => {
    try {
      setSavingContentId(sectionId);
      
      // Get the current section to preserve other properties
      const section = contentSections.find(s => s.id === sectionId);
      if (!section) {
        throw new Error('Section not found');
      }
      
      // Update the content in the state immediately for optimistic UI update
      const updatedSections = contentSections.map(s => 
        s.id === sectionId ? { ...s, content: newContent } : s
      );
      
      // Update the content using the context
      await updateContent(
        sectionId,
        newContent,
        section.title,
        section.type as 'text' | 'image' | 'html',
        section.section as 'home' | 'services' | 'about' | 'contact' | 'settings' | 'footer'
      );
      
      setEditingContent(null);
      setStats(prev => ({ ...prev, contentUpdates: prev.contentUpdates + 1 }));
      
      // Show success message
      setSaveStatus('Content updated successfully! ✅');
      setTimeout(() => setSaveStatus(null), 3000);
      
    } catch (err: any) {
      console.error('Error updating content:', err);
      setSaveStatus(`Error: ${err.message || 'Failed to update content'} ❌`);
      setTimeout(() => setSaveStatus(null), 5000);
      
      // Revert to the previous content on error
      const previousSections = contentSections.map(s => 
        s.id === sectionId ? { ...s, content: section?.content || '' } : s
      );
    } finally {
      setSavingContentId(null);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    handleFiles(files);
    // Reset the input
    event.target.value = '';
  };

  const deleteImage = (imageId: string) => {
    setUploadedImages(prev => {
      const updated = prev.filter(img => img.id !== imageId);
      localStorage.setItem('uploadedImages', JSON.stringify(updated));
      return updated;
    });
    setSaveStatus('Image deleted successfully! 🗑️');
    setTimeout(() => setSaveStatus(null), 2000);
  };

  const handleSettingsSave = async () => {
    try {
      //setError(null);
      
      // Save settings to backend
      const response = await contentAPI.updateSettings(websiteSettings);
      if (response.success) {
        // Update corresponding content sections
        // Trigger content update event for live refresh
        window.dispatchEvent(new CustomEvent('contentUpdated'));
        
        // Show success message
        setSaveStatus('Settings saved successfully! ✅ Changes are now live on the website.');
        setTimeout(() => setSaveStatus(null), 4000);
        
        setStats(prev => ({ ...prev, contentUpdates: prev.contentUpdates + 1 }));
      } else {
        //setError(response.message || 'Failed to save settings');
      }
    } catch (err: any) {
      console.error('Error saving settings:', err);
      //setError(err.message || 'Failed to save settings');
    }
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files: FileList) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    const promises = Array.from(files).map(file => {
      return new Promise<UploadedImage>((resolve, reject) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          reject(new Error(`${file.name} is not an image file`));
          return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          reject(new Error(`${file.name} is too large (max 5MB)`));
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage: UploadedImage = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: file.name,
            url: e.target?.result as string,
            size: file.size,
            uploadedAt: new Date().toISOString()
          };
          resolve(newImage);
        };
        reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
        reader.readAsDataURL(file);
      });
    });
    
    Promise.allSettled(promises)
      .then(results => {
        const successfulUploads: UploadedImage[] = [];
        const errors: string[] = [];
        
        results.forEach(result => {
          if (result.status === 'fulfilled') {
            successfulUploads.push(result.value);
          } else {
            errors.push(result.reason.message);
          }
        });
        
        if (successfulUploads.length > 0) {
          setUploadedImages(prev => {
            const updated = [...prev, ...successfulUploads];
            localStorage.setItem('uploadedImages', JSON.stringify(updated));
            return updated;
          });
          
          setSaveStatus(`Successfully uploaded ${successfulUploads.length} image(s)! ✅`);
        }
        
        if (errors.length > 0) {
          setSaveStatus(`Errors: ${errors.join(', ')} ❌`);
        }
        
        setTimeout(() => setSaveStatus(null), 5000);
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
        {/* Loading and Error States */}
        {loading && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent mr-2"></div>
              <span className="text-blue-800">Loading...</span>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <span className="text-red-800">Error: {error}</span>
          </div>
        )}

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
                      <p className="text-xs text-green-600">+{stats.monthlyGrowth}% this month</p>
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
                      <p className="text-xs text-green-600">Live updates</p>
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
                      <p className="text-xs text-purple-600">{stats.conversionRate}% conversion</p>
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
                      <p className="text-xs text-orange-600">Dynamic editing</p>
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
                    Edit Website Content
                  </Button>
                  <Button onClick={() => setActiveTab('media')} variant="outline" className="justify-start">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Images
                  </Button>
                  <Button onClick={() => setActiveTab('analytics')} variant="outline" className="justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Live Metrics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Management Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Dynamic Content Editor</h2>
              <div className="flex items-center gap-4">
                {saveStatus && (
                  <div className="bg-green-100 border border-green-300 rounded-lg px-4 py-2">
                    <span className="text-green-800 text-sm font-medium">{saveStatus}</span>
                  </div>
                )}
                <Badge className="bg-blue-100 text-blue-800">Live Updates</Badge>
              </div>
            </div>

            <div className="grid gap-6">
              {Array.isArray(contentSections) && contentSections.map((section) => (
                <Card key={section.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                        <p className="text-sm text-gray-500">
                          Section: {section.section} • Last modified: {new Date(section.lastModified).toLocaleDateString()}
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
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {editingContent === section.id ? (
                      <div className="space-y-4">
                        <Textarea
                          value={editedContent[section.id] !== undefined ? editedContent[section.id] : section.content}
                          onChange={(e) => {
                            setEditedContent(prev => ({
                              ...prev,
                              [section.id]: e.target.value
                            }));
                          }}
                          onFocus={() => {
                            // Initialize with current content if not already set
                            if (editedContent[section.id] === undefined) {
                              setEditedContent(prev => ({
                                ...prev,
                                [section.id]: section.content
                              }));
                            }
                          }}
                          rows={4}
                          className="w-full min-h-[200px] font-mono text-sm"
                          disabled={savingContentId === section.id}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={async () => {
                              const contentToSave = editedContent[section.id] || section.content;
                              if (contentToSave.trim()) {
                                try {
                                  await handleContentEdit(section.id, contentToSave);
                                  // Clear the edited content after successful save
                                  setEditedContent(prev => {
                                    const newState = {...prev};
                                    delete newState[section.id];
                                    return newState;
                                  });
                                } catch (error) {
                                  console.error('Error saving content:', error);
                                }
                              }
                            }}
                            disabled={savingContentId === section.id || !section.content.trim()}
                          >
                            {savingContentId === section.id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                Save & Apply Live
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingContent(null);
                              // Clear any unsaved edits when canceling
                              setEditedContent(prev => {
                                const newState = {...prev};
                                delete newState[section.id];
                                return newState;
                              });
                            }}
                            disabled={savingContentId === section.id}
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
              {!Array.isArray(contentSections) && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No content available or data format error</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="space-y-6">
            {/* Success/Error Messages */}
            {saveStatus && (
              <div className={`p-4 rounded-lg border ${
                saveStatus.includes('✅') 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{saveStatus}</span>
                </div>
              </div>
            )}
            
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Upload Images
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Upload images for your website. Supported formats: JPG, PNG, GIF, WebP (Max 5MB each)
                  </p>
                </CardHeader>
                <CardContent>
                  <div 
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors group ${
                      dragActive 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Upload className={`h-12 w-12 mx-auto mb-4 transition-colors ${
                      dragActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-500'
                    }`} />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {dragActive ? 'Drop files here!' : 'Drag & Drop or Click to Upload'}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {dragActive 
                        ? 'Release to upload your images' 
                        : 'Select multiple images to upload at once (Works on mobile too!)'
                      }
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      disabled={isUploading}
                      capture="environment"
                    />
                    <label htmlFor="image-upload">
                      <Button 
                        disabled={isUploading} 
                        className="cursor-pointer bg-blue-600 hover:bg-blue-700"
                        size="lg"
                      >
                        {isUploading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Browse Files
                          </>
                        )}
                      </Button>
                    </label>
                    <div className="mt-4 space-y-1">
                      <p className="text-xs text-gray-400">
                        📱 Mobile: Tap to access camera or gallery
                      </p>
                      <p className="text-xs text-gray-400">
                        💻 Desktop: Drag files here or click browse
                      </p>
                      <p className="text-xs text-gray-400">
                        Max size: 5MB per image | Formats: JPG, PNG, GIF, WebP
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Media Stats</CardTitle>
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
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Image Gallery */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Image Gallery</span>
                  {uploadedImages.length > 0 && (
                    <Badge variant="outline">{uploadedImages.length} images</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {uploadedImages.length === 0 ? (
                  <div className="text-center py-12">
                    <Image className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No images uploaded yet</h3>
                    <p className="text-gray-500 mb-4">Upload your first image to get started</p>
                    <label htmlFor="image-upload">
                      <Button variant="outline" className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload First Image
                      </Button>
                    </label>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {uploadedImages.map((image) => (
                      <div key={image.id} className="relative group rounded-lg overflow-hidden border hover:shadow-lg transition-all duration-300">
                        <div className="aspect-square relative">
                          <img 
                            src={image.url} 
                            alt={image.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => {
                                  navigator.clipboard.writeText(image.url);
                                  setSaveStatus('Image URL copied to clipboard! 📋');
                                  setTimeout(() => setSaveStatus(null), 2000);
                                }}
                              >
                                Copy URL
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteImage(image.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 bg-white">
                          <p className="text-sm font-medium truncate" title={image.name}>{image.name}</p>
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-xs text-gray-500">{formatFileSize(image.size)}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(image.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Live Metrics
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
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Service Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
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
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            {/* Success/Error Messages */}
            {saveStatus && (
              <div className={`p-4 rounded-lg border ${
                saveStatus.includes('✅') 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{saveStatus}</span>
                </div>
              </div>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle>Website Settings</CardTitle>
                <p className="text-sm text-gray-600">
                  Update global website settings. Changes will be reflected across all pages immediately.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="site-title">Site Title</Label>
                    <Input 
                      id="site-title" 
                      value={websiteSettings.siteTitle}
                      onChange={(e) => setWebsiteSettings(prev => ({ ...prev, siteTitle: e.target.value }))}
                      placeholder="Enter website title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-phone">Contact Phone</Label>
                    <Input 
                      id="contact-phone" 
                      value={websiteSettings.contactPhone}
                      onChange={(e) => setWebsiteSettings(prev => ({ ...prev, contactPhone: e.target.value }))}
                      placeholder="Enter contact phone"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Contact Email</Label>
                    <Input 
                      id="contact-email" 
                      type="email"
                      value={websiteSettings.contactEmail}
                      onChange={(e) => setWebsiteSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                      placeholder="Enter contact email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-address">Contact Address</Label>
                    <Input 
                      id="contact-address" 
                      value={websiteSettings.contactAddress}
                      onChange={(e) => setWebsiteSettings(prev => ({ ...prev, contactAddress: e.target.value }))}
                      placeholder="Enter contact address"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSettingsSave} 
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}