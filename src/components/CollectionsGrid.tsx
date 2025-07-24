import { CollectionCard, Collection } from "./CollectionCard";

// Sample data - In real implementation, this would come from your backend/database
const sampleCollections: Collection[] = [
  {
    id: "1",
    name: "Royal Bridal Lehenga",
    price: 25000,
    description: "Exquisite bridal ghagra choli with heavy golden embroidery, perfect for your special day. Features intricate zardozi work and premium silk fabric.",
    images: [
      "/api/placeholder/400/500",
      "/api/placeholder/400/500",
      "/api/placeholder/400/500"
    ],
    status: "Available",
    category: "Bridal"
  },
  {
    id: "2",
    name: "Festive Red Ensemble",
    price: 15000,
    description: "Vibrant red ghagra choli with traditional mirror work and embroidery. Ideal for festivals and celebrations.",
    images: [
      "/api/placeholder/400/500",
      "/api/placeholder/400/500"
    ],
    status: "Available",
    category: "Festive"
  },
  {
    id: "3",
    name: "Elegant Pink Lehenga",
    price: 18000,
    description: "Soft pink ghagra choli with delicate floral embroidery and beadwork. Perfect for engagement ceremonies.",
    images: [
      "/api/placeholder/400/500",
      "/api/placeholder/400/500",
      "/api/placeholder/400/500",
      "/api/placeholder/400/500"
    ],
    status: "Sold Out",
    category: "Party Wear"
  },
  {
    id: "4",
    name: "Golden Glamour Set",
    price: 22000,
    description: "Stunning golden ghagra choli with sequin work and contemporary design elements.",
    images: [
      "/api/placeholder/400/500",
      "/api/placeholder/400/500"
    ],
    status: "Available",
    category: "Designer"
  },
  {
    id: "5",
    name: "Traditional Navy Blue",
    price: 12000,
    description: "Classic navy blue ghagra choli with traditional motifs and comfortable fit.",
    images: [
      "/api/placeholder/400/500"
    ],
    status: "Available",
    category: "Traditional"
  },
  {
    id: "6",
    name: "Mint Green Elegance",
    price: 16000,
    description: "Fresh mint green ghagra choli with contemporary cut and minimal embellishments.",
    images: [
      "/api/placeholder/400/500",
      "/api/placeholder/400/500",
      "/api/placeholder/400/500"
    ],
    status: "Available",
    category: "Contemporary"
  }
];

export const CollectionsGrid = () => {
  return (
    <section id="collections" className="py-16 bg-background">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Our <span className="bg-gradient-primary bg-clip-text text-transparent">Exclusive</span> Collections
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our carefully curated collection of ghagra cholis, each piece telling its own story of elegance and tradition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleCollections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Looking for something specific? We also create custom designs!
          </p>
          <button
            onClick={() => window.open('https://wa.me/your-number?text=Hi! I would like to inquire about custom ghagra choli designs.', '_blank')}
            className="inline-flex items-center px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors rounded-md font-medium"
          >
            Contact for Custom Designs
          </button>
        </div>
      </div>
    </section>
  );
};