import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CollectionsGrid } from "@/components/CollectionsGrid";
import { Footer } from "@/components/Footer";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";

const Index = () => {
  useVisitorTracking();
  
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <CollectionsGrid />
      <Footer />
    </div>
  );
};

export default Index;
