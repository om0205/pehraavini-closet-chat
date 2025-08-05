import { useState, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RotateCw, RotateCcw, Move, ZoomIn, ZoomOut } from "lucide-react";

interface ImageCropperProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onCrop: (croppedBlob: Blob) => void;
  aspectRatio?: number; // 3/4 for collection cards
}

export const ImageCropper = ({ isOpen, onClose, imageUrl, onCrop, aspectRatio = 3/4 }: ImageCropperProps) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCrop = useCallback(async () => {
    if (!canvasRef.current || !imageRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imageRef.current;
    const container = containerRef.current;
    
    // Set canvas size to match aspect ratio
    const cropWidth = 400;
    const cropHeight = cropWidth / aspectRatio;
    
    canvas.width = cropWidth;
    canvas.height = cropHeight;

    ctx.clearRect(0, 0, cropWidth, cropHeight);

    // Calculate the visible area dimensions
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;

    // Create a temporary canvas to render the transformed image first
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    // Set temp canvas size to container size for accurate cropping
    tempCanvas.width = containerWidth;
    tempCanvas.height = containerHeight;

    // Clear temp canvas
    tempCtx.clearRect(0, 0, containerWidth, containerHeight);

    // Save temp context state
    tempCtx.save();

    // Move to center of container
    tempCtx.translate(containerWidth / 2, containerHeight / 2);
    
    // Apply rotation
    tempCtx.rotate((rotation * Math.PI) / 180);
    
    // Apply scale and position
    const scaledWidth = img.naturalWidth * scale;
    const scaledHeight = img.naturalHeight * scale;
    
    // Draw the image with transformations to temp canvas
    tempCtx.drawImage(
      img,
      -scaledWidth / 2 + position.x,
      -scaledHeight / 2 + position.y,
      scaledWidth,
      scaledHeight
    );

    // Restore temp context state
    tempCtx.restore();

    // Now crop from the temp canvas to the final canvas
    ctx.drawImage(
      tempCanvas,
      0, 0, containerWidth, containerHeight,  // Source area (entire temp canvas)
      0, 0, cropWidth, cropHeight            // Destination area (final canvas)
    );

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        onCrop(blob);
        onClose();
      }
    }, 'image/jpeg', 0.9);
  }, [scale, rotation, position, aspectRatio, onCrop, onClose]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetTransforms = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview Area */}
          <div 
            ref={containerRef}
            className="relative mx-auto bg-gray-100 rounded-lg overflow-hidden"
            style={{
              width: '400px',
              height: `${400 / aspectRatio}px`,
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Crop preview"
              className="absolute top-1/2 left-1/2 pointer-events-none"
              style={{
                transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
                transformOrigin: 'center center'
              }}
              crossOrigin="anonymous"
            />
            
            {/* Crop overlay */}
            <div className="absolute inset-0 border-2 border-dashed border-white/70 pointer-events-none">
              <div className="absolute inset-0 bg-black/20" />
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {/* Scale Control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Zoom</label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setScale(Math.max(0.1, scale - 0.1))}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setScale(Math.min(3, scale + 0.1))}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Slider
                value={[scale]}
                onValueChange={([value]) => setScale(value)}
                min={0.1}
                max={3}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Rotation Control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Rotation</label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRotation(rotation - 90)}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRotation(rotation + 90)}
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Slider
                value={[rotation]}
                onValueChange={([value]) => setRotation(value)}
                min={-180}
                max={180}
                step={1}
                className="w-full"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={resetTransforms}>
                <Move className="h-4 w-4 mr-2" />
                Reset
              </Button>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="elegant" onClick={handleCrop}>
                  Crop & Apply
                </Button>
              </div>
            </div>
          </div>

          {/* Hidden canvas for cropping */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </DialogContent>
    </Dialog>
  );
};