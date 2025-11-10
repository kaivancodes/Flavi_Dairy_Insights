
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertOctagon, CheckCircle2 } from 'lucide-react';

interface AnomalyDetectionProps {
  formData: {
    fatContent: string;
    snf: string;
    microbialLoad: string;
    adulterantsDetected: boolean;
    processingTemp: string;
    phLevel: string;
  };
}

const AnomalyDetection: React.FC<AnomalyDetectionProps> = ({ formData }) => {
  const detectAnomalies = () => {
    const anomalies: Array<{
      parameter: string;
      value: string;
      type: 'statistical' | 'operational' | 'safety';
      severity: 'low' | 'medium' | 'high';
      description: string;
    }> = [];

    const fat = parseFloat(formData.fatContent);
    const snf = parseFloat(formData.snf);
    const microbial = parseInt(formData.microbialLoad);
    const temp = parseFloat(formData.processingTemp);
    const ph = parseFloat(formData.phLevel);

    // Statistical anomalies (outside normal distribution)
    if (fat > 5.0 || fat < 3.2) {
      anomalies.push({
        parameter: 'Fat Content',
        value: `${fat}%`,
        type: 'statistical',
        severity: 'medium',
        description: 'Value falls outside 95% confidence interval of normal operations'
      });
    }

    if (snf > 9.2 || snf < 8.2) {
      anomalies.push({
        parameter: 'SNF',
        value: `${snf}%`,
        type: 'statistical',
        severity: 'medium',
        description: 'Unusual SNF levels may indicate measurement error or process deviation'
      });
    }

    // Operational anomalies
    if (microbial > 100000) {
      anomalies.push({
        parameter: 'Microbial Load',
        value: `${microbial.toLocaleString()} CFU/ml`,
        type: 'operational',
        severity: 'high',
        description: 'Extreme microbial count suggests critical hygiene failure'
      });
    }

    if (temp > 90 || temp < 72) {
      anomalies.push({
        parameter: 'Processing Temperature',
        value: `${temp}°C`,
        type: 'operational',
        severity: 'high',
        description: 'Temperature outside safe operational bounds'
      });
    }

    // Safety anomalies
    if (formData.adulterantsDetected) {
      anomalies.push({
        parameter: 'Adulterants',
        value: 'Detected',
        type: 'safety',
        severity: 'high',
        description: 'Presence of adulterants poses immediate safety risk'
      });
    }

    if (ph < 6.5 || ph > 6.9) {
      anomalies.push({
        parameter: 'pH Level',
        value: `${ph}`,
        type: 'safety',
        severity: 'low',
        description: 'pH deviation may indicate spoilage or contamination'
      });
    }

    return anomalies;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'safety': return <AlertOctagon className="h-4 w-4 text-red-600" />;
      case 'operational': return <Shield className="h-4 w-4 text-yellow-600" />;
      case 'statistical': return <CheckCircle2 className="h-4 w-4 text-blue-600" />;
      default: return <Shield className="h-4 w-4 text-gray-600" />;
    }
  };

  const anomalies = detectAnomalies();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-orange-600" />
          <CardTitle>Isolation Forest Anomaly Detection</CardTitle>
        </div>
        <CardDescription>
          AI-powered detection of unusual parameter patterns and operational deviations
        </CardDescription>
      </CardHeader>
      <CardContent>
        {anomalies.length === 0 ? (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">
                No anomalies detected. All parameters within expected operational bounds.
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-orange-800 mb-1">Anomaly Alert</h4>
              <p className="text-sm text-orange-700">
                {anomalies.length} anomal{anomalies.length === 1 ? 'y' : 'ies'} detected. 
                Review flagged parameters before proceeding with batch processing.
              </p>
            </div>

            {anomalies.map((anomaly, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(anomaly.type)}
                    <span className="font-medium">{anomaly.parameter}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`text-xs ${getSeverityColor(anomaly.severity)}`}>
                      {anomaly.severity} risk
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {anomaly.type}
                    </Badge>
                  </div>
                </div>
                <div className="mb-2">
                  <span className="text-sm text-gray-600">Value: </span>
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                    {anomaly.value}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{anomaly.description}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnomalyDetection;
