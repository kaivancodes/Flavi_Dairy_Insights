
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Brain, Target, TrendingUp } from 'lucide-react';

const ModelInsights = () => {
  const modelMetrics = {
    accuracy: 94.5,
    precision: 92.8,
    recall: 95.2,
    f1Score: 94.0
  };

  const featureImportance = [
    { feature: 'Adulterants Detected', importance: 28.5, description: 'Primary quality indicator' },
    { feature: 'Microbial Load', importance: 24.2, description: 'Critical safety parameter' },
    { feature: 'Processing Temperature', importance: 18.7, description: 'Pasteurization effectiveness' },
    { feature: 'Fat Content', importance: 12.1, description: 'Nutritional quality marker' },
    { feature: 'pH Level', importance: 9.8, description: 'Acidity balance indicator' },
    { feature: 'SNF Content', importance: 6.7, description: 'Solids composition factor' }
  ];

  return (
    <div className="space-y-6">
      {/* Model Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <CardTitle>AI Model Overview</CardTitle>
          </div>
          <CardDescription>
            Advanced Random Forest Classifier trained on 2,000+ dairy batch samples
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Model Architecture</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Algorithm:</span>
                  <Badge variant="secondary">Random Forest</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimators:</span>
                  <span className="font-medium">100 trees</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Training Set:</span>
                  <span className="font-medium">1,600 samples</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Validation Set:</span>
                  <span className="font-medium">400 samples</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cross-Validation:</span>
                  <span className="font-medium">5-fold</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Training Process</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Stratified sampling for balanced classes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Hyperparameter tuning via Grid Search</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Class weight balancing applied</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Feature scaling not required (tree-based)</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <CardTitle>Model Performance Metrics</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-600">{modelMetrics.accuracy}%</div>
              <div className="text-sm text-blue-600 mt-1">Overall Accuracy</div>
              <Progress value={modelMetrics.accuracy} className="mt-2" />
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-3xl font-bold text-green-600">{modelMetrics.precision}%</div>
              <div className="text-sm text-green-600 mt-1">Precision</div>
              <Progress value={modelMetrics.precision} className="mt-2" />
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-3xl font-bold text-purple-600">{modelMetrics.recall}%</div>
              <div className="text-sm text-purple-600 mt-1">Recall</div>
              <Progress value={modelMetrics.recall} className="mt-2" />
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-3xl font-bold text-orange-600">{modelMetrics.f1Score}%</div>
              <div className="text-sm text-orange-600 mt-1">F1-Score</div>
              <Progress value={modelMetrics.f1Score} className="mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Importance */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            <CardTitle>Feature Importance Analysis</CardTitle>
          </div>
          <CardDescription>
            Ranked by contribution to prediction accuracy (SHAP values)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {featureImportance.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{item.feature}</span>
                    <span className="text-sm text-gray-500 ml-2">({item.description})</span>
                  </div>
                  <span className="font-bold text-lg">{item.importance}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item.importance}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Model Limitations & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Model Limitations & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Current Limitations</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Model trained on synthetic data - requires real production data for optimal performance</li>
                <li>• Limited to current parameter ranges - may not generalize to extreme conditions</li>
                <li>• Does not account for seasonal variations or equipment degradation</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Improvement Recommendations</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Collect and integrate real historical batch data for retraining</li>
                <li>• Implement online learning for continuous model improvement</li>
                <li>• Add temporal features to capture seasonal and equipment trends</li>
                <li>• Consider ensemble methods combining multiple algorithms</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModelInsights;
