
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface EconomicImpactProps {
  prediction: {
    quality: 'Good' | 'Acceptable' | 'Poor';
    confidence: number;
  };
  batchSize?: number;
}

const EconomicImpact: React.FC<EconomicImpactProps> = ({ prediction, batchSize = 1000 }) => {
  const calculateEconomicImpact = () => {
    const costPerLiter = 50; // Base cost per liter
    const premiumMultiplier = { Good: 1.2, Acceptable: 1.0, Poor: 0.6 };
    const rejectionCost = 25000; // Cost of rejecting a batch
    
    const baseValue = batchSize * costPerLiter;
    const qualityAdjustedValue = baseValue * premiumMultiplier[prediction.quality];
    const potentialSavings = prediction.quality === 'Poor' ? rejectionCost : 0;
    
    return {
      baseValue,
      qualityAdjustedValue,
      potentialSavings,
      netImpact: qualityAdjustedValue - baseValue + potentialSavings,
      recommendation: getRecommendation(prediction.quality)
    };
  };

  const getRecommendation = (quality: string) => {
    switch (quality) {
      case 'Good':
        return 'Process immediately for premium pricing';
      case 'Acceptable':
        return 'Process as standard grade product';
      case 'Poor':
        return 'Consider rejection to avoid downstream costs';
      default:
        return '';
    }
  };

  const impact = calculateEconomicImpact();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          <CardTitle>Economic Impact Analysis</CardTitle>
        </div>
        <CardDescription>
          Financial implications of this quality prediction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Batch Size:</span>
              <span className="font-medium">{batchSize.toLocaleString()} L</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Base Value:</span>
              <span className="font-medium">₹{impact.baseValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Quality Adjusted:</span>
              <span className="font-medium">₹{impact.qualityAdjustedValue.toLocaleString()}</span>
            </div>
            {impact.potentialSavings > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Rejection Savings:</span>
                <span className="font-medium text-green-600">₹{impact.potentialSavings.toLocaleString()}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="p-3 rounded-lg border-2 border-dashed border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Net Impact:</span>
                <div className="flex items-center space-x-1">
                  {impact.netImpact >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`font-bold ${impact.netImpact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{Math.abs(impact.netImpact).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-800 mb-1">Recommendation:</p>
              <p className="text-sm text-blue-700">{impact.recommendation}</p>
            </div>
            
            <Badge 
              variant={prediction.quality === 'Good' ? 'default' : prediction.quality === 'Acceptable' ? 'secondary' : 'destructive'}
              className="w-full justify-center"
            >
              Quality Grade: {prediction.quality}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EconomicImpact;
