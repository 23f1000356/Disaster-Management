"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Cloud, 
  Thermometer, 
  Wind, 
  Droplets, 
  AlertTriangle,
  Shield,
  Users,
  Settings,
  LogOut,
  Activity,
  MapPin
} from 'lucide-react';

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} username
 * @property {string} role
 */

/**
 * @typedef {Object} DisasterPrediction
 * @property {string} disaster
 * @property {number} probability
 * @property {string} time
 */

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [predictions, setPredictions] = useState<DisasterPrediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    
    setUser(JSON.parse(userData));
    fetchPredictions();
    setLoading(false);
  }, [router]);

  const fetchPredictions = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/predictions');
      if (response.ok) {
        const data = await response.json();
        setPredictions(data);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Failed to fetch predictions:', error);
      setIsConnected(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getProbabilityColor = (probability) => {
    if (probability >= 0.8) return 'text-red-500';
    if (probability >= 0.6) return 'text-orange-500';
    if (probability >= 0.4) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getProbabilityBadge = (probability) => {
    if (probability >= 0.8) return 'destructive';
    if (probability >= 0.6) return 'secondary';
    return 'default';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-xl font-bold text-white">ACMS Dashboard</h1>
                <p className="text-sm text-blue-200">Autonomous Climate Mitigation System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                {user.role.toUpperCase()}
              </Badge>
              <span className="text-white font-medium">{user.username}</span>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="text-white border-white/20 hover:bg-white/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Status Cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Connection Status */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-white">
                    {isConnected ? 'Connected to Backend' : 'Backend Disconnected'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Disaster Prediction */}
            {predictions && (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Active Disaster Prediction
                  </CardTitle>
                  <CardDescription className="text-blue-200">
                    Latest AI-powered climate risk assessment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">Disaster Type:</span>
                      <Badge variant="outline" className="text-orange-300 border-orange-300">
                        {predictions.disaster.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">Probability:</span>
                      <span className={`font-bold ${getProbabilityColor(predictions.probability)}`}>
                        {(predictions.probability * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">Predicted Time:</span>
                      <span className="text-blue-200">{formatDateTime(predictions.time)}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-4">
                      <div 
                        className={`h-2 rounded-full ${
                          predictions.probability >= 0.8 ? 'bg-red-500' :
                          predictions.probability >= 0.6 ? 'bg-orange-500' :
                          predictions.probability >= 0.4 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${predictions.probability * 100}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Climate Monitoring */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Cloud className="w-5 h-5 mr-2" />
                  Climate Monitoring
                </CardTitle>
                <CardDescription className="text-blue-200">
                  Real-time environmental data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                    <Thermometer className="w-6 h-6 text-red-400" />
                    <div>
                      <p className="text-sm text-blue-200">Temperature</p>
                      <p className="text-white font-semibold">24.5°C</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                    <Droplets className="w-6 h-6 text-blue-400" />
                    <div>
                      <p className="text-sm text-blue-200">Humidity</p>
                      <p className="text-white font-semibold">68%</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                    <Wind className="w-6 h-6 text-green-400" />
                    <div>
                      <p className="text-sm text-blue-200">Wind Speed</p>
                      <p className="text-white font-semibold">12 km/h</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                    <MapPin className="w-6 h-6 text-purple-400" />
                    <div>
                      <p className="text-sm text-blue-200">Location</p>
                      <p className="text-white font-semibold">California</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* System Alerts */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  System Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Alert className="bg-yellow-500/20 border-yellow-500/50">
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  <AlertTitle className="text-yellow-300">High Risk Detected</AlertTitle>
                  <AlertDescription className="text-yellow-200">
                    Elevated wildfire risk in monitored region
                  </AlertDescription>
                </Alert>
                <Alert className="bg-blue-500/20 border-blue-500/50">
                  <Shield className="h-4 w-4 text-blue-400" />
                  <AlertTitle className="text-blue-300">System Updated</AlertTitle>
                  <AlertDescription className="text-blue-200">
                    AI model refreshed with latest data
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={fetchPredictions} 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Refresh Predictions
                </Button>
                {user.role === 'admin' && (
                  <Button variant="outline" className="w-full text-white border-white/20 hover:bg-white/10">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Users
                  </Button>
                )}
                <Button variant="outline" className="w-full text-white border-white/20 hover:bg-white/10">
                  <Settings className="w-4 h-4 mr-2" />
                  System Settings
                </Button>
              </CardContent>
            </Card>

            {/* User Info */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">User Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-blue-200">Username:</span>
                  <span className="text-white font-medium">{user.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Role:</span>
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    {user.role.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">User ID:</span>
                  <span className="text-white font-medium">#{user.id}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;