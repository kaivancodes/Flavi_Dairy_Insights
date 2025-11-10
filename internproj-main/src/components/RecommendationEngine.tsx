
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Target, ArrowRight } from 'lucide-react';

interface RecommendationEngineProps {
  formData: {
    fatContent: string;
    snf: string;
    microbialLoad: string;
    adulterantsDetected: boolean;
    processingTemp: string;
    phLevel: string;
  };
  currentPrediction: {
    quality: 'Good' | 'Acceptable' | 'Poor';
    confidence: number;
  };
}

const RecommendationEngine: React.FC<RecommendationEngineProps> = ({ formData, currentPrediction }) => {
  const generateRecommendations = () => {
    const recommendations: Array<{
      parameter: string;
      currentValue: string;
      recommendedValue: string;
      rationale: string;
      impact: 'high' | 'medium' | 'low';
    }> = [];

    const fat = parseFloat(formData.fatContent);
    const snf = parseFloat(formData.snf);
    const microbial = parseInt(formData.microbialLoad);
    const temp = parseFloat(formData.processingTemp);
    const ph = parseFloat(formData.phLevel);

    // Fat content optimization
    if (fat < 3.8 || fat > 4.3) {
      recommendations.push({
        parameter: 'Fat Content',
        currentValue: `${fat}%`,
        recommendedValue: '4.0-4.2%',
        rationale: 'Optimal fat content improves texture and nutritional value',
        impact: 'medium'
      });
    }

    // SNF optimization
    if (snf < 8.6 || snf > 8.9) {
      recommendations.push({
        parameter: 'SNF',
        currentValue: `${snf}%`,
        recommendedValue: '8.7-8.8%',
        rationale: 'Target SNF range maximizes protein and lactose content',
        impact: 'medium'
      });
    }

    // Microbial load critical recommendation
    if (microbial > 15000) {
      recommendations.push({
        parameter: 'Microbial Load',
        currentValue: `${microbial.toLocaleString()} CFU/ml`,
        recommendedValue: '< 10,000 CFU/ml',
        rationale: 'Reduce microbial load through better hygiene practices and cold chain management',
        impact: 'high'
      });
    }

    // Processing temperature optimization
    if (temp < 75 || temp > 82) {
      recommendations.push({
        parameter: 'Processing Temperature',
        currentValue: `${temp}°C`,
        recommendedValue: '78-80°C',
        rationale: 'Optimal pasteurization temperature ensures safety while preserving nutrients',
        impact: 'high'
      });
    }

    // pH optimization
    if (ph < 6.65 || ph > 6.75) {
      recommendations.push({
        parameter: 'pH Level',
        currentValue: `${ph}`,
        recommendedValue: '6.7-6.8',
        rationale: 'Target pH range indicates optimal freshness and processing conditions',
        impact: 'low'
      });
    }

    // Adulterants check
    if (formData.adulterantsDetected) {
      recommendations.push({
        parameter: 'Adulterant Control',
        currentValue: 'Detected',
        recommendedValue: 'Zero tolerance',
        rationale: 'Implement stricter supplier verification and incoming material testing',
        impact: 'high'
      });
    }

    return recommendations;
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const recommendations = generateRecommendations();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Lightbulb className="h-5 w-5 text-yellow-600" />
          <CardTitle>Optimization Recommendations</CardTitle>
        </div>
        <CardDescription>
          Suggested parameter adjustments to improve batch quality
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 ? (
          <div className="flex items-center space-x-2 p-4 bg-green-50 rounded-lg border border-green-200">
            <Target className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">
              All parameters are within optimal ranges. No adjustments needed.
            </span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Current Quality:</strong> {currentPrediction.quality} ({currentPrediction.confidence}% confidence)
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Implementing these recommendations could improve quality to "Good" with higher confidence.
              </p>
            </div>
            
            {recommendations.map((rec, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">{rec.parameter}</h4>
                  <Badge className={`text-xs ${getImpactColor(rec.impact)}`}>
                    {rec.impact} impact
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2 mb-2 text-sm">
                  <span className="text-gray-600">Current:</span>
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">{rec.currentValue}</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-600">Target:</span>
                  <span className="font-mono bg-green-100 px-2 py-1 rounded text-green-800">{rec.recommendedValue}</span>
                </div>
                
                <p className="text-sm text-gray-700">{rec.rationale}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendationEngine;
