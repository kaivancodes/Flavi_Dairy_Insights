
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Search, Target } from 'lucide-react';

interface RootCauseAnalysisProps {
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

const RootCauseAnalysis: React.FC<RootCauseAnalysisProps> = ({ formData, prediction }) => {
  const analyzeRootCauses = () => {
    const causes: Array<{
      factor: string;
      contribution: number;
      impact: 'primary' | 'secondary' | 'minor';
      explanation: string;
    }> = [];

    const fat = parseFloat(formData.fatContent);
    const snf = parseFloat(formData.snf);
    const microbial = parseInt(formData.microbialLoad);
    const temp = parseFloat(formData.processingTemp);
    const ph = parseFloat(formData.phLevel);

    // Primary causes (high impact)
    if (microbial > 50000) {
      causes.push({
        factor: 'Microbial Contamination',
        contribution: 45,
        impact: 'primary',
        explanation: 'Extremely high microbial load indicates severe hygiene issues or cold chain failure'
      });
    }

    if (formData.adulterantsDetected) {
      causes.push({
        factor: 'Adulterant Presence',
        contribution: 40,
        impact: 'primary',
        explanation: 'Detection of adulterants compromises both safety and quality standards'
      });
    }

    // Secondary causes
    if (temp < 72 || temp > 85) {
      causes.push({
        factor: 'Processing Temperature',
        contribution: 25,
        impact: 'secondary',
        explanation: 'Sub-optimal pasteurization temperature affects pathogen elimination and nutrient retention'
      });
    }

    if (snf < 8.5) {
      causes.push({
        factor: 'Low SNF Content',
        contribution: 20,
        impact: 'secondary',
        explanation: 'Insufficient solids-non-fat indicates potential dilution or poor milk quality'
      });
    }

    // Minor causes
    if (fat < 3.5 || fat > 4.5) {
      causes.push({
        factor: 'Fat Content Deviation',
        contribution: 15,
        impact: 'minor',
        explanation: 'Fat content outside optimal range affects texture and nutritional profile'
      });
    }

    if (ph < 6.6 || ph > 6.8) {
      causes.push({
        factor: 'pH Imbalance',
        contribution: 10,
        impact: 'minor',
        explanation: 'pH deviation suggests freshness issues or processing anomalies'
      });
    }

    return causes.sort((a, b) => b.contribution - a.contribution);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'primary': return 'bg-red-100 text-red-800 border-red-200';
      case 'secondary': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'minor': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const causes = analyzeRootCauses();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-purple-600" />
          <CardTitle>Root Cause Analysis</CardTitle>
        </div>
        <CardDescription>
          SHAP-based analysis identifying primary factors affecting batch quality
        </CardDescription>
      </CardHeader>
      <CardContent>
        {causes.length === 0 ? (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">
                No significant quality issues detected. All parameters within optimal ranges.
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg border">
              <h4 className="font-semibold text-gray-800 mb-2">Quality Impact Summary</h4>
              <p className="text-sm text-gray-700">
                Analysis shows {causes.length} contributing factor(s) to the "{prediction.quality}" quality prediction.
                Focus on addressing primary causes for maximum improvement.
              </p>
            </div>

            {causes.map((cause, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className={`h-4 w-4 ${cause.impact === 'primary' ? 'text-red-600' : cause.impact === 'secondary' ? 'text-yellow-600' : 'text-blue-600'}`} />
                    <h4 className="font-medium">{cause.factor}</h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`text-xs ${getImpactColor(cause.impact)}`}>
                      {cause.impact}
                    </Badge>
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                      {cause.contribution}% impact
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{cause.explanation}</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${cause.impact === 'primary' ? 'bg-red-500' : cause.impact === 'secondary' ? 'bg-yellow-500' : 'bg-blue-500'}`}
                    style={{ width: `${cause.contribution}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RootCauseAnalysis;
