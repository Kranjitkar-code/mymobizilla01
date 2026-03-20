import { useState } from 'react';
import { useRouter } from 'next/router';
import { useServices } from '@/hooks/useWordPressData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Edit } from 'lucide-react';

export default function ServicesDashboard() {
  const { data: services, create, update, remove } = useServices();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    price: '',
    duration: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const serviceData = {
      title: formData.title,
      content: formData.content,
      status: 'publish',
      acf: {
        price: parseFloat(formData.price) || 0,
        duration: formData.duration
      }
    };

    try {
      if (editingId) {
        await update(editingId, serviceData);
      } else {
        await create(serviceData);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', price: '', duration: '' });
    setEditingId(null);
  };

  const handleEdit = (service: any) => {
    setEditingId(service.id);
    setFormData({
      title: service.title.rendered,
      content: service.content.rendered,
      price: service.acf?.price || '',
      duration: service.acf?.duration || ''
    });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this service?')) {
      try {
        await remove(id);
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Manage Services</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editingId ? 'Edit Service' : 'Add New Service'}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Service Name</Label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                className="w-full min-h-[100px] p-2 border rounded"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price ($)</Label>
                <Input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </CardContent>
          <div className="p-6 pt-0 flex justify-end gap-2">
            {editingId && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
            <Button type="submit">
              {editingId ? 'Update' : 'Add'} Service
            </Button>
          </div>
        </form>
      </Card>

      <div className="grid gap-4">
        <h2 className="text-xl font-semibold">All Services</h2>
        {services?.map((service) => (
          <Card key={service.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{service.title.rendered}</h3>
                  <p className="text-sm text-muted-foreground">
                    ${service.acf?.price} • {service.acf?.duration}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(service)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(service.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
