import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, BookOpen, Building, Scale } from "lucide-react";
import Disclaimer from "@/components/Disclaimer";

const FAQ = () => {
  const faqCategories = [
    {
      title: "General Information",
      icon: <HelpCircle className="h-5 w-5" />,
      items: [
        {
          question: "What is Exempt Development?",
          answer: "Exempt development is low-impact development that can be carried out without the need for development consent from Council, provided it meets certain criteria set out in State Environmental Planning Policy (SEPP)."
        },
        {
          question: "Why use this tool?",
          answer: "This tool helps you quickly determine if your proposed shed, patio, or similar structure qualifies as exempt development, potentially saving you time and money on development applications."
        },
        {
          question: "Is this tool's assessment legally binding?",
          answer: "No, this tool provides guidance only. For official confirmation, please contact Albury City Council's planning department. Site-specific constraints may apply that aren't covered by this assessment."
        }
      ]
    },
    {
      title: "Planning Terminology",
      icon: <BookOpen className="h-5 w-5" />,
      items: [
        {
          question: "What is SEPP?",
          answer: "State Environmental Planning Policy (SEPP) is NSW state-level planning legislation that sets rules for development across the state, including provisions for exempt and complying development."
        },
        {
          question: "What is LEP?",
          answer: "Local Environmental Plan (LEP) is Council's main planning document that sets out zoning, development standards, and environmental protection measures for the local area."
        },
        {
          question: "What is DCP?",
          answer: "Development Control Plan (DCP) provides detailed planning and design guidelines that supplement the LEP, covering matters like building design, landscaping, and parking."
        },
        {
          question: "What are setbacks?",
          answer: "Setbacks are the minimum distances required between a building or structure and the property boundaries. They ensure adequate space for access, privacy, and neighbourhood amenity."
        }
      ]
    },
    {
      title: "Structure Requirements",
      icon: <Building className="h-5 w-5" />,
      items: [
        {
          question: "What structures can be exempt development?",
          answer: "Common exempt structures include garden sheds, patios, pergolas, carports, and decks. Each has specific size, height, and setback requirements that must be met."
        },
        {
          question: "What are the height limits?",
          answer: "Most exempt structures are limited to 3 metres in height, though this can vary depending on the type of structure and its location on the property."
        },
        {
          question: "How close can I build to my boundary?",
          answer: "Minimum setbacks typically include: 6m from front boundary, 0.9m from side boundaries, and 0.9m from rear boundary. Requirements may vary based on structure type and size."
        },
        {
          question: "Are there size limitations?",
          answer: "Yes, exempt development typically has maximum floor area limits. For example, sheds are often limited to 20m² floor area, while patios may have different limits."
        }
      ]
    },
    {
      title: "Application Process",
      icon: <Scale className="h-5 w-5" />,
      items: [
        {
          question: "What if my development isn't exempt?",
          answer: "If your proposed development doesn't qualify as exempt, you'll need to submit a development application (DA) to Council. This involves detailed plans, fees, and an assessment period of 40-60 days."
        },
        {
          question: "Do I need building approval for exempt development?",
          answer: "While exempt development doesn't require development consent, you may still need to comply with building codes and obtain any necessary building certificates or approvals."
        },
        {
          question: "Are there any exemptions to exempt development?",
          answer: "Yes, exempt development may not apply in certain areas such as heritage conservation areas, flood zones, or areas with specific environmental constraints. Always check with Council."
        },
        {
          question: "How much does a development application cost?",
          answer: "DA fees vary depending on the type and value of development. Contact Albury City Council for current fee schedules. Exempt development avoids these costs entirely."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get answers to common questions about exempt development, planning requirements, and using this assessment tool.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="shadow-card animate-slide-up" style={{ animationDelay: `${categoryIndex * 0.1}s` }}>
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary mr-3">
                    {category.icon}
                  </div>
                  {category.title}
                  <Badge variant="secondary" className="ml-auto">
                    {category.items.length} questions
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.items.map((item, itemIndex) => (
                    <AccordionItem key={itemIndex} value={`item-${categoryIndex}-${itemIndex}`}>
                      <AccordionTrigger className="text-left hover:text-primary">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Card */}
        <Card className="mt-12 shadow-card border-primary/20">
          <CardHeader>
            <CardTitle className="text-center text-primary">
              Still Have Questions?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              For specific planning advice or official confirmation of your development proposal, 
              contact Albury City Council directly.
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-semibold">Planning Department</h4>
                <p>Phone: (02) 6023 8111</p>
                <p>Email: council@alburycity.nsw.gov.au</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Office Hours</h4>
                <p>Monday - Friday: 8:30am - 5:00pm</p>
                <p>553 Kiewa Street, Albury NSW 2640</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Disclaimer />
      </div>
    </div>
  );
};

export default FAQ;
