
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown, MessageSquare, Star } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface UserFeedbackProps {
  predictionId?: string;
  prediction: {
    quality: 'Good' | 'Acceptable' | 'Poor';
    confidence: number;
  };
}

const UserFeedback: React.FC<UserFeedbackProps> = ({ predictionId = 'pred_' + Date.now(), prediction }) => {
  const { toast } = useToast();
  const [feedback, setFeedback] = useState<{
    accuracy: 'correct' | 'incorrect' | null;
    actualQuality: 'Good' | 'Acceptable' | 'Poor' | null;
    rating: number;
    comments: string;
  }>({
    accuracy: null,
    actualQuality: null,
    rating: 0,
    comments: ''
  });
  
  const [submitted, setSubmitted] = useState(false);

  const handleAccuracyFeedback = (accuracy: 'correct' | 'incorrect') => {
    setFeedback(prev => ({ ...prev, accuracy }));
  };

  const handleRating = (rating: number) => {
    setFeedback(prev => ({ ...prev, rating }));
  };

  const handleSubmitFeedback = () => {
    if (!feedback.accuracy) {
      toast({
        title: "Feedback Required",
        description: "Please indicate if the prediction was correct or incorrect.",
        variant: "destructive"
      });
      return;
    }

    // Simulate feedback submission
    console.log('Submitting feedback:', {
      predictionId,
      originalPrediction: prediction,
      userFeedback: feedback,
      timestamp: new Date().toISOString()
    });

    setSubmitted(true);
    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback. This helps improve our model accuracy."
    });
  };

  if (submitted) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <ThumbsUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-green-800 font-medium">Feedback submitted successfully!</p>
            <p className="text-sm text-green-600 mt-1">Your input helps improve model accuracy.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          <CardTitle>Prediction Feedback</CardTitle>
        </div>
        <CardDescription>
          Help us improve by providing feedback on this prediction
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-2">Was this prediction accurate?</p>
          <div className="flex space-x-2">
            <Button
              variant={feedback.accuracy === 'correct' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleAccuracyFeedback('correct')}
              className="flex items-center space-x-1"
            >
              <ThumbsUp className="h-4 w-4" />
              <span>Correct</span>
            </Button>
            <Button
              variant={feedback.accuracy === 'incorrect' ? 'destructive' : 'outline'}
              size="sm"
              onClick={() => handleAccuracyFeedback('incorrect')}
              className="flex items-center space-x-1"
            >
              <ThumbsDown className="h-4 w-4" />
              <span>Incorrect</span>
            </Button>
          </div>
        </div>

        {feedback.accuracy === 'incorrect' && (
          <div>
            <p className="text-sm font-medium mb-2">What was the actual quality?</p>
            <div className="flex space-x-2">
              {['Good', 'Acceptable', 'Poor'].map((quality) => (
                <Button
                  key={quality}
                  variant={feedback.actualQuality === quality ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFeedback(prev => ({ ...prev, actualQuality: quality as any }))}
                >
                  {quality}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-sm font-medium mb-2">Rate this prediction system (1-5 stars)</p>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRating(star)}
                className="focus:outline-none"
              >
                <Star 
                  className={`h-5 w-5 ${star <= feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Additional comments (optional)</p>
          <Textarea
            placeholder="Share any suggestions or observations..."
            value={feedback.comments}
            onChange={(e) => setFeedback(prev => ({ ...prev, comments: e.target.value }))}
            rows={3}
          />
        </div>

        <div className="flex justify-between items-center pt-2">
          <Badge variant="outline" className="text-xs">
            Prediction ID: {predictionId}
          </Badge>
          <Button onClick={handleSubmitFeedback}>
            Submit Feedback
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserFeedback;
