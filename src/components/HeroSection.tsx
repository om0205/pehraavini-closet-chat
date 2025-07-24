import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  const scrollToCollections = () => {
    document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-cream via-background to-secondary overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border border-primary rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-accent rounded-full"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 border border-gold rounded-full"></div>
      </div>
      
      <div className="container px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-8">
            <img 
              src="/lovable-uploads/dc2e0a2b-83de-45b1-a731-8555e88e20f0.png" 
              alt="Pehraavini" 
              className="h-24 w-auto mx-auto mb-4"
            />
          </div>
          
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Exquisite 
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Ghagra Cholis</span>
            <br />
            for Every Celebration
          </h1>
          
          {/* Tagline */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 font-medium">
            Where attire becomes an emotion!
          </p>
          
          {/* Description */}
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover our stunning collection of traditional ghagra cholis, 
            perfect for weddings, festivals, and special occasions. Each piece 
            is crafted with love and attention to detail.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="elegant" 
              size="xl" 
              onClick={scrollToCollections}
              className="min-w-[200px]"
            >
              Explore Collections
            </Button>
            
            <Button 
              variant="outline" 
              size="xl"
              onClick={() => window.open('https://wa.me/your-number', '_blank')}
              className="min-w-[200px] border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};