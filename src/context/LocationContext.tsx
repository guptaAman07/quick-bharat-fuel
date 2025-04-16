
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface PetrolPump {
  id: string;
  name: string;
  location: Coordinates;
  address: string;
  distance?: number; // in km
  rating?: number;
  isOpen: boolean;
}

interface LocationContextType {
  userLocation: Coordinates | null;
  isLoadingLocation: boolean;
  nearbyPumps: PetrolPump[];
  selectedPump: PetrolPump | null;
  setSelectedPump: (pump: PetrolPump | null) => void;
  refreshLocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | null>(null);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

// Mock data for petrol pumps in Bangalore
const mockPumps: PetrolPump[] = [
  {
    id: 'pump1',
    name: 'Indian Oil',
    location: { lat: 12.9352, lng: 77.6245 },
    address: 'Koramangala 7th Block, Bangalore',
    rating: 4.3,
    distance: 1.2,
    isOpen: true
  },
  {
    id: 'pump2',
    name: 'HP Petrol Pump',
    location: { lat: 12.9346, lng: 77.6132 },
    address: 'BTM Layout, Bangalore',
    rating: 4.1,
    distance: 2.5,
    isOpen: true
  },
  {
    id: 'pump3',
    name: 'Bharat Petroleum',
    location: { lat: 12.9456, lng: 77.6221 },
    address: 'HSR Layout, Bangalore',
    rating: 4.5,
    distance: 3.1,
    isOpen: true
  },
  {
    id: 'pump4',
    name: 'Shell',
    location: { lat: 12.9299, lng: 77.6338 },
    address: 'Indiranagar, Bangalore',
    rating: 4.7,
    distance: 4.0,
    isOpen: false
  },
];

// Default to Bangalore coordinates
const BANGALORE_COORDINATES = { lat: 12.9716, lng: 77.5946 };

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [nearbyPumps, setNearbyPumps] = useState<PetrolPump[]>([]);
  const [selectedPump, setSelectedPump] = useState<PetrolPump | null>(null);

  const refreshLocation = async () => {
    setIsLoadingLocation(true);
    try {
      // In a real app, we'd use the browser's geolocation API
      // For now, use default Bangalore coordinates with slight randomization
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Randomize location slightly for demo purposes
      const randomizeFactor = 0.01; // ~1km
      const randomLat = BANGALORE_COORDINATES.lat + (Math.random() - 0.5) * randomizeFactor;
      const randomLng = BANGALORE_COORDINATES.lng + (Math.random() - 0.5) * randomizeFactor;
      
      const location = { lat: randomLat, lng: randomLng };
      setUserLocation(location);
      
      // In a real app, we'd fetch nearby pumps based on this location
      // For the demo, let's just use our mock data with randomized distances
      setNearbyPumps(
        mockPumps.map(pump => ({
          ...pump,
          distance: Number((1 + Math.random() * 5).toFixed(1)) // Random distance between 1-6km
        }))
      );
    } catch (error) {
      toast.error('Failed to get your location. Using default location.');
      setUserLocation(BANGALORE_COORDINATES);
      setNearbyPumps(mockPumps);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  useEffect(() => {
    refreshLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ 
      userLocation, 
      isLoadingLocation, 
      nearbyPumps, 
      selectedPump, 
      setSelectedPump,
      refreshLocation
    }}>
      {children}
    </LocationContext.Provider>
  );
};
