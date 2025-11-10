
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface OutlierDetectionProps {
  formData: {
    fatContent: string;
    snf: string;
    microbialLoad: string;
    processingTemp: string;
    phLevel: string;
  };
}

const OutlierDetection: React.FC<OutlierDetectionProps> = ({ formData }) => {
  const detectOutliers = () => {
    const outliers: Array<{
      parameter: string;
      value: string;
      issue: string;
      severity: 'warning' | 'error';
    }> = [];

    const fat = parseFloat(formData.fatContent);
    const snf = parseFloat(formData.snf);
    const microbial = parseInt(formData.microbialLoad);
    const temp = parseFloat(formData.processingTemp);
    const ph = parseFloat(formData.phLevel);

    // Check for outliers and unusual combinations
    if (fat < 3.0 || fat > 5.5) {
      outliers.push({
        parameter: 'Fat Content',
        value: `${fat}%`,
        issue: 'Outside validated range (3.0-5.5%)',
        severity: 'error'
      });
    }

    if (snf < 8.0 || snf > 9.5) {
      outliers.push({
        parameter: 'SNF',
        value: `${snf}%`,
        issue: 'Outside validated range (8.0-9.5%)',
        severity: 'error'
      });
    }

    if (microbial > 100000) {
      outliers.push({
        parameter: 'Microbial Load',
        value: `${microbial.toLocaleString()} CFU/ml`,
        issue: 'Extremely high microbial count detected',
        severity: 'error'
      });
    }

    if (temp < 70 || temp > 95) {
      outliers.push({
        parameter: 'Processing Temperature',
        value: `${temp}°C`,
        issue: 'Outside safe processing range (70-95°C)',
        severity: 'error'
      });
    }

    if (ph < 6.5 || ph > 6.9) {
      outliers.push({
        parameter: 'pH Level',
        value: `${ph}`,
        issue: 'Outside normal pH range (6.5-6.9)',
        severity: 'warning'
      });
    }

    // Check for unusual combinations
    if (fat > 4.5 && microbial > 50000) {
      outliers.push({
        parameter: 'Fat-Microbial Combination',
        value: `Fat: ${fat}%, Microbial: ${microbial.toLocaleString()}`,
        issue: 'High fat with high microbial load - unusual pattern',
        severity: 'warning'
      });
    }

    return outliers;
  };

  const outliers = detectOutliers();

  if (outliers.length === 0) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">All parameters within normal ranges</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <CardTitle className="text-yellow-800">Anomaly Detection</CardTitle>
        </div>
        <CardDescription className="text-yellow-700">
          Unusual parameter values detected
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {outliers.map((outlier, index) => (
            <div key={index} className="flex items-start justify-between p-3 bg-white rounded-lg border">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium">{outlier.parameter}</span>
                  <Badge variant={outlier.severity === 'error' ? 'destructive' : 'secondary'}>
                    {outlier.severity}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">Value: {outlier.value}</p>
                <p className="text-sm text-gray-700">{outlier.issue}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OutlierDetection;
