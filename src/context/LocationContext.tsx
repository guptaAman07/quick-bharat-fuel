
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

// Mock data for petrol pumps in Kandivali West, Mumbai
const mockPumps: PetrolPump[] = [
  {
    id: 'pump1',
    name: 'Indian Oil',
    location: { lat: 19.2063, lng: 72.8293 },
    address: 'S.V. Road, Kandivali West, Mumbai',
    rating: 4.3,
    distance: 1.2,
    isOpen: true
  },
  {
    id: 'pump2',
    name: 'HP Petrol Pump',
    location: { lat: 19.2105, lng: 72.8245 },
    address: 'Link Road, Kandivali West, Mumbai',
    rating: 4.1,
    distance: 2.5,
    isOpen: true
  },
  {
    id: 'pump3',
    name: 'Bharat Petroleum',
    location: { lat: 19.2031, lng: 72.8312 },
    address: 'Mahavir Nagar, Kandivali West, Mumbai',
    rating: 4.5,
    distance: 3.1,
    isOpen: true
  },
  {
    id: 'pump4',
    name: 'Shell',
    location: { lat: 19.2098, lng: 72.8198 },
    address: 'Charkop, Kandivali West, Mumbai',
    rating: 4.7,
    distance: 4.0,
    isOpen: false
  },
  {
    id: 'pump5',
    name: 'Hindustan Petroleum',
    location: { lat: 19.2072, lng: 72.8325 },
    address: 'Poisar, Kandivali West, Mumbai',
    rating: 4.2,
    distance: 2.8,
    isOpen: true
  },
];

// Default to Kandivali West, Mumbai coordinates
const KANDIVALI_WEST_COORDINATES = { lat: 19.2081, lng: 72.8292 };

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [nearbyPumps, setNearbyPumps] = useState<PetrolPump[]>([]);
  const [selectedPump, setSelectedPump] = useState<PetrolPump | null>(null);

  const refreshLocation = async () => {
    setIsLoadingLocation(true);
    try {
      // For this app, we'll directly set location to Kandivali West instead of using geolocation
      setUserLocation(KANDIVALI_WEST_COORDINATES);
      
      // In a real app, we'd fetch nearby pumps from Google Places API based on this location
      // For the demo, let's use our mock data for Kandivali West
      setNearbyPumps(mockPumps);
    } catch (error) {
      console.error('Location error:', error);
      toast.error('Failed to get location data. Using default location.');
      setUserLocation(KANDIVALI_WEST_COORDINATES);
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
