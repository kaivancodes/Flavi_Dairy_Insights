
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';

interface CostImpactEstimatorProps {
  prediction: {
    quality: 'Good' | 'Acceptable' | 'Poor';
    confidence: number;
  };
  batchSize?: number;
}

const CostImpactEstimator: React.FC<CostImpactEstimatorProps> = ({ prediction, batchSize = 1000 }) => {
  const calculateCostImpact = () => {
    const costs = {
      rawMaterialPerLiter: 45,      // Base cost per liter
      processingCost: 8,            // Processing cost per liter
      rejectionCost: 30000,         // Cost of rejecting entire batch
      reworkCost: 15000,            // Cost of reworking acceptable batch
      downtime: 50000,              // Cost of production downtime
      brandDamage: 100000           // Estimated brand damage from poor quality
    };

    const batchValue = batchSize * (costs.rawMaterialPerLiter + costs.processingCost);
    
    let potentialLoss = 0;
    let savings = 0;
    let riskLevel = 'low';

    switch (prediction.quality) {
      case 'Poor':
        potentialLoss = batchValue + costs.rejectionCost + (costs.downtime * 0.3);
        savings = costs.brandDamage; // Avoiding brand damage
        riskLevel = 'high';
        break;
      case 'Acceptable':
        potentialLoss = costs.reworkCost;
        savings = batchValue * 0.1; // 10% value preservation
        riskLevel = 'medium';
        break;
      case 'Good':
        potentialLoss = 0;
        savings = batchValue * 1.15; // 15% premium for good quality
        riskLevel = 'low';
        break;
    }

    const confidenceAdjustment = prediction.confidence / 100;
    const adjustedPotentialLoss = potentialLoss * confidenceAdjustment;
    const adjustedSavings = savings * confidenceAdjustment;

    return {
      batchValue,
      potentialLoss: adjustedPotentialLoss,
      savings: adjustedSavings,
      netImpact: adjustedSavings - adjustedPotentialLoss,
      riskLevel,
      recommendations: generateRecommendations(prediction, riskLevel, adjustedPotentialLoss)
    };
  };

  const generateRecommendations = (prediction: any, riskLevel: string, potentialLoss: number) => {
    const recommendations = [];

    if (prediction.quality === 'Poor') {
      recommendations.push('Immediate batch rejection recommended');
      recommendations.push('Investigate root cause before processing similar batches');
      recommendations.push('Implement enhanced quality controls');
    } else if (prediction.quality === 'Acceptable') {
      recommendations.push('Consider rework to improve quality grade');
      recommendations.push('Monitor closely during processing');
      recommendations.push('Implement process adjustments');
    } else {
      recommendations.push('Proceed with standard processing');
      recommendations.push('Maintain current quality standards');
      recommendations.push('Document best practices for replication');
    }

    return recommendations;
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const impact = calculateCostImpact();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          <CardTitle>Cost Impact & Loss Prevention Analysis</CardTitle>
        </div>
        <CardDescription>
          Financial implications and risk assessment based on quality prediction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className={`p-4 rounded-lg border-2 ${getRiskColor(impact.riskLevel)}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Risk Level</span>
                <Badge className={getRiskColor(impact.riskLevel)}>
                  {impact.riskLevel.toUpperCase()}
                </Badge>
              </div>
              <div className="text-sm opacity-80">
                Based on prediction confidence and quality grade
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Batch Value:</span>
                <span className="font-medium">₹{impact.batchValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Potential Loss:</span>
                <div className="flex items-center space-x-1">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  <span className="font-medium text-red-600">₹{impact.potentialLoss.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Potential Savings:</span>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-600">₹{impact.savings.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-blue-800">Net Financial Impact</span>
                <div className="flex items-center space-x-1">
                  {impact.netImpact >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`font-bold text-lg ${impact.netImpact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{Math.abs(impact.netImpact).toLocaleString()}
                  </span>
                </div>
              </div>
              <p className="text-sm text-blue-700">
                {impact.netImpact >= 0 ? 'Expected benefit' : 'Expected loss'} from this batch prediction
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Recommendations
              </h4>
              <ul className="text-sm text-gray-700 space-y-1">
                {impact.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CostImpactEstimator;
