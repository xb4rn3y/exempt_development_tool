import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Building, MapPin, ChevronRight } from "lucide-react";
import Disclaimer from "@/components/Disclaimer";

interface Property {
  id: string;
  address: string;
  type: string;
  zone: string;
  description: string;
  icon: React.ReactNode;
}

const sampleProperties: Property[] = [
  {
    id: "1",
    address: "Urban Lot - Small (300m²)",
    type: "Residential",
    zone: "R1 General Residential",
    description: "Typical inner-city residential lot",
    icon: <Home className="h-6 w-6" />
  },
  {
    id: "2", 
    address: "Urban Lot - Medium (500m²)",
    type: "Residential",
    zone: "R2 Low Density Residential", 
    description: "Standard suburban residential lot",
    icon: <Home className="h-6 w-6" />
  },
  {
    id: "3",
    address: "Urban Lot - Large (800m²)",
    type: "Residential",
    zone: "R2 Low Density Residential",
    description: "Large suburban residential lot",
    icon: <Home className="h-6 w-6" />
  },
  {
    id: "4",
    address: "Rural Block - Small (1200m²)",
    type: "Residential",
    zone: "R5 Large Lot Residential",
    description: "Small rural residential block",
    icon: <Building className="h-6 w-6" />
  },
  {
    id: "5",
    address: "Rural Block - Med (2000m²)",
    type: "Residential",
    zone: "RU5 Village",
    description: "Medium rural residential block",
    icon: <Building className="h-6 w-6" />
  },
  {
    id: "6",
    address: "Rural Block - Large (5000m²)",
    type: "Residential",
    zone: "RU1 Primary Production",
    description: "Large rural residential block",
    icon: <Building className="h-6 w-6" />
  },
  {
    id: "7",
    address: "Urban Corner Lot (600m²)",
    type: "Residential",
    zone: "R2 Low Density Residential",
    description: "Corner lot in suburban area",
    icon: <MapPin className="h-6 w-6" />
  },
  {
    id: "8",
    address: "Urban Compact (250m²)",
    type: "Residential",
    zone: "R3 Medium Density Residential",
    description: "Compact urban dwelling lot",
    icon: <Home className="h-6 w-6" />
  },
  {
    id: "9",
    address: "Rural Acreage (1 hectare)",
    type: "Residential",
    zone: "RU1 Primary Production",
    description: "Small acreage property",
    icon: <Building className="h-6 w-6" />
  },
  {
    id: "10",
    address: "Urban Duplex Site (400m²)",
    type: "Residential",
    zone: "R3 Medium Density Residential",
    description: "Duplex development site",
    icon: <Building className="h-6 w-6" />
  },
  {
    id: "11",
    address: "Rural Farmlet (2 hectares)",
    type: "Rural",
    zone: "RU1 Primary Production",
    description: "Small farming property",
    icon: <Building className="h-6 w-6" />
  },
  {
    id: "12",
    address: "Urban Townhouse (350m²)",
    type: "Residential",
    zone: "R4 High Density Residential",
    description: "Townhouse development lot",
    icon: <Home className="h-6 w-6" />
  }
];

const Properties = () => {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const navigate = useNavigate();

  const handlePropertySelect = (propertyId: string) => {
    setSelectedProperty(propertyId);
  };

  const handleContinue = () => {
    if (selectedProperty) {
      navigate(`/structure/${selectedProperty}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Select Your Property
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose your property from our sample database to check if your proposed development qualifies as exempt development.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {sampleProperties.map((property, index) => (
            <Card
              key={property.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-card hover:scale-105 ${
                selectedProperty === property.id 
                  ? 'ring-2 ring-primary shadow-hero' 
                  : 'hover:shadow-lg'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handlePropertySelect(property.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      {property.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg font-sans">{property.address}</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        {property.type} • {property.zone}
                      </CardDescription>
                    </div>
                  </div>
                  {selectedProperty === property.id && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-primary-foreground rounded-full"></div>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {property.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            variant="hero"
            size="lg"
            onClick={handleContinue}
            disabled={!selectedProperty}
            className="min-w-40"
          >
            Continue to Structure Details
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
        
        <Disclaimer />
      </div>
    </div>
  );
};

export default Properties;
