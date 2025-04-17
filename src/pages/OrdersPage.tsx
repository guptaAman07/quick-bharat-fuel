
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useFuel } from '@/context/FuelContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  MapPin,
  ChevronRight,
  GasPump
} from 'lucide-react';

const OrdersPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { orders } = useFuel();
  
  const userOrders = orders.filter(order => order.userId === user?.id);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-amber-500" size={18} />;
      case 'processing':
        return <AlertCircle className="text-blue-500" size={18} />;
      case 'delivering':
        return <Truck className="text-fastfuel-blue animate-pulse-slow" size={18} />;
      case 'completed':
        return <CheckCircle className="text-green-500" size={18} />;
      default:
        return <Clock className="text-gray-400" size={18} />;
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Order Placed';
      case 'processing':
        return 'Processing Order';
      case 'delivering':
        return 'Out for Delivery';
      case 'completed':
        return 'Delivered';
      default:
        return status;
    }
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(new Date(date));
  };

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">My Orders</h1>
        
        {userOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Clock className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
            <p className="text-gray-500 mt-1">You haven't placed any orders yet</p>
            <Button 
              onClick={() => navigate('/')}
              className="mt-4 bg-fastfuel-orange text-white hover:bg-orange-600"
            >
              Order Fuel Now
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {userOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardContent className="p-0">
                  {/* Order Status Header */}
                  <div className="bg-gray-50 p-3 border-b flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span className="font-medium">{getStatusText(order.status)}</span>
                    </div>
                    <Badge 
                      variant={order.paymentStatus === 'completed' ? 'outline' : 'default'}
                      className={order.paymentStatus === 'completed' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                    >
                      {order.paymentStatus === 'completed' ? 'Paid' : 'Payment Pending'}
                    </Badge>
                  </div>
                  
                  {/* Order Details */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium">{order.fuelType}</h3>
                        <p className="text-sm text-gray-500">{order.quantity} litres</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{order.totalPrice.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">
                          Ordered on {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Petrol Pump Info */}
                    {order.pumpName && (
                      <div className="flex items-start gap-2 text-sm text-gray-500 mb-2">
                        <GasPump size={16} className="mt-0.5" />
                        <span>From {order.pumpName}</span>
                      </div>
                    )}
                    
                    {/* Delivery Info */}
                    <div className="flex items-start gap-2 text-sm text-gray-500 mb-3">
                      <MapPin size={16} className="mt-0.5" />
                      <span>{order.deliveryAddress}</span>
                    </div>
                    
                    {/* ETA for delivering status */}
                    {order.status === 'delivering' && order.estimatedDelivery && (
                      <div className="bg-blue-50 text-blue-700 p-2 rounded-md text-sm flex items-center gap-2 mb-3">
                        <Truck size={16} />
                        <span>
                          Estimated delivery by {formatDate(order.estimatedDelivery)}
                        </span>
                      </div>
                    )}
                    
                    {/* Action Button - Updated to go to order details page */}
                    <Button 
                      variant="outline" 
                      className="w-full mt-2"
                      onClick={() => navigate(`/order-details/${order.id}`)}
                    >
                      <span className="flex-1 text-left">Track Order</span>
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OrdersPage;
