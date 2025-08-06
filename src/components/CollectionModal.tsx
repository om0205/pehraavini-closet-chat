import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { Collection } from "./CollectionCard";
import { MediaCarousel } from "./ui/media-carousel";

interface CollectionModalProps {
  collection: Collection;
  isOpen: boolean;
  onClose: () => void;
  onWhatsAppInquiry: () => void;
}

export const CollectionModal = ({ collection, isOpen, onClose, onWhatsAppInquiry }: CollectionModalProps) => {
  const isAvailable = collection.status === "Available";

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
          {/* Media Carousel */}
          <div className="space-y-4">
            <div className="relative">
              <MediaCarousel 
                images={collection.images} 
                videos={collection.videos}
                name={collection.name}
              />
              
              {/* Status Badge */}
              <Badge 
                variant={isAvailable ? "default" : "destructive"}
                className={`absolute top-4 right-4 z-20 ${
                  isAvailable 
                    ? "bg-green-600 hover:bg-green-700" 
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {collection.status}
              </Badge>
            </div>
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