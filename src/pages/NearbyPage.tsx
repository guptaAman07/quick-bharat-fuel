
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useLocation, PetrolPump } from '@/context/LocationContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  RefreshCw,
  List,
  Map,
  Star,
  Building,
  Route,
  Clock,
  Search
} from 'lucide-react';

const NearbyPage = () => {
  const navigate = useNavigate();
  const { userLocation, nearbyPumps, isLoadingLocation, refreshLocation } = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredPumps = searchQuery 
    ? nearbyPumps.filter(pump => 
        pump.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pump.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : nearbyPumps;
  
  const sortedPumps = [...filteredPumps].sort((a, b) => 
    (a.distance || 0) - (b.distance || 0)
  );

  const MapSection = () => (
    <div className="bg-gray-200 rounded-lg overflow-hidden h-[400px] flex items-center justify-center">
      <p className="text-gray-500">Google Maps integration would go here</p>
    </div>
  );
  
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
                  <Card key={pump.id}>
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
                        
                        <Button 
                          variant="outline"
                          className="h-8 px-3"
                          onClick={() => navigate(`/pump/${pump.id}`)}
                        >
                          Details
                        </Button>
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
            <MapSection />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default NearbyPage;
