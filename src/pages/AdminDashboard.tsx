import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, LogOut, Eye, Edit, Trash2, Package, TrendingUp, Users, MessageCircle } from "lucide-react";
import { Collection } from "@/components/CollectionCard";
import { AddCollectionModal } from "@/components/admin/AddCollectionModal";
import { toast } from "sonner";

export const AdminDashboard = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("isAdminAuthenticated");
    if (!isAuthenticated) {
      navigate("/admin");
      return;
    }

    // Load collections from localStorage (in production, this would be from your database)
    const savedCollections = localStorage.getItem("pehraavini_collections");
    if (savedCollections) {
      setCollections(JSON.parse(savedCollections));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated");
    toast.success("Logged out successfully");
    navigate("/admin");
  };

  const handleAddCollection = (newCollection: Omit<Collection, "id">) => {
    const collection: Collection = {
      ...newCollection,
      id: Date.now().toString()
    };
    
    const updatedCollections = [...collections, collection];
    setCollections(updatedCollections);
    localStorage.setItem("pehraavini_collections", JSON.stringify(updatedCollections));
    toast.success("Collection added successfully!");
  };

  const handleDeleteCollection = (id: string) => {
    if (confirm("Are you sure you want to delete this collection?")) {
      const updatedCollections = collections.filter(c => c.id !== id);
      setCollections(updatedCollections);
      localStorage.setItem("pehraavini_collections", JSON.stringify(updatedCollections));
      toast.success("Collection deleted successfully!");
    }
  };

  const toggleStatus = (id: string) => {
    const updatedCollections = collections.map(c => 
      c.id === id 
        ? { ...c, status: (c.status === "Available" ? "Sold Out" : "Available") as "Available" | "Sold Out" }
        : c
    );
    setCollections(updatedCollections);
    localStorage.setItem("pehraavini_collections", JSON.stringify(updatedCollections));
    toast.success("Status updated successfully!");
  };

  const availableCount = collections.filter(c => c.status === "Available").length;
  const soldOutCount = collections.filter(c => c.status === "Sold Out").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/dc2e0a2b-83de-45b1-a731-8555e88e20f0.png" 
                alt="Pehraavini" 
                className="h-10 w-auto"
              />
              <div>
                <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage your collections</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate("/")}>
                <Eye className="h-4 w-4 mr-2" />
                View Website
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Collections</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{collections.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{availableCount}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sold Out</CardTitle>
              <Users className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{soldOutCount}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">WhatsApp Ready</CardTitle>
              <MessageCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{availableCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Collections Management */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Collections Management</h2>
            <Button variant="elegant" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Collection
            </Button>
          </div>

          {collections.length === 0 ? (
            <Alert>
              <AlertDescription>
                No collections found. Add your first collection to get started!
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((collection) => (
                <Card key={collection.id} className="overflow-hidden">
                  <div className="aspect-[3/4] relative">
                    <img
                      src={collection.images[0] || "/api/placeholder/300/400"}
                      alt={collection.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge 
                      variant={collection.status === "Available" ? "default" : "destructive"}
                      className={`absolute top-2 right-2 ${
                        collection.status === "Available" 
                          ? "bg-green-600 hover:bg-green-700" 
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {collection.status}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">{collection.name}</h3>
                    <p className="text-primary font-bold text-xl mb-2">₹{collection.price.toLocaleString()}</p>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{collection.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleStatus(collection.id)}
                      >
                        {collection.status === "Available" ? "Mark Sold Out" : "Mark Available"}
                      </Button>
                      
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteCollection(collection.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <AddCollectionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddCollection}
      />
    </div>
  );
};