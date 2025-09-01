import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Calculator, CheckCircle, Check } from "lucide-react";
import Disclaimer from "@/components/Disclaimer";

interface FormData {
  structureType: string;
  length: string;
  width: string;
  height: string;
  frontBoundary: string;
  sideBoundary: string;
  rearBoundary: string;
}

const StructureInput = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    structureType: "",
    length: "",
    width: "",
    height: "",
    frontBoundary: "",
    sideBoundary: "",
    rearBoundary: ""
  });

  const totalSteps = 2;
  const progress = (currentStep / totalSteps) * 100;

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    console.log('Previous button clicked, current step:', currentStep);
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      console.log('Moving to step:', currentStep - 1);
    }
  };

  const handleSubmit = () => {
    navigate(`/results/${propertyId}`, { 
      state: { formData } 
    });
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.structureType && formData.length && formData.width && formData.height;
      case 2:
        return formData.frontBoundary && formData.sideBoundary && formData.rearBoundary;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-slide-up">
            <div>
              <Label htmlFor="structureType" className="text-base font-medium">
                Type of Structure
              </Label>
              <Select onValueChange={(value) => handleInputChange('structureType', value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select structure type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shed">Garden Shed</SelectItem>
                  <SelectItem value="patio">Patio/Pergola</SelectItem>
                  <SelectItem value="carport">Carport</SelectItem>
                  <SelectItem value="garage">Garage</SelectItem>
                  <SelectItem value="pool-house">Pool House</SelectItem>
                  <SelectItem value="deck">Deck/Verandah</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="length" className="text-base font-medium">
                  Length (m)
                </Label>
                <Input
                  id="length"
                  type="number"
                  placeholder="0.00"
                  value={formData.length}
                  onChange={(e) => handleInputChange('length', e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="width" className="text-base font-medium">
                  Width (m)
                </Label>
                <Input
                  id="width"
                  type="number"
                  placeholder="0.00"
                  value={formData.width}
                  onChange={(e) => handleInputChange('width', e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="height" className="text-base font-medium">
                  Height (m)
                </Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="0.00"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-slide-up">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Boundary Distances</h3>
              <p className="text-muted-foreground">
                Enter the distance from your proposed structure to each property boundary
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="frontBoundary" className="text-base font-medium">
                  Front Boundary (m)
                </Label>
                <Input
                  id="frontBoundary"
                  type="number"
                  placeholder="0.00"
                  value={formData.frontBoundary}
                  onChange={(e) => handleInputChange('frontBoundary', e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="sideBoundary" className="text-base font-medium">
                  Side Boundary (m)
                </Label>
                <Input
                  id="sideBoundary"
                  type="number"
                  placeholder="0.00"
                  value={formData.sideBoundary}
                  onChange={(e) => handleInputChange('sideBoundary', e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="rearBoundary" className="text-base font-medium">
                  Rear Boundary (m)
                </Label>
                <Input
                  id="rearBoundary"
                  type="number"
                  placeholder="0.00"
                  value={formData.rearBoundary}
                  onChange={(e) => handleInputChange('rearBoundary', e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => navigate('/properties')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Properties
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Structure Details
            </h1>
            <p className="text-lg text-muted-foreground">
              Provide details about your proposed structure
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4 md:space-x-8">
              {/* Step 1 - Property */}
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent text-accent-foreground">
                  <Check className="h-5 w-5" />
                </div>
                <div className="ml-3 hidden md:block">
                  <div className="text-sm font-medium text-accent">Property</div>
                  <div className="text-xs text-muted-foreground">Select your property</div>
                </div>
              </div>

              {/* Connector Line */}
              <div className="w-8 md:w-16 h-px bg-accent"></div>

              {/* Step 2 - Structure */}
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-medium">
                  2
                </div>
                <div className="ml-3 hidden md:block">
                  <div className="text-sm font-medium text-primary">Structure</div>
                  <div className="text-xs text-muted-foreground">Enter structure details</div>
                </div>
              </div>

              {/* Connector Line */}
              <div className="w-8 md:w-16 h-px bg-border"></div>

              {/* Step 3 - Results */}
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted text-muted-foreground font-medium">
                  3
                </div>
                <div className="ml-3 hidden md:block">
                  <div className="text-sm font-medium text-muted-foreground">Results</div>
                  <div className="text-xs text-muted-foreground">View assessment</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="mr-2 h-5 w-5 text-primary" />
              {currentStep === 1 && "Basic Information"}
              {currentStep === 2 && "Boundary Setbacks"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Tell us about the type and size of your proposed structure"}
              {currentStep === 2 && "Boundary distances are critical for exempt development eligibility"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>

          {currentStep === totalSteps ? (
            <Button
              variant="hero"
              onClick={handleSubmit}
              disabled={!isStepValid()}
              className="min-w-32"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Get Results
            </Button>
          ) : (
            <Button
              variant="council"
              onClick={handleNext}
              disabled={!isStepValid()}
              className="min-w-24"
            >
              Next
            </Button>
          )}
        </div>
        
        <Disclaimer />
      </div>
    </div>
  );
};

export default StructureInput;
