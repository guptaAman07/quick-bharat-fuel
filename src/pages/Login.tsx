
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Fuel, Shield } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState('user');

  // If already logged in, redirect to home
  if (user) {
    navigate('/');
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password, tab === 'admin');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-fastfuel-blue to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-2">
            <Fuel size={36} className="text-fastfuel-orange" />
            <h1 className="text-3xl font-bold text-white">Fast<span className="text-fastfuel-orange">Fuel</span></h1>
          </div>
          <p className="text-gray-200">Fuel delivery at your doorstep</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6">
          <Tabs defaultValue="user" className="w-full" onValueChange={setTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="user" className="data-[state=active]:bg-fastfuel-orange data-[state=active]:text-white">
                User Login
              </TabsTrigger>
              <TabsTrigger value="admin" className="data-[state=active]:bg-fastfuel-blue data-[state=active]:text-white">
                Admin Login
              </TabsTrigger>
            </TabsList>

            <TabsContent value="user">
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <a href="#" className="text-xs text-fastfuel-blue hover:underline">
                        Forgot password?
                      </a>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-fastfuel-orange hover:bg-orange-600 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Logging in...</span>
                      </div>
                    ) : (
                      'Login'
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="admin">
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Admin Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@fastfuel.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-fastfuel-blue hover:bg-blue-800 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Logging in...</span>
                      </div>
                    ) : (
                      'Admin Login'
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button 
                type="button"
                onClick={() => navigate('/register')}
                className="text-fastfuel-blue hover:underline font-medium"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-300">
          <p>For demonstration:</p>
          <p>Use any email/password combination to login</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
