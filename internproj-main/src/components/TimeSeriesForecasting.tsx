
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, Calendar, AlertCircle } from 'lucide-react';

const TimeSeriesForecasting = () => {
  // Generate historical data with trends
  const generateHistoricalData = () => {
    const data = [];
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 12);
    
    for (let i = 0; i < 18; i++) { // 12 months historical + 6 months forecast
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + i);
      
      const isHistorical = i < 12;
      const baseQuality = 75 + Math.sin(i * 0.5) * 10; // Seasonal variation
      const trend = i * 0.5; // Gradual improvement
      const noise = (Math.random() - 0.5) * 8;
      
      const quality = Math.max(60, Math.min(95, baseQuality + trend + noise));
      const microbialLoad = Math.max(5000, 20000 - (quality - 60) * 200 + (Math.random() - 0.5) * 3000);
      
      data.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        quality: Math.round(quality * 10) / 10,
        microbialLoad: Math.round(microbialLoad),
        isHistorical,
        confidence: isHistorical ? 100 : Math.max(60, 90 - i * 3)
      });
    }
    
    return data;
  };

  const data = generateHistoricalData();
  const historicalData = data.filter(d => d.isHistorical);
  const forecastData = data.filter(d => !d.isHistorical);
  const combinedData = [...historicalData.slice(-2), ...forecastData]; // Include last 2 historical for continuity

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <CardTitle>Quality Score Forecasting</CardTitle>
          </div>
          <CardDescription>
            Predicted quality trends for the next 6 months based on historical patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[60, 95]} />
              <Tooltip 
                formatter={(value, name) => [
                  `${value}${name === 'quality' ? '%' : ' CFU/ml'}`,
                  name === 'quality' ? 'Quality Score' : 'Microbial Load'
                ]}
              />
              <ReferenceLine x="Dec 24" stroke="#ef4444" strokeDasharray="2 2" />
              <Line 
                type="monotone" 
                dataKey="quality" 
                stroke="#2563eb" 
                strokeWidth={2}
                dot={{ fill: '#2563eb', strokeWidth: 2, r: 3 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-800">Forecast Insights</span>
            </div>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Quality scores expected to improve by 3-5% over next 6 months</li>
              <li>• Seasonal dip predicted in summer months (Apr-Jun)</li>
              <li>• Implement preventive measures in March to maintain quality</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            <CardTitle>Microbial Load Trends</CardTitle>
          </div>
          <CardDescription>
            Forecasted microbial load patterns and risk periods
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value.toLocaleString()} CFU/ml`, 'Microbial Load']}
              />
              <ReferenceLine x="Dec 24" stroke="#ef4444" strokeDasharray="2 2" />
              <Line 
                type="monotone" 
                dataKey="microbialLoad" 
                stroke="#dc2626" 
                strokeWidth={2}
                dot={{ fill: '#dc2626', strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm font-medium text-green-800">Low Risk Period</p>
              <p className="text-xs text-green-600">Jan - Mar 2025</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm font-medium text-yellow-800">Medium Risk</p>
              <p className="text-xs text-yellow-600">Apr - May 2025</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm font-medium text-red-800">High Risk Period</p>
              <p className="text-xs text-red-600">Jun - Jul 2025</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeSeriesForecasting;
