
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img 
            src={`${import.meta.env.BASE_URL}lovable-uploads/dc2e0a2b-83de-45b1-a731-8555e88e20f0.png`}
            alt="Pehraavini" 
            className="h-10 w-auto"
          />
          <span className="text-2xl font-bold font-prognostic bg-gradient-primary bg-clip-text text-transparent">
            Pehraavini
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => scrollToSection('hero')}
            className="text-foreground hover:text-primary transition-colors"
          >
            Home
          </button>
          <button 
            onClick={() => scrollToSection('collections')}
            className="text-foreground hover:text-primary transition-colors"
          >
            Collections
          </button>
          <button 
            onClick={() => scrollToSection('footer')}
            className="text-foreground hover:text-primary transition-colors"
          >
            Contact
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b border-border md:hidden">
            <nav className="container px-4 py-4 flex flex-col space-y-4">
              <button 
                onClick={() => scrollToSection('hero')}
                className="text-foreground hover:text-primary transition-colors text-left"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('collections')}
                className="text-foreground hover:text-primary transition-colors text-left"
              >
                Collections
              </button>
              <button 
                onClick={() => scrollToSection('footer')}
                className="text-foreground hover:text-primary transition-colors text-left"
              >
                Contact
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
