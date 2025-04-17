
import React, { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';
import { useFuel } from './FuelContext';

interface PaymentMethod {
  id: string;
  type: 'upi' | 'card' | 'netbanking' | 'wallet' | 'cod';
  name: string;
  isDefault?: boolean;
  last4?: string;
  icon: string;
}

interface PaymentContextType {
  paymentMethods: PaymentMethod[];
  processingPayment: boolean;
  selectedMethod: PaymentMethod | null;
  selectPaymentMethod: (methodId: string) => void;
  processPayment: (amount: number, orderId: string) => Promise<boolean>;
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void;
}

const PaymentContext = createContext<PaymentContextType | null>(null);

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

const defaultPaymentMethods: PaymentMethod[] = [
  {
    id: 'upi1',
    type: 'upi',
    name: 'Google Pay',
    isDefault: true,
    icon: 'gpay.png'
  },
  {
    id: 'upi2',
    type: 'upi',
    name: 'PhonePe',
    icon: 'phonepe.png'
  },
  {
    id: 'card1',
    type: 'card',
    name: 'HDFC Credit Card',
    last4: '4567',
    icon: 'card.png'
  },
  {
    id: 'cod1',
    type: 'cod',
    name: 'Cash on Delivery',
    icon: 'cash.png'
  }
];

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { updateOrderStatus, updatePaymentStatus } = useFuel();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(defaultPaymentMethods);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    paymentMethods.find(method => method.isDefault) || null
  );
  const [processingPayment, setProcessingPayment] = useState(false);

  const selectPaymentMethod = (methodId: string) => {
    const method = paymentMethods.find(m => m.id === methodId);
    if (method) {
      setSelectedMethod(method);
    }
  };

  const addPaymentMethod = (method: Omit<PaymentMethod, 'id'>) => {
    const newMethod = { 
      ...method,
      id: `${method.type}${Date.now()}`
    };
    
    setPaymentMethods([...paymentMethods, newMethod]);
    toast.success(`Added ${method.name} as a payment method`);
  };

  const processPayment = async (amount: number, orderId: string): Promise<boolean> => {
    if (!selectedMethod) {
      toast.error('Please select a payment method');
      return false;
    }

    setProcessingPayment(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, we'd integrate with Razorpay or another payment gateway
      // For this demo, we'll simulate a successful payment
      toast.success(`Payment of ₹${amount.toFixed(2)} processed successfully`);
      
      // Update payment status to completed
      updatePaymentStatus(orderId, 'completed');
      
      // Update order status to processing
      updateOrderStatus(orderId, 'processing');
      
      return true;
    } catch (error) {
      toast.error('Payment failed. Please try again.');
      return false;
    } finally {
      setProcessingPayment(false);
    }
  };

  return (
    <PaymentContext.Provider value={{ 
      paymentMethods, 
      processingPayment, 
      selectedMethod, 
      selectPaymentMethod, 
      processPayment,
      addPaymentMethod
    }}>
      {children}
    </PaymentContext.Provider>
  );
};
