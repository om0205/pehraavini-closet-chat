import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Plus, Video } from "lucide-react";
import { Collection } from "@/components/CollectionCard";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ImageCropper } from "./ImageCropper";

interface AddCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (collection: Omit<Collection, "id">) => void;
}

export const AddCollectionModal = ({ isOpen, onClose, onAdd }: AddCollectionModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    status: "Available" as "Available" | "Sold Out"
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cropperImage, setCropperImage] = useState<string | null>(null);
  const [croppingIndex, setCroppingIndex] = useState<number | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (imageFiles.length + videoFiles.length >= 20) {
        toast.error("Maximum 20 media files allowed");
        return;
      }

      // Add file to state
      setImageFiles(prev => [...prev, file]);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreviews(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (imageFiles.length + videoFiles.length >= 20) {
        toast.error("Maximum 20 media files allowed");
        return;
      }

      // Add file to state
      setVideoFiles(prev => [...prev, file]);
      
      // Create preview
      const url = URL.createObjectURL(file);
      setVideoPreviews(prev => [...prev, url]);
    });
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setVideoFiles(prev => prev.filter((_, i) => i !== index));
    setVideoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleCropImage = (index: number) => {
    setCropperImage(imagePreviews[index]);
    setCroppingIndex(index);
  };

  const handleCropComplete = (croppedImageBlob: Blob) => {
    if (croppingIndex === null) return;

    const file = new File([croppedImageBlob], `cropped_${Date.now()}.jpg`, { type: 'image/jpeg' });
    
    // Replace the file at the cropping index
    setImageFiles(prev => prev.map((f, i) => i === croppingIndex ? file : f));
    
    // Update preview
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImagePreviews(prev => prev.map((p, i) => i === croppingIndex ? event.target!.result as string : p));
      }
    };
    reader.readAsDataURL(file);
    
    setCropperImage(null);
    setCroppingIndex(null);
  };

  const uploadImagesToStorage = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(async (file, index) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${index}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('clothing-images')
        .upload(fileName, file);

      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('clothing-images')
        .getPublicUrl(fileName);
        
      return publicUrl;
    });

    return Promise.all(uploadPromises);
  };

  const uploadVideosToStorage = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(async (file, index) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `video_${Date.now()}-${index}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('clothing-images')
        .upload(fileName, file);

      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('clothing-images')
        .getPublicUrl(fileName);
        
      return publicUrl;
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.name || !formData.price || !formData.description) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (imageFiles.length === 0 && videoFiles.length === 0) {
        toast.error("Please upload at least one image or video");
        return;
      }

      // Upload images and videos to storage and get URLs
      const [imageUrls, videoUrls] = await Promise.all([
        imageFiles.length > 0 ? uploadImagesToStorage(imageFiles) : Promise.resolve([]),
        videoFiles.length > 0 ? uploadVideosToStorage(videoFiles) : Promise.resolve([])
      ]);

      const collection: Omit<Collection, "id"> = {
        name: formData.name,
        price: parseInt(formData.price),
        description: formData.description,
        images: imageUrls,
        videos: videoUrls,
        status: formData.status,
        category: formData.category || undefined
      };

      onAdd(collection);
      
      // Reset form
      setFormData({
        name: "",
        price: "",
        description: "",
        category: "",
        status: "Available"
      });
      setImageFiles([]);
      setImagePreviews([]);
      setVideoFiles([]);
      setVideoPreviews([]);
      onClose();
    } catch (error) {
      console.error('Error adding collection:', error);
      toast.error("Failed to add collection");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      description: "",
      category: "",
      status: "Available"
    });
    setImageFiles([]);
    setImagePreviews([]);
    setVideoFiles([]);
    setVideoPreviews([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetForm();
        onClose();
      }
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">Add New Collection</DialogTitle>
          <DialogDescription>
            Create a new ghagra choli collection for your store
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Collection Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Royal Bridal Lehenga"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="e.g., 25000"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
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
              <Select 
                value={formData.status} 
                onValueChange={(value: "Available" | "Sold Out") => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Sold Out">Sold Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the ghagra choli, its features, fabric, work, etc."
              rows={4}
              required
            />
          </div>

          {/* Media Upload */}
          <div className="space-y-4">
            <Label>Images & Videos * (Max 20 total)</Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Image Upload */}
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Upload images
                </p>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  disabled={imageFiles.length + videoFiles.length >= 20}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  disabled={imageFiles.length + videoFiles.length >= 20}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Images ({imageFiles.length})
                </Button>
              </div>

              {/* Video Upload */}
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Upload videos
                </p>
                <Input
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={handleVideoUpload}
                  className="hidden"
                  id="video-upload"
                  disabled={imageFiles.length + videoFiles.length >= 20}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('video-upload')?.click()}
                  disabled={imageFiles.length + videoFiles.length >= 20}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Videos ({videoFiles.length})
                </Button>
              </div>
            </div>

            {/* Media Previews */}
            {(imagePreviews.length > 0 || videoPreviews.length > 0) && (
              <div className="space-y-4">
                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Images</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {imagePreviews.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden">
                            <img
                              src={image}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleCropImage(index)}
                          >
                            Crop
                          </Button>
                          {index === 0 && (
                            <Badge className="absolute bottom-2 left-2 bg-primary">
                              Main
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Video Previews */}
                {videoPreviews.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Videos</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {videoPreviews.map((video, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden">
                            <video
                              src={video}
                              className="w-full h-full object-cover"
                              controls
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeVideo(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="elegant" 
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Adding..." : "Add Collection"}
            </Button>
          </div>
        </form>
      </DialogContent>

      {/* Image Cropper Modal */}
      {cropperImage && (
        <ImageCropper
          isOpen={!!cropperImage}
          onClose={() => {
            setCropperImage(null);
            setCroppingIndex(null);
          }}
          imageUrl={cropperImage}
          onCrop={handleCropComplete}
          aspectRatio={3/4}
        />
      )}
    </Dialog>
  );
};