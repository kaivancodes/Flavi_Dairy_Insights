import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PredictionForm from '@/components/PredictionForm';
import ExtrapolationForm from '@/components/ExtrapolationForm';
import ModelInsights from '@/components/ModelInsights';
import Charts from '@/components/Charts';
import TimeSeriesForecasting from '@/components/TimeSeriesForecasting';
import BatchComparison from '@/components/BatchComparison';
import AutoRetrainingPipeline from '@/components/AutoRetrainingPipeline';
import UserRoleManagement from '@/components/UserRoleManagement';
import { Beaker, TrendingUp, Shield, Brain, BarChart3 } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Beaker className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Flavi Dairy Solutions</h1>
                <p className="text-sm text-gray-600">Quality Assurance System</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Home</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Advanced AI-Powered Quality Prediction System
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive dairy processing intelligence with explainable AI, economic impact analysis, and predictive forecasting capabilities.
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Quality Prediction</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">AI-powered batch quality prediction with explainable results and economic impact analysis</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Future Forecasting</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Time series forecasting and scenario extrapolation for proactive quality management</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Brain className="h-12 w-12 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Intelligent Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Advanced analytics with anomaly detection, recommendations, and model transparency</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Application */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">AI-Powered Quality Analysis Platform</CardTitle>
            <CardDescription>
              Comprehensive tools for prediction, forecasting, insights, advanced analytics, and enterprise management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="prediction" className="w-full">
              <TabsList className="grid w-full grid-cols-7 mb-8">
                <TabsTrigger value="prediction" className="text-sm">
                  Predict Quality
                </TabsTrigger>
                <TabsTrigger value="extrapolation" className="text-sm">
                  Extrapolate Data
                </TabsTrigger>
                <TabsTrigger value="forecasting" className="text-sm">
                  Time Series
                </TabsTrigger>
                <TabsTrigger value="insights" className="text-sm">
                  Model Insights
                </TabsTrigger>
                <TabsTrigger value="analytics" className="text-sm">
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="comparison" className="text-sm">
                  Batch Compare
                </TabsTrigger>
                <TabsTrigger value="admin" className="text-sm">
                  Admin Panel
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="prediction" className="space-y-6">
                <PredictionForm />
              </TabsContent>
              
              <TabsContent value="extrapolation" className="space-y-6">
                <ExtrapolationForm />
              </TabsContent>

              <TabsContent value="forecasting" className="space-y-6">
                <TimeSeriesForecasting />
              </TabsContent>
              
              <TabsContent value="insights" className="space-y-6">
                <ModelInsights />
              </TabsContent>
              
              <TabsContent value="analytics" className="space-y-6">
                <Charts />
              </TabsContent>

              <TabsContent value="comparison" className="space-y-6">
                <BatchComparison />
              </TabsContent>

              <TabsContent value="admin" className="space-y-6">
                <UserRoleManagement />
                <AutoRetrainingPipeline />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600 mb-4">© 2025 Flavi Dairy Solutions. All rights reserved.</p>
            <div className="space-x-6">
              <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
