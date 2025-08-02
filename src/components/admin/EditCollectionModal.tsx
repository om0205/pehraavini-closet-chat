import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Upload, GripVertical, Image, Video } from "lucide-react";
import { Collection } from "@/components/CollectionCard";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface EditCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedCollection: Collection) => void;
  collection: Collection | null;
}

interface MediaItem {
  type: 'image' | 'video';
  url: string;
  id: string;
}

export const EditCollectionModal = ({ isOpen, onClose, onUpdate, collection }: EditCollectionModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    status: "Available" as "Available" | "Sold Out"
  });
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (collection) {
      setFormData({
        name: collection.name,
        price: collection.price.toString(),
        description: collection.description,
        category: collection.category,
        status: collection.status
      });
      
      // Convert existing images and videos to media items
      const imageItems: MediaItem[] = (collection.images || []).map((url, index) => ({
        type: 'image',
        url,
        id: `image-${index}`
      }));
      
      // Check if collection has videos property
      const videos = (collection as any).videos || [];
      const videoItems: MediaItem[] = videos.map((url: string, index: number) => ({
        type: 'video',
        url,
        id: `video-${index}`
      }));
      
      setMedia([...imageItems, ...videoItems]);
    }
  }, [collection]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newMediaItems: MediaItem[] = [];

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data, error } = await supabase.storage
          .from('clothing-images')
          .upload(filePath, file);

        if (error) {
          toast.error(`Failed to upload ${file.name}`);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('clothing-images')
          .getPublicUrl(filePath);

        const isVideo = file.type.startsWith('video/');
        newMediaItems.push({
          type: isVideo ? 'video' : 'image',
          url: publicUrl,
          id: `${isVideo ? 'video' : 'image'}-${Date.now()}-${Math.random()}`
        });
      }

      setMedia(prev => [...prev, ...newMediaItems]);
      toast.success(`Uploaded ${newMediaItems.length} file(s)`);
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const removeMedia = (id: string) => {
    setMedia(prev => prev.filter(item => item.id !== id));
  };

  const moveMedia = (fromIndex: number, toIndex: number) => {
    setMedia(prev => {
      const newMedia = [...prev];
      const [moved] = newMedia.splice(fromIndex, 1);
      newMedia.splice(toIndex, 0, moved);
      return newMedia;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!collection) return;

    const images = media.filter(item => item.type === 'image').map(item => item.url);
    const videos = media.filter(item => item.type === 'video').map(item => item.url);

    try {
      console.log('Updating collection with data:', {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        category: formData.category,
        status: formData.status === 'Available' ? 'available' : 'sold-out',
        images,
        videos
      });

      const { error } = await supabase
        .from('clothing_sets')
        .update({
          name: formData.name,
          price: parseFloat(formData.price),
          description: formData.description,
          category: formData.category,
          status: formData.status === 'Available' ? 'available' : 'sold-out',
          images,
          videos
        })
        .eq('id', collection.id);

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }

      const updatedCollection: Collection = {
        ...collection,
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        category: formData.category,
        status: formData.status,
        images,
        videos
      };

      onUpdate(updatedCollection);
      toast.success("Collection updated successfully!");
      onClose();
    } catch (error: any) {
      console.error('Error updating collection:', error);
      toast.error(`Failed to update collection: ${error.message || 'Unknown error'}`);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (dragIndex !== dropIndex) {
      moveMedia(dragIndex, dropIndex);
    }
  };

  if (!collection) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Collection</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Collection Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bridal">Bridal</SelectItem>
                  <SelectItem value="Festive">Festive</SelectItem>
                  <SelectItem value="Party Wear">Party Wear</SelectItem>
                  <SelectItem value="Designer">Designer</SelectItem>
                  <SelectItem value="Traditional">Traditional</SelectItem>
                  <SelectItem value="Contemporary">Contemporary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: "Available" | "Sold Out") => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Sold Out">Sold Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Media (Images & Videos)</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isUploading}
                  onClick={() => document.getElementById('media-upload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading ? "Uploading..." : "Add Media"}
                </Button>
                <input
                  id="media-upload"
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {media.map((item, index) => (
                <div
                  key={item.id}
                  className="relative group border rounded-lg overflow-hidden"
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <div className="absolute top-2 left-2 z-10">
                    <Badge variant="secondary" className="text-xs">
                      {item.type === 'image' ? <Image className="h-3 w-3 mr-1" /> : <Video className="h-3 w-3 mr-1" />}
                      {index + 1}
                    </Badge>
                  </div>
                  
                  <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => removeMedia(item.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="absolute bottom-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="h-4 w-4 text-white cursor-move" />
                  </div>

                  {item.type === 'image' ? (
                    <img
                      src={item.url}
                      alt={`Media ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                  ) : (
                    <video
                      src={item.url}
                      className="w-full h-32 object-cover"
                      controls
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="elegant">
              Update Collection
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};