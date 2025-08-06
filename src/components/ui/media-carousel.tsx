import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "./button";

interface MediaItem {
  type: 'image' | 'video';
  url: string;
}

interface MediaCarouselProps {
  images: string[];
  videos?: string[];
  name: string;
  className?: string;
}

export const MediaCarousel = ({ images, videos = [], name, className = "" }: MediaCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Combine images and videos into media items
  const mediaItems: MediaItem[] = [
    ...images.filter(img => img && img.trim() !== '').map(url => ({ type: 'image' as const, url })),
    ...videos.filter(vid => vid && vid.trim() !== '').map(url => ({ type: 'video' as const, url }))
  ];

  if (mediaItems.length === 0) {
    return (
      <div className={`aspect-[3/4] bg-muted rounded-md flex items-center justify-center ${className}`}>
        <span className="text-muted-foreground">No media</span>
      </div>
    );
  }

  const currentMedia = mediaItems[currentIndex];

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
    setIsPlaying(false);
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
    setIsPlaying(false);
  };

  const togglePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentMedia.type === 'video' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
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

    if (isLeftSwipe && mediaItems.length > 1) {
      e.stopPropagation();
      setCurrentIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
      setIsPlaying(false);
    }
    if (isRightSwipe && mediaItems.length > 1) {
      e.stopPropagation();
      setCurrentIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
      setIsPlaying(false);
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
        {mediaItems.map((media, index) => (
          <div
            key={index}
            className="w-full h-full flex-shrink-0 overflow-hidden relative"
          >
            {media.type === 'image' ? (
              <img
                src={media.url}
                alt={`${name} - Image ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={index === 0 ? "high" : "low"}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={(e) => {
                  e.currentTarget.src = "/api/placeholder/300/400";
                }}
              />
            ) : (
              <div className="relative w-full h-full">
                <video
                  ref={index === currentIndex ? videoRef : null}
                  src={media.url}
                  className="w-full h-full object-cover"
                  muted={isMuted}
                  loop
                  playsInline
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
                
                {/* Video Controls */}
                {index === currentIndex && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="opacity-70 hover:opacity-100 transition-opacity"
                      onClick={togglePlayPause}
                    >
                      {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </Button>
                  </div>
                )}

                {/* Mute Button */}
                {index === currentIndex && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute bottom-2 left-2 opacity-70 hover:opacity-100 transition-opacity w-8 h-8"
                    onClick={toggleMute}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {mediaItems.length > 1 && (
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
          <div className="absolute bottom-2 right-2 flex space-x-1 opacity-70 hover:opacity-100 transition-opacity duration-300">
            {mediaItems.map((media, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-white" : "bg-white/50"
                } ${media.type === 'video' ? 'ring-1 ring-white/50' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                  setIsPlaying(false);
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};