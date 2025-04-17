
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useLocation, PetrolPump } from '@/context/LocationContext';
import { useFuel } from '@/context/FuelContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import GoogleMap from '@/components/GoogleMap';
import { 
  MapPin, 
  RefreshCw,
  List,
  Map,
  Star,
  Building,
  Route,
  Clock,
  Search,
  Droplet,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

const NearbyPage = () => {
  const navigate = useNavigate();
  const { userLocation, nearbyPumps, isLoadingLocation, refreshLocation, setSelectedPump, selectedPump } = useLocation();
  const { fuels } = useFuel();
  const [searchQuery, setSearchQuery] = useState('');
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [selectedFuel, setSelectedFuel] = useState(fuels[0].id);
  const [selectedQuantity, setSelectedQuantity] = useState(10);
  
  const filteredPumps = searchQuery 
    ? nearbyPumps.filter(pump => 
        pump.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pump.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : nearbyPumps;
  
  const sortedPumps = [...filteredPumps].sort((a, b) => 
    (a.distance || 0) - (b.distance || 0)
  );

  const handleSelectPump = (pump: PetrolPump) => {
    setSelectedPump(pump);
  };
  
  const handleOrderFromPump = (pump: PetrolPump) => {
    setSelectedPump(pump);
    setShowOrderDialog(true);
  };
  
  const handleStartOrder = () => {
    if (selectedFuel && selectedPump) {
      navigate(`/order/${selectedFuel}`, {
        state: {
          quantity: selectedQuantity,
          pumpId: selectedPump.id,
          pumpName: selectedPump.name,
          pumpAddress: selectedPump.address
        }
      });
      toast.success(`Starting order from ${selectedPump.name}`);
    }
  };
  
  return (
    <Layout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Nearby Pumps</h1>
          <Button 
            variant="outline" 
            size="icon"
            onClick={refreshLocation}
            disabled={isLoadingLocation}
          >
            <RefreshCw size={16} className={isLoadingLocation ? 'animate-spin' : ''} />
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            placeholder="Search by name or address"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Tabs defaultValue="list">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="list">
              <List className="mr-2" size={16} />
              List View
            </TabsTrigger>
            <TabsTrigger value="map">
              <Map className="mr-2" size={16} />
              Map View
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            {isLoadingLocation ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fastfuel-blue"></div>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedPumps.map((pump) => (
                  <Card 
                    key={pump.id}
                    className={`${selectedPump?.id === pump.id ? 'border-2 border-fastfuel-blue' : ''}`}
                    onClick={() => handleSelectPump(pump)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`h-2 w-2 rounded-full ${pump.isOpen ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <h3 className="font-medium">{pump.name}</h3>
                          </div>
                          <p className="text-sm text-gray-500">{pump.address}</p>
                          
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <div className="flex items-center gap-1">
                              <Star className="text-yellow-400" size={14} />
                              <span>{pump.rating}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Route className="text-fastfuel-blue" size={14} />
                              <span>{pump.distance} km</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="text-gray-400" size={14} />
                              <span>{pump.isOpen ? 'Open Now' : 'Closed'}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <Button 
                            variant="outline"
                            className="h-8 px-3 mb-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/pump/${pump.id}`);
                            }}
                          >
                            Details
                          </Button>
                          
                          <Button 
                            className="h-8 px-3 bg-fastfuel-orange hover:bg-orange-600 block w-full"
                            disabled={!pump.isOpen}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOrderFromPump(pump);
                            }}
                          >
                            Order Here
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {sortedPumps.length === 0 && !isLoadingLocation && (
                  <div className="text-center py-8">
                    <Building className="mx-auto text-gray-300 mb-2" size={32} />
                    <p className="text-gray-500">No petrol pumps found</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="map">
            <div className="bg-gray-200 rounded-lg overflow-hidden h-[400px]">
              <GoogleMap 
                userLocation={userLocation} 
                pumps={sortedPumps} 
                selectedPump={selectedPump}
                onSelectPump={handleSelectPump}
              />
            </div>
            
            {selectedPump && (
              <Card className="mt-3">
                <CardContent className="p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{selectedPump.name}</h3>
                      <p className="text-xs text-gray-500">{selectedPump.address}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`h-2 w-2 rounded-full ${selectedPump.isOpen ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className="text-xs">{selectedPump.isOpen ? 'Open Now' : 'Closed'}</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs">{selectedPump.distance} km away</span>
                      </div>
                    </div>
                    <Button 
                      className="bg-fastfuel-orange hover:bg-orange-600"
                      disabled={!selectedPump.isOpen}
                      onClick={() => handleOrderFromPump(selectedPump)}
                    >
                      Order Here
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Order Dialog */}
        <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Order Fuel from {selectedPump?.name}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Fuel Type</label>
                <Select value={selectedFuel} onValueChange={setSelectedFuel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fuels.map(fuel => (
                      <SelectItem key={fuel.id} value={fuel.id}>
                        <div className="flex items-center gap-2">
                          <Droplet size={14} />
                          <span>{fuel.name} - ₹{fuel.price}/litre</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity (Litres)</label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setSelectedQuantity(prev => Math.max(1, prev - 1))}
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={selectedQuantity}
                    onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                    min={1}
                    className="text-center"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setSelectedQuantity(prev => prev + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Subtotal</span>
                  <span className="font-medium">
                    ₹{(fuels.find(f => f.id === selectedFuel)?.price || 0) * selectedQuantity}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  *Final price including delivery fee and taxes will be shown on checkout
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowOrderDialog(false)}>Cancel</Button>
              <Button onClick={handleStartOrder}>Continue to Checkout</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default NearbyPage;
