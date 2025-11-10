
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RefreshCw, Upload, CheckCircle, AlertCircle, Database } from 'lucide-react';

const AutoRetrainingPipeline: React.FC = () => {
  const [retrainingStatus, setRetrainingStatus] = useState<'idle' | 'running' | 'completed' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);

  const mockModelMetrics = {
    currentVersion: '2.1.4',
    accuracy: 0.94,
    f1Score: 0.91,
    precision: 0.93,
    recall: 0.89,
    lastTraining: '2025-01-10',
    totalBatches: 1247,
    newBatches: 156,
    retrainingThreshold: 100
  };

  const startRetraining = () => {
    setRetrainingStatus('running');
    setProgress(0);
    
    // Simulate retraining process
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setRetrainingStatus('completed');
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      default: return <Database className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-5 w-5 text-purple-600" />
          <CardTitle>Auto-Retraining Pipeline</CardTitle>
        </div>
        <CardDescription>
          Automated model retraining with performance monitoring and version control
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Current Model Status */}
          <div className="p-4 bg-gray-50 rounded-lg border">
            <h4 className="font-semibold mb-3">Current Model Status</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Model Version:</span>
                  <span className="font-medium">v{mockModelMetrics.currentVersion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Accuracy:</span>
                  <span className="font-medium">{(mockModelMetrics.accuracy * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">F1-Score:</span>
                  <span className="font-medium">{(mockModelMetrics.f1Score * 100).toFixed(1)}%</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Training:</span>
                  <span className="font-medium">{mockModelMetrics.lastTraining}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Training Data:</span>
                  <span className="font-medium">{mockModelMetrics.totalBatches.toLocaleString()} batches</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">New Data:</span>
                  <span className="font-medium">{mockModelMetrics.newBatches} batches</span>
                </div>
              </div>
            </div>
          </div>

          {/* Retraining Trigger */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">Retraining Status</h4>
              <Badge className={getStatusColor(retrainingStatus)}>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(retrainingStatus)}
                  <span>{retrainingStatus.charAt(0).toUpperCase() + retrainingStatus.slice(1)}</span>
                </div>
              </Badge>
            </div>

            {mockModelMetrics.newBatches >= mockModelMetrics.retrainingThreshold && retrainingStatus === 'idle' && (
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Retraining Recommended</span>
                </div>
                <p className="text-sm text-yellow-700">
                  {mockModelMetrics.newBatches} new batches available. Threshold of {mockModelMetrics.retrainingThreshold} reached.
                </p>
              </div>
            )}

            {retrainingStatus === 'running' && (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Training Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-gray-600">
                  Training model with {mockModelMetrics.totalBatches + mockModelMetrics.newBatches} total batches...
                </p>
              </div>
            )}

            {retrainingStatus === 'completed' && (
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">Retraining Completed</span>
                </div>
                <div className="text-sm text-green-700 space-y-1">
                  <p>• New model version: v2.1.5</p>
                  <p>• Improved accuracy: 95.2% (+1.2%)</p>
                  <p>• Ready for deployment</p>
                </div>
              </div>
            )}

            <div className="flex space-x-3 mt-4">
              <Button
                onClick={startRetraining}
                disabled={retrainingStatus === 'running'}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${retrainingStatus === 'running' ? 'animate-spin' : ''}`} />
                <span>{retrainingStatus === 'running' ? 'Training...' : 'Start Retraining'}</span>
              </Button>
              
              <Button variant="outline" className="flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>Upload New Data</span>
              </Button>
            </div>
          </div>

          {/* Model Performance History */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-3">Performance History</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>v2.1.4 (Current)</span>
                <span>94.0% accuracy</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>v2.1.3</span>
                <span>92.8% accuracy</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>v2.1.2</span>
                <span>91.5% accuracy</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AutoRetrainingPipeline;
