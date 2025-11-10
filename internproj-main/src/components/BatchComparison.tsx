
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GitCompare, Plus, Trash2 } from 'lucide-react';

interface BatchData {
  id: string;
  name: string;
  fatContent: number;
  snf: number;
  microbialLoad: number;
  adulterantsDetected: boolean;
  processingTemp: number;
  phLevel: number;
  predictedQuality: 'Good' | 'Acceptable' | 'Poor';
  confidence: number;
  date: string;
}

const BatchComparison: React.FC = () => {
  const [selectedBatches, setSelectedBatches] = useState<BatchData[]>([]);

  // Mock historical batch data
  const historicalBatches: BatchData[] = [
    {
      id: 'B001',
      name: 'Batch 001 - Morning',
      fatContent: 4.2,
      snf: 8.8,
      microbialLoad: 8500,
      adulterantsDetected: false,
      processingTemp: 78.5,
      phLevel: 6.7,
      predictedQuality: 'Good',
      confidence: 94,
      date: '2025-01-10'
    },
    {
      id: 'B002',
      name: 'Batch 002 - Evening',
      fatContent: 3.8,
      snf: 8.5,
      microbialLoad: 15000,
      adulterantsDetected: false,
      processingTemp: 82.0,
      phLevel: 6.6,
      predictedQuality: 'Acceptable',
      confidence: 78,
      date: '2025-01-10'
    },
    {
      id: 'B003',
      name: 'Batch 003 - Quality Issue',
      fatContent: 3.2,
      snf: 8.1,
      microbialLoad: 85000,
      adulterantsDetected: true,
      processingTemp: 75.0,
      phLevel: 6.4,
      predictedQuality: 'Poor',
      confidence: 89,
      date: '2025-01-09'
    }
  ];

  const addBatchToComparison = (batch: BatchData) => {
    if (selectedBatches.length < 3 && !selectedBatches.find(b => b.id === batch.id)) {
      setSelectedBatches([...selectedBatches, batch]);
    }
  };

  const removeBatchFromComparison = (batchId: string) => {
    setSelectedBatches(selectedBatches.filter(b => b.id !== batchId));
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'Good': return 'bg-green-100 text-green-800 border-green-200';
      case 'Acceptable': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Poor': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getParameterComparison = (param: string, values: number[]) => {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    
    return { min, max, avg, range: max - min };
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <GitCompare className="h-5 w-5 text-blue-600" />
          <CardTitle>Batch History & Comparison Tool</CardTitle>
        </div>
        <CardDescription>
          Compare up to 3 batches side-by-side to identify patterns and differences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Historical Batches Selection */}
          <div>
            <h4 className="font-semibold mb-3">Select Batches to Compare</h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {historicalBatches.map((batch) => (
                <div key={batch.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{batch.name}</span>
                    <Badge className={`text-xs ${getQualityColor(batch.predictedQuality)}`}>
                      {batch.predictedQuality}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{batch.date}</p>
                  <Button
                    size="sm"
                    onClick={() => addBatchToComparison(batch)}
                    disabled={selectedBatches.length >= 3 || selectedBatches.some(b => b.id === batch.id)}
                    className="w-full"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add to Compare
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison Table */}
          {selectedBatches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Comparison Results ({selectedBatches.length}/3)</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedBatches([])}
                >
                  Clear All
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left">Parameter</th>
                      {selectedBatches.map((batch) => (
                        <th key={batch.id} className="border border-gray-300 p-2 text-center">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{batch.name}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeBatchFromComparison(batch.id)}
                              className="p-1 h-6 w-6"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">Quality</td>
                      {selectedBatches.map((batch) => (
                        <td key={batch.id} className="border border-gray-300 p-2 text-center">
                          <Badge className={`${getQualityColor(batch.predictedQuality)} text-xs`}>
                            {batch.predictedQuality}
                          </Badge>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">Confidence</td>
                      {selectedBatches.map((batch) => (
                        <td key={batch.id} className="border border-gray-300 p-2 text-center">
                          {batch.confidence}%
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">Fat Content (%)</td>
                      {selectedBatches.map((batch) => (
                        <td key={batch.id} className="border border-gray-300 p-2 text-center">
                          {batch.fatContent}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">SNF (%)</td>
                      {selectedBatches.map((batch) => (
                        <td key={batch.id} className="border border-gray-300 p-2 text-center">
                          {batch.snf}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">Microbial Load</td>
                      {selectedBatches.map((batch) => (
                        <td key={batch.id} className="border border-gray-300 p-2 text-center">
                          {batch.microbialLoad.toLocaleString()}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">Adulterants</td>
                      {selectedBatches.map((batch) => (
                        <td key={batch.id} className="border border-gray-300 p-2 text-center">
                          {batch.adulterantsDetected ? 'Yes' : 'No'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">Processing Temp (°C)</td>
                      {selectedBatches.map((batch) => (
                        <td key={batch.id} className="border border-gray-300 p-2 text-center">
                          {batch.processingTemp}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">pH Level</td>
                      {selectedBatches.map((batch) => (
                        <td key={batch.id} className="border border-gray-300 p-2 text-center">
                          {batch.phLevel}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Statistical Summary */}
              {selectedBatches.length > 1 && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h5 className="font-semibold text-blue-800 mb-2">Statistical Analysis</h5>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Fat Content Range:</strong> {getParameterComparison('fat', selectedBatches.map(b => b.fatContent)).range.toFixed(1)}%</p>
                      <p><strong>SNF Variation:</strong> {getParameterComparison('snf', selectedBatches.map(b => b.snf)).range.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p><strong>Temp Range:</strong> {getParameterComparison('temp', selectedBatches.map(b => b.processingTemp)).range.toFixed(1)}°C</p>
                      <p><strong>Quality Distribution:</strong> {selectedBatches.filter(b => b.predictedQuality === 'Good').length} Good, {selectedBatches.filter(b => b.predictedQuality === 'Acceptable').length} Acceptable, {selectedBatches.filter(b => b.predictedQuality === 'Poor').length} Poor</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BatchComparison;
