import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  Phone, 
  ArrowLeft, 
  Send, 
  MessageCircle, 
  CheckCircle, 
  HelpCircle,
  FileText,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

const SupportPage = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I help you today?',
      sender: 'agent',
      timestamp: new Date()
    }
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setMessage('');
    
    // Simulate agent response after a delay
    setTimeout(() => {
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Thank you for your message. Our customer executive will get back to you shortly.',
        sender: 'agent',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, agentMessage]);
    }, 1000);
  };
  
  const callCustomerSupport = (number: string) => {
    window.location.href = `tel:${number}`;
    toast.info(`Calling customer support: ${number}`);
  };

  return (
    <Layout>
      <div className="p-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft size={16} className="mr-2" /> Back
        </Button>
        
        <h1 className="text-2xl font-bold mb-4">Help & Support</h1>
        
        {/* Chat with Customer Executive */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <MessageCircle size={18} />
              Customer Support Chat
            </h3>
            
            {/* Chat messages */}
            <div className="bg-gray-50 rounded-lg p-3 h-96 overflow-y-auto mb-4">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`mb-3 ${
                    msg.sender === 'user' ? 'text-right' : ''
                  }`}
                >
                  <div 
                    className={`inline-block rounded-lg px-4 py-2 max-w-[80%] ${
                      msg.sender === 'user' 
                        ? 'bg-fastfuel-blue text-white'
                        : 'bg-white border text-gray-800'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Message input */}
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button onClick={sendMessage}>
                <Send size={16} />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Call Support */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4">Call Customer Support</h3>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => callCustomerSupport('9326267664')}
              >
                <Phone size={16} className="mr-2 text-green-600" />
                Call Support (9326267664)
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => callCustomerSupport('8976453592')}
              >
                <Phone size={16} className="mr-2 text-green-600" />
                Call Support (8976453592)
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* FAQs */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4">Frequently Asked Questions</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">How does fuel delivery work?</h4>
                <p className="text-sm text-gray-600 mt-1">
                  We deliver fuel directly to your location. Just place an order, specify your location, and our team will bring the fuel to you.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium">What payment methods are accepted?</h4>
                <p className="text-sm text-gray-600 mt-1">
                  We accept credit/debit cards, UPI payments, and digital wallets like Google Pay and PhonePe.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium">How long does delivery take?</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Standard delivery time is 45-60 minutes, depending on your location and traffic conditions.
                </p>
              </div>
              
              <Button 
                variant="link" 
                className="w-full justify-center mt-2"
                onClick={() => navigate('/terms')}
              >
                View all FAQs <ChevronRight size={16} />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Other Support Options */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <div className="divide-y">
              <Button 
                variant="ghost" 
                className="w-full justify-start h-auto py-3 rounded-none"
                onClick={() => navigate('/terms')}
              >
                <HelpCircle size={16} className="mr-2 text-gray-500" />
                Help Center
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start h-auto py-3 rounded-none"
                onClick={() => navigate('/terms')}
              >
                <FileText size={16} className="mr-2 text-gray-500" />
                Terms & Conditions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SupportPage;
