import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useFuel } from '@/context/FuelContext';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from '@/context/LocationContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Droplet, 
  Truck, 
  MapPin, 
  Zap,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fuels } = useFuel();
  const { refreshLocation, userLocation, isLoadingLocation, nearbyPumps } = useLocation();
  const [quantity, setQuantity] = useState<Record<string, number>>({});
  
  if (!user) {
    navigate('/login');
    return null;
  }

  const handleOrderFuel = (fuelId: string) => {
    if (quantity[fuelId] && quantity[fuelId] > 0) {
      const fuel = fuels.find(f => f.id === fuelId);
      if (fuel) {
        navigate(`/order/${fuelId}`, { 
          state: { 
            fuelId: fuel.id,
            quantity: quantity[fuelId] 
          } 
        });
      }
    }
  };

  const nearestPump = nearbyPumps.length > 0 
    ? nearbyPumps.sort((a, b) => (a.distance || 0) - (b.distance || 0))[0]
    : null;

  return (
    <Layout>
      <div className="p-4">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-fastfuel-blue to-blue-800 rounded-lg p-4 mb-4 text-white">
          <h1 className="text-xl font-bold">Welcome, {user.name}!</h1>
          <p className="text-sm opacity-90">Get fuel delivered to your doorstep</p>
        </div>
        
        {/* Location Section */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <MapPin className="text-fastfuel-orange" size={20} />
                </div>
                <div>
                  <h3 className="font-medium">Your Location</h3>
                  <p className="text-sm text-gray-500">
                    {isLoadingLocation 
                      ? 'Fetching your location...' 
                      : "Kapol Vidyanidhi College, Mumbai"}
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="icon"
                onClick={refreshLocation}
                disabled={isLoadingLocation}
              >
                <RefreshCw size={16} className={`${isLoadingLocation ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Nearest Pump */}
        {nearestPump && (
          <Card className="mb-6 bg-fastfuel-light border-none">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${nearestPump.isOpen ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <h3 className="font-semibold">{nearestPump.name}</h3>
                  </div>
                  <p className="text-sm text-gray-500">{nearestPump.address}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-sm font-medium text-fastfuel-blue">{nearestPump.distance} km away</span>
                    <span className="mx-2">•</span>
                    <span className="text-sm">{nearestPump.isOpen ? 'Open' : 'Closed'}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/nearby')}
                >
                  <ChevronRight />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Fuel Types */}
        <h2 className="text-lg font-semibold mb-3">Order Fuel</h2>
        <div className="grid grid-cols-1 gap-4">
          {fuels.map((fuel) => (
            <Card key={fuel.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex">
                  <div className="w-1/4 bg-gradient-to-br from-blue-500 to-fastfuel-blue flex items-center justify-center p-4">
                    <Droplet className="text-white" size={32} />
                  </div>
                  <div className="w-3/4 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{fuel.name}</h3>
                        <p className="text-sm text-gray-500">{fuel.description}</p>
                      </div>
                      <span className="font-bold text-lg">₹{fuel.price.toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-gray-500 mb-2">Per Litre</div>
                    
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input 
                          type="number"
                          min="1"
                          placeholder="Litres"
                          value={quantity[fuel.id] || ''}
                          onChange={(e) => setQuantity({
                            ...quantity,
                            [fuel.id]: Number(e.target.value)
                          })}
                          className="h-9"
                        />
                      </div>
                      <Button 
                        className="bg-fastfuel-orange hover:bg-orange-600 text-white"
                        onClick={() => handleOrderFuel(fuel.id)}
                        disabled={!quantity[fuel.id] || quantity[fuel.id] <= 0}
                      >
                        Order
                      </Button>
                    </div>
                    
                    {quantity[fuel.id] && quantity[fuel.id] > 0 && (
                      <p className="text-sm mt-2 font-medium">
                        Total: ₹{(fuel.price * quantity[fuel.id]).toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Quick Actions */}
        <h2 className="text-lg font-semibold mt-6 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            onClick={() => navigate('/orders')}
            className="justify-start p-4 h-auto"
          >
            <div className="flex flex-col items-center w-full">
              <Truck className="h-6 w-6 mb-2 text-fastfuel-blue" />
              <span className="text-sm">Track Orders</span>
            </div>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/nearby')}
            className="justify-start p-4 h-auto"
          >
            <div className="flex flex-col items-center w-full">
              <MapPin className="h-6 w-6 mb-2 text-fastfuel-orange" />
              <span className="text-sm">Find Pumps</span>
            </div>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
