import { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SupabasePhonesService, { PhoneModelRow } from '@/services/supabasePhonesService';
import initializeSupabaseSchema from '@/utils/initializeSupabase';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';

// Brand and series configuration
const BRAND_CONFIG = [
  { 
    name: 'Apple', 
    series: [] // Apple doesn't use series
  },
  { 
    name: 'Samsung', 
    series: ['Series S', 'Series A', 'Series M', 'Series Note', 'Series F', 'Series J', 'Series Z', 'Series ON']
  },
  { 
    name: 'Xiaomi', 
    series: ['MI Series', 'Redmi Note Series', 'Redmi Series', 'K & X Series', 'A Series', 'K Series']
  },
  { 
    name: 'OnePlus', 
    series: []
  },
  { 
    name: 'VIVO', 
    series: ['Y Series', 'V Series', 'X Series', 'T Series', 'S Series', 'U Series', 'Z Series', 'NEX Series']
  },
  { 
    name: 'OPPO', 
    series: ['A Series', 'F Series', 'Reno Series']
  },
  { 
    name: 'Realme', 
    series: ['X Series', 'C Series', 'Narzo Series']
  },
  { 
    name: 'Motorola', 
    series: ['G Series', 'E Series', 'Edge Series']
  },
  { 
    name: 'Google', 
    series: ['Pixel Series']
  },
  { 
    name: 'Nothing', 
    series: ['Phone Series']
  },
  { 
    name: 'IQOO', 
    series: ['Z Series', 'Neo Series']
  },
  { 
    name: 'POCO', 
    series: ['X Series', 'M Series', 'C Series', 'F Series']
  },
  { 
    name: 'Huawei', 
    series: ['P Series', 'Mate Series', 'Nova Series']
  },
  { 
    name: 'Asus', 
    series: ['Zenfone', 'ROG Phone']
  },
  { 
    name: 'LG', 
    series: ['G Series', 'V Series', 'Wing']
  }
];

export default function AdminPhonesNew() {
  const isLoggedIn = useMemo(() => {
    const loggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    const token = localStorage.getItem('adminToken');
    return loggedIn && !!token;
  }, []);

  if (!isLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  const [models, setModels] = useState<PhoneModelRow[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [brand, setBrand] = useState('');
  const [series, setSeries] = useState('');
  const [customSeries, setCustomSeries] = useState('');
  const [isNewSeries, setIsNewSeries] = useState(false);
  const [modelName, setModelName] = useState('');
  const [price, setPrice] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [schemaMsg, setSchemaMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // Get available series for selected brand
  const availableSeries = useMemo(() => {
    const config = BRAND_CONFIG.find(b => b.name === brand);
    return config?.series || [];
  }, [brand]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const rows = await SupabasePhonesService.getAllModels();
      setModels(rows || []);
    } catch (err) {
      console.error('Failed to load phone models', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  // Handle brand change
  const handleBrandChange = (value: string) => {
    setBrand(value);
    setSeries('');
    setCustomSeries('');
    setIsNewSeries(false);
  };

  // Handle series selection
  const handleSeriesChange = (value: string) => {
    if (value === '__new__') {
      setIsNewSeries(true);
      setSeries('');
    } else {
      setIsNewSeries(false);
      setSeries(value);
      setCustomSeries('');
    }
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = async () => {
    if (!brand || !modelName) {
      setStatusMsg('❌ Please enter brand and model');
      return;
    }

    // Determine final series value
    const finalSeries = isNewSeries ? customSeries : series;

    const file = fileRef.current?.files?.[0];
    if (!file) {
      setStatusMsg('❌ Please select an image');
      return;
    }

    setLoading(true);
    setStatusMsg('📤 Uploading...');

    try {
      await SupabasePhonesService.addModel({
        brand,
        series: finalSeries || null,
        model: modelName,
        imageFile: file,
        basePrice: price ? parseFloat(price) : undefined
      });

      setStatusMsg('✅ Phone added successfully!');
      setBrand('');
      setSeries('');
      setCustomSeries('');
      setIsNewSeries(false);
      setModelName('');
      setPrice('');
      setImagePreview(null);
      if (fileRef.current) fileRef.current.value = '';
      
      await loadAll();
    } catch (err: any) {
      setStatusMsg(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this phone model?')) return;
    setLoading(true);
    try {
      await SupabasePhonesService.deleteModel(id);
      setStatusMsg('✅ Deleted');
      await loadAll();
    } catch (err: any) {
      setStatusMsg(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEnsureSchema = async () => {
    setSchemaMsg('🔄 Initializing schema...');
    try {
      await initializeSupabaseSchema();
      setSchemaMsg('✅ Schema ready!');
    } catch (err: any) {
      setSchemaMsg(`❌ Error: ${err.message}`);
    }
  };

  // Group models by brand and series
  const groupedModels = useMemo(() => {
    const grouped: Record<string, Record<string, PhoneModelRow[]>> = {};
    
    models.forEach(model => {
      if (!grouped[model.brand]) {
        grouped[model.brand] = {};
      }
      const seriesKey = model.series || 'No Series';
      if (!grouped[model.brand][seriesKey]) {
        grouped[model.brand][seriesKey] = [];
      }
      grouped[model.brand][seriesKey].push(model);
    });
    
    return grouped;
  }, [models]);

  return (
    <>
      <Helmet>
        <title>Manage Phones - Admin Panel</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Phone Models Manager</h1>
            <p className="text-muted-foreground">Add phones that appear in Browse by Brand section</p>
          </div>
          <Button onClick={handleEnsureSchema} variant="outline" size="sm">
            Ensure Schema
          </Button>
        </div>

        {schemaMsg && (
          <div className="mb-4 p-3 rounded bg-blue-50 text-blue-900 text-sm">
            {schemaMsg}
          </div>
        )}

        {/* Add New Phone Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Phone
            </CardTitle>
            <CardDescription>
              Select brand, series, and upload phone image
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Form */}
              <div className="space-y-4">
                {/* Brand Selection */}
                <div>
                  <Label htmlFor="brand">Brand *</Label>
                  <Select value={brand} onValueChange={handleBrandChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {BRAND_CONFIG.map(b => (
                        <SelectItem key={b.name} value={b.name}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Series Selection (if brand has series) */}
                {brand && availableSeries.length > 0 && (
                  <div>
                    <Label htmlFor="series">Series</Label>
                    <Select 
                      value={isNewSeries ? '__new__' : series} 
                      onValueChange={handleSeriesChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select or create series" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSeries.map(s => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                        <SelectItem value="__new__">➕ Create New Series</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Custom Series Input */}
                {isNewSeries && (
                  <div>
                    <Label htmlFor="customSeries">New Series Name *</Label>
                    <Input
                      id="customSeries"
                      value={customSeries}
                      onChange={e => setCustomSeries(e.target.value)}
                      placeholder="e.g., Series T"
                    />
                  </div>
                )}

                {/* Model Name */}
                <div>
                  <Label htmlFor="model">Model Name *</Label>
                  <Input
                    id="model"
                    value={modelName}
                    onChange={e => setModelName(e.target.value)}
                    placeholder="e.g., Galaxy S68"
                  />
                </div>

                {/* Base Price */}
                <div>
                  <Label htmlFor="price">Base Price (₨)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    placeholder="e.g., 25000"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <Label htmlFor="image">Phone Image *</Label>
                  <Input
                    id="image"
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Square PNG/WebP works best. Max 1MB recommended.
                  </p>
                </div>

                <Button 
                  onClick={handleAdd} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? '⏳ Adding...' : '➕ Add Phone'}
                </Button>

                {statusMsg && (
                  <div className="p-3 rounded bg-gray-100 text-sm">
                    {statusMsg}
                  </div>
                )}
              </div>

              {/* Right Column - Preview */}
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
                {imagePreview ? (
                  <div className="text-center">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-w-[200px] max-h-[200px] object-contain mb-4"
                    />
                    <p className="text-sm font-medium">{modelName || 'Phone Model'}</p>
                    <p className="text-xs text-muted-foreground">{brand} {series && `- ${series}`}</p>
                    {price && <p className="text-sm mt-1">Starting ₨{price}</p>}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <ImageIcon className="h-16 w-16 mx-auto mb-2 opacity-30" />
                    <p>Image preview will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Brand Inventory */}
        <Card>
          <CardHeader>
            <CardTitle>Brand Inventory</CardTitle>
            <CardDescription>
              Tracking {models.length} devices across {Object.keys(groupedModels).length} brands
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading && models.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Loading...</p>
            ) : Object.keys(groupedModels).length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No phones added yet. Add your first phone above!
              </p>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedModels).map(([brandName, seriesData]) => (
                  <div key={brandName}>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      {brandName}
                      <Badge variant="secondary">{Object.values(seriesData).flat().length} models</Badge>
                    </h3>
                    
                    <div className="space-y-4 pl-4">
                      {Object.entries(seriesData).map(([seriesName, phones]) => (
                        <div key={seriesName} className="border-l-2 border-gray-200 pl-4">
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">
                            {seriesName}
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {phones.map(phone => (
                              <div 
                                key={phone.id} 
                                className="border rounded-lg p-2 hover:shadow-md transition-shadow group relative"
                              >
                                {phone.image_url && (
                                  <img 
                                    src={phone.image_url} 
                                    alt={phone.model}
                                    className="w-full h-24 object-contain mb-2"
                                  />
                                )}
                                <p className="text-xs font-medium truncate">{phone.model}</p>
                                {phone.base_price && (
                                  <p className="text-xs text-muted-foreground">₨{phone.base_price}</p>
                                )}
                                <p className="text-[10px] text-muted-foreground">
                                  Added {new Date(phone.created_at).toLocaleDateString()}
                                </p>
                                <Button
                                  onClick={() => handleDelete(phone.id)}
                                  variant="destructive"
                                  size="sm"
                                  className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
