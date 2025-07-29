import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, MessageCircle, X } from "lucide-react";
import { Collection } from "./CollectionCard";

interface CollectionModalProps {
  collection: Collection;
  isOpen: boolean;
  onClose: () => void;
  onWhatsAppInquiry: () => void;
}

export const CollectionModal = ({ collection, isOpen, onClose, onWhatsAppInquiry }: CollectionModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const isAvailable = collection.status === "Available";

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === collection.images.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? collection.images.length - 1 : prev - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">{collection.name}</DialogTitle>
          <DialogDescription className="text-lg">
            View details and images of this beautiful ghagra choli
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Carousel */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden">
              <img
                src={collection.images[currentImageIndex] || "/api/placeholder/400/500"}
                alt={`${collection.name} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Navigation Buttons */}
              {collection.images.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 shadow-lg"
                    onClick={previousImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 shadow-lg"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Status Badge */}
              <Badge 
                variant={isAvailable ? "default" : "destructive"}
                className={`absolute top-4 right-4 ${
                  isAvailable 
                    ? "bg-green-600 hover:bg-green-700" 
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {collection.status}
              </Badge>

              {/* Image Counter */}
              {collection.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {collection.images.length}
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {collection.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {collection.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                      index === currentImageIndex 
                        ? "border-primary ring-2 ring-primary/30" 
                        : "border-muted hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h3 className="text-3xl font-bold text-primary mb-2">
                ₹{collection.price.toLocaleString()}
              </h3>
              {collection.category && (
                <Badge variant="secondary" className="mb-4">
                  {collection.category}
                </Badge>
              )}
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-2">Description</h4>
              <p className="text-muted-foreground leading-relaxed">
                {collection.description}
              </p>
            </div>

            {/* Features */}
            <div>
              <h4 className="font-semibold text-lg mb-2">Features</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• Premium quality fabric</li>
                <li>• Intricate embroidery work</li>
                <li>• Perfect for special occasions</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Button
                variant="whatsapp"
                size="lg"
                className="w-full"
                onClick={onWhatsAppInquiry}
                disabled={!isAvailable}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                {isAvailable ? "Enquire on WhatsApp" : "Currently Unavailable"}
              </Button>

              {!isAvailable && (
                <p className="text-center text-muted-foreground text-sm">
                  This item is currently sold out. Contact us for similar designs!
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};