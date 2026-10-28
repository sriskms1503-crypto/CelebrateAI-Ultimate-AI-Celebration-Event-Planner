import { EventPlan, InspirationItem } from '../types/event';

// Pre-curated inspiration gallery with generated editorial images & high-fidelity celebration themes
export const INITIAL_INSPIRATION_ITEMS: InspirationItem[] = [
  {
    id: 'insp-1',
    title: 'Royal Mandap & Golden Silk Heritage',
    category: 'Wedding decoration',
    imageUrl: '/src/assets/images/wedding_royal_palace_1793190298989.jpg',
    description: 'Lavish traditional Indian celebration with carved golden pillars, cascading marigold & jasmine arches, and brass diya accents.',
    colorPalette: [
      { name: 'Royal Violet', hex: '#4A154B' },
      { name: 'Champagne Gold', hex: '#D4AF37' },
      { name: 'Sunset Marigold', hex: '#F59E0B' },
    ],
    suitableEvents: ['Wedding', 'Engagement', 'Cultural festival'],
    indicativeBudget: '₹1,50,000 – ₹5,00,000',
    isSaved: true,
  },
  {
    id: 'insp-2',
    title: 'Enchanted Twilight Garden Banquet',
    category: 'Garden venues',
    imageUrl: '/src/assets/images/garden_outdoor_event_1793190300102.jpg',
    description: 'Intimate alfresco dining under a romantic canopy of glowing string fairy lights with rustic wooden banquets and eucalyptus runners.',
    colorPalette: [
      { name: 'Forest Green', hex: '#166534' },
      { name: 'Warm Amber', hex: '#F59E0B' },
      { name: 'Ivory Cream', hex: '#FFFDF9' },
    ],
    suitableEvents: ['Anniversary', 'Wedding', 'Community event'],
    indicativeBudget: '₹75,000 – ₹2,50,000',
    isSaved: true,
  },
  {
    id: 'insp-3',
    title: 'Chic Blush & Champagne Milestone Soirée',
    category: 'Birthday themes',
    imageUrl: '/src/assets/images/birthday_party_festive_1793190299046.jpg',
    description: 'Sophisticated modern party setting with organic peach and blush balloon garlands, crystal dessert plinths, and golden party accents.',
    colorPalette: [
      { name: 'Blush Coral', hex: '#FB7185' },
      { name: 'Peach Sunset', hex: '#FDBA74' },
      { name: 'Champagne', hex: '#FDE68A' },
    ],
    suitableEvents: ['Birthday', 'Anniversary', 'Baby shower'],
    indicativeBudget: '₹35,000 – ₹1,20,000',
    isSaved: false,
  },
  {
    id: 'insp-4',
    title: 'Contemporary Geometric Gala Stage',
    category: 'Stage design',
    imageUrl: '/src/assets/images/corporate_gala_stage_1793190300154.jpg',
    description: 'Sleek architectural LED light sculptures, deep purple banquet linens, and modern floral centerpieces for awards and milestones.',
    colorPalette: [
      { name: 'Deep Indigo', hex: '#312E81' },
      { name: 'Electric Violet', hex: '#7C3AED' },
      { name: 'Platinum Silver', hex: '#E2E8F0' },
    ],
    suitableEvents: ['Corporate gathering', 'College festival', 'Graduation'],
    indicativeBudget: '₹2,00,000 – ₹8,00,000',
    isSaved: false,
  },
  {
    id: 'insp-5',
    title: 'Grand Palace Floral Chandelier Hall',
    category: 'Lighting',
    imageUrl: '/src/assets/images/hero_grand_celebration_1793190297590.jpg',
    description: 'Breathtaking floral ceiling canopy suspended with warm fairy lights and antique crystal chandeliers above dancing guests.',
    colorPalette: [
      { name: 'Royal Violet', hex: '#4A154B' },
      { name: 'Peach Orchid', hex: '#FED7AA' },
      { name: 'Warm Gold', hex: '#EAB308' },
    ],
    suitableEvents: ['Wedding', 'Anniversary', 'Corporate gathering'],
    indicativeBudget: '₹3,00,000 – ₹10,00,000',
    isSaved: true,
  },
];

// Demo Event compliant with Section 17 specifications
export const DEMO_EVENT: EventPlan = {
  id: 'demo-event-garden-wedding',
  name: 'Elegant Garden Wedding',
  eventType: 'Wedding',
  date: '2026-11-28',
  startTime: '10:00',
  endTime: '18:00',
  city: 'Hyderabad, India',
  venue: 'Jubilee Hills Garden Pavilion',
  isOutdoor: true,
  guestCount: 150,
  duration: 'Full Day Celebration',
  preferredLanguage: 'English & Telugu',
  culturalPreferences: 'Traditional Telugu rituals with elegant floral & modern champagne touches',
  currency: 'INR',
  isDemo: true,
  createdAt: '2026-10-28T05:00:00.000Z',
  updatedAt: '2026-10-28T05:00:00.000Z',
  budget: {
    total: 250000,
    emergencyReserve: 15000,
    categories: [
      {
        category: 'Venue',
        estimatedCost: 60000,
        percentage: 24,
        reasoning: 'Lush lawn booking with electricity generator backup, bridal greenroom & parking.',
        lowerCostAlternative: 'Host at morning slots on weekday or choose a community club garden.',
      },
      {
        category: 'Catering',
        estimatedCost: 75000,
        percentage: 30,
        reasoning: 'Authentic 18-item traditional South Indian banquet served on banana leaves + mocktail counter.',
        lowerCostAlternative: 'Reduce starter count and spotlight signature regional delicacies.',
      },
      {
        category: 'Decoration',
        estimatedCost: 40000,
        percentage: 16,
        reasoning: 'Marigold floral mandap canopy, brass lamps, entrance floral arch and fairy light trees.',
        lowerCostAlternative: 'Utilize sustainable potted plants and locally grown loose marigolds.',
      },
      {
        category: 'Photography',
        estimatedCost: 30000,
        percentage: 12,
        reasoning: 'Two photographers (traditional + candid) with drone highlight reel and photo book.',
        lowerCostAlternative: 'Single lead candid photographer with raw cloud delivery.',
      },
      {
        category: 'Entertainment',
        estimatedCost: 18000,
        percentage: 7,
        reasoning: 'Live Nadaswaram & mridangam instrumentalists for auspicious ceremony.',
        lowerCostAlternative: 'Acoustic violin duo with curated classical instrumental playlist.',
      },
      {
        category: 'Clothing & Styling',
        estimatedCost: 12000,
        percentage: 5,
        reasoning: 'Bridal traditional hair adornment (Poola Jada) and groom turban styling.',
        lowerCostAlternative: 'In-home family styling with rented ceremonial jewelry.',
      },
      {
        category: 'Invitations',
        estimatedCost: 5000,
        percentage: 2,
        reasoning: 'Gold-embossed keepsake cards for elders + animated WhatsApp invite for all guests.',
        lowerCostAlternative: '100% digital RSVP page with wedding website link.',
      },
      {
        category: 'Emergency Reserve',
        estimatedCost: 10000,
        percentage: 4,
        reasoning: 'Reserved for extra unexpected guests (+10) and sudden weather protection.',
        lowerCostAlternative: 'Strict RSVP confirmation 3 days prior.',
      },
    ],
    expenses: [
      {
        id: 'exp-1',
        category: 'Venue',
        name: 'Pavilion Advance Booking Deposit',
        amount: 30000,
        date: '2026-10-15',
        paymentStatus: 'Paid',
        vendorName: 'Jubilee Hills Garden Pavilion',
        notes: '50% advance confirmed via bank transfer. Receipt #JH-4029.',
      },
      {
        id: 'exp-2',
        category: 'Catering',
        name: 'Caterer Menu Advance',
        amount: 35000,
        date: '2026-10-20',
        paymentStatus: 'Paid',
        vendorName: 'Sri Krishna Royal Caterers',
        notes: 'Deposit locked for 150 plates with live sweet counter.',
      },
      {
        id: 'exp-3',
        category: 'Photography',
        name: 'Photographer Retainer',
        amount: 15000,
        date: '2026-10-22',
        paymentStatus: 'Paid',
        vendorName: 'Vibrant Moments Photography',
        notes: 'Retainer paid; balance due on delivery of highlight reel.',
      },
      {
        id: 'exp-4',
        category: 'Decoration',
        name: 'Floral Mandap Advance',
        amount: 20000,
        date: '2026-10-25',
        paymentStatus: 'Paid',
        vendorName: 'Pushpam Floral Decor',
        notes: 'Fresh marigold and jasmine orders placed.',
      },
      {
        id: 'exp-5',
        category: 'Invitations',
        name: 'Digital Invitation Suite & Printing',
        amount: 4500,
        date: '2026-10-26',
        paymentStatus: 'Paid',
        vendorName: 'CelebrateAI Studio',
        notes: 'Digital wedding portal and 40 physical elder cards printed.',
      },
    ],
  },
  styleTheme: 'Traditional Indian with Romantic Garden Florals',
  priorities: ['Catering', 'Photography', 'Decoration', 'Sustainability'],
  concept: {
    title: 'Siddhartha & Ananya: Traditional Floral Garden Wedding',
    description: 'An auspicious Telugu wedding celebration set in an enchanting open-air Hyderabad garden, honoring cultural traditions with fragrant marigold cascades, soulful live instruments, and sustainable zero-waste hospitality.',
    colorPalette: [
      { name: 'Royal Violet', hex: '#4A154B' },
      { name: 'Champagne Gold', hex: '#D4AF37' },
      { name: 'Sunset Marigold', hex: '#F59E0B' },
      { name: 'Soft Jasmine White', hex: '#FAF8F5' },
    ],
    decorationIdeas: [
      'Four-pillar floral mandap constructed with natural bamboo, fragrant yellow marigolds, and white jasmine strings',
      'Entrance arch with brass urlis floating with lotus blossoms and flickering tea lights',
      'Guest seating with white linen covers and gold organza sashes under shaded garden trees',
      'Eco-friendly backdrop with repurposed brass bells and handloom silk drapes',
    ],
    lightingIdeas: [
      'Warm ambient fairy lights woven through the garden canopy',
      'Traditional tall brass kuthu vilakku oil lamps lit during muhurtham',
      'Soft amber pin-spots illuminating the wedding mandap ceremony stage',
    ],
    entertainmentIdeas: [
      'Traditional Nadaswaram and Thavil artists performing classical ragas during guest arrival',
      'Curated acoustic Telugu and Carnatic instrumental fusion during the lunch banquet',
      'Dedicated instant photo booth with brass props and floral frames for family portraits',
    ],
    guestExperience: [
      'Tender coconut and fresh rose-sharbat welcome drinks upon arrival',
      'Handmade silk pouches containing sacred turmeric, kumkum, and fragrant jasmine for guests',
      'Live jalebi and masala chai counter post-ceremony',
    ],
    culturalNotes: 'Muhurtham is set at 11:15 AM; elders blessing lounge is situated adjacent to mandap with easy accessibility ramps.',
    practicalTips: 'Ensure lawn misting fans are activated by 10:30 AM; assign two family liaisons for valet parking coordination.',
  },
  schedule: [
    { time: '07:30', title: 'Decor & Mandap Final Inspection', description: 'Fresh floral installation check, sound test, and altar setup.', category: 'Decoration' },
    { time: '09:00', title: 'Bride & Groom Arrival & Photoshoot', description: 'Portraits in the morning garden light before guest arrival.', category: 'Photography' },
    { time: '09:45', title: 'Guest Arrival & Welcome Refreshments', description: 'Nadaswaram music begins, fresh tender coconut served.', category: 'Guest Experience' },
    { time: '10:30', title: 'Pre-Ceremony Rituals & Ganesh Puja', description: 'Auspicious opening rituals with family elders.', category: 'Ceremony' },
    { time: '11:15', title: 'Muhurtham & Jeelakarra Bellam', description: 'Sacred wedding vows, Mangalasutra tying and Talambralu celebration.', category: 'Ceremony' },
    { time: '13:00', title: 'Traditional Banana Leaf Lunch Banquet', description: '18-course royal feast served in the pavilion hall.', category: 'Catering' },
    { time: '15:00', title: 'Arundhati Nakshatra & Blessings Session', description: 'Extended family photography, gift exchanges, and elders blessings.', category: 'Ceremony' },
    { time: '16:30', title: 'Appaginthalu & Joyous Farewell', description: 'Distribution of sweet boxes, thank-you tokens, and departure.', category: 'Closing' },
  ],
  checklist: [
    { id: 'task-1', title: 'Pay 50% deposit to Jubilee Hills Pavilion', priority: 'High', dueDate: '2026-10-15', category: 'Venue', status: 'Completed' },
    { id: 'task-2', title: 'Conduct menu tasting with Sri Krishna Caterers', priority: 'High', dueDate: '2026-10-20', category: 'Catering', status: 'Completed' },
    { id: 'task-3', title: 'Send digital WhatsApp invitations with RSVP link', priority: 'High', dueDate: '2026-10-26', category: 'Invitations', status: 'Completed' },
    { id: 'task-4', title: 'Finalize traditional Nadaswaram musicians schedule', priority: 'Medium', dueDate: '2026-11-05', category: 'Entertainment', status: 'In Progress' },
    { id: 'task-5', title: 'Review flower delivery timeline for morning setup', priority: 'High', dueDate: '2026-11-10', category: 'Decoration', status: 'Pending' },
    { id: 'task-6', title: 'Collate dietary restrictions and wheelchair requests', priority: 'High', dueDate: '2026-11-15', category: 'Guests', status: 'Pending' },
    { id: 'task-7', title: 'Prepare emergency kit (safety pins, paracetamol, umbrellas)', priority: 'Low', dueDate: '2026-11-25', category: 'Logistics', status: 'Pending' },
    { id: 'task-8', title: 'Final briefing with wedding coordinator and panditji', priority: 'High', dueDate: '2026-11-27', category: 'Ceremony', status: 'Pending' },
  ],
  vendors: [
    {
      id: 'ven-1',
      name: 'Jubilee Hills Garden Pavilion',
      category: 'Venue',
      serviceArea: 'Hyderabad Central',
      contactInfo: '+91 98490 12345 | events@jubileegardens.in',
      description: 'Lush 2-acre landscaped lawn with air-conditioned dining pavilion and ample valet parking.',
      quotedPrice: 60000,
      bookingStatus: 'Booked',
      paymentStatus: 'Partial',
      contractRef: 'CTR-JH-2026-08',
      quotations: [
        {
          id: 'q-1',
          vendorName: 'Jubilee Hills Garden Pavilion',
          totalPrice: 60000,
          includedServices: ['Lawn for 12 hours', 'Power generator backup', '2 Bridal greenrooms', '100 banquet chairs'],
          exclusions: ['Outside sound license fees', 'Cleaning surcharge if confetti used'],
          deposit: 30000,
          cancellationTerms: '90% refund if cancelled 30 days prior',
          paymentSchedule: '50% advance, 50% on morning of event',
          additionalCharges: '₹3,000 per extra hour beyond 10 PM',
          notes: 'Signed contract on file.',
        },
      ],
    },
    {
      id: 'ven-2',
      name: 'Sri Krishna Royal Caterers',
      category: 'Catering',
      serviceArea: 'Greater Hyderabad',
      contactInfo: '+91 94401 56789 | contact@srikrishnacaters.com',
      description: 'Acclaimed vegetarian wedding caterers specializing in authentic Telangana and Andhra wedding feasts.',
      quotedPrice: 75000,
      bookingStatus: 'Booked',
      paymentStatus: 'Partial',
      quotations: [
        {
          id: 'q-2',
          vendorName: 'Sri Krishna Royal Caterers',
          totalPrice: 75000,
          includedServices: ['18-item banana leaf meal', 'Fresh tender coconut welcome', '2 live dessert counters', '30 trained service stewards'],
          exclusions: ['Packaged bottled water (using copper filters instead)'],
          deposit: 35000,
          cancellationTerms: 'Deposit non-refundable within 14 days of event',
          paymentSchedule: '₹35,000 advance, balance upon meal completion',
          additionalCharges: '₹450 per additional plate above 150',
          notes: 'Special requests: Diabetic-friendly kheer and no garlic options noted.',
        },
      ],
    },
    {
      id: 'ven-3',
      name: 'Vibrant Moments Photography',
      category: 'Photography',
      serviceArea: 'Hyderabad & Bangalore',
      contactInfo: '+91 91234 98765 | hello@vibrantmoments.studio',
      description: 'Award-winning wedding candid photography duo known for soft natural lighting and documentary storytelling.',
      quotedPrice: 30000,
      bookingStatus: 'Booked',
      paymentStatus: 'Partial',
      quotations: [
        {
          id: 'q-3',
          vendorName: 'Vibrant Moments Photography',
          totalPrice: 30000,
          includedServices: ['Full day coverage (8 hours)', '1 Candid + 1 Traditional photographer', 'Drone ceremony footage', '350 edited photos + 3-minute highlight video'],
          exclusions: ['Physical leather album (available for +₹8,000)'],
          deposit: 15000,
          cancellationTerms: 'Transferable to another date within 6 months',
          paymentSchedule: '50% booking deposit, 50% on photo drive delivery',
          additionalCharges: 'None',
        },
      ],
    },
    {
      id: 'ven-4',
      name: 'Pushpam Floral Decor',
      category: 'Decoration',
      serviceArea: 'Hyderabad',
      contactInfo: '+91 98850 44332 | info@pushpamdecor.in',
      description: 'Floral boutique specializing in sustainable marigold arches, brass temple bells, and traditional mandaps.',
      quotedPrice: 40000,
      bookingStatus: 'Booked',
      paymentStatus: 'Partial',
      quotations: [
        {
          id: 'q-4',
          vendorName: 'Pushpam Floral Decor',
          totalPrice: 40000,
          includedServices: ['Mandap setup with 100 kg fresh marigold', 'Pathway brass lanterns', 'Main gate arch', 'Stage backdrop'],
          exclusions: ['Heavy sound trusses'],
          deposit: 20000,
          cancellationTerms: 'Cancelable up to 7 days before event with 50% refund',
          paymentSchedule: '50% on booking, 50% upon setup completion at 8 AM',
          additionalCharges: 'None',
        },
      ],
    },
  ],
  guests: [
    { id: 'g-1', name: 'Dr. Ramesh & Lalitha Rao', contact: 'ramesh.rao@email.com', attendeesCount: 2, invitationStatus: 'Opened', rsvpStatus: 'Attending', dietary: 'Vegetarian, Low Sugar', seatingGroup: 'Bride Family VIP', accessibility: 'Wheelchair assistance requested', notes: 'Groom paternal uncle' },
    { id: 'g-2', name: 'Suresh Kumar & Family', contact: '+91 98480 11223', attendeesCount: 4, invitationStatus: 'Opened', rsvpStatus: 'Attending', dietary: 'Vegetarian', seatingGroup: 'Groom Relatives', accessibility: 'None', notes: 'Arriving from Vijayawada' },
    { id: 'g-3', name: 'Pooja Reddy', contact: 'pooja.r@gmail.com', attendeesCount: 1, invitationStatus: 'Opened', rsvpStatus: 'Attending', dietary: 'Vegan', seatingGroup: 'College Friends', accessibility: 'None', notes: 'Bridesmaid' },
    { id: 'g-4', name: 'Karthik & Sneha Varma', contact: '+91 99890 33445', attendeesCount: 2, invitationStatus: 'Sent', rsvpStatus: 'Pending', dietary: 'Vegetarian', seatingGroup: 'Colleagues', accessibility: 'None', notes: 'Follow-up call next week' },
    { id: 'g-5', name: 'Vikram Joshi', contact: 'v.joshi@techcorp.in', attendeesCount: 1, invitationStatus: 'Sent', rsvpStatus: 'Declined', dietary: 'N/A', seatingGroup: 'Colleagues', accessibility: 'None', notes: 'Traveling abroad on event date' },
    { id: 'g-6', name: 'Shanti Devi', contact: '+91 94412 88990', attendeesCount: 2, invitationStatus: 'Opened', rsvpStatus: 'Attending', dietary: 'Strict Jain (No root vegetables)', seatingGroup: 'Grandparents & Elders', accessibility: 'Requires ground floor seating near ceremony', notes: 'Grandmother' },
    { id: 'g-7', name: 'Aditya & Neha Sharma', contact: 'aditya.sharma@outlook.com', attendeesCount: 2, invitationStatus: 'Opened', rsvpStatus: 'Attending', dietary: 'Vegetarian', seatingGroup: 'College Friends', accessibility: 'None' },
    { id: 'g-8', name: 'Venkat Raman', contact: '+91 97000 55667', attendeesCount: 3, invitationStatus: 'Sent', rsvpStatus: 'Pending', dietary: 'Vegetarian', seatingGroup: 'Neighbors', accessibility: 'None' },
  ],
  inspiration: INITIAL_INSPIRATION_ITEMS,
  moodBoards: [
    {
      id: 'mb-1',
      name: 'Garden Marigold & Brass Dream',
      description: 'Warm gold, traditional yellow, and royal violet palette with fragrant flowers and sustainable brassware.',
      inspirationIds: ['insp-1', 'insp-2', 'insp-5'],
      createdAt: '2026-10-28T05:00:00.000Z',
    },
  ],
  invitation: {
    templateId: 'royal-floral',
    title: 'The Wedding Celebration',
    hostNames: 'Sri & Smt. K. Venkata Rao and Sri & Smt. M. Raghunath',
    date: 'Saturday, November 28, 2026',
    time: '10:00 AM onwards (Muhurtham 11:15 AM)',
    venue: 'Jubilee Hills Garden Pavilion',
    address: 'Road No. 36, Jubilee Hills, Hyderabad',
    rsvpDetails: '+91 98490 12345 / celebrateai.in/ananya-siddharth',
    language: 'English with Telugu Blessings',
    colorTheme: 'Royal Violet & Champagne Gold',
    font: 'Playfair Display',
    decorativeBorder: 'Floral Mandap Motif',
  },
  risks: [
    { risk: 'Afternoon Heat in Outdoor Pavilion', severity: 'Medium', contingency: 'Deploy 6 water-misting high-velocity fans under the shade trees and provide chilled tender coconut.' },
    { risk: 'Guest Overrun (+20 guests beyond 150)', severity: 'Medium', contingency: 'Caterer contract includes a 15-plate buffer at standard per-plate rate.' },
    { risk: 'Parking Congestion on Road 36', severity: 'Low', contingency: '4 dedicated valet attendants contracted with adjacent open lot reservation.' },
    { risk: 'Audio Feedback during Pandit Vows', severity: 'Low', contingency: 'Sound engineer on-site with 2 lapel microphones and battery backup amp.' },
  ],
  vendorRequirements: [
    { category: 'Venue', selectionCriteria: 'Lawn with minimum 200 person capacity, clear lawn maintenance, generator backup', suggestedQuestions: ['Is outside catering allowed without corkage?', 'What are the music curfew timings?'], bookingDeadline: '6-8 weeks before' },
    { category: 'Caterer', selectionCriteria: 'Expertise in traditional Telugu banana leaf service, clean water filtration', suggestedQuestions: ['Can you provide live hot sweet counters?', 'How do you package remaining clean food?'], bookingDeadline: '4-6 weeks before' },
    { category: 'Photographer', selectionCriteria: 'Natural lighting portfolio, drone certification, fast turnaround of teaser reel', suggestedQuestions: ['Do you bring backup cameras and lenses?', 'When will high-res photos be delivered?'], bookingDeadline: '4 weeks before' },
  ],
  sustainability: [
    'Zero Single-Use Plastic: Copper urns with infused mint water and glass goblets instead of plastic bottles.',
    'Food Rescue Partnership: Robin Hood Army Hyderabad pre-notified to collect any untouched prepared meals for local shelter homes.',
    'Plantable Favors: Guest return gift bags include organic holy basil (Tulsi) seed packets and locally woven jute bags.',
    'Natural Composting: All banana leaves and fresh marigold flowers sent to Jubilee Gardens organic composting facility after the event.',
  ],
  notes: 'Ensure Panditji arrives by 9:30 AM with all puja samagri. Family coordinators: Anand (Logistics), Divya (Guest hospitality).',
};

const STORAGE_KEY = 'celebrate_ai_events';
const ACTIVE_EVENT_KEY = 'celebrate_ai_active_event_id';

/**
 * Storage API for CelebrateAI
 */
export const StorageService = {
  getEvents(): EventPlan[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        // Initialize with DEMO_EVENT
        localStorage.setItem(STORAGE_KEY, JSON.stringify([DEMO_EVENT]));
        localStorage.setItem(ACTIVE_EVENT_KEY, DEMO_EVENT.id);
        return [DEMO_EVENT];
      }
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([DEMO_EVENT]));
        return [DEMO_EVENT];
      }
      return parsed;
    } catch {
      return [DEMO_EVENT];
    }
  },

  getActiveEventId(): string {
    const id = localStorage.getItem(ACTIVE_EVENT_KEY);
    return id || DEMO_EVENT.id;
  },

  setActiveEventId(id: string): void {
    localStorage.setItem(ACTIVE_EVENT_KEY, id);
  },

  saveEvent(event: EventPlan): void {
    const events = this.getEvents();
    const index = events.findIndex((e) => e.id === event.id);
    const updatedEvent = { ...event, updatedAt: new Date().toISOString() };

    if (index >= 0) {
      events[index] = updatedEvent;
    } else {
      events.unshift(updatedEvent);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  },

  deleteEvent(id: string): void {
    const events = this.getEvents().filter((e) => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    if (this.getActiveEventId() === id) {
      if (events.length > 0) {
        this.setActiveEventId(events[0].id);
      } else {
        this.saveEvent(DEMO_EVENT);
        this.setActiveEventId(DEMO_EVENT.id);
      }
    }
  },

  resetToDemo(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([DEMO_EVENT]));
    localStorage.setItem(ACTIVE_EVENT_KEY, DEMO_EVENT.id);
  },
};
