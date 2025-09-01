import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Bot, User, Lightbulb } from "lucide-react";
import Disclaimer from "@/components/Disclaimer";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm the Albury City planning assistant. I can help you determine if your proposed shed, patio, or similar structure qualifies as exempt development. What would you like to build?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const suggestedQuestions = [
    "I want to build a garden shed",
    "Can I add a patio to my home?",
    "What are the height limits for structures?",
    "How close can I build to my boundary?",
    "Do I need council approval for a carport?"
  ];

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('shed') || message.includes('storage')) {
      return "For garden sheds, the key requirements are: maximum 20m² floor area, maximum 3m height, minimum 0.9m from side/rear boundaries and 6m from front boundary. The shed must be single storey and not contain habitable rooms. Would you like me to check specific dimensions?";
    }
    
    if (message.includes('patio') || message.includes('pergola') || message.includes('verandah')) {
      return "Patios and pergolas can often be exempt development if they: don't exceed 25m² in area, are maximum 3m high, meet setback requirements (0.9m from boundaries, 6m from front), and don't enclose more than 50% of the perimeter. What size patio are you planning?";
    }
    
    if (message.includes('carport') || message.includes('garage')) {
      return "Carports can be exempt if they're: maximum 50m² floor area, maximum 3m height, minimum 0.9m from side/rear boundaries, and 6m from front boundary. They must be open on at least two sides. Are you planning a single or double carport?";
    }
    
    if (message.includes('height') || message.includes('tall') || message.includes('high')) {
      return "Most exempt development structures have a maximum height limit of 3 metres. This is measured from natural ground level to the highest point of the structure. Heights above 3m typically require a development application.";
    }
    
    if (message.includes('boundary') || message.includes('setback') || message.includes('close')) {
      return "Standard setback requirements for exempt development are: 6 metres from front boundary, 0.9 metres from side boundaries, and 0.9 metres from rear boundary. These ensure adequate space for access and neighbourhood amenity.";
    }
    
    if (message.includes('approval') || message.includes('permission') || message.includes('consent')) {
      return "Exempt development doesn't require development consent from Council, but you may still need building approval and must comply with all relevant codes. If your proposal doesn't meet exempt development criteria, you'll need to submit a development application.";
    }
    
    if (message.includes('cost') || message.includes('fee') || message.includes('price')) {
      return "Exempt development avoids development application fees! DA fees vary but can range from hundreds to thousands of dollars depending on the project value. Building approval fees may still apply for structural work.";
    }

    if (message.includes('hello') || message.includes('hi') || message.includes('help')) {
      return "I'm here to help with your development questions! I can assist with information about sheds, patios, carports, height limits, setbacks, and approval requirements. What specific structure are you planning?";
    }
    
    return "I understand you're asking about development requirements. For the most accurate assessment, I'd recommend using our step-by-step assessment tool or contacting Albury City Council directly at (02) 6023 8111. Is there a specific aspect of your project you'd like me to help clarify?";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newUserMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: getBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            AI Planning Assistant
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get instant answers about exempt development requirements. Ask questions about your proposed structure in natural language.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="shadow-card h-[750px] flex flex-col">
              <CardHeader className="bg-primary rounded-t-lg">
                <CardTitle className="flex items-center text-primary-foreground">
                  <Bot className="mr-2 h-5 w-5 text-primary-foreground" />
                  Planning Assistant
                </CardTitle>
                <CardDescription className="text-primary-foreground/80">
                  Ask me anything about exempt development requirements
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
                        <p className="text-sm leading-relaxed">{message.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted p-3 rounded-lg animate-pulse">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-4 w-4 text-primary" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              
              {/* Input Area */}
              <div className="p-4 border-t bg-muted">
                <div className="flex space-x-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your question about development requirements..."
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    variant="accent"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Suggested Questions */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Lightbulb className="mr-2 h-5 w-5 text-primary" />
                  Suggested Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start text-left h-auto p-3 text-sm whitespace-normal leading-relaxed"
                    onClick={() => handleSuggestedQuestion(question)}
                  >
                    <MessageCircle className="mr-2 h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span className="break-words">{question}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="shadow-card border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg text-primary">Need Official Advice?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  For official planning advice, contact Albury City Council.
                </p>
                <div className="space-y-1 text-sm">
                  <p><strong>Phone:</strong> (02) 6023 8111</p>
                  <p><strong>Email:</strong> council@alburycity.nsw.gov.au</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Resources Section */}
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <MessageCircle className="mr-2 h-5 w-5 text-primary" />
                Assessment Tool
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Use our comprehensive step-by-step assessment tool for detailed evaluation.
              </p>
              <Button variant="hero" className="w-full" onClick={() => window.location.href = '/properties'}>
                Start Assessment
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Lightbulb className="mr-2 h-5 w-5 text-primary" />
                Helpful Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Always check Building Code requirements</li>
                <li>• Consider neighbour notification requirements</li>
                <li>• Verify property boundary locations</li>
                <li>• Check for any easements or restrictions</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-card md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Frequently Asked</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Common questions and detailed answers about development requirements.
              </p>
              <Button variant="hero" className="w-full" onClick={() => window.location.href = '/faq'}>
                View FAQ
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <Disclaimer />
      </div>
    </div>
  );
};

export default Chatbot;
