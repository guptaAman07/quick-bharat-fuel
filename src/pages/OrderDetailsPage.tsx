
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useFuel } from '@/context/FuelContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Clock,
  CheckCircle,
  Truck,
  MapPin,
  ArrowLeft,
  Phone,
  MessageCircle
} from 'lucide-react';
import { toast } from 'sonner';

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useFuel();
  
  const order = orders.find(o => o.id === orderId);
  
  if (!order) {
    return (
      <Layout>
        <div className="p-4">
          <Button variant="ghost" onClick={() => navigate('/orders')}>
            <ArrowLeft size={16} className="mr-2" /> Back to Orders
          </Button>
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">Order not found</h3>
            <p className="text-gray-500 mt-1">The order you're looking for doesn't exist</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Calculate order progress percentage
  const getProgressPercentage = () => {
    switch (order.status) {
      case 'pending': return 25;
      case 'processing': return 50;
      case 'delivering': return 75;
      case 'completed': return 100;
      default: return 0;
    }
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(new Date(date));
  };
  
  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Order Placed';
      case 'processing': return 'Processing Order';
      case 'delivering': return 'Out for Delivery';
      case 'completed': return 'Delivered';
      default: return status;
    }
  };
  
  // Mock function to contact delivery agent
  const contactDeliveryAgent = () => {
    toast.success('Connecting to delivery agent...');
  };

  return (
    <Layout>
      <div className="p-4">
        <Button variant="ghost" onClick={() => navigate('/orders')} className="mb-4">
          <ArrowLeft size={16} className="mr-2" /> Back to Orders
        </Button>
        
        <h1 className="text-2xl font-bold mb-4">Order Details</h1>
        
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold">{order.fuelType}</h3>
                <p className="text-sm text-gray-500">Order #{order.id}</p>
              </div>
              <Badge 
                variant={order.paymentStatus === 'completed' ? 'outline' : 'default'}
                className={order.paymentStatus === 'completed' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
              >
                {order.paymentStatus === 'completed' ? 'Paid' : 'Payment Pending'}
              </Badge>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Order Placed</span>
                <span>{order.status === 'completed' ? 'Delivered' : 'Estimated Delivery'}</span>
              </div>
              <Progress value={getProgressPercentage()} className="h-2 mb-2" />
              <div className="flex justify-between text-xs">
                <span>{formatDate(order.createdAt)}</span>
                <span>{order.estimatedDelivery ? formatDate(order.estimatedDelivery) : 'TBD'}</span>
              </div>
            </div>
            
            {/* Order Status */}
            <div className="bg-gray-50 rounded-md p-4 mb-4">
              <div className="flex items-center gap-3">
                {order.status === 'delivering' && <Truck className="text-fastfuel-blue animate-pulse" size={24} />}
                {order.status === 'completed' && <CheckCircle className="text-green-500" size={24} />}
                {(order.status === 'pending' || order.status === 'processing') && <Clock className="text-amber-500" size={24} />}
                
                <div>
                  <h3 className="font-medium">{getStatusText(order.status)}</h3>
                  <p className="text-sm text-gray-500">
                    {order.status === 'delivering' && 'Your order is on the way!'}
                    {order.status === 'completed' && 'Your order has been delivered.'}
                    {order.status === 'pending' && 'Your order has been received.'}
                    {order.status === 'processing' && 'We are preparing your order.'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Order Details */}
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Order Summary</h3>
                <div className="flex justify-between border-b pb-2 mb-2">
                  <span>{order.quantity} litres of {order.fuelType}</span>
                  <span>₹{order.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b pb-2 mb-2">
                  <span>Delivery Fee</span>
                  <span>₹49.00</span>
                </div>
                <div className="flex justify-between border-b pb-2 mb-2">
                  <span>Taxes</span>
                  <span>₹{(order.totalPrice * 0.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{(order.totalPrice + 49 + order.totalPrice * 0.18).toFixed(2)}</span>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Delivery Address</h3>
                <div className="flex items-start gap-2">
                  <MapPin size={18} className="text-gray-400 mt-0.5" />
                  <p>{order.deliveryAddress}</p>
                </div>
              </div>
              
              {/* Contact Options - Only show for delivering status */}
              {order.status === 'delivering' && (
                <div>
                  <h3 className="font-medium mb-2">Need Help?</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={contactDeliveryAgent} className="flex-1">
                      <Phone size={16} className="mr-2" />
                      Call Driver
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/support')} className="flex-1">
                      <MessageCircle size={16} className="mr-2" />
                      Support
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Actions */}
        {order.status === 'completed' && (
          <Button 
            className="w-full bg-fastfuel-blue hover:bg-blue-800"
            onClick={() => navigate('/')}
          >
            Order Again
          </Button>
        )}
        
        {/* Demo Buttons for testing statuses */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            onClick={() => updateOrderStatus(order.id, 'delivering')}
            disabled={order.status === 'delivering'}
          >
            Mark as Delivering
          </Button>
          <Button 
            variant="outline" 
            onClick={() => updateOrderStatus(order.id, 'completed')}
            disabled={order.status === 'completed'}
          >
            Mark as Delivered
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetailsPage;
