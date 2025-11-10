
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, XCircle, BarChart3 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface BatchResult {
  batchNumber: number;
  fatContent: number;
  snf: number;
  microbialLoad: number;
  adulterantsDetected: boolean;
  processingTemp: number;
  phLevel: number;
  predictedQuality: 'Good' | 'Acceptable' | 'Poor';
  confidence: number;
}

const ExtrapolationForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BatchResult[]>([]);
  const [summary, setSummary] = useState<{good: number, acceptable: number, poor: number} | null>(null);
  
  const [formData, setFormData] = useState({
    numberOfBatches: '10',
    baselineFatContent: '4.0',
    variability: 'medium'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateVariation = (baseline: number, variability: string, min: number, max: number): number => {
    const variabilityFactors = {
      low: 0.05,
      medium: 0.15,
      high: 0.25
    };
    
    const factor = variabilityFactors[variability as keyof typeof variabilityFactors] || 0.15;
    const variation = (Math.random() - 0.5) * 2 * factor * baseline;
    return Math.max(min, Math.min(max, baseline + variation));
  };

  const simulateBatchQuality = (batch: Omit<BatchResult, 'predictedQuality' | 'confidence' | 'batchNumber'>): { quality: 'Good' | 'Acceptable' | 'Poor', confidence: number } => {
    let score = 0;
    
    if (batch.fatContent >= 3.5 && batch.fatContent <= 4.5) score += 1;
    if (batch.snf >= 8.5 && batch.snf <= 9.0) score += 1;
    if (batch.microbialLoad < 10000) score += 1;
    if (!batch.adulterantsDetected) score += 2;
    if (batch.processingTemp >= 72 && batch.processingTemp <= 85) score += 1;
    if (batch.phLevel >= 6.6 && batch.phLevel <= 6.8) score += 1;

    if (batch.microbialLoad > 50000 || batch.adulterantsDetected) score -= 5;

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

  const generateExtrapolation = () => {
    const numberOfBatches = parseInt(formData.numberOfBatches);
    const baselineFat = parseFloat(formData.baselineFatContent);
    const variability = formData.variability;

    const batches: BatchResult[] = [];
    
    for (let i = 1; i <= numberOfBatches; i++) {
      const batch = {
        fatContent: generateVariation(baselineFat, variability, 3.0, 5.5),
        snf: generateVariation(8.7, variability, 8.0, 9.5),
        microbialLoad: Math.round(Math.exp(Math.random() * 5 + 5)), // Log-normal distribution
        adulterantsDetected: Math.random() < 0.02, // 2% chance
        processingTemp: generateVariation(80, variability, 70, 95),
        phLevel: generateVariation(6.7, variability, 6.5, 6.9)
      };

      const prediction = simulateBatchQuality(batch);
      
      batches.push({
        batchNumber: i,
        ...batch,
        predictedQuality: prediction.quality,
        confidence: prediction.confidence
      });
    }

    return batches;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const numberOfBatches = parseInt(formData.numberOfBatches);
    const baselineFat = parseFloat(formData.baselineFatContent);

    if (numberOfBatches < 1 || numberOfBatches > 50) {
      toast({
        title: "Validation Error",
        description: "Number of batches must be between 1 and 50.",
        variant: "destructive"
      });
      return;
    }

    if (baselineFat < 3.0 || baselineFat > 5.5) {
      toast({
        title: "Validation Error",
        description: "Baseline fat content must be between 3.0% and 5.5%.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const extrapolatedResults = generateExtrapolation();
      setResults(extrapolatedResults);
      
      // Calculate summary
      const summary = extrapolatedResults.reduce(
        (acc, batch) => {
          acc[batch.predictedQuality.toLowerCase() as keyof typeof acc]++;
          return acc;
        },
        { good: 0, acceptable: 0, poor: 0 }
      );
      setSummary(summary);
      
      setLoading(false);
      
      toast({
        title: "Extrapolation Complete",
        description: `Generated predictions for ${extrapolatedResults.length} future batches.`
      });
    }, 2000);
  };

  const getQualityIcon = (quality: string) => {
    switch (quality) {
      case 'Good':
        return <CheckCircle className="h-4 w-4" />;
      case 'Acceptable':
        return <AlertCircle className="h-4 w-4" />;
      case 'Poor':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getQualityBadge = (quality: 'Good' | 'Acceptable' | 'Poor') => {
    const variants = {
      Good: 'bg-green-100 text-green-800 border-green-200',
      Acceptable: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      Poor: 'bg-red-100 text-red-800 border-red-200'
    };
    
    return (
      <Badge className={variants[quality]}>
        <div className="flex items-center space-x-1">
          {getQualityIcon(quality)}
          <span>{quality}</span>
        </div>
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Extrapolation Parameters</CardTitle>
          <CardDescription>
            Configure parameters to simulate future batch scenarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="numberOfBatches">Number of Future Batches to Simulate</Label>
                <Input
                  id="numberOfBatches"
                  type="number"
                  min="1"
                  max="50"
                  value={formData.numberOfBatches}
                  onChange={(e) => handleInputChange('numberOfBatches', e.target.value)}
                  className="w-full"
                />
                <p className="text-sm text-gray-500">Range: 1 - 50 batches</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="baselineFatContent">Baseline Fat Content (%)</Label>
                <Input
                  id="baselineFatContent"
                  type="number"
                  step="0.1"
                  min="3.0"
                  max="5.5"
                  value={formData.baselineFatContent}
                  onChange={(e) => handleInputChange('baselineFatContent', e.target.value)}
                  className="w-full"
                />
                <p className="text-sm text-gray-500">Starting point for extrapolation</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="variability">Expected Variability</Label>
                <Select value={formData.variability} onValueChange={(value) => handleInputChange('variability', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select variability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (±5%)</SelectItem>
                    <SelectItem value="medium">Medium (±15%)</SelectItem>
                    <SelectItem value="high">High (±25%)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">Parameter variation range</p>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? 'Generating Extrapolation...' : 'Generate Extrapolation'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {summary && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <CardTitle>Quality Distribution Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600">{summary.good}</div>
                <div className="text-sm text-green-600">Good Quality</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-600">{summary.acceptable}</div>
                <div className="text-sm text-yellow-600">Acceptable Quality</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="text-2xl font-bold text-red-600">{summary.poor}</div>
                <div className="text-sm text-red-600">Poor Quality</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Extrapolation Results</CardTitle>
            <CardDescription>
              Predicted quality for {results.length} future batches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch #</TableHead>
                    <TableHead>Fat Content</TableHead>
                    <TableHead>SNF</TableHead>
                    <TableHead>Microbial Load</TableHead>
                    <TableHead>Adulterants</TableHead>
                    <TableHead>Processing Temp</TableHead>
                    <TableHead>pH Level</TableHead>
                    <TableHead>Predicted Quality</TableHead>
                    <TableHead>Confidence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((batch) => (
                    <TableRow key={batch.batchNumber}>
                      <TableCell className="font-medium">{batch.batchNumber}</TableCell>
                      <TableCell>{batch.fatContent.toFixed(2)}%</TableCell>
                      <TableCell>{batch.snf.toFixed(2)}%</TableCell>
                      <TableCell>{batch.microbialLoad.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={batch.adulterantsDetected ? "destructive" : "secondary"}>
                          {batch.adulterantsDetected ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell>{batch.processingTemp.toFixed(1)}°C</TableCell>
                      <TableCell>{batch.phLevel.toFixed(2)}</TableCell>
                      <TableCell>{getQualityBadge(batch.predictedQuality)}</TableCell>
                      <TableCell>{batch.confidence}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExtrapolationForm;
