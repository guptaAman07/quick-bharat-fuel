
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useFuel, FuelType } from '@/context/FuelContext';
import { useAuth } from '@/context/AuthContext';
import { usePayment } from '@/context/PaymentContext';
import { useLocation as useLocationContext } from '@/context/LocationContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  Droplet, 
  Calendar, 
  Clock,
  CheckCircle,
  ChevronRight,
  MapPin,
  CreditCard,
  Fuel
} from 'lucide-react';

const OrderPage = () => {
  const navigate = useNavigate();
  const { fuelId } = useParams();
  const routeLocation = useLocation();
  const { user } = useAuth();
  const { fuels, createOrder, updateOrderStatus } = useFuel();
  const { nearbyPumps, setSelectedPump } = useLocationContext();
  const { 
    paymentMethods, 
    selectedMethod, 
    selectPaymentMethod, 
    processPayment,
    processingPayment
  } = usePayment();
  
  const [quantity, setQuantity] = useState<number>(
    routeLocation.state?.quantity || 10
  );
  const [address, setAddress] = useState(user?.address || '');
  const [scheduledDelivery, setScheduledDelivery] = useState('now');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [selectedPumpId, setSelectedPumpId] = useState<string>(
    routeLocation.state?.pumpId || ''
  );
  
  const fuel = fuels.find(f => f.id === fuelId);
  
  useEffect(() => {
    if (!fuel) {
      navigate('/');
    }
  }, [fuel, navigate]);
  
  if (!fuel || !user) {
    return null;
  }
  
  const totalPrice = fuel.price * quantity;
  
  const handlePlaceOrder = async () => {
    if (!selectedMethod) return;
    
    const orderId = createOrder({
      userId: user.id,
      fuelType: fuel.name,
      quantity,
      totalPrice,
      deliveryAddress: address,
      pumpId: selectedPumpId,
      pumpName: selectedPumpId ? nearbyPumps.find(p => p.id === selectedPumpId)?.name : undefined
    });
    
    const paymentSuccessful = await processPayment(totalPrice, orderId);
    
    if (paymentSuccessful) {
      navigate('/orders');
    }
  };

  return (
    <Layout>
      <div className="p-4">
        <div className="mb-4">
          <Button variant="ghost" onClick={() => navigate('/')}>
            ← Back to Home
          </Button>
        </div>
        
        <h1 className="text-2xl font-bold mb-4">Place Your Order</h1>
        
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-fastfuel-blue rounded-full flex items-center justify-center">
                <Droplet className="text-white" size={24} />
              </div>
              <div>
                <h2 className="font-bold">{fuel.name}</h2>
                <div className="flex gap-2 text-sm">
                  <span className="text-gray-500">₹{fuel.price.toFixed(2)}/litre</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-4">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Order Details</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="quantity">Quantity (Litres)</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="text-center"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Total: ₹{totalPrice.toFixed(2)}
                </p>
              </div>
              
              <div>
                <Label htmlFor="pump">Select Petrol Pump</Label>
                <Select 
                  value={selectedPumpId} 
                  onValueChange={setSelectedPumpId}
                >
                  <SelectTrigger id="pump" className="mt-1">
                    <SelectValue placeholder="Select a petrol pump" />
                  </SelectTrigger>
                  <SelectContent>
                    {nearbyPumps.filter(pump => pump.isOpen).map((pump) => (
                      <SelectItem key={pump.id} value={pump.id}>
                        <div className="flex items-center gap-2">
                          <Fuel size={16} className="text-gray-500" />
                          <div>
                            <span>{pump.name}</span>
                            <span className="text-xs text-gray-500 block">
                              {pump.distance} km • {pump.address}
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!selectedPumpId && (
                  <p className="text-xs text-amber-500 mt-1">
                    Please select a petrol pump for your order
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="address">Delivery Address</Label>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="text-gray-400" size={16} />
                  <Textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your delivery address"
                    className="resize-none"
                  />
                </div>
              </div>
              
              <div>
                <Label>Delivery Time</Label>
                <RadioGroup value={scheduledDelivery} onValueChange={setScheduledDelivery} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="now" id="delivery-now" />
                    <Label htmlFor="delivery-now">Deliver Now (within 45 mins)</Label>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <RadioGroupItem value="scheduled" id="delivery-scheduled" />
                    <Label htmlFor="delivery-scheduled">Schedule for Later</Label>
                  </div>
                </RadioGroup>
                
                {scheduledDelivery === 'scheduled' && (
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="text-gray-400" size={16} />
                        <Input
                          id="date"
                          type="date"
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="time">Time</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="text-gray-400" size={16} />
                        <Input
                          id="time"
                          type="time"
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Payment Method</h3>
            
            <RadioGroup 
              value={selectedMethod?.id || ''} 
              onValueChange={selectPaymentMethod}
            >
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center space-x-2 border rounded-md p-3">
                    <RadioGroupItem value={method.id} id={`payment-${method.id}`} />
                    <Label htmlFor={`payment-${method.id}`} className="flex flex-1 cursor-pointer">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <CreditCard className="text-gray-400" size={16} />
                          <span>{method.name}</span>
                          {method.last4 && (
                            <span className="text-sm text-gray-500">•••• {method.last4}</span>
                          )}
                        </div>
                        {method.isDefault && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Default</span>
                        )}
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
        
        <Card className="mb-4">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Order Summary</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery Fee</span>
                <span>₹49.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Taxes</span>
                <span>₹{(totalPrice * 0.18).toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                <span>Total</span>
                <span>₹{(totalPrice + 49 + totalPrice * 0.18).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Button 
          className="w-full bg-fastfuel-orange hover:bg-orange-600 text-white py-6"
          onClick={handlePlaceOrder}
          disabled={processingPayment || !address || !selectedMethod || !selectedPumpId}
        >
          {processingPayment ? (
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Processing...</span>
            </div>
          ) : (
            'Place Order'
          )}
        </Button>
      </div>
    </Layout>
  );
};

export default OrderPage;
