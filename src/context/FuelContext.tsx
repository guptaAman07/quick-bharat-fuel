
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface FuelType {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  fuelType: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'processing' | 'delivering' | 'completed';
  paymentStatus: 'pending' | 'completed';
  deliveryAddress: string;
  createdAt: Date;
  estimatedDelivery?: Date;
  pumpId?: string;
  pumpName?: string;
}

interface FuelContextType {
  fuels: FuelType[];
  orders: Order[];
  isLoading: boolean;
  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status' | 'paymentStatus'>) => string;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updatePaymentStatus: (orderId: string, status: 'pending' | 'completed') => void;
}

const FuelContext = createContext<FuelContextType | null>(null);

export const useFuel = () => {
  const context = useContext(FuelContext);
  if (!context) {
    throw new Error('useFuel must be used within a FuelProvider');
  }
  return context;
};

const mockFuels: FuelType[] = [
  {
    id: 'petrol',
    name: 'Petrol',
    price: 106.31, // Current price in Bangalore (April 2025)
    description: 'Regular unleaded petrol for all petrol vehicles',
    image: '/petrol.png',
  },
  {
    id: 'diesel',
    name: 'Diesel',
    price: 92.76, // Current price in Bangalore (April 2025)
    description: 'Standard diesel fuel for diesel engines',
    image: '/diesel.png',
  },
  {
    id: 'premium-petrol',
    name: 'Premium Petrol',
    price: 110.50,
    description: 'High-performance fuel with additives for better engine health',
    image: '/premium-petrol.png',
  },
  {
    id: 'cng',
    name: 'CNG',
    price: 83.88, // per kg
    description: 'Compressed Natural Gas, eco-friendly alternative',
    image: '/cng.png',
  }
];

const mockOrders: Order[] = [
  {
    id: 'order1',
    userId: 'user1',
    fuelType: 'Petrol',
    quantity: 10,
    totalPrice: 1063.10,
    status: 'delivering',
    paymentStatus: 'completed',
    deliveryAddress: 'Koramangala, Bangalore',
    createdAt: new Date(),
    estimatedDelivery: new Date(Date.now() + 30 * 60000), // 30 mins from now
    pumpId: 'pump1'
  }
];

export const FuelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fuels, setFuels] = useState<FuelType[]>(mockFuels);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // In a real app, we'd fetch this data from an API
    const storedOrders = localStorage.getItem('fastfuel_orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders).map((order: any) => ({
        ...order,
        createdAt: new Date(order.createdAt),
        estimatedDelivery: order.estimatedDelivery ? new Date(order.estimatedDelivery) : undefined,
      })));
    }
  }, []);

  // Save orders to localStorage whenever orders change
  useEffect(() => {
    localStorage.setItem('fastfuel_orders', JSON.stringify(orders));
  }, [orders]);

  const createOrder = (order: Omit<Order, 'id' | 'createdAt' | 'status' | 'paymentStatus'>) => {
    const orderId = `order${Date.now()}`;
    const newOrder: Order = {
      ...order,
      id: orderId,
      createdAt: new Date(),
      status: 'pending',
      paymentStatus: 'pending',
      estimatedDelivery: new Date(Date.now() + 45 * 60000), // 45 mins from now
    };
    
    setOrders([...orders, newOrder]);
    toast.success('Order placed successfully!');
    return orderId;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(
      orders.map(order => 
        order.id === orderId ? { 
          ...order, 
          status,
          // If the status is 'processing', automatically update payment status to 'completed'
          paymentStatus: status === 'processing' ? 'completed' : order.paymentStatus
        } : order
      )
    );
    toast.success(`Order status updated to ${status}`);
  };
  
  const updatePaymentStatus = (orderId: string, status: 'pending' | 'completed') => {
    setOrders(
      orders.map(order => 
        order.id === orderId ? { ...order, paymentStatus: status } : order
      )
    );
    if (status === 'completed') {
      toast.success('Payment completed successfully!');
    }
  };

  return (
    <FuelContext.Provider value={{ 
      fuels, 
      orders, 
      isLoading, 
      createOrder, 
      updateOrderStatus,
      updatePaymentStatus 
    }}>
      {children}
    </FuelContext.Provider>
  );
};
