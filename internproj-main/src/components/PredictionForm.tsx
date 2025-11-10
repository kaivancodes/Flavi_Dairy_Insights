import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, XCircle, Download } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import AIExplainability from './AIExplainability';
import OutlierDetection from './OutlierDetection';
import EconomicImpact from './EconomicImpact';
import RecommendationEngine from './RecommendationEngine';
import UserFeedback from './UserFeedback';
import RootCauseAnalysis from './RootCauseAnalysis';
import AnomalyDetection from './AnomalyDetection';
import CostImpactEstimator from './CostImpactEstimator';

interface PredictionResult {
  quality: 'Good' | 'Acceptable' | 'Poor';
  confidence: number;
}

const PredictionForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  
  const [formData, setFormData] = useState({
    fatContent: '',
    snf: '',
    microbialLoad: '',
    adulterantsDetected: false,
    processingTemp: '',
    phLevel: ''
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const { fatContent, snf, microbialLoad, processingTemp, phLevel } = formData;
    
    if (!fatContent || !snf || !microbialLoad || !processingTemp || !phLevel) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return false;
    }

    const fat = parseFloat(fatContent);
    const snfVal = parseFloat(snf);
    const microbial = parseInt(microbialLoad);
    const temp = parseFloat(processingTemp);
    const ph = parseFloat(phLevel);

    if (fat < 3.0 || fat > 5.5) {
      toast({
        title: "Validation Error",
        description: "Fat content must be between 3.0% and 5.5%.",
        variant: "destructive"
      });
      return false;
    }

    if (snfVal < 8.0 || snfVal > 9.5) {
      toast({
        title: "Validation Error",
        description: "SNF must be between 8.0% and 9.5%.",
        variant: "destructive"
      });
      return false;
    }

    if (microbial < 1000 || microbial > 500000) {
      toast({
        title: "Validation Error",
        description: "Microbial load must be between 1,000 and 500,000 CFU/ml.",
        variant: "destructive"
      });
      return false;
    }

    if (temp < 70.0 || temp > 95.0) {
      toast({
        title: "Validation Error",
        description: "Processing temperature must be between 70.0°C and 95.0°C.",
        variant: "destructive"
      });
      return false;
    }

    if (ph < 6.5 || ph > 6.9) {
      toast({
        title: "Validation Error",
        description: "pH level must be between 6.5 and 6.9.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const simulatePrediction = (data: typeof formData): PredictionResult => {
    // Simulate the Python model's prediction logic
    let score = 0;
    const fat = parseFloat(data.fatContent);
    const snfVal = parseFloat(data.snf);
    const microbial = parseInt(data.microbialLoad);
    const temp = parseFloat(data.processingTemp);
    const ph = parseFloat(data.phLevel);

    if (fat >= 3.5 && fat <= 4.5) score += 1;
    if (snfVal >= 8.5 && snfVal <= 9.0) score += 1;
    if (microbial < 10000) score += 1;
    if (!data.adulterantsDetected) score += 2;
    if (temp >= 72 && temp <= 85) score += 1;
    if (ph >= 6.6 && ph <= 6.8) score += 1;

    if (microbial > 50000 || data.adulterantsDetected) score -= 5;

    let quality: 'Good' | 'Acceptable' | 'Poor';
    let confidence: number;

    if (score >= 4) {
      quality = 'Good';
      confidence = Math.min(95, 80 + score * 3);
    } else if (score >= 2) {
      quality = 'Acceptable';
      confidence = Math.min(85, 70 + score * 2);
    } else {
      quality = 'Poor';
      confidence = Math.min(90, 60 + Math.abs(score) * 5);
    }

    return { quality, confidence: Math.round(confidence) };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const prediction = simulatePrediction(formData);
      setResult(prediction);
      setLoading(false);
      
      toast({
        title: "Prediction Complete",
        description: `Batch quality predicted as ${prediction.quality} with ${prediction.confidence}% confidence.`
      });
    }, 1500);
  };

  const exportReport = () => {
    if (!result) return;
    
    const reportData = {
      timestamp: new Date().toISOString(),
      inputs: formData,
      prediction: result
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `batch_prediction_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    toast({
      title: "Report Exported",
      description: "Prediction report has been downloaded successfully."
    });
  };

  const getQualityIcon = (quality: string) => {
    switch (quality) {
      case 'Good':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'Acceptable':
        return <AlertCircle className="h-6 w-6 text-yellow-600" />;
      case 'Poor':
        return <XCircle className="h-6 w-6 text-red-600" />;
      default:
        return null;
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'Good':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Acceptable':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Poor':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Outlier Detection - Show before form submission */}
      {(formData.fatContent || formData.snf || formData.microbialLoad || formData.processingTemp || formData.phLevel) && (
        <OutlierDetection formData={formData} />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Input Parameters</CardTitle>
          <CardDescription>
            Enter the raw material and processing parameters for quality prediction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fatContent">Fat Content (%)</Label>
                <Input
                  id="fatContent"
                  type="number"
                  step="0.1"
                  min="3.0"
                  max="5.5"
                  placeholder="e.g., 4.2"
                  value={formData.fatContent}
                  onChange={(e) => handleInputChange('fatContent', e.target.value)}
                  className="w-full"
                />
                <p className="text-sm text-gray-500">Range: 3.0 - 5.5%</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="snf">SNF (%)</Label>
                <Input
                  id="snf"
                  type="number"
                  step="0.1"
                  min="8.0"
                  max="9.5"
                  placeholder="e.g., 8.8"
                  value={formData.snf}
                  onChange={(e) => handleInputChange('snf', e.target.value)}
                  className="w-full"
                />
                <p className="text-sm text-gray-500">Range: 8.0 - 9.5%</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="microbialLoad">Microbial Load (CFU/ml)</Label>
                <Input
                  id="microbialLoad"
                  type="number"
                  min="1000"
                  max="500000"
                  placeholder="e.g., 15000"
                  value={formData.microbialLoad}
                  onChange={(e) => handleInputChange('microbialLoad', e.target.value)}
                  className="w-full"
                />
                <p className="text-sm text-gray-500">Range: 1,000 - 500,000 CFU/ml</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="processingTemp">Processing Temperature (°C)</Label>
                <Input
                  id="processingTemp"
                  type="number"
                  step="0.1"
                  min="70.0"
                  max="95.0"
                  placeholder="e.g., 78.5"
                  value={formData.processingTemp}
                  onChange={(e) => handleInputChange('processingTemp', e.target.value)}
                  className="w-full"
                />
                <p className="text-sm text-gray-500">Range: 70.0 - 95.0°C</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phLevel">pH Level</Label>
                <Input
                  id="phLevel"
                  type="number"
                  step="0.01"
                  min="6.5"
                  max="6.9"
                  placeholder="e.g., 6.7"
                  value={formData.phLevel}
                  onChange={(e) => handleInputChange('phLevel', e.target.value)}
                  className="w-full"
                />
                <p className="text-sm text-gray-500">Range: 6.5 - 6.9</p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="adulterants"
                  checked={formData.adulterantsDetected}
                  onCheckedChange={(checked) => handleInputChange('adulterantsDetected', !!checked)}
                />
                <Label htmlFor="adulterants" className="text-sm font-medium">
                  Adulterants Detected
                </Label>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Analyzing...' : 'Predict Quality'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <>
          <Card className={`border-2 ${getQualityColor(result.quality)}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getQualityIcon(result.quality)}
                  <div>
                    <CardTitle className="text-xl">Prediction Result</CardTitle>
                    <CardDescription>
                      Based on the provided inputs, the system predicts the batch quality as:
                    </CardDescription>
                  </div>
                </div>
                <Button
                  onClick={exportReport}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Export Report</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Predicted Quality:</span>
                  <span className={`text-xl font-bold ${result.quality === 'Good' ? 'text-green-600' : result.quality === 'Acceptable' ? 'text-yellow-600' : 'text-red-600'}`}>
                    {result.quality}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Confidence:</span>
                  <span className="text-xl font-bold text-gray-700">
                    {result.confidence}% Certainty
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      result.quality === 'Good' ? 'bg-green-500' : 
                      result.quality === 'Acceptable' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${result.confidence}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <EconomicImpact prediction={result} />
          <RecommendationEngine formData={formData} currentPrediction={result} />
          <AIExplainability formData={formData} prediction={result} />
          <UserFeedback prediction={result} />
          <RootCauseAnalysis formData={formData} prediction={result} />
          <AnomalyDetection formData={formData} />
          <CostImpactEstimator prediction={result} />
        </>
      )}
    </div>
  );
};

export default PredictionForm;
