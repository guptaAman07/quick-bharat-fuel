
import React, { useEffect, useRef, useState } from 'react';
import { PetrolPump } from '@/context/LocationContext';

interface GoogleMapProps {
  userLocation: { lat: number; lng: number } | null;
  pumps: PetrolPump[];
  onSelectPump?: (pump: PetrolPump) => void;
  selectedPump?: PetrolPump | null;
}

// This API key would normally be stored securely, but for demo purposes it's included directly
// In a production app, this should be stored in environment variables or fetched from a backend
const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";

const GoogleMap: React.FC<GoogleMapProps> = ({ 
  userLocation, 
  pumps,
  onSelectPump,
  selectedPump
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load Google Maps API script
  useEffect(() => {
    const loadGoogleMapsApi = () => {
      if (!document.getElementById('google-maps-script')) {
        const script = document.createElement('script');
        script.id = 'google-maps-script';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => setLoaded(true);
        document.head.appendChild(script);
      } else {
        setLoaded(true);
      }
    };
    
    loadGoogleMapsApi();
    
    return () => {
      // Clean up markers when component unmounts
      markers.forEach(marker => marker.setMap(null));
    };
  }, []);

  // Initialize map once the API is loaded and we have user location
  useEffect(() => {
    if (!loaded || !userLocation || !mapRef.current) return;
    
    const mapOptions: google.maps.MapOptions = {
      center: userLocation,
      zoom: 14,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      zoomControl: true
    };
    
    const map = new google.maps.Map(mapRef.current, mapOptions);
    setMapInstance(map);
    
    // Add user location marker
    const userMarker = new google.maps.Marker({
      position: userLocation,
      map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#4285F4",
        fillOpacity: 1,
        strokeColor: "white",
        strokeWeight: 2,
      },
      title: "Your location (Kandivali West, Mumbai)"
    });
    
    return () => {
      userMarker.setMap(null);
    };
  }, [loaded, userLocation]);

  // Add or update markers when pumps or map changes
  useEffect(() => {
    if (!mapInstance || !pumps.length) return;
    
    // Clear previous markers
    markers.forEach(marker => marker.setMap(null));
    const newMarkers: google.maps.Marker[] = [];
    
    // Create markers for each pump
    pumps.forEach(pump => {
      const marker = new google.maps.Marker({
        position: pump.location,
        map: mapInstance,
        title: pump.name,
        icon: {
          url: pump.isOpen ? 
            'http://maps.google.com/mapfiles/ms/icons/green-dot.png' : 
            'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        }
      });
      
      if (onSelectPump) {
        marker.addListener('click', () => onSelectPump(pump));
      }
      
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="font-size: 16px; margin: 0 0 4px 0;">${pump.name}</h3>
            <p style="font-size: 12px; margin: 0 0 4px 0;">${pump.address}</p>
            <p style="font-size: 12px; margin: 0;">
              ${pump.isOpen ? '<span style="color: green;">Open</span>' : '<span style="color: red;">Closed</span>'} • 
              ${pump.distance?.toFixed(1)} km away
            </p>
          </div>
        `
      });
      
      marker.addListener('click', () => {
        infoWindow.open(mapInstance, marker);
      });
      
      newMarkers.push(marker);
    });
    
    setMarkers(newMarkers);
    
    return () => {
      newMarkers.forEach(marker => marker.setMap(null));
    };
  }, [mapInstance, pumps, onSelectPump]);
  
  // Highlight selected pump on the map
  useEffect(() => {
    if (!mapInstance || !selectedPump || !markers.length) return;
    
    const pumpMarker = markers.find(
      marker => marker.getPosition()?.lat() === selectedPump.location.lat && 
                marker.getPosition()?.lng() === selectedPump.location.lng
    );
    
    if (pumpMarker) {
      mapInstance.panTo(pumpMarker.getPosition() as google.maps.LatLng);
      mapInstance.setZoom(15);
      
      // Trigger the marker click to show info window
      google.maps.event.trigger(pumpMarker, 'click');
    }
  }, [selectedPump, mapInstance, markers]);

  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      {!loaded ? (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fastfuel-blue"></div>
        </div>
      ) : (
        <div ref={mapRef} className="w-full h-full"></div>
      )}
    </div>
  );
};

export default GoogleMap;
