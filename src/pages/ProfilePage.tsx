import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { 
  User,
  Phone,
  Mail,
  MapPin,
  LogOut,
  Save,
  Bell,
  Shield,
  HelpCircle,
  FileText,
  ChevronRight,
  CreditCard,
  MessageCircle
} from 'lucide-react';
import { toast } from 'sonner';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    fuelPriceAlerts: true
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
  };

  const callCustomerSupport = (number: string) => {
    window.location.href = `tel:${number}`;
    toast.info(`Calling customer support: ${number}`);
  };
  
  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        
        {/* Profile Info Card */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-fastfuel-blue flex items-center justify-center text-white text-xl font-bold">
                {user?.name?.charAt(0)}
              </div>
              <div>
                <h2 className="font-bold text-lg">{user?.name}</h2>
                <p className="text-gray-500">{user?.email}</p>
                <p className="text-xs bg-gray-100 inline-block px-2 py-1 rounded mt-1">{user?.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Edit Profile */}
        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Edit Profile</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User size={14} />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail size={14} />
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone size={14} />
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin size={14} />
                    Default Address
                  </Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your address"
                    className="resize-none"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-fastfuel-blue hover:bg-blue-800"
                >
                  <Save size={16} className="mr-2" />
                  Save Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
        
        {/* Notifications */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Bell size={16} />
              Notification Settings
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Order Updates</p>
                  <p className="text-sm text-gray-500">Get notified about your order status</p>
                </div>
                <Switch 
                  checked={notifications.orderUpdates}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, orderUpdates: checked }))
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Promotions & Offers</p>
                  <p className="text-sm text-gray-500">Receive promotional messages</p>
                </div>
                <Switch 
                  checked={notifications.promotions}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, promotions: checked }))
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Fuel Price Alerts</p>
                  <p className="text-sm text-gray-500">Get notified when fuel prices change</p>
                </div>
                <Switch 
                  checked={notifications.fuelPriceAlerts}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, fuelPriceAlerts: checked }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Payment Methods */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <CreditCard size={16} />
                Payment Methods
              </h3>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                Add New
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between border rounded-md p-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                    <CreditCard size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Google Pay</p>
                    <p className="text-xs text-gray-500">Default</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
              
              <div className="flex items-center justify-between border rounded-md p-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                    <CreditCard size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">HDFC Credit Card</p>
                    <p className="text-xs text-gray-500">•••• 4567</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Customer Support */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <HelpCircle size={16} />
              Help & Support
            </h3>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => navigate('/support')}
              >
                <MessageCircle size={16} className="mr-2 text-fastfuel-blue" />
                Chat with Customer Executive
              </Button>
              
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
        
        {/* Other Options */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <div className="divide-y">
              <Button 
                variant="ghost" 
                className="w-full justify-start h-auto py-3 rounded-none"
                onClick={() => navigate('/support')}
              >
                <HelpCircle size={16} className="mr-2 text-gray-500" />
                Help & Support
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start h-auto py-3 rounded-none"
                onClick={() => navigate('/terms')}
              >
                <Shield size={16} className="mr-2 text-gray-500" />
                Privacy Policy
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start h-auto py-3 rounded-none"
                onClick={() => navigate('/terms')}
              >
                <FileText size={16} className="mr-2 text-gray-500" />
                Terms & Conditions
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start h-auto py-3 rounded-none text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => {
                  logout();
                  toast.success('Logged out successfully');
                  navigate('/login');
                }}
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <p className="text-center text-xs text-gray-400 mt-6">
          FastFuel App v1.0.0
        </p>
      </div>
    </Layout>
  );
};

export default ProfilePage;
