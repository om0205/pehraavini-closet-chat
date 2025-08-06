import { CollectionCard, Collection } from "./CollectionCard";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const fetchCollections = async (): Promise<Collection[]> => {
  const { data, error } = await supabase
    .from('clothing_sets')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  return data.map(item => ({
    id: item.id,
    name: item.name,
    price: Number(item.price),
    description: item.description || '',
    images: item.images || [],
    videos: item.videos || [],
    status: item.status === 'available' ? 'Available' : 'Sold Out',
    category: item.category
  }));
};

export const CollectionsGrid = () => {
  const { data: collections = [], isLoading, error } = useQuery({
    queryKey: ['collections'],
    queryFn: fetchCollections,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Memoize collections to prevent unnecessary re-renders
  const memoizedCollections = useMemo(() => collections, [collections]);

  if (error) {
    return (
      <section id="collections" className="py-16 bg-background">
        <div className="container px-4">
          <div className="text-center">
            <p className="text-destructive">Failed to load collections. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

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

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg p-4 animate-pulse">
                <div className="aspect-[4/5] bg-muted rounded-md mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : collections.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No collections available yet.</p>
            <p className="text-muted-foreground">Check back soon for new arrivals!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {memoizedCollections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};