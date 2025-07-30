
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Eye } from "lucide-react";
import { CollectionModal } from "./CollectionModal";
import { ImageCarousel } from "./ui/image-carousel";

export interface Collection {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  status: "Available" | "Sold Out";
  category?: string;
}

interface CollectionCardProps {
  collection: Collection;
}

export const CollectionCard = ({ collection }: CollectionCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleWhatsAppInquiry = () => {
    const message = `Hi! I'm interested in the "${collection.name}" ghagra choli priced at ₹${collection.price.toLocaleString()}. Could you please provide more details?`;
    const whatsappUrl = `https://wa.me/919881207898?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const isAvailable = collection.status === "Available";

  return (
    <>
      <Card className="group overflow-hidden bg-card hover:shadow-card transition-all duration-300 border-border hover:border-primary/30">
        <CardHeader className="p-0 relative overflow-hidden">
          {/* Image Carousel Container */}
          <div className="relative">
            <ImageCarousel 
              images={collection.images} 
              name={collection.name}
              className="transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Status Badge */}
            <Badge 
              variant={isAvailable ? "default" : "destructive"}
              className={`absolute top-4 right-4 z-10 ${
                isAvailable 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {collection.status}
            </Badge>

            {/* Sold Out Overlay */}
            {!isAvailable && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                <span className="text-white text-xl font-bold">SOLD OUT</span>
              </div>
            )}

            {/* Quick View Button */}
            <Button
              variant="secondary"
              size="icon"
              className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg z-10"
              onClick={() => setIsModalOpen(true)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-3">
            <h3 className="font-bold text-lg text-card-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {collection.name}
            </h3>
            
            <p className="text-2xl font-bold text-primary">
              ₹{collection.price.toLocaleString()}
            </p>
            
            <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
              {collection.description}
            </p>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <div className="flex flex-col gap-3 w-full">
            <Button
              variant="elegant"
              className="w-full"
              onClick={() => setIsModalOpen(true)}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
            
            <Button
              variant="whatsapp"
              className="w-full"
              onClick={handleWhatsAppInquiry}
              disabled={!isAvailable}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {isAvailable ? "Enquire on WhatsApp" : "Currently Unavailable"}
            </Button>
          </div>
        </CardFooter>
      </Card>

      <CollectionModal
        collection={collection}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onWhatsAppInquiry={handleWhatsAppInquiry}
      />
    </>
  );
};
