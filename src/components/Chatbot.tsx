import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatbotKnowledge {
  [key: string]: {
    keywords: string[];
    response: string;
  };
}

const knowledgeBase: ChatbotKnowledge = {
  repair_services: {
    keywords: ['repair', 'fix', 'broken', 'damage', 'screen', 'battery', 'charging', 'water damage', 'diagnosis'],
    response: "🔧 **Repair Services**: We offer professional repair services for smartphones, tablets, laptops, and accessories. Our services include screen replacement, battery replacement, water damage repair, charging port fixes, and complete diagnostics. You can book a repair appointment through our Repair section. We provide free pickup and delivery within the city!"
  },
  buyback_program: {
    keywords: ['buyback', 'sell', 'old device', 'quote', 'value', 'trade in', 'cash'],
    response: "💰 **BuyBack Program**: Get instant cash for your old devices! We buy smartphones, tablets, laptops in any condition. Our process is simple: 1) Get instant quote online, 2) Free device evaluation, 3) Immediate payment. We offer competitive prices and handle all the paperwork. Visit our BuyBack section to get started!"
  },
  tracking: {
    keywords: ['track', 'tracking', 'order status', 'repair status', 'progress', 'where is my device'],
    response: "📱 **Order Tracking**: You can track your repair order using your tracking code (format: SNP######). Visit our website and use the tracking feature, or contact us at +977-1-5354999. You'll receive SMS and email updates throughout the repair process."
  },
  pricing: {
    keywords: ['price', 'cost', 'how much', 'pricing', 'estimate', 'charges', 'fees'],
    response: "💵 **Pricing**: Our repair costs vary by device and issue type. Screen repairs typically range from ₨1,500-₨8,000, battery replacements from ₨800-₨3,500. We provide free diagnosis and estimates before any work begins. Contact us for specific pricing on your device model."
  },
  contact: {
    keywords: ['contact', 'phone', 'email', 'address', 'location', 'reach', 'support'],
    response: "📞 **Contact Information**: \n• Phone: +977-1-5354999\n• Email: mobizillanepal@gmail.com\n• We're available Monday-Saturday, 9 AM-8 PM\n• Visit our Contact page for more details and to send us a message directly!"
  },
  services_overview: {
    keywords: ['services', 'what do you do', 'offerings', 'capabilities', 'help with'],
    response: "🛠️ **Our Services**: \n• Device Repair (smartphones, tablets, laptops)\n• BuyBack Program (sell your old devices)\n• Training Courses (learn repair skills)\n• Coming Soon: Device Store\n• Free pickup & delivery\n• Warranty on all repairs"
  },
  training: {
    keywords: ['training', 'course', 'learn', 'education', 'skill', 'workshop'],
    response: "🎓 **Training Programs**: Learn professional device repair skills! We offer comprehensive courses covering smartphone repair, tablet repair, and laptop maintenance. Our hands-on training includes tools, practice devices, and certification. Check our Training section for course schedules and enrollment."
  },
  warranty: {
    keywords: ['warranty', 'guarantee', 'coverage', 'protection', 'after service'],
    response: "🛡️ **Warranty**: All our repairs come with warranty coverage! Screen repairs have 6-month warranty, battery replacements have 1-year warranty, and water damage repairs have 3-month warranty. We stand behind our work and provide free re-service if any issues arise within warranty period."
  },
  store_hours: {
    keywords: ['hours', 'open', 'closed', 'timing', 'schedule', 'when'],
    response: "🕒 **Store Hours**: We're open Monday-Saturday, 9:00 AM - 8:00 PM. Closed on Sundays. You can book appointments online 24/7, and we offer pickup services during business hours. Emergency repairs may be available - please call us!"
  },
  about: {
    keywords: ['about', 'company', 'who are you', 'mobizilla', 'business'],
    response: "🏢 **About Mobizilla**: We're a professional device repair service specializing in smartphones, tablets, and laptops. With years of experience, certified technicians, and genuine parts, we provide reliable repairs with warranty coverage. We also offer device buyback and training programs!"
  }
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! 👋 I'm Mobizilla Assistant. I can help you with questions about our repair services, buyback program, pricing, tracking, and more. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findBestResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    let bestMatch = '';
    let maxScore = 0;

    for (const [key, knowledge] of Object.entries(knowledgeBase)) {
      let score = 0;
      for (const keyword of knowledge.keywords) {
        if (lowerMessage.includes(keyword)) {
          score++;
        }
      }
      if (score > maxScore) {
        maxScore = score;
        bestMatch = knowledge.response;
      }
    }

    if (maxScore > 0) {
      return bestMatch;
    }

    // Default response
    return "I'd be happy to help! I can assist you with:\n\n🔧 Repair services and booking\n💰 BuyBack program and quotes\n📱 Order tracking\n💵 Pricing information\n📞 Contact details\n🛠️ Our services overview\n🎓 Training programs\n\nPlease ask me about any of these topics, or contact us directly at +977-1-5354999 for immediate assistance!";
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: findBestResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
        size="icon"
        aria-label="Open chat support"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 z-50 w-auto sm:w-96 h-[70vh] max-h-[560px] shadow-2xl">
      <CardHeader className="bg-blue-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Mobizilla Assistant
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-blue-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0 flex flex-col h-[calc(100%-80px)]">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-2 ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.sender === 'bot' && (
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-blue-600" />
                </div>
              )}
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="text-sm whitespace-pre-line">{message.text}</div>
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              {message.sender === 'user' && (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-blue-600" />
              </div>
              <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              size="icon"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}