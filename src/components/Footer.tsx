import { Heart, MessageCircle, Mail, Phone, Instagram } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-secondary border-t">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <img 
              src="/lovable-uploads/dc2e0a2b-83de-45b1-a731-8555e88e20f0.png" 
              alt="Pehraavini" 
              className="h-16 w-auto"
            />
            <p className="text-muted-foreground leading-relaxed">
              Where attire becomes an emotion! Crafting beautiful ghagra cholis 
              for your most precious moments.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground">Quick Links</h3>
            <div className="space-y-2">
              <a href="#collections" className="block text-muted-foreground hover:text-primary transition-colors">
                Collections
              </a>
              <a href="#about" className="block text-muted-foreground hover:text-primary transition-colors">
                About Us
              </a>
              <a href="#contact" className="block text-muted-foreground hover:text-primary transition-colors">
                Contact
              </a>
              <a href="/admin" className="block text-muted-foreground hover:text-primary transition-colors">
                Admin Panel
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Instagram className="h-5 w-5 text-primary" />
                <a 
                  href="https://www.instagram.com/pehraavini?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  @pehraavini
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MessageCircle className="h-5 w-5 text-primary" />
                <a 
                  href="https://wa.me/919881207898" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  WhatsApp Us
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <a 
                  href="mailto:pehraavini.store@gmail.com" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  pehraavini.store@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <div className="text-muted-foreground">
                  <div>+91 988 120 7898</div>
                  <div>+91 739 781 2069</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-muted-foreground flex items-center justify-center space-x-1">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>by Pehraavini • © 2024 All rights reserved</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
