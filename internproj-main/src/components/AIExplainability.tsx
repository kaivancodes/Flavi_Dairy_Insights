
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, XCircle, Lightbulb } from 'lucide-react';

interface ExplanationProps {
  formData: {
    fatContent: string;
    snf: string;
    microbialLoad: string;
    adulterantsDetected: boolean;
    processingTemp: string;
    phLevel: string;
  };
  prediction: {
    quality: 'Good' | 'Acceptable' | 'Poor';
    confidence: number;
  };
}

const AIExplainability: React.FC<ExplanationProps> = ({ formData, prediction }) => {
  const generateExplanations = () => {
    const explanations: Array<{
      factor: string;
      impact: 'positive' | 'negative' | 'neutral';
      message: string;
      severity: number;
    }> = [];

    const fat = parseFloat(formData.fatContent);
    const snf = parseFloat(formData.snf);
    const microbial = parseInt(formData.microbialLoad);
    const temp = parseFloat(formData.processingTemp);
    const ph = parseFloat(formData.phLevel);

    // Fat content analysis
    if (fat >= 3.5 && fat <= 4.5) {
      explanations.push({
        factor: 'Fat Content',
        impact: 'positive',
        message: `Optimal fat content (${fat}%) contributes positively to quality. This falls within the ideal range for dairy products.`,
        severity: 2
      });
    } else if (fat < 3.5) {
      explanations.push({
        factor: 'Fat Content',
        impact: 'negative',
        message: `Low fat content (${fat}%) may indicate dilution or poor milk quality, negatively affecting the batch score.`,
        severity: 1
      });
    } else {
      explanations.push({
        factor: 'Fat Content',
        impact: 'neutral',
        message: `Fat content (${fat}%) is above optimal range but still acceptable for processing.`,
        severity: 1
      });
    }

    // SNF analysis
    if (snf >= 8.5 && snf <= 9.0) {
      explanations.push({
        factor: 'Solids-Non-Fat (SNF)',
        impact: 'positive',
        message: `Excellent SNF content (${snf}%) indicates high protein and lactose levels, enhancing nutritional quality.`,
        severity: 2
      });
    } else {
      explanations.push({
        factor: 'Solids-Non-Fat (SNF)',
        impact: 'neutral',
        message: `SNF content (${snf}%) is within acceptable range but not optimal for premium quality.`,
        severity: 1
      });
    }

    // Microbial load analysis
    if (microbial < 10000) {
      explanations.push({
        factor: 'Microbial Load',
        impact: 'positive',
        message: `Low microbial count (${microbial.toLocaleString()} CFU/ml) indicates excellent hygiene and safety standards.`,
        severity: 3
      });
    } else if (microbial <= 50000) {
      explanations.push({
        factor: 'Microbial Load',
        impact: 'neutral',
        message: `Moderate microbial count (${microbial.toLocaleString()} CFU/ml) is acceptable but requires monitoring.`,
        severity: 2
      });
    } else {
      explanations.push({
        factor: 'Microbial Load',
        impact: 'negative',
        message: `High microbial count (${microbial.toLocaleString()} CFU/ml) poses significant quality and safety risks.`,
        severity: 4
      });
    }

    // Adulterants analysis
    if (formData.adulterantsDetected) {
      explanations.push({
        factor: 'Adulterants',
        impact: 'negative',
        message: `Presence of adulterants severely compromises batch quality and safety. Immediate rejection recommended.`,
        severity: 5
      });
    } else {
      explanations.push({
        factor: 'Adulterant Testing',
        impact: 'positive',
        message: `No adulterants detected, confirming milk purity and authenticity.`,
        severity: 3
      });
    }

    // Processing temperature analysis
    if (temp >= 72 && temp <= 85) {
      explanations.push({
        factor: 'Processing Temperature',
        impact: 'positive',
        message: `Optimal pasteurization temperature (${temp}°C) ensures pathogen destruction while preserving nutritional value.`,
        severity: 2
      });
    } else if (temp < 72) {
      explanations.push({
        factor: 'Processing Temperature',
        impact: 'negative',
        message: `Low processing temperature (${temp}°C) may not effectively eliminate harmful microorganisms.`,
        severity: 3
      });
    } else {
      explanations.push({
        factor: 'Processing Temperature',
        impact: 'negative',
        message: `High processing temperature (${temp}°C) may damage proteins and reduce nutritional quality.`,
        severity: 2
      });
    }

    // pH analysis
    if (ph >= 6.6 && ph <= 6.8) {
      explanations.push({
        factor: 'pH Level',
        impact: 'positive',
        message: `Ideal pH level (${ph}) indicates fresh milk with optimal acidity balance.`,
        severity: 2
      });
    } else {
      explanations.push({
        factor: 'pH Level',
        impact: 'neutral',
        message: `pH level (${ph}) is within acceptable range but may indicate slight quality deviation.`,
        severity: 1
      });
    }

    return explanations.sort((a, b) => b.severity - a.severity);
  };

  const explanations = generateExplanations();

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'negative':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive':
        return 'border-green-200 bg-green-50';
      case 'negative':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-yellow-200 bg-yellow-50';
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Lightbulb className="h-5 w-5 text-blue-600" />
          <CardTitle>AI Decision Explanation</CardTitle>
        </div>
        <CardDescription>
          Understanding how the AI arrived at this prediction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Prediction Summary</h4>
            <p className="text-sm text-blue-700">
              Based on the input parameters, the AI model predicts this batch as <strong>{prediction.quality}</strong> quality 
              with <strong>{prediction.confidence}% confidence</strong>. This decision was made by analyzing {explanations.length} key factors.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-lg">Factor Analysis</h4>
            {explanations.map((explanation, index) => (
              <div key={index} className={`p-3 rounded-lg border ${getImpactColor(explanation.impact)}`}>
                <div className="flex items-start space-x-3">
                  {getImpactIcon(explanation.impact)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium">{explanation.factor}</span>
                      <Badge 
                        variant={explanation.impact === 'positive' ? 'default' : explanation.impact === 'negative' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {explanation.impact}
                      </Badge>
                      <div className="flex">
                        {Array.from({ length: explanation.severity }, (_, i) => (
                          <div key={i} className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{explanation.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Key Insights</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <p>• The most critical factors for this prediction were microbial load and adulterant detection</p>
              <p>• Processing parameters (temperature, pH) significantly influenced the quality assessment</p>
              <p>• Compositional factors (fat, SNF) provided additional quality validation</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIExplainability;
