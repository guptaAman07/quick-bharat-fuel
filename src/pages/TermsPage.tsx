
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Shield, HelpCircle } from 'lucide-react';

const TermsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft size={16} className="mr-2" /> Back
        </Button>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <FileText size={24} className="text-fastfuel-blue" />
              <h1 className="text-2xl font-bold">Terms and Conditions</h1>
            </div>
            
            <div className="space-y-6">
              <section>
                <h2 className="text-lg font-semibold mb-2">1. Introduction</h2>
                <p className="text-gray-700">
                  Welcome to FastFuel. These terms and conditions govern your use of our mobile application 
                  and the fuel delivery services provided through it. By using our application, you accept 
                  these terms and conditions in full. If you disagree with these terms and conditions or 
                  any part of them, you must not use our application.
                </p>
              </section>
              
              <section>
                <h2 className="text-lg font-semibold mb-2">2. Service Description</h2>
                <p className="text-gray-700">
                  FastFuel provides a platform for ordering and delivery of petroleum products. Our services 
                  include delivering fuel to your specified location, processing payments, and providing 
                  customer support. We reserve the right to modify, suspend, or discontinue any part of our 
                  service at any time.
                </p>
              </section>
              
              <section>
                <h2 className="text-lg font-semibold mb-2">3. User Accounts</h2>
                <p className="text-gray-700">
                  To use our services, you must register and create an account. You are responsible for 
                  maintaining the confidentiality of your account information and for restricting access to 
                  your account. You agree to accept responsibility for all activities that occur under your 
                  account.
                </p>
              </section>
              
              <section>
                <h2 className="text-lg font-semibold mb-2">4. Order and Delivery</h2>
                <p className="text-gray-700">
                  By placing an order through our application, you agree to provide accurate information 
                  about your location and requirements. We will make reasonable efforts to deliver your order 
                  within the estimated time frame, but delivery times are not guaranteed and may be affected 
                  by factors outside our control.
                </p>
              </section>
              
              <section>
                <h2 className="text-lg font-semibold mb-2">5. Payments</h2>
                <p className="text-gray-700">
                  Payment for our services can be made through the payment methods available on the application. 
                  Prices for fuel products are subject to change without notice. We will charge your selected 
                  payment method the amount of the total purchase price, including applicable taxes and delivery fees.
                </p>
              </section>
              
              <section>
                <h2 className="text-lg font-semibold mb-2">6. Safety and Compliance</h2>
                <p className="text-gray-700">
                  You agree to comply with all safety instructions provided by our delivery personnel. Fuel 
                  delivery locations must be accessible, legal, and safe for our personnel. We reserve the right 
                  to refuse delivery if we determine that delivery conditions are unsafe or non-compliant with 
                  regulations.
                </p>
              </section>
              
              <section>
                <h2 className="text-lg font-semibold mb-2">7. Privacy Policy</h2>
                <p className="text-gray-700">
                  Your use of our services is also governed by our Privacy Policy, which outlines how we collect, 
                  use, and protect your personal information.
                </p>
              </section>
              
              <section>
                <h2 className="text-lg font-semibold mb-2">8. Limitation of Liability</h2>
                <p className="text-gray-700">
                  In no event shall FastFuel be liable for any indirect, incidental, special, consequential or 
                  punitive damages, including without limitation, loss of profits or data, arising out of or 
                  related to your use of the service.
                </p>
              </section>
              
              <section>
                <h2 className="text-lg font-semibold mb-2">9. Changes to Terms</h2>
                <p className="text-gray-700">
                  We may revise these terms and conditions from time to time. The revised terms and conditions 
                  shall apply from the date of publication. Every time you wish to use our site, please check 
                  these terms to ensure you understand the terms that apply at that time.
                </p>
              </section>
              
              <section>
                <h2 className="text-lg font-semibold mb-2">10. Contact Us</h2>
                <p className="text-gray-700">
                  If you have any questions about these terms and conditions, please contact us at:
                </p>
                <ul className="list-disc list-inside mt-2 text-gray-700">
                  <li>Email: support@fastfuel.com</li>
                  <li>Phone: 9326267664, 8976453592</li>
                </ul>
              </section>
            </div>
            
            <div className="mt-8 flex gap-3">
              <Button onClick={() => navigate(-1)}>
                I Accept
              </Button>
              <Button variant="outline" onClick={() => navigate(-1)}>
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6 flex justify-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/support')}>
            <HelpCircle size={16} className="mr-2" />
            Help Center
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/terms')}>
            <Shield size={16} className="mr-2" />
            Privacy Policy
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
