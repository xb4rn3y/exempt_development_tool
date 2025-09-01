import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, ArrowLeft, FileText, AlertTriangle, Home } from "lucide-react";
import Disclaimer from "@/components/Disclaimer";

interface FormData {
  structureType: string;
  length: string;
  width: string;
  height: string;
  frontBoundary: string;
  sideBoundary: string;
  rearBoundary: string;
  materials: string;
}

const Results = () => {
  const { propertyId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData as FormData;

  // Simple logic to determine if development is exempt (for demo purposes)
  const isExempt = formData ? 
    parseFloat(formData.height) <= 3.0 && 
    parseFloat(formData.sideBoundary) >= 0.9 &&
    parseFloat(formData.frontBoundary) >= 6.0 &&
    parseFloat(formData.rearBoundary) >= 0.9 : false;

  const getStructureArea = () => {
    if (!formData) return 0;
    return parseFloat(formData.length) * parseFloat(formData.width);
  };

  const getSEPPClause = () => {
    if (!formData) return "";
    switch (formData.structureType) {
      case "shed":
        return "SEPP (Exempt and Complying Development Codes) 2008 - Schedule 2, Part 1, Division 1A";
      case "patio":
        return "SEPP (Exempt and Complying Development Codes) 2008 - Schedule 2, Part 1, Division 1B";
      case "carport":
        return "SEPP (Exempt and Complying Development Codes) 2008 - Schedule 2, Part 1, Division 1C";
      default:
        return "SEPP (Exempt and Complying Development Codes) 2008 - Schedule 2, Part 1";
    }
  };

  if (!formData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <XCircle className="mr-2 h-5 w-5" />
              Missing Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">No structure data found. Please start over.</p>
            <Button onClick={() => navigate('/properties')} variant="council">
              Start New Assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => navigate(`/structure/${propertyId}`)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Structure Details
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Assessment Results
            </h1>
            <p className="text-lg text-muted-foreground">
              Based on your structure details and NSW SEPP requirements
            </p>
          </div>
        </div>

        {/* Results Card */}
        <Card className={`mb-8 shadow-hero animate-slide-up ${
          isExempt ? 'border-accent' : 'border-destructive'
        }`}>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {isExempt ? (
                <div className="p-4 bg-success-gradient rounded-full">
                  <CheckCircle className="h-12 w-12 text-accent-foreground" />
                </div>
              ) : (
                <div className="p-4 bg-destructive/10 rounded-full">
                  <XCircle className="h-12 w-12 text-destructive" />
                </div>
              )}
            </div>
            <CardTitle className="text-2xl">
              {isExempt ? (
                <span className="text-accent">Exempt Development Approved</span>
              ) : (
                <span className="text-destructive">Development Application Required</span>
              )}
            </CardTitle>
            <CardDescription className="text-base">
              {isExempt 
                ? "Your proposed structure meets the requirements for exempt development under NSW SEPP"
                : "Your proposed structure requires a development application to be submitted to Council"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Structure Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <Badge variant="secondary">{formData.structureType}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dimensions:</span>
                    <span>{formData.length}m × {formData.width}m × {formData.height}m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Floor Area:</span>
                    <span>{getStructureArea().toFixed(1)}m²</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Setback Requirements</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Front Boundary:</span>
                    <span className={parseFloat(formData.frontBoundary) >= 6.0 ? 'text-accent' : 'text-destructive'}>
                      {formData.frontBoundary}m {parseFloat(formData.frontBoundary) >= 6.0 ? '✓' : '✗'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Side Boundary:</span>
                    <span className={parseFloat(formData.sideBoundary) >= 0.9 ? 'text-accent' : 'text-destructive'}>
                      {formData.sideBoundary}m {parseFloat(formData.sideBoundary) >= 0.9 ? '✓' : '✗'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rear Boundary:</span>
                    <span className={parseFloat(formData.rearBoundary) >= 0.9 ? 'text-accent' : 'text-destructive'}>
                      {formData.rearBoundary}m {parseFloat(formData.rearBoundary) >= 0.9 ? '✓' : '✗'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SEPP Reference */}
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              Legal Reference
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">Applicable Legislation:</p>
            <p className="font-mono text-sm bg-muted p-3 rounded">
              {getSEPPClause()}
            </p>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              {isExempt ? (
                <CheckCircle className="mr-2 h-5 w-5 text-accent" />
              ) : (
                <AlertTriangle className="mr-2 h-5 w-5 text-destructive" />
              )}
              Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isExempt ? (
              <div className="space-y-4">
                <p className="text-accent font-medium">Your development can proceed as exempt development!</p>
                <ul className="space-y-2 text-sm">
                  <li>• No development application required</li>
                  <li>• Ensure compliance with all building codes</li>
                  <li>• Consider any relevant environmental or heritage overlays</li>
                  <li>• Check for any utility connections required</li>
                </ul>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-destructive font-medium">Development Application Required: Your proposed structure does not meet all requirements for exempt development.</p>
                <div className="mt-4">
                  <p className="font-medium text-sm mb-2">Next Steps:</p>
                  <ul className="space-y-2 text-sm">
                    <li>• Contact Albury City Council for development application guidance</li>
                    <li>• Consider modifying your design to meet exempt development requirements</li>
                    <li>• Engage a qualified building designer or architect if needed</li>
                    <li>• Review the non-compliant items above and adjust your plans</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>


        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="council" onClick={() => navigate('/properties')}>
            <Home className="mr-2 h-4 w-4" />
            New Assessment
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            <FileText className="mr-2 h-4 w-4" />
            Save Results
          </Button>
        </div>
        
        <Disclaimer />
      </div>
    </div>
  );
};

export default Results;
