interface KnowledgeSection {
  id: string;
  title: string;
  content: string;
  keywords: string[];
  relatedSections: string[];
}

export const knowledgeBase: KnowledgeSection[] = [
  {
    id: "repairs-general",
    title: "Mobile Repair Services",
    content: `Our expert technicians specialize in comprehensive mobile device repairs with typical turnaround times:

    📱 Screen Repairs:
    • Most repairs completed in 1-2 hours
    • Premium quality OEM parts used
    • Full display testing after repair
    • Optional screen protector installation

    🔋 Battery Service:
    • 30-45 minute service time
    • Genuine batteries with warranty
    • Full capacity testing
    • Battery health optimization

    💧 Water Damage:
    • Professional ultrasonic cleaning
    • 24-48 hour thorough treatment
    • Component-level inspection
    • Data recovery when possible

    🔧 Other Services:
    • Camera repairs: 1-2 hours
    • Charging port: 30-60 minutes
    • Speaker/mic: 30-60 minutes
    • Board repairs: 24-72 hours

    All repairs include our quality assurance testing and warranty coverage.`,
    keywords: ["repair", "fix", "service", "screen", "battery", "water damage", "software", "time", "long", "duration"],
    relatedSections: ["repair-warranty", "repair-pricing", "diagnostics"]
  },
  {
    id: "repair-pricing",
    title: "Repair Pricing Structure",
    content: `Our repair services are competitively priced with no hidden fees:

    📱 iPhone Repairs:
    • Screen replacement: From $89
    • Battery replacement: From $49
    • Charging port: From $69
    • Back glass: From $99

    📲 Samsung Repairs:
    • Screen replacement: From $79
    • Battery replacement: From $45
    • Charging port: From $65
    • Back glass: From $89

    🛠️ Additional Services:
    • Diagnostic assessment: Free
    • Water damage treatment: From $75
    • Motherboard repair: From $99
    • Data recovery: Custom quote

    All repairs include:
    • Free diagnostic testing
    • Quality OEM parts
    • Labor warranty
    • Post-repair testing`,
    keywords: ["price", "cost", "charge", "fee", "quote"],
    relatedSections: ["repairs-general", "repair-warranty"]
  },
  {
    id: "buyback-program",
    title: "Device Buy Back Program",
    content: `📱 Trade In Your Device:
    
    Instant Cash for:
    • iPhones (all models)
    • Samsung Galaxy series
    • iPads and tablets
    • Smart watches
    • Gaming consoles

    💰 Competitive Pricing Factors:
    • Device model & age
    • Functional condition
    • Cosmetic condition
    • Storage capacity
    • Accessories included

    ✨ Premium Features:
    • Instant price quotes
    • Same-day cash payment
    • Secure data erasure
    • Free device inspection
    • Best price match guarantee

    📲 Trade-Up Options:
    • Apply value to new device
    • Extra credit on upgrades
    • Special trade-in deals
    • Flexible payment options`,
    keywords: ["buy", "sell", "trade", "buyback", "exchange"],
    relatedSections: ["device-sales", "trade-in-value"]
  },
  {
    id: "repair-warranty",
    title: "Repair Warranty Coverage",
    content: `🛡️ Premium Warranty Protection:

    Warranty Duration:
    • Screen Repairs: 90 days
    • Battery Service: 180 days
    • Parts & Labor: 90 days
    • Workmanship: Lifetime

    ✅ What's Covered:
    • Part defects/failures
    • Installation issues
    • Performance problems
    • Workmanship quality
    • Touch functionality
    • Display quality
    • Battery performance

    📋 Simple Warranty Process:
    • No appointment needed
    • Quick assessment
    • Same-day resolution
    • Free re-repair if needed

    ⚠️ Important Notes:
    • Keep your repair invoice
    • Non-transferable coverage
    • Valid at all locations
    • Water damage excluded`,
    keywords: ["warranty", "guarantee", "coverage", "protection"],
    relatedSections: ["repairs-general", "repair-pricing"]
  },
  {
    id: "diagnostic-service",
    title: "Professional Diagnostics",
    content: `🔍 Free Diagnostic Service:

    Complete Testing:
    • Hardware diagnostics
    • Software analysis
    • Battery health check
    • Signal strength test
    • Camera functionality
    • Audio system check
    • Charging system test

    ⚡ Quick Process:
    • 15-30 minute initial check
    • Detailed report provided
    • Repair recommendations
    • Upfront pricing quote
    • No-obligation service

    🛠️ Advanced Diagnostics:
    • Motherboard testing
    • Liquid damage assessment
    • Signal interference check
    • Component-level analysis
    • Performance benchmarking

    💻 Software Diagnostics:
    • OS health check
    • Malware scanning
    • Backup verification
    • Update assessment
    • Speed optimization`,
    keywords: ["diagnose", "check", "test", "assessment", "inspection"],
    relatedSections: ["repairs-general", "repair-pricing"]
  },
  {
    id: "support-services",
    title: "Customer Support Services",
    content: `🌟 Expert Support Available:

    Service Hours:
    • Monday-Saturday: 10am-8pm
    • Sundays: 11am-6pm
    • Emergency: 24/7 hotline

    📱 Contact Options:
    • In-store support
    • Phone assistance
    • Online chat
    • Email support
    • Video consultation

    🚀 Fast Track Service:
    • Priority handling
    • Express repair options
    • Same-day service
    • Emergency support
    • Corporate accounts

    💼 Business Solutions:
    • Fleet management
    • Bulk repairs
    • Custom service plans
    • Priority support
    • Volume pricing`,
    keywords: ["support", "help", "contact", "assistance", "service"],
    relatedSections: ["repairs-general", "diagnostic-service"]
  }
];

export const findRelevantSections = (query: string, conversationHistory: Message[]): KnowledgeSection[] => {
  const queryWords = query.toLowerCase().split(" ");
  
  // Calculate relevance scores for each section
  const scoredSections = knowledgeBase.map(section => {
    let score = 0;
    
    // Check keywords
    section.keywords.forEach(keyword => {
      if (query.toLowerCase().includes(keyword.toLowerCase())) {
        score += 5;
      }
    });
    
    // Check content relevance
    queryWords.forEach(word => {
      if (section.content.toLowerCase().includes(word)) {
        score += 1;
      }
    });
    
    // Consider conversation history
    conversationHistory.forEach(msg => {
      section.keywords.forEach(keyword => {
        if (msg.content.toLowerCase().includes(keyword.toLowerCase())) {
          score += 0.5; // Lower weight for historical context
        }
      });
    });
    
    return { section, score };
  });
  
  // Sort by score and return top 3 most relevant sections
  return scoredSections
    .sort((a, b) => b.score - a.score)
    .filter(item => item.score > 0)
    .slice(0, 3)
    .map(item => item.section);
};

export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: number;
}

export const generateDetailedResponse = (
  query: string,
  relevantSections: KnowledgeSection[],
  previousMessages: Message[]
): string => {
  const queryLower = query.toLowerCase();
  let response = "";

  // Find the most relevant section based on query specifics
  const primarySection = relevantSections[0];
  if (!primarySection) {
    return "I can help you with repair services, device trade-ins, diagnostics, and warranty information. What would you like to know about specifically?";
  }

  // Parse the primary content based on query type
  const content = primarySection.content;
  const contentSections = content.split('\n\n').filter(Boolean);

  if (queryLower.includes("how long") || queryLower.includes("time") || queryLower.includes("duration")) {
    // Extract timing information
    const timeRelatedSections = contentSections.filter(section => 
      section.toLowerCase().includes("minute") || 
      section.toLowerCase().includes("hour") || 
      section.toLowerCase().includes("day")
    );
    response = timeRelatedSections.join("\n\n");
  } else if (queryLower.includes("price") || queryLower.includes("cost")) {
    // Extract pricing information
    const priceSections = contentSections.filter(section =>
      section.includes("$") || 
      section.toLowerCase().includes("price") || 
      section.toLowerCase().includes("cost")
    );
    response = priceSections.join("\n\n");
  } else if (queryLower.includes("warranty")) {
    // Extract warranty information
    const warrantySections = contentSections.filter(section =>
      section.toLowerCase().includes("warranty") ||
      section.toLowerCase().includes("coverage") ||
      section.toLowerCase().includes("guarantee")
    );
    response = warrantySections.join("\n\n");
  } else {
    // For general queries, include all relevant information
    response = content;
  }

  // Add context from secondary relevant sections if needed
  relevantSections.slice(1).forEach(section => {
    const isRelevant = section.keywords.some(keyword => 
      queryLower.includes(keyword.toLowerCase())
    );
    if (isRelevant) {
      const relevantContent = section.content
        .split('\n\n')
        .filter(para => 
          para.toLowerCase().includes(queryLower) ||
          section.keywords.some(k => para.toLowerCase().includes(k.toLowerCase()))
        )
        .join('\n\n');
      if (relevantContent) {
        response += "\n\n" + relevantContent;
      }
    }
  });

  // Add follow-up suggestions
  const relatedInfo = primarySection.relatedSections
    .map(id => knowledgeBase.find(s => s.id === id))
    .filter(Boolean)
    .map(section => section.title)
    .slice(0, 2);

  if (relatedInfo.length > 0) {
    response += "\n\n💡 Related information available about: " + relatedInfo.join(" and ");
  }

  return response;
};
