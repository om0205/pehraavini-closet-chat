
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

interface ImageCarouselProps {
  images: string[];
  name: string;
  className?: string;
}

export const ImageCarousel = ({ images, name, className = "" }: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Filter out empty/invalid images
  const validImages = images?.filter(img => img && img.trim() !== '') || [];

  if (validImages.length === 0) {
    return (
      <div className={`aspect-[3/4] bg-muted rounded-md flex items-center justify-center ${className}`}>
        <span className="text-muted-foreground">No image</span>
      </div>
    );
  }

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && validImages.length > 1) {
      e.stopPropagation();
      setCurrentIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
    }
    if (isRightSwipe && validImages.length > 1) {
      e.stopPropagation();
      setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
    }
  };

  return (
    <div 
      className={`relative aspect-[3/4] bg-muted rounded-md overflow-hidden group ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {validImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${name} - Image ${index + 1}`}
            className="w-full h-full object-cover flex-shrink-0 transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.src = "/api/placeholder/300/400";
            }}
          />
        ))}
      </div>

      {validImages.length > 1 && (
        <>
          {/* Navigation Buttons */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity duration-300 shadow-lg w-8 h-8"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity duration-300 shadow-lg w-8 h-8"
            onClick={goToNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Dots Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1 opacity-70 hover:opacity-100 transition-opacity duration-300">
            {validImages.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-white" : "bg-white/50"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
