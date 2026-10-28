import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '5mb' }));

// Initialize GoogleGenAI server-side with required httpOptions User-Agent
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'CelebrateAI API',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Helper for deterministic event planning fallback
function generateDeterministicPlan(params: {
  eventType: string;
  name: string;
  date: string;
  city: string;
  guestCount: number;
  budgetAmount: number;
  currency: string;
  styleTheme: string;
  priorities: string[];
}) {
  const { eventType, name, date, city, guestCount, budgetAmount, currency, styleTheme, priorities } = params;

  // Reconciled budget breakdown (100% total)
  const venueCost = Math.round(budgetAmount * 0.25);
  const cateringCost = Math.round(budgetAmount * 0.30);
  const decorCost = Math.round(budgetAmount * 0.15);
  const photoCost = Math.round(budgetAmount * 0.10);
  const entertainmentCost = Math.round(budgetAmount * 0.08);
  const stylingCost = Math.round(budgetAmount * 0.05);
  const invitationsCost = Math.round(budgetAmount * 0.02);
  const emergencyCost = budgetAmount - (venueCost + cateringCost + decorCost + photoCost + entertainmentCost + stylingCost + invitationsCost);

  return {
    concept: {
      title: `${styleTheme} ${eventType}: ${name}`,
      description: `A masterfully curated celebration in ${city} blending ${styleTheme.toLowerCase()} aesthetics with unforgettable guest hospitality for ${guestCount} cherished guests.`,
      colorPalette: [
        { name: 'Royal Violet', hex: '#4A154B' },
        { name: 'Champagne Gold', hex: '#D4AF37' },
        { name: 'Warm Coral', hex: '#FB923C' },
        { name: 'Ivory Cream', hex: '#FFFDF9' },
      ],
      decorationIdeas: [
        'Cascading seasonal floral canopy over the central stage with warm fairy lighting',
        'Minimalist ambient LED strip uplighting with customized monogram projection',
        'Sustainable brass oil lamps and fragrant natural marigold & jasmine garlands',
        'Cozy guest lounge seating pods with textured velvet cushions and low tables',
      ],
      lightingIdeas: [
        'Warm 2700K fairy string lights draped overhead',
        'Dimmable stage spotlights highlighting key ceremonial and toast moments',
        'Acoustic glow pillar candles inside glass lanterns along pathways',
      ],
      entertainmentIdeas: [
        'Live acoustic ensemble or sitar/flute instrumentalists during arrival cocktails',
        'Curated celebration playlist featuring cultural favorites and modern anthems',
        'Interactive guest memory book and instant Polaroid photo keepsake station',
      ],
      guestExperience: [
        'Signature welcome beverage infused with local seasonal flavors',
        'Personalized handcrafted placecards and dietary-labeled banquet menus',
        'Curated sweet gift box containing artisanal local confections',
      ],
      culturalNotes: 'Honoring regional celebratory rituals with dedicated auspicious timings, elders blessing lounge, and ceremonial props.',
      practicalTips: `Verify venue sound curfew in ${city}; allocate 2 dedicated coordinator volunteers for elderly guests and transport logistics.`,
    },
    schedule: [
      { time: '08:00', title: 'Vendor Setup & Logistics Arrival', description: 'Decorators, sound technicians, and florists begin installation at venue.', category: 'Logistics' },
      { time: '10:00', title: 'Floral & Stage Inspection', description: 'Final walk-through of stage, backdrop, seating layout, and audiovisual checks.', category: 'Decoration' },
      { time: '11:30', title: 'Host & Core Family Arrival', description: 'Early photo session, outfit checks, and quiet blessing moment.', category: 'Ceremony' },
      { time: '12:00', title: 'Guest Arrival & Welcome Cocktails', description: 'Refreshments served, welcome music, guestbook signing.', category: 'Guest Experience' },
      { time: '12:45', title: 'Main Celebration Ceremony / Program', description: 'Key highlights, rituals, commemorative speeches, or cake cutting.', category: 'Ceremony' },
      { time: '14:00', title: 'Grand Banquet Meal Service', description: 'Multi-course lunch/dinner with dietary options clearly marked.', category: 'Catering' },
      { time: '15:30', title: 'Celebration Entertainment & Open Floor', description: 'Music, dancing, photo booth, and candid family captures.', category: 'Entertainment' },
      { time: '17:00', title: 'Vote of Thanks & Heartfelt Farewell', description: 'Distribution of favors, family photographs, and vendor wrap-up.', category: 'Closing' },
    ],
    budgetCategories: [
      { category: 'Venue', estimatedCost: venueCost, percentage: 25, reasoning: 'Prime location rental, air-conditioning, chairs, and housekeeping.', lowerCostAlternative: 'Host during off-peak weekday or reserve a scenic community banquet hall.' },
      { category: 'Catering', estimatedCost: cateringCost, percentage: 30, reasoning: `Buffet banquet with live counters for ${guestCount} guests plus beverages.`, lowerCostAlternative: 'Streamline menu to 3 curated live stations and seasonal specialty dessert.' },
      { category: 'Decoration', estimatedCost: decorCost, percentage: 15, reasoning: 'Stage setup, fresh floral installations, entry arch, and lighting.', lowerCostAlternative: 'Combine reusable brass props with locally sourced seasonal marigold and greenery.' },
      { category: 'Photography', estimatedCost: photoCost, percentage: 10, reasoning: 'Full day candid & traditional photographer with edited video reel.', lowerCostAlternative: 'Contract a single lead photographer with digital album delivery.' },
      { category: 'Entertainment', estimatedCost: entertainmentCost, percentage: 8, reasoning: 'Sound system, wireless microphones, acoustic musicians or DJ.', lowerCostAlternative: 'Curate a bespoke high-fidelity playlist with hired professional audio gear.' },
      { category: 'Clothing & Styling', estimatedCost: stylingCost, percentage: 5, reasoning: 'Host attire adjustments, hair and makeup styling touchups.', lowerCostAlternative: 'Collaborate with a trusted local stylist or family specialist.' },
      { category: 'Invitations', estimatedCost: invitationsCost, percentage: 2, reasoning: 'Digital animated invitations, printed heirloom cards for close family.', lowerCostAlternative: 'Adopt 100% digital RSVP web invitations and WhatsApp broadcast.' },
      { category: 'Emergency Reserve', estimatedCost: emergencyCost, percentage: 5, reasoning: 'Contingency cushion for last-minute guest additions or extra hours.', lowerCostAlternative: 'Maintain at least 5% reserved for unexpected transit or weather equipment.' },
    ],
    checklist: [
      { title: 'Confirm Venue Contract & Security Deposit', priority: 'High', dueDate: '30 days before', category: 'Venue', status: 'Pending' },
      { title: 'Finalize Catering Menu & Tasting Session', priority: 'High', dueDate: '21 days before', category: 'Catering', status: 'Pending' },
      { title: 'Send Digital & Print Invitations with RSVP Link', priority: 'High', dueDate: '20 days before', category: 'Invitations', status: 'Pending' },
      { title: 'Book Lead Photographer & Videographer', priority: 'Medium', dueDate: '18 days before', category: 'Photography', status: 'Pending' },
      { title: 'Finalize Theme Decor & Floral Color Scheme', priority: 'Medium', dueDate: '14 days before', category: 'Decoration', status: 'Pending' },
      { title: 'Coordinate Sound System & Playlist / DJ', priority: 'Medium', dueDate: '10 days before', category: 'Entertainment', status: 'Pending' },
      { title: 'Collate RSVPs, Seating Plan & Dietary Notes', priority: 'High', dueDate: '5 days before', category: 'Guests', status: 'Pending' },
      { title: 'Assemble Emergency Kit (Pins, First Aid, Chargers)', priority: 'Low', dueDate: '2 days before', category: 'Logistics', status: 'Pending' },
      { title: 'Conduct Final Vendor Briefing Call', priority: 'High', dueDate: '1 day before', category: 'Logistics', status: 'Pending' },
    ],
    vendorRequirements: [
      { category: 'Venue Manager', selectionCriteria: 'Capacity for 150+ guests, reliable power backup, on-site parking', suggestedQuestions: ['What are the noise curfew hours?', 'Is outside catering permitted?'], bookingDeadline: '6-8 weeks before' },
      { category: 'Catering Specialist', selectionCriteria: 'High hygiene rating, experience with regional delicacies, live station expertise', suggestedQuestions: ['Do you provide service staff and dinnerware?', 'How do you handle dietary preferences?'], bookingDeadline: '4-6 weeks before' },
      { category: 'Photographer', selectionCriteria: 'Strong portfolio of candid celebration shots, fast preview turnaround', suggestedQuestions: ['How many edited photos will we receive?', 'Will there be a second shooter?'], bookingDeadline: '4 weeks before' },
      { category: 'Floral Decorator', selectionCriteria: 'Knowledge of sustainable florals, portfolio matching theme palette', suggestedQuestions: ['Are mockups provided beforehand?', 'What is the setup and strike-down schedule?'], bookingDeadline: '3 weeks before' },
    ],
    risks: [
      { risk: 'Unexpected Weather / Rain', severity: 'High', contingency: 'Secure waterproof canopy overhangs and arrange indoor backup holding zone.' },
      { risk: 'Guest Count Surge (+15%)', severity: 'Medium', contingency: 'Negotiate a 10% buffer with caterer with payable per-plate rate.' },
      { risk: 'Audio / Power Disruption', severity: 'Medium', contingency: 'Ensure venue provides an automatic switchover diesel generator.' },
      { risk: 'Last-minute Vendor Delay', severity: 'Medium', contingency: 'Establish vendor arrival times 2 hours ahead of guest schedule with backup contact.' },
    ],
    sustainability: [
      'Eliminate single-use plastic bottles with attractive copper water dispensers and glassware.',
      'Partner with a certified local food rescue NGO (e.g. Robin Hood Army / Feeding India) to collect excess clean banquet meals.',
      'Use potted blooming plants and seasonal flowers as centerpieces, which guests can take home to plant.',
      'Opt for digital interactive RSVPs and QR-code programs instead of excessive printed pamphlets.',
    ],
  };
}

// 1. AI Event Plan Generation Endpoint
app.post('/api/ai/plan-event', async (req: Request, res: Response) => {
  try {
    const {
      eventType = 'Wedding',
      name = 'Grand Celebration',
      date = new Date().toISOString().split('T')[0],
      startTime = '10:00',
      endTime = '18:00',
      city = 'Hyderabad',
      venue = 'Scenic Banquet Garden',
      isOutdoor = false,
      guestCount = 150,
      duration = 'Full Day',
      preferredLanguage = 'English',
      culturalPreferences = 'Traditional Indian with modern luxury touches',
      budgetAmount = 250000,
      currency = 'INR',
      styleTheme = 'Royal Luxury',
      priorities = ['Catering', 'Photography', 'Decoration'],
    } = req.body;

    // If Gemini client is available, generate structured response with gemini-3.8-flash
    if (aiClient) {
      try {
        const prompt = `You are CelebrateAI, an elite event planner and celebration architect.
Create a comprehensive, production-grade celebration plan for:
Event: ${name} (${eventType})
Date: ${date}, Time: ${startTime} to ${endTime} (${duration})
City/Location: ${city}, Venue: ${venue} (${isOutdoor ? 'Outdoor' : 'Indoor'})
Guests: ${guestCount}
Budget: ${currency} ${budgetAmount}
Style & Theme: ${styleTheme}
Cultural Preferences: ${culturalPreferences}
Preferred Language: ${preferredLanguage}
Key Priorities: ${priorities.join(', ')}

Ensure that the sum of estimated costs in budgetCategories strictly equals ${budgetAmount} ${currency}.
Provide actionable, realistic, culturally-grounded ideas.`;

        const geminiPromise = aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                concept: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    colorPalette: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING },
                          hex: { type: Type.STRING },
                        },
                        required: ['name', 'hex'],
                      },
                    },
                    decorationIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
                    lightingIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
                    entertainmentIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
                    guestExperience: { type: Type.ARRAY, items: { type: Type.STRING } },
                    culturalNotes: { type: Type.STRING },
                    practicalTips: { type: Type.STRING },
                  },
                  required: ['title', 'description', 'colorPalette', 'decorationIdeas', 'lightingIdeas', 'entertainmentIdeas', 'guestExperience', 'culturalNotes', 'practicalTips'],
                },
                schedule: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      time: { type: Type.STRING },
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      category: { type: Type.STRING },
                    },
                    required: ['time', 'title', 'description', 'category'],
                  },
                },
                budgetCategories: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      category: { type: Type.STRING },
                      estimatedCost: { type: Type.NUMBER },
                      percentage: { type: Type.NUMBER },
                      reasoning: { type: Type.STRING },
                      lowerCostAlternative: { type: Type.STRING },
                    },
                    required: ['category', 'estimatedCost', 'percentage', 'reasoning', 'lowerCostAlternative'],
                  },
                },
                checklist: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      priority: { type: Type.STRING },
                      dueDate: { type: Type.STRING },
                      category: { type: Type.STRING },
                      status: { type: Type.STRING },
                    },
                    required: ['title', 'priority', 'dueDate', 'category', 'status'],
                  },
                },
                vendorRequirements: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      category: { type: Type.STRING },
                      selectionCriteria: { type: Type.STRING },
                      suggestedQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                      bookingDeadline: { type: Type.STRING },
                    },
                    required: ['category', 'selectionCriteria', 'suggestedQuestions', 'bookingDeadline'],
                  },
                },
                risks: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      risk: { type: Type.STRING },
                      severity: { type: Type.STRING },
                      contingency: { type: Type.STRING },
                    },
                    required: ['risk', 'severity', 'contingency'],
                  },
                },
                sustainability: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['concept', 'schedule', 'budgetCategories', 'checklist', 'vendorRequirements', 'risks', 'sustainability'],
            },
          },
        });

        // Timeout race in 8 seconds
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('AI generation timed out')), 8000)
        );

        const response: any = await Promise.race([geminiPromise, timeoutPromise]);
        const responseText = response?.text;
        if (responseText) {
          const parsedData = JSON.parse(responseText);
          return res.json({
            success: true,
            source: 'gemini-3.8-flash',
            plan: parsedData,
          });
        }
      } catch (geminiErr) {
        console.warn('Gemini live call timed out or failed, falling back to local engine:', geminiErr);
      }
    }

    // Fallback if no API key or empty response
    const fallback = generateDeterministicPlan({
      eventType,
      name,
      date,
      city,
      guestCount,
      budgetAmount,
      currency,
      styleTheme,
      priorities,
    });

    return res.json({
      success: true,
      source: 'local-intelligence-engine',
      plan: fallback,
      notice: aiClient ? undefined : 'Processed via CelebrateAI Deterministic Optimization Engine',
    });
  } catch (error: any) {
    console.error('Error generating AI event plan:', error);
    // Graceful fallback on API error
    const fallback = generateDeterministicPlan({
      eventType: req.body.eventType || 'Event',
      name: req.body.name || 'Celebration',
      date: req.body.date || 'Upcoming',
      city: req.body.city || 'City',
      guestCount: req.body.guestCount || 100,
      budgetAmount: req.body.budgetAmount || 200000,
      currency: req.body.currency || 'INR',
      styleTheme: req.body.styleTheme || 'Celebration',
      priorities: req.body.priorities || ['Catering', 'Venue'],
    });

    return res.json({
      success: true,
      source: 'local-intelligence-engine-fallback',
      plan: fallback,
      warning: 'Live AI request encountered a temporary error; loaded high-fidelity local plan.',
    });
  }
});

// 2. AI Budget Optimizer Endpoint
app.post('/api/ai/optimize-budget', async (req: Request, res: Response) => {
  try {
    const { targetReductionPct = 15, currentBudget = 250000, protectedCategories = ['Photography', 'Catering'], categories = [] } = req.body;

    if (aiClient) {
      try {
        const prompt = `You are a financial event planner. A user with an event budget of ${currentBudget} wants to reduce expenses by approximately ${targetReductionPct}%.
They want to protect these critical priorities without compromising quality: ${protectedCategories.join(', ')}.
Current categories & allocations: ${JSON.stringify(categories)}.

Provide a structured optimization plan:
1. Recommended budget breakdown with reduced amounts for non-essential categories.
2. Concrete negotiation tips and smart trade-offs for each modified category.
3. Total savings achieved.`;

        const geminiPromise = aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                targetBudget: { type: Type.NUMBER },
                totalSavings: { type: Type.NUMBER },
                percentageReduced: { type: Type.NUMBER },
                recommendations: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      category: { type: Type.STRING },
                      originalCost: { type: Type.NUMBER },
                      proposedCost: { type: Type.NUMBER },
                      actionableStrategy: { type: Type.STRING },
                    },
                    required: ['category', 'originalCost', 'proposedCost', 'actionableStrategy'],
                  },
                },
                overallAdvice: { type: Type.STRING },
              },
              required: ['targetBudget', 'totalSavings', 'percentageReduced', 'recommendations', 'overallAdvice'],
            },
          },
        });

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('AI optimization timed out')), 8000)
        );

        const response: any = await Promise.race([geminiPromise, timeoutPromise]);
        if (response?.text) {
          return res.json({ success: true, optimization: JSON.parse(response.text) });
        }
      } catch (err) {
        console.warn('AI budget optimization timed out or failed, using local calculation:', err);
      }
    }

    // Deterministic fallback optimizer
    const targetSavings = Math.round(currentBudget * (targetReductionPct / 100));
    const targetBudget = currentBudget - targetSavings;
    const recommendations = (categories.length > 0 ? categories : [
      { category: 'Venue', estimatedCost: currentBudget * 0.25 },
      { category: 'Catering', estimatedCost: currentBudget * 0.30 },
      { category: 'Decoration', estimatedCost: currentBudget * 0.15 },
      { category: 'Entertainment', estimatedCost: currentBudget * 0.10 },
      { category: 'Invitations', estimatedCost: currentBudget * 0.05 },
    ]).map((cat: any) => {
      const isProtected = protectedCategories.includes(cat.category);
      const discount = isProtected ? 0 : 0.25;
      const proposed = Math.round(cat.estimatedCost * (1 - discount));
      return {
        category: cat.category,
        originalCost: cat.estimatedCost,
        proposedCost: proposed,
        actionableStrategy: isProtected
          ? 'Preserved at full budget to protect your highest-priority celebration experience.'
          : 'Substitute premium imported items with artisanal seasonal alternatives or renegotiate service package bundle.',
      };
    });

    return res.json({
      success: true,
      optimization: {
        targetBudget,
        totalSavings: targetSavings,
        percentageReduced: targetReductionPct,
        recommendations,
        overallAdvice: `By focusing reductions on flexible items (such as floral imports and print collaterals) while protecting ${protectedCategories.join(' & ')}, you save ${targetSavings} without diminishing guest satisfaction.`,
      },
    });
  } catch (error) {
    console.error('Error optimizing budget:', error);
    res.status(500).json({ error: 'Failed to optimize budget' });
  }
});

// 3. AI Copilot Chat Endpoint
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  try {
    const { message, history = [], eventContext } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (aiClient) {
      try {
        const contextPrompt = eventContext
          ? `Context of currently active event:
Event Name: ${eventContext.name || 'Celebration'}
Type: ${eventContext.eventType || 'Event'}
Date: ${eventContext.date || 'TBD'}, City: ${eventContext.city || 'TBD'}
Guests: ${eventContext.guestCount || 'N/A'}, Budget: ${eventContext.currency || 'INR'} ${eventContext.budget?.total || 'N/A'}
Theme: ${eventContext.styleTheme || 'Custom'}`
          : 'No specific event selected yet.';

        const chat = aiClient.chats.create({
          model: 'gemini-3.8-flash',
          config: {
            systemInstruction: `You are CelebrateAI Copilot, an elite, warm, creative, and highly organized celebration planner.
${contextPrompt}

Rules:
- Give concrete, actionable, culturally mindful event planning advice.
- When answering questions about budgets, timelines, decor, dietary catering, or invitations, provide structured bullet points.
- Never invent confirmed real-world vendor contracts or pretend to have booked items.
- If asked to reduce budgets or generate invitations in regional languages (e.g. Hindi, Telugu, Tamil, French, Spanish), fulfill the request authentically with translations.
- Be concise, friendly, and practical.`,
          },
        });

        const chatPromise = chat.sendMessage({
          message,
        });

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Chat timed out')), 8000)
        );

        const response: any = await Promise.race([chatPromise, timeoutPromise]);
        if (response?.text) {
          return res.json({
            success: true,
            reply: response.text,
          });
        }
      } catch (chatErr) {
        console.warn('AI chat timed out or failed, using local assistant engine:', chatErr);
      }
    }

    // High-fidelity fallback chat assistant
    const lower = message.toLowerCase();
    let reply = "I'm your CelebrateAI Copilot! I can help you refine your event theme, adjust budgets, organize vendor checklists, or craft custom invitations. What would you like to plan today?";

    if (lower.includes('budget') || lower.includes('reduce') || lower.includes('cost')) {
      reply = `To optimize your budget effectively:
1. **Catering Strategy**: Replace a 10-course sit-down meal with 4 curated live gourmet counters. This typically saves 15-20% on food waste and staffing.
2. **Floral & Decor**: Use cascading greenery, fairy lights, and seasonal local blooms (like marigolds and jasmine) instead of off-season imports.
3. **Digital Invitations**: Switching completely to interactive WhatsApp/Web RSVPs saves printing, calligraphy, and postage fees.
4. **Photography**: Book a 6-hour targeted coverage window focusing on key ceremonies rather than full 12-hour crew presence.`;
    } else if (lower.includes('rain') || lower.includes('weather')) {
      reply = `Outdoor Weather Contingency Protocol:
1. **Waterproof Marquee**: Ensure your venue contract has a standby clear-span German hangar or marquee tent clause with 48h activation notice.
2. **Floor Elevation**: Wooden or acrylic sub-flooring prevents grass mudding during sudden showers.
3. **Guest Comfort**: Provide stylish branded umbrellas at the valet station and warm welcome towels.
4. **Electrical Safety**: Elevate all sound cables and generator connections off ground level with rubber ramps.`;
    } else if (lower.includes('invitation') || lower.includes('telugu') || lower.includes('hindi')) {
      reply = `Here is an elegant celebration invitation draft:

"Together with their families,
[Host Names]
cordially invite you to celebrate the joyous union of
[Name] & [Name]

Date: [Date] | Time: [Time]
Venue: [Venue Name], [City]

Your gracious presence and heartfelt blessings will make our special day truly complete.

RSVP: [Contact / Phone]
Please join us for dinner and festivities following the ceremony."`;
    } else if (lower.includes('dinosaur') || lower.includes('birthday')) {
      reply = `Dinosaur-Themed Birthday Party Blueprint:
- **Decor**: "Jurassic Jungle" with giant monstera leaves, green & gold balloon arches, burlap table runners, and fossil excavation sandpits.
- **Cake**: Volcano chocolate lava cake with chocolate rock crumbs and toy dinosaur toppers.
- **Activity**: "Junior Paleontologist Dig" where kids wear safari hats and find dinosaur fossils in kinetic sand.
- **Party Favor**: Personalized dinosaur excavation kit with mini magnifying glass and custom thank-you tag.`;
    }

    return res.json({
      success: true,
      reply,
      notice: 'CelebrateAI Copilot Local Engine',
    });
  } catch (error) {
    console.error('Error in AI chat endpoint:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// Mount Vite or serve static dist
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎉 CelebrateAI Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start CelebrateAI server:', err);
  process.exit(1);
});
