import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MessageCircle, Bot, User, Lightbulb, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import Disclaimer from "@/components/Disclaimer";

interface ChatState {
  step: 'initial' | 'zone' | 'property' | 'structure' | 'measurements' | 'additional' | 'results';
  zone: string;
  propertyType: string;
  structureType: string;
  length: string;
  width: string;
  height: string;
  frontBoundary: string;
  sideBoundary: string;
  rearBoundary: string;
  additionalRequirements: Record<string, boolean>;
  currentRequirementIndex: number;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  component?: React.ReactNode;
}

const zones = [
  { value: 'R1', label: 'R1 - General Residential' },
  { value: 'R2', label: 'R2 - Low Density Residential' },
  { value: 'R3', label: 'R3 - Medium Density Residential' },
  { value: 'R4', label: 'R4 - High Density Residential' },
  { value: 'R5', label: 'R5 - Large Lot Residential' },
  { value: 'RU1', label: 'RU1 - Primary Production' },
  { value: 'RU2', label: 'RU2 - Rural Landscape' },
  { value: 'RU3', label: 'RU3 - Forestry' },
  { value: 'RU4', label: 'RU4 - Primary Production Small Lots' },
  { value: 'RU5', label: 'RU5 - Village' },
  { value: 'RU6', label: 'RU6 - Transition' }
];

const propertyTypes = [
  { value: 'urban-standard', label: 'Urban Standard Lot (> 300m²)', zones: ['R1', 'R2', 'R3', 'R4'] },
  { value: 'rural-standard', label: 'Rural/Large Lot Residential (> 300m²)', zones: ['R5', 'RU1', 'RU2', 'RU3', 'RU4', 'RU5', 'RU6'] },
  { value: 'urban-small', label: 'Small Lot (< 300m²) - Residential', zones: ['R1', 'R2', 'R3', 'R4'] },
  { value: 'rural-small', label: 'Small Lot (< 300m²) - Rural', zones: ['R5', 'RU1', 'RU2', 'RU3', 'RU4', 'RU5', 'RU6'] }
];

const structureTypes = [
  { value: 'shed', label: 'Shed' },
  { value: 'patio', label: 'Patio/Pergola/Verandah' },
  { value: 'carport', label: 'Carport' }
];

const Chatbot = () => {
  const [chatState, setChatState] = useState<ChatState>({
    step: 'initial',
    zone: '',
    propertyType: '',
    structureType: '',
    length: '',
    width: '',
    height: '',
    frontBoundary: '',
    sideBoundary: '',
    rearBoundary: '',
    additionalRequirements: {},
    currentRequirementIndex: 0
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'll help you determine if your proposed structure qualifies as exempt development. First, I need to know if you're familiar with your property's zone classification.",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);

  // Get requirements for structure type (same as Results.tsx)
  const getRequirementsForStructure = (structureType: string) => {
    switch (structureType) {
      case 'shed':
        return [
          {
            key: 'isShippingContainer',
            label: 'Is your structure a shipping container?',
            correctAnswer: false
          },
          {
            key: 'roofwaterDrains',
            label: 'Will roofwater drain without causing nuisance to neighbours?',
            correctAnswer: true
          },
          {
            key: 'isMetal',
            label: 'Is your structure made of metal?',
            correctAnswer: null,
            conditional: true
          },
          {
            key: 'lowReflectiveMaterials',
            label: 'Will you use low-reflective, factory-coloured materials?',
            correctAnswer: true,
            dependsOn: 'isMetal',
            showIf: true
          },
          {
            key: 'inBushfireArea',
            label: 'Will your structure be in a bushfire area?',
            correctAnswer: null,
            conditional: true
          },
          {
            key: 'nearDwelling',
            label: 'Will your structure be less than 5m from a dwelling?',
            correctAnswer: false,
            dependsOn: 'inBushfireArea',
            showIf: true,
            conditional: true
          },
          {
            key: 'isNonCombustible',
            label: 'Is your structure made of non-combustible materials?',
            correctAnswer: true,
            dependsOn: 'inBushfireArea',
            showIf: true
          },
          {
            key: 'inHeritageArea',
            label: 'Is your property in a heritage area?',
            correctAnswer: null,
            conditional: true
          },
          {
            key: 'inRearYard',
            label: 'Will your structure be in the rear yard?',
            correctAnswer: true,
            dependsOn: 'inHeritageArea',
            showIf: true
          },
          {
            key: 'blocksAccess',
            label: 'Does your structure block entry, exit, or fire safety measures of nearby buildings?',
            correctAnswer: false
          },
          {
            key: 'clearOfEasements',
            label: 'Is your structure at least 1m clear of registered easements?',
            correctAnswer: true
          }
        ];
      case 'patio':
        return [
          {
            key: 'enclosingWallHeight',
            label: 'Does your patio have an enclosing wall higher than 1.4m?',
            correctAnswer: false
          },
          {
            key: 'floorHeight',
            label: 'Is the floor height more than 1m above ground level?',
            correctAnswer: false
          },
          {
            key: 'isRoofed',
            label: 'Is your patio/pergola roofed?',
            correctAnswer: null,
            conditional: true
          },
          {
            key: 'roofOverhang',
            label: 'Is the roof overhang 600mm or less on each side?',
            correctAnswer: true,
            dependsOn: 'isRoofed',
            showIf: true
          },
          {
            key: 'attachedToDwelling',
            label: 'Is your patio/pergola attached to a dwelling?',
            correctAnswer: null,
            conditional: true,
            dependsOn: 'isRoofed',
            showIf: true
          },
          {
            key: 'extendsAboveGutter',
            label: 'Does it extend above the gutter line?',
            correctAnswer: false,
            dependsOn: 'attachedToDwelling',
            showIf: true
          },
          {
            key: 'stormwaterConnection',
            label: 'Will roofwater connect to the stormwater drainage system?',
            correctAnswer: true,
            dependsOn: 'isRoofed',
            showIf: true
          },
          {
            key: 'isMetal',
            label: 'Is your patio/pergola made of metal?',
            correctAnswer: null,
            conditional: true
          },
          {
            key: 'lowReflectiveMaterials',
            label: 'Will you use low-reflective, factory-coloured materials?',
            correctAnswer: true,
            dependsOn: 'isMetal',
            showIf: true
          },
          {
            key: 'isFasciaConnected',
            label: 'Is your patio/pergola fascia-connected?',
            correctAnswer: null,
            conditional: true
          },
          {
            key: 'followsEngineerSpecs',
            label: 'Does it follow engineer\'s specifications?',
            correctAnswer: true,
            dependsOn: 'isFasciaConnected',
            showIf: true
          },
          {
            key: 'obstructsDrainage',
            label: 'Does your structure obstruct existing drainage paths?',
            correctAnswer: false
          },
          {
            key: 'inBushfireArea',
            label: 'Will your structure be in a bushfire area?',
            correctAnswer: null,
            conditional: true
          },
          {
            key: 'nearDwelling',
            label: 'Will your structure be less than 5m from a dwelling?',
            correctAnswer: false,
            dependsOn: 'inBushfireArea',
            showIf: true,
            conditional: true
          },
          {
            key: 'isNonCombustible',
            label: 'Is your structure made of non-combustible materials?',
            correctAnswer: true,
            dependsOn: 'inBushfireArea',
            showIf: true
          }
        ];
      case 'carport':
        return [
          {
            key: 'isMetal',
            label: 'Is your carport made of metal?',
            correctAnswer: null,
            conditional: true
          },
          {
            key: 'lowReflectiveMaterials',
            label: 'Will you use low-reflective, factory-coloured materials?',
            correctAnswer: true,
            dependsOn: 'isMetal',
            showIf: true
          },
          {
            key: 'newDriveway',
            label: 'Are you creating a new driveway or gutter crossing?',
            correctAnswer: null,
            conditional: true
          },
          {
            key: 'hasRoadApproval',
            label: 'Do you have approval from the road authority?',
            correctAnswer: true,
            dependsOn: 'newDriveway',
            showIf: true
          },
          {
            key: 'stormwaterConnection',
            label: 'Will roofwater connect to the stormwater drainage system?',
            correctAnswer: true
          },
          {
            key: 'reducesAccess',
            label: 'Does your carport reduce or block vehicle access, parking, or loading?',
            correctAnswer: false
          }
        ];
      default:
        return [];
    }
  };

  // Assessment logic (same as Results.tsx)
  const getAssessment = () => {
    const { zone, propertyType, structureType, length, width, height, frontBoundary, sideBoundary, rearBoundary, additionalRequirements } = chatState;
    
    if (!length || !width || !height || !frontBoundary || !sideBoundary || !rearBoundary) {
      return null;
    }

    const area = parseFloat(length) * parseFloat(width);
    const isRural = ['R5', 'RU1', 'RU2', 'RU3', 'RU4', 'RU5', 'RU6'].includes(zone);
    const isSmallLot = propertyType.includes('small');

    // Area limits based on property type and structure
    const maxArea = (() => {
      switch (structureType) {
        case 'patio':
          return 25; // 25m² for all properties
        case 'shed':
          return isRural ? 50 : 20;
        case 'carport':
          return isSmallLot ? 20 : (isRural ? 50 : 25);
        default:
          return 0;
      }
    })();

    const maxHeight = 3.0;
    const minSetback = isRural ? 5.0 : 0.9;

    const checks = {
      areaOK: area <= maxArea,
      heightOK: parseFloat(height) <= maxHeight,
      frontOK: parseFloat(frontBoundary) >= minSetback,
      sideOK: parseFloat(sideBoundary) >= minSetback,
      rearOK: parseFloat(rearBoundary) >= minSetback
    };

    // Check additional requirements
    const requirements = getRequirementsForStructure(structureType);
    const additionalRequirementsCheck = requirements.every(req => {
      if (req.dependsOn) {
        const parentAnswer = additionalRequirements[req.dependsOn];
        if (parentAnswer !== req.showIf) {
          return true; // Not applicable, so considered passing
        }
      }
      const userAnswer = additionalRequirements[req.key];

      // For conditional questions (correctAnswer is null), just check if user provided an answer
      if (req.correctAnswer === null) {
        return userAnswer !== undefined;
      }

      // For regular questions, check if answer matches the correct answer
      return userAnswer === req.correctAnswer;
    });

    // Get failed additional requirements for reporting
    const failedAdditional = requirements.filter(req => {
      if (req.dependsOn) {
        const parentAnswer = additionalRequirements[req.dependsOn];
        if (parentAnswer !== req.showIf) {
          return false; // Not applicable
        }
      }
      const userAnswer = additionalRequirements[req.key];
      if (req.correctAnswer === null) {
        return userAnswer === undefined;
      }
      return userAnswer !== req.correctAnswer;
    });

    const isExempt = Object.values(checks).every(check => check) && additionalRequirementsCheck;

    return {
      isExempt,
      area,
      maxArea,
      maxHeight,
      minSetback,
      checks,
      failedAdditional
    };
  };

  const addMessage = (text: string, sender: 'user' | 'bot', component?: React.ReactNode) => {
    const newMessage: Message = {
      id: Date.now(),
      text,
      sender,
      timestamp: new Date(),
      component
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleInitialResponse = (knowsZone: boolean) => {
    if (knowsZone) {
      addMessage("Yes, I know my zone", 'user');
      setTimeout(() => {
        addMessage("Great! Please select your property zone:", 'bot');
        setChatState(prev => ({ ...prev, step: 'zone' }));
      }, 500);
    } else {
      addMessage("No, I need to find my zone", 'user');
      setTimeout(() => {
        const instructionText = `No problem! Here's how to find your residential zone:

**Step-by-step instructions:**
1. Visit the NSW Planning Portal Spatial Viewer
2. Enter your property address in the search box
3. Click on "Search Results"
4. View your zone under the "Land Zoning Map" tab

Once you've found your zone information, come back and we'll continue with your assessment!`;
        
        addMessage(instructionText, 'bot');
      }, 500);
    }
  };

  const handleZoneSelect = (selectedZone: string) => {
    setChatState(prev => ({ ...prev, zone: selectedZone }));
    addMessage(`I selected ${selectedZone}`, 'user');
    
    setTimeout(() => {
      addMessage("Great! Now please select your property type based on lot size and location:", 'bot');
      setChatState(prev => ({ ...prev, step: 'property' }));
    }, 500);
  };

  const handlePropertySelect = (selectedProperty: string) => {
    const propertyLabel = propertyTypes.find(p => p.value === selectedProperty)?.label || selectedProperty;
    setChatState(prev => ({ ...prev, propertyType: selectedProperty }));
    addMessage(`I selected: ${propertyLabel}`, 'user');
    
    setTimeout(() => {
      addMessage("Perfect! What type of structure are you planning to build?", 'bot');
      setChatState(prev => ({ ...prev, step: 'structure' }));
    }, 500);
  };

  const handleStructureSelect = (selectedStructure: string) => {
    const structureLabel = structureTypes.find(s => s.value === selectedStructure)?.label || selectedStructure;
    setChatState(prev => ({ ...prev, structureType: selectedStructure }));
    addMessage(`I want to build: ${structureLabel}`, 'user');
    
    setTimeout(() => {
      addMessage("Excellent! Now I need the dimensions and setback distances for your proposed structure. Please fill in all measurements:", 'bot');
      setChatState(prev => ({ ...prev, step: 'measurements' }));
    }, 500);
  };

  const handleMeasurementsSubmit = () => {
    const { length, width, height, frontBoundary, sideBoundary, rearBoundary } = chatState;
    
    if (!length || !width || !height || !frontBoundary || !sideBoundary || !rearBoundary) {
      return;
    }

    addMessage(`Dimensions: ${length}m × ${width}m × ${height}m\nSetbacks: Front ${frontBoundary}m, Side ${sideBoundary}m, Rear ${rearBoundary}m`, 'user');
    
    setTimeout(() => {
      const requirements = getRequirementsForStructure(chatState.structureType);
      if (requirements.length > 0) {
        addMessage("Great! Now I need to ask about additional requirements for your structure. Let's go through these one by one:", 'bot');
        setChatState(prev => ({ ...prev, step: 'additional', currentRequirementIndex: 0 }));
        
        // Ask the first question immediately
        setTimeout(() => {
          const firstRequirement = requirements[0];
          addMessage(firstRequirement.label, 'bot');
        }, 500);
      } else {
        setChatState(prev => ({ ...prev, step: 'results' }));
      const assessment = getAssessment();
      
      if (assessment) {
        const { isExempt, area, maxArea, checks } = assessment;
        
        const propertyTypeLabel = propertyTypes.find(p => p.value === chatState.propertyType)?.label || chatState.propertyType;
        
        let resultText = `**Assessment Complete!**\n\n`;
        resultText += `Your ${chatState.structureType} (${area.toFixed(1)}m²) in ${chatState.zone} zone on a ${propertyTypeLabel}:\n\n`;
        
        if (isExempt) {
          resultText += `✅ **QUALIFIES as Exempt Development**\n\n`;
          resultText += `All dimensional requirements are met:\n`;
          resultText += `• Area: ${area.toFixed(1)}m² ≤ ${maxArea}m² ✓\n`;
          resultText += `• Height: ${chatState.height}m ≤ 3m ✓\n`;
          resultText += `• Setbacks: All boundaries compliant ✓\n\n`;
          
          // Add detailed additional requirements based on structure type
          resultText += `**Additional Requirements You Must Meet:**\n`;
          
          if (chatState.structureType === 'shed') {
            resultText += `• Cannot be a shipping container\n`;
            resultText += `• Roofwater must drain without causing nuisance to neighbours\n`;
            resultText += `• If metal, must use low-reflective, factory-coloured materials (in residential zones)\n`;
            resultText += `• If in bushfire areas and < 5m from a dwelling → must be non-combustible\n`;
            resultText += `• In heritage areas → must be in the rear yard\n`;
            resultText += `• Must not block entry, exit, or fire safety measures of nearby buildings\n`;
            resultText += `• Must be at least 1m clear of registered easements\n`;
          } else if (chatState.structureType === 'patio') {
            resultText += `• Wall height: no higher than 1.4m if enclosed\n`;
            resultText += `• Floor height: ≤ 1m above ground\n`;
            resultText += `• If metal, must use low-reflective, factory-coloured materials\n`;
            resultText += `• Roof overhang: ≤ 600mm on each side\n`;
            resultText += `• If attached to a dwelling → must not extend above gutter line\n`;
            resultText += `• If fascia-connected → must follow engineer's specs\n`;
            resultText += `• Roofwater must connect to stormwater drainage system\n`;
            resultText += `• Must not obstruct existing drainage paths\n`;
            resultText += `• In bushfire areas and < 5m from a dwelling → must be non-combustible\n`;
          } else if (chatState.structureType === 'carport') {
            resultText += `• Must be set ≥ 1m behind the building line\n`;
            resultText += `• If attached, not above dwelling's gutter line\n`;
            resultText += `• If metal, must use low-reflective, factory-coloured materials\n`;
            resultText += `• No new driveway/gutter crossing unless approved by road authority\n`;
            resultText += `• Roofwater must connect to stormwater drainage system\n`;
            resultText += `• Must not reduce or block vehicle access, parking, or loading\n`;
          }
          
          resultText += `\n**Applicable Legislation:**\n`;
          if (chatState.structureType === 'shed') {
            resultText += `SEPP (Exempt and Complying Development Codes) 2008 - Clauses 2.17 and 2.18\n`;
          } else if (chatState.structureType === 'patio') {
            resultText += `SEPP (Exempt and Complying Development Codes) 2008 - Clauses 2.11 and 2.12\n`;
          } else if (chatState.structureType === 'carport') {
            resultText += `SEPP (Exempt and Complying Development Codes) 2008 - Clauses 2.19 and 2.20\n`;
          }
          
          resultText += `\n**Next Steps:**\n`;
          resultText += `• No development application required\n`;
          resultText += `• Ensure Building Code compliance\n`;
          resultText += `• Check for any heritage/environmental overlays`;
        } else {
          resultText += `❌ **REQUIRES Development Application**\n\n`;
          
          // Show what failed
          resultText += `**Requirements NOT Met:**\n`;
          if (!checks.areaOK) resultText += `• Area: ${area.toFixed(1)}m² > ${maxArea}m² limit ✗\n`;
          if (!checks.heightOK) resultText += `• Height: ${chatState.height}m > 3m limit ✗\n`;
          if (!checks.frontOK) resultText += `• Front setback: ${chatState.frontBoundary}m insufficient ✗\n`;
          if (!checks.sideOK) resultText += `• Side setback: ${chatState.sideBoundary}m insufficient ✗\n`;
          if (!checks.rearOK) resultText += `• Rear setback: ${chatState.rearBoundary}m insufficient ✗\n`;
          
          // Show what passed
          const passedChecks = [];
          if (checks.areaOK) passedChecks.push(`• Area: ${area.toFixed(1)}m² ≤ ${maxArea}m² ✓`);
          if (checks.heightOK) passedChecks.push(`• Height: ${chatState.height}m ≤ 3m ✓`);
          if (checks.frontOK) passedChecks.push(`• Front setback: ${chatState.frontBoundary}m compliant ✓`);
          if (checks.sideOK) passedChecks.push(`• Side setback: ${chatState.sideBoundary}m compliant ✓`);
          if (checks.rearOK) passedChecks.push(`• Rear setback: ${chatState.rearBoundary}m compliant ✓`);
          
          if (passedChecks.length > 0) {
            resultText += `\n**Requirements Met:**\n`;
            resultText += passedChecks.join('\n') + '\n';
          }
          
          resultText += `\n**Applicable Legislation:**\n`;
          if (chatState.structureType === 'shed') {
            resultText += `SEPP (Exempt and Complying Development Codes) 2008 - Clauses 2.17 and 2.18\n`;
          } else if (chatState.structureType === 'patio') {
            resultText += `SEPP (Exempt and Complying Development Codes) 2008 - Clauses 2.11 and 2.12\n`;
          } else if (chatState.structureType === 'carport') {
            resultText += `SEPP (Exempt and Complying Development Codes) 2008 - Clauses 2.19 and 2.20\n`;
          }
          
          resultText += `\n**Next Steps:**\n`;
          resultText += `• Submit development application to Council\n`;
          resultText += `• Consider modifying design to meet exempt requirements`;
        }
        
        addMessage(resultText, 'bot');
      }
      }
    }, 1000);
  };

  const getCurrentRequirement = () => {
    const requirements = getRequirementsForStructure(chatState.structureType);
    const flattenedRequirements = [];
    
    // Flatten requirements to show only applicable ones
    for (const req of requirements) {
      if (req.dependsOn) {
        const parentAnswer = chatState.additionalRequirements[req.dependsOn];
        if (parentAnswer === req.showIf) {
          flattenedRequirements.push(req);
        }
      } else {
        flattenedRequirements.push(req);
      }
    }
    
    return flattenedRequirements[chatState.currentRequirementIndex];
  };

  const handleAdditionalRequirementAnswer = (answer: boolean) => {
    const currentReq = getCurrentRequirement();
    if (!currentReq) return;

    // Update the answer
    const newRequirements = {
      ...chatState.additionalRequirements,
      [currentReq.key]: answer
    };

    addMessage(answer ? "Yes" : "No", 'user');

    setTimeout(() => {
      setChatState(prev => ({ 
        ...prev, 
        additionalRequirements: newRequirements,
        currentRequirementIndex: prev.currentRequirementIndex + 1
      }));
      
      // Calculate next question to ask using the updated requirements
      setTimeout(() => {
        const requirements = getRequirementsForStructure(chatState.structureType);
        const flattenedRequirements = [];
        
        for (const req of requirements) {
          if (req.dependsOn) {
            const parentAnswer = newRequirements[req.dependsOn];
            if (parentAnswer === req.showIf) {
              flattenedRequirements.push(req);
            }
          } else {
            flattenedRequirements.push(req);
          }
        }

        const nextIndex = chatState.currentRequirementIndex + 1;
        
        if (nextIndex >= flattenedRequirements.length) {
          // All questions answered, show results
          addMessage("Perfect! I have all the information I need. Let me analyze your structure against all the requirements...", 'bot');
          setChatState(prev => ({ ...prev, step: 'results' }));
          
          // Create assessment with updated requirements
          const tempState = { ...chatState, additionalRequirements: newRequirements };
          const { zone, propertyType, structureType, length, width, height, frontBoundary, sideBoundary, rearBoundary, additionalRequirements } = tempState;
          
          const area = parseFloat(length) * parseFloat(width);
          const isRural = ['R5', 'RU1', 'RU2', 'RU3', 'RU4', 'RU5', 'RU6'].includes(zone);
          const isSmallLot = propertyType.includes('small');

          const maxArea = (() => {
            switch (structureType) {
              case 'patio':
                return 25;
              case 'shed':
                return isRural ? 50 : 20;
              case 'carport':
                return isSmallLot ? 20 : (isRural ? 50 : 25);
              default:
                return 0;
            }
          })();

          const maxHeight = 3.0;
          const minSetback = isRural ? 5.0 : 0.9;

          const checks = {
            areaOK: area <= maxArea,
            heightOK: parseFloat(height) <= maxHeight,
            frontOK: parseFloat(frontBoundary) >= minSetback,
            sideOK: parseFloat(sideBoundary) >= minSetback,
            rearOK: parseFloat(rearBoundary) >= minSetback
          };

          // Check additional requirements
          const requirements = getRequirementsForStructure(structureType);
          const additionalRequirementsCheck = requirements.every(req => {
            if (req.dependsOn) {
              const parentAnswer = additionalRequirements[req.dependsOn];
              if (parentAnswer !== req.showIf) {
                return true;
              }
            }
            const userAnswer = additionalRequirements[req.key];
            if (req.correctAnswer === null) {
              return userAnswer !== undefined;
            }
            return userAnswer === req.correctAnswer;
          });

          // Get failed additional requirements
          const failedAdditional = requirements.filter(req => {
            if (req.dependsOn) {
              const parentAnswer = additionalRequirements[req.dependsOn];
              if (parentAnswer !== req.showIf) {
                return false;
              }
            }
            const userAnswer = additionalRequirements[req.key];
            if (req.correctAnswer === null) {
              return userAnswer === undefined;
            }
            return userAnswer !== req.correctAnswer;
          });

          const isExempt = Object.values(checks).every(check => check) && additionalRequirementsCheck;
          
          if (true) {
            
            const propertyTypeLabel = propertyTypes.find(p => p.value === chatState.propertyType)?.label || chatState.propertyType;
            
            let resultText = `**Assessment Complete!**\n\n`;
            resultText += `Your ${chatState.structureType} (${area.toFixed(1)}m²) in ${chatState.zone} zone on a ${propertyTypeLabel}:\n\n`;
            
            if (isExempt) {
              resultText += `✅ **QUALIFIES as Exempt Development**\n\n`;
              resultText += `All dimensional and additional requirements are met:\n`;
              resultText += `• Area: ${area.toFixed(1)}m² ≤ ${maxArea}m² ✓\n`;
              resultText += `• Height: ${chatState.height}m ≤ 3m ✓\n`;
              resultText += `• Setbacks: All boundaries compliant ✓\n`;
              resultText += `• Additional Requirements: All requirements met ✓\n\n`;
              
              resultText += `**Applicable Legislation:**\n`;
              if (chatState.structureType === 'shed') {
                resultText += `SEPP (Exempt and Complying Development Codes) 2008 - Clauses 2.17 and 2.18\n`;
              } else if (chatState.structureType === 'patio') {
                resultText += `SEPP (Exempt and Complying Development Codes) 2008 - Clauses 2.11 and 2.12\n`;
              } else if (chatState.structureType === 'carport') {
                resultText += `SEPP (Exempt and Complying Development Codes) 2008 - Clauses 2.19 and 2.20\n`;
              }
              
              resultText += `\n**Next Steps:**\n`;
              resultText += `• No development application required\n`;
              resultText += `• Ensure Building Code compliance\n`;
              resultText += `• Check for any heritage/environmental overlays`;
            } else {
              resultText += `❌ **REQUIRES Development Application**\n\n`;
              
              // Show what failed
              resultText += `**Requirements NOT Met:**\n`;
              if (!checks.areaOK) resultText += `• Area: ${area.toFixed(1)}m² > ${maxArea}m² limit ✗\n`;
              if (!checks.heightOK) resultText += `• Height: ${chatState.height}m > 3m limit ✗\n`;
              if (!checks.frontOK) resultText += `• Front setback: ${chatState.frontBoundary}m < ${minSetback}m required ✗\n`;
              if (!checks.sideOK) resultText += `• Side setback: ${chatState.sideBoundary}m < ${minSetback}m required ✗\n`;
              if (!checks.rearOK) resultText += `• Rear setback: ${chatState.rearBoundary}m < ${minSetback}m required ✗\n`;
              
              // Show failed additional requirements with details
              if (failedAdditional && failedAdditional.length > 0) {
                resultText += `• Additional requirements not met:\n`;
                failedAdditional.forEach(req => {
                  const userAnswer = newRequirements[req.key];
                  let errorMessage = `  - ${req.label} (answered: ${userAnswer ? 'Yes' : 'No'})`;
                  
                  // Add parent context for conditional questions
                  if (req.dependsOn) {
                    const parentReq = requirements.find(r => r.key === req.dependsOn);
                    const parentAnswer = newRequirements[req.dependsOn];
                    if (parentReq && parentAnswer !== undefined) {
                      errorMessage += `\n    → This applies because you answered "${parentAnswer ? 'Yes' : 'No'}" to: ${parentReq.label}`;
                    }
                  }
                  
                  resultText += errorMessage + '\n';
                });
              }
              
              resultText += `\n**Applicable Legislation:**\n`;
              if (chatState.structureType === 'shed') {
                resultText += `SEPP (Exempt and Complying Development Codes) 2008 - Clauses 2.17 and 2.18\n`;
              } else if (chatState.structureType === 'patio') {
                resultText += `SEPP (Exempt and Complying Development Codes) 2008 - Clauses 2.11 and 2.12\n`;
              } else if (chatState.structureType === 'carport') {
                resultText += `SEPP (Exempt and Complying Development Codes) 2008 - Clauses 2.19 and 2.20\n`;
              }
              
              resultText += `\n**Next Steps:**\n`;
              resultText += `• Submit development application to Council\n`;
              resultText += `• Consider modifying design to meet exempt requirements`;
            }
            
            addMessage(resultText, 'bot');
          }
        } else {
          // More questions to ask - get the next question from the updated flattened list
          const nextReq = flattenedRequirements[nextIndex];
          if (nextReq) {
            addMessage(nextReq.label, 'bot');
          }
        }
      }, 100); // Small delay to ensure state is updated
    }, 500);
  };

  const resetChat = () => {
    setChatState({
      step: 'initial',
      zone: '',
      propertyType: '',
      structureType: '',
      length: '',
      width: '',
      height: '',
      frontBoundary: '',
      sideBoundary: '',
      rearBoundary: '',
      additionalRequirements: {},
      currentRequirementIndex: 0
    });
    setMessages([{
      id: 1,
      text: "Hello! I'll help you determine if your proposed structure qualifies as exempt development. First, I need to know if you're familiar with your property's zone classification.",
      sender: 'bot',
      timestamp: new Date()
    }]);
  };

  const renderCurrentStep = () => {
    switch (chatState.step) {
      case 'initial':
        return (
          <div className="space-y-4">
            <Label className="text-base font-medium">Do you know which zone your property is in?</Label>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start h-auto p-4 text-left"
                onClick={() => handleInitialResponse(true)}
              >
                Yes, I know my zone
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-auto p-4 text-left"
                onClick={() => handleInitialResponse(false)}
              >
                No, I need to find my zone
              </Button>
            </div>
            {/* Add NSW Planning Portal link after "No" is selected */}
            <Button 
              variant="outline" 
              className="w-full mt-4" 
              onClick={() => window.open("https://www.planningportal.nsw.gov.au/spatialviewer/", "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open NSW Planning Portal
            </Button>
          </div>
        );

      case 'zone':
        return (
          <div className="space-y-4">
            <Label className="text-base font-medium">Select your property zone:</Label>
            <Select onValueChange={handleZoneSelect} value={chatState.zone}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your zone..." />
              </SelectTrigger>
              <SelectContent>
                {zones.map(zone => (
                  <SelectItem key={zone.value} value={zone.value}>
                    {zone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'property':
        const availableProperties = propertyTypes.filter(prop => 
          prop.zones.includes(chatState.zone)
        );
        
        return (
          <div className="space-y-4">
            <Label className="text-base font-medium">Select your property type:</Label>
            <div className="space-y-2">
              {availableProperties.map(property => (
                <Button
                  key={property.value}
                  variant="outline"
                  className="w-full justify-start h-auto p-4 text-left whitespace-normal"
                  onClick={() => handlePropertySelect(property.value)}
                >
                  {property.label}
                </Button>
              ))}
            </div>
          </div>
        );

      case 'structure':
        return (
          <div className="space-y-4">
            <Label className="text-base font-medium">Select structure type:</Label>
            <div className="space-y-2">
              {structureTypes.map(structure => (
                <Button
                  key={structure.value}
                  variant="outline"
                  className="w-full justify-start h-auto p-4 text-left"
                  onClick={() => handleStructureSelect(structure.value)}
                >
                  {structure.label}
                </Button>
              ))}
            </div>
          </div>
        );

      case 'measurements':
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-4 block">Structure Dimensions:</Label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="length">Length (m)</Label>
                  <Input
                    id="length"
                    type="number"
                    placeholder="0.00"
                    value={chatState.length}
                    onChange={(e) => setChatState(prev => ({ ...prev, length: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="width">Width (m)</Label>
                  <Input
                    id="width"
                    type="number"
                    placeholder="0.00"
                    value={chatState.width}
                    onChange={(e) => setChatState(prev => ({ ...prev, width: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height (m)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="0.00"
                    value={chatState.height}
                    onChange={(e) => setChatState(prev => ({ ...prev, height: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="text-base font-medium mb-4 block">Setback Distances:</Label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="front">Front Boundary (m)</Label>
                  <Input
                    id="front"
                    type="number"
                    placeholder="0.00"
                    value={chatState.frontBoundary}
                    onChange={(e) => setChatState(prev => ({ ...prev, frontBoundary: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="side">Side Boundary (m)</Label>
                  <Input
                    id="side"
                    type="number"
                    placeholder="0.00"
                    value={chatState.sideBoundary}
                    onChange={(e) => setChatState(prev => ({ ...prev, sideBoundary: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="rear">Rear Boundary (m)</Label>
                  <Input
                    id="rear"
                    type="number"
                    placeholder="0.00"
                    value={chatState.rearBoundary}
                    onChange={(e) => setChatState(prev => ({ ...prev, rearBoundary: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={handleMeasurementsSubmit}
              disabled={!chatState.length || !chatState.width || !chatState.height || 
                       !chatState.frontBoundary || !chatState.sideBoundary || !chatState.rearBoundary}
              className="w-full"
              variant="hero"
            >
              Next
            </Button>
          </div>
        );

      case 'additional':
        const currentReq = getCurrentRequirement();
        if (!currentReq) {
          return null;
        }

        return (
          <div className="space-y-4">
            <Label className="text-base font-medium">{currentReq.label}</Label>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start h-auto p-4 text-left"
                onClick={() => handleAdditionalRequirementAnswer(true)}
              >
                Yes
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-auto p-4 text-left"
                onClick={() => handleAdditionalRequirementAnswer(false)}
              >
                No
              </Button>
            </div>
          </div>
        );

      case 'results':
        return (
          <div className="space-y-4">
            <Button onClick={resetChat} variant="outline" className="w-full">
              Start New Assessment
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Guided Planning Assistant
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            This chatbot offers a more guided experience for you to assess your proposed structure. Follow the step-by-step process to determine if your structure qualifies as exempt development.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="shadow-card h-[750px] flex flex-col">
              <CardHeader className="bg-primary rounded-t-lg">
                <CardTitle className="flex items-center text-primary-foreground">
                  <Bot className="mr-2 h-5 w-5 text-primary-foreground" />
                  Guided Assessment
                </CardTitle>
                <CardDescription className="text-primary-foreground/80">
                  Step-by-step exempt development evaluation
                </CardDescription>
              </CardHeader>
              
              {/* Messages Area */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      } animate-slide-up`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.sender === 'bot' && (
                          <Bot className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                        )}
                        {message.sender === 'user' && (
                          <User className="h-4 w-4 mt-0.5 text-primary-foreground flex-shrink-0" />
                        )}
                        <div className="text-sm leading-relaxed whitespace-pre-line">
                          {message.text}
                          {message.component}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
              
              {/* Current Step Input */}
              <div className="p-4 border-t bg-muted">
                {renderCurrentStep()}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Progress Indicator */}
            <Card className="shadow-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <Lightbulb className="mr-2 h-5 w-5 text-primary" />
                  Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className={`flex items-center space-x-3 ${chatState.zone ? 'text-accent' : 'text-muted-foreground'}`}>
                  {chatState.zone ? <CheckCircle className="h-4 w-4" /> : <div className="h-4 w-4 rounded-full border-2 border-current" />}
                  <span className="text-sm">Zone Selection</span>
                </div>
                <div className={`flex items-center space-x-3 ${chatState.propertyType ? 'text-accent' : 'text-muted-foreground'}`}>
                  {chatState.propertyType ? <CheckCircle className="h-4 w-4" /> : <div className="h-4 w-4 rounded-full border-2 border-current" />}
                  <span className="text-sm">Property Type</span>
                </div>
                <div className={`flex items-center space-x-3 ${chatState.structureType ? 'text-accent' : 'text-muted-foreground'}`}>
                  {chatState.structureType ? <CheckCircle className="h-4 w-4" /> : <div className="h-4 w-4 rounded-full border-2 border-current" />}
                  <span className="text-sm">Structure Type</span>
                </div>
                <div className={`flex items-center space-x-3 ${chatState.length && chatState.width && chatState.height && chatState.frontBoundary && chatState.sideBoundary && chatState.rearBoundary ? 'text-accent' : 'text-muted-foreground'}`}>
                  {chatState.length && chatState.width && chatState.height && chatState.frontBoundary && chatState.sideBoundary && chatState.rearBoundary ? <CheckCircle className="h-4 w-4" /> : <div className="h-4 w-4 rounded-full border-2 border-current" />}
                  <span className="text-sm">Measurements</span>
                </div>
                <div className={`flex items-center space-x-3 ${chatState.step === 'results' || (chatState.step === 'additional' && Object.keys(chatState.additionalRequirements).length > 0) ? 'text-accent' : 'text-muted-foreground'}`}>
                  {chatState.step === 'results' || (chatState.step === 'additional' && Object.keys(chatState.additionalRequirements).length > 0) ? <CheckCircle className="h-4 w-4" /> : <div className="h-4 w-4 rounded-full border-2 border-current" />}
                  <span className="text-sm">Additional Requirements</span>
                </div>
                <div className={`flex items-center space-x-3 ${chatState.step === 'results' ? 'text-accent' : 'text-muted-foreground'}`}>
                  {chatState.step === 'results' ? <CheckCircle className="h-4 w-4" /> : <div className="h-4 w-4 rounded-full border-2 border-current" />}
                  <span className="text-sm">Assessment Results</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-sm h-auto py-3 px-4"
                  onClick={() => window.location.href = '/properties'}
                >
                  <MessageCircle className="mr-3 h-4 w-4 flex-shrink-0" />
                  <span>Full Assessment Tool</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-sm h-auto py-3 px-4"
                  onClick={() => window.location.href = '/faq'}
                >
                  <Lightbulb className="mr-3 h-4 w-4 flex-shrink-0" />
                  <span>View FAQ</span>
                </Button>
                {chatState.step === 'results' && (
                  <Button 
                    variant="hero" 
                    className="w-full text-sm py-3"
                    onClick={resetChat}
                  >
                    Start New Assessment
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="shadow-card border-primary/20">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-primary">Contact Council</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">(02) 6023 8111</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground break-words">info@alburycity.nsw.gov.au</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Information Cards */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Building Code</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Exempt development still requires Building Code compliance for structural safety.
              </p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• Structural adequacy</li>
                <li>• Foundation requirements</li>
                <li>• Wind load calculations</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Important Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Additional requirements may apply to your specific situation.
              </p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• Heritage conservation areas</li>
                <li>• Environmental protection zones</li>
                <li>• Bushfire prone areas</li>
                <li>• Flooding overlays</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                After confirming exempt development status, consider these steps.
              </p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• Obtain building approval if required</li>
                <li>• Check utility connections</li>
                <li>• Verify boundary locations</li>
                <li>• Consider neighbour consultation</li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <Disclaimer />
      </div>
    </div>
  );
};

export default Chatbot;
