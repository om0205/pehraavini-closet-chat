
import { Button } from "@/components/ui/button";
import { MessageCircle, Sparkles, Heart, Star } from "lucide-react";

export const HeroSection = () => {
  const scrollToCollections = () => {
    const collectionsSection = document.getElementById('collections');
    if (collectionsSection) {
      collectionsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleWhatsAppContact = () => {
    const message = "Hi! I'm interested in your ghagra choli collections. Could you please help me?";
    const whatsappUrl = `https://wa.me/919881207898?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center bg-cream overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 animate-pulse">
          <Sparkles className="h-8 w-8 text-primary/20" />
        </div>
        <div className="absolute top-40 right-20 animate-bounce delay-1000">
          <Heart className="h-6 w-6 text-accent/30" />
        </div>
        <div className="absolute bottom-32 left-20 animate-pulse delay-500">
          <Star className="h-7 w-7 text-gold/30" />
        </div>
        <div className="absolute bottom-20 right-32 animate-bounce delay-700">
          <Sparkles className="h-5 w-5 text-primary/25" />
        </div>
      </div>

      <div className="container px-4 z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <img 
              src={`${import.meta.env.BASE_URL}lovable-uploads/dc2e0a2b-83de-45b1-a731-8555e88e20f0.png`}
              alt="Pehraavini Logo" 
              className="h-32 w-auto drop-shadow-lg"
            />
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Pehraavini
            </span>
            <br />
            <span className="text-foreground text-4xl md:text-5xl">
              Exquisite Ghagra Cholis
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover the perfect blend of tradition and elegance with our handcrafted collection of 
            <span className="text-primary font-semibold"> premium ghagra cholis</span>, 
            designed to make every moment unforgettable.
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 mb-12 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-gold" />
              <span>Premium Quality</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-accent" />
              <span>Handcrafted Designs</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>Exclusive Collections</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="elegant" 
              size="lg" 
              className="text-lg px-8 py-3 shadow-elegant"
              onClick={scrollToCollections}
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Explore Collections
            </Button>
            
            <Button 
              variant="whatsapp" 
              size="lg" 
              className="text-lg px-8 py-3"
              onClick={handleWhatsAppContact}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              WhatsApp Us
            </Button>
          </div>

        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
    </section>
  );
};
