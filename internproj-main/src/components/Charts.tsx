
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';

const Charts = () => {
  // Sample historical data for trending
  const historicalTrends = [
    { month: 'Jan', fatContent: 4.1, microbialLoad: 8500, quality: 85 },
    { month: 'Feb', fatContent: 4.0, microbialLoad: 9200, quality: 82 },
    { month: 'Mar', fatContent: 4.2, microbialLoad: 7800, quality: 88 },
    { month: 'Apr', fatContent: 4.3, microbialLoad: 8100, quality: 87 },
    { month: 'May', fatContent: 4.1, microbialLoad: 7500, quality: 90 },
    { month: 'Jun', fatContent: 4.0, microbialLoad: 8300, quality: 85 }
  ];

  // Quality distribution data
  const qualityDistribution = [
    { name: 'Good', value: 65, color: '#22c55e' },
    { name: 'Acceptable', value: 25, color: '#eab308' },
    { name: 'Poor', value: 10, color: '#ef4444' }
  ];

  // Confidence intervals data
  const confidenceData = [
    { parameter: 'Fat Content', confidence: 92, range: '±0.2%' },
    { parameter: 'SNF', confidence: 88, range: '±0.3%' },
    { parameter: 'Microbial Load', confidence: 95, range: '±500 CFU' },
    { parameter: 'Processing Temp', confidence: 90, range: '±1.5°C' },
    { parameter: 'pH Level', confidence: 87, range: '±0.05' }
  ];

  return (
    <div className="space-y-6">
      {/* Historical Trends */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <CardTitle>Historical Quality Trends</CardTitle>
          </div>
          <CardDescription>
            Quality score trends over the past 6 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historicalTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="quality" 
                stroke="#2563eb" 
                strokeWidth={3}
                dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Quality Distribution */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <PieChartIcon className="h-5 w-5 text-green-600" />
              <CardTitle>Quality Distribution</CardTitle>
            </div>
            <CardDescription>
              Current batch quality breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={qualityDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {qualityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-4">
              {qualityDistribution.map((item) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Prediction Confidence */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <CardTitle>Prediction Confidence</CardTitle>
            </div>
            <CardDescription>
              Confidence levels by parameter
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={confidenceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="parameter" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="confidence" 
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Fat Content vs Microbial Load Correlation */}
      <Card>
        <CardHeader>
          <CardTitle>Parameter Correlation Analysis</CardTitle>
          <CardDescription>
            Fat content vs microbial load trends over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historicalTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="fatContent" 
                stroke="#22c55e" 
                strokeWidth={2}
                name="Fat Content (%)"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="microbialLoad" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Microbial Load (CFU/ml)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Charts;
