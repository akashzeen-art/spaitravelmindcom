/** Female OpenAI TTS voices. */
const FEMALE_VOICES = {
  nova: 'nova', // bright, energetic American-leaning female
  shimmer: 'shimmer', // soft, polished European-leaning female
  coral: 'coral', // warm, expressive female
  sage: 'sage', // calm, clear female
};

/** Shared language defs used by destinations + practice pages. */
export const GUIDE_LANGUAGES = {
  en: {
    id: 'en',
    name: 'English',
    nativeName: 'English',
    speakLang: 'en-US',
    flag: '/images/en-flag.png',
    ttsVoice: FEMALE_VOICES.nova,
  },
  es: {
    id: 'es',
    name: 'Spanish',
    nativeName: 'EspaÃ±ol',
    speakLang: 'es-ES',
    flag: '/images/es-flag.png',
    ttsVoice: FEMALE_VOICES.coral,
  },
  fr: {
    id: 'fr',
    name: 'French',
    nativeName: 'FranÃ§ais',
    speakLang: 'fr-FR',
    flag: '/images/fr-flag.png',
    ttsVoice: FEMALE_VOICES.shimmer,
  },
  ar: {
    id: 'ar',
    name: 'Arabic',
    nativeName: 'Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©',
    speakLang: 'ar-SA',
    flag: '/images/ar-flag.png',
    // Female voice (never onyx â€” that reads male)
    ttsVoice: FEMALE_VOICES.coral,
  },
  pt: {
    id: 'pt',
    name: 'Portuguese',
    nativeName: 'PortuguÃªs',
    speakLang: 'pt-BR',
    flag: '/images/pt-flag.png',
    ttsVoice: FEMALE_VOICES.nova,
  },
  sw: {
    id: 'sw',
    name: 'Swahili',
    nativeName: 'Kiswahili',
    speakLang: 'sw-KE',
    flag: '/images/sw-flag.png',
    ttsVoice: FEMALE_VOICES.coral,
  },
  it: {
    id: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    speakLang: 'it-IT',
    flag: '/images/it-flag.png',
    ttsVoice: FEMALE_VOICES.shimmer,
  },
  hi: {
    id: 'hi',
    name: 'Hindi',
    nativeName: 'à¤¹à¤¿à¤¨à¥à¤¦à¥€',
    speakLang: 'hi-IN',
    flag: '/images/hi-flag.png',
    ttsVoice: FEMALE_VOICES.coral,
  },
};

/** Country/region â†’ English female voice + accent for TTS. */
function langs(...ids) {
  return ids.map((id) => GUIDE_LANGUAGES[id]).filter(Boolean);
}

export const cities = [
  {
    id: 'amsterdam',
    name: 'Amsterdam',
    country: 'Netherlands',
    image: '/images/amsterdam.jpg',
    tagline: 'Canals, culture, and cycling through historic streets.',
    languages: langs('en'),
  },
  {
    id: 'kathmandu',
    name: 'Kathmandu',
    country: 'Nepal',
    image: '/images/kathmandu.jpg',
    tagline: 'Temples, mountain views, and Himalayan heritage.',
    languages: langs('en'),
  },
  {
    id: 'barcelona',
    name: 'Barcelona',
    country: 'Spain',
    image: '/images/barcelona.jpg',
    tagline: 'GaudÃ­ masterpieces, beaches, and Catalan flair.',
    languages: langs('en', 'es'),
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    image: '/images/paris.jpg',
    tagline: 'Art, romance, and world-class cuisine.',
    languages: langs('en', 'fr'),
  },
  {
    id: 'sydney',
    name: 'Sydney',
    country: 'Australia',
    image: '/images/sydney.jpg',
    tagline: 'Harbour views, coastal walks, and sunny adventures.',
    languages: langs('en'),
  },
  {
    id: 'delhi',
    name: 'Delhi',
    country: 'India',
    image: '/images/delhi.jpg',
    tagline: 'Historic capitals, street food, and bustling markets.',
    languages: langs('en', 'hi'),
  },
  {
    id: 'bangkok',
    name: 'Bangkok',
    country: 'Thailand',
    image: '/images/bangkok.jpg',
    tagline: 'Temples, night markets, and vibrant street life.',
    languages: langs('en'),
  },
  {
    id: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    image: '/images/singapore.jpg',
    tagline: 'Gardens, food courts, and futuristic cityscapes.',
    languages: langs('en'),
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    image: '/images/dubai.jpg',
    tagline: 'Skyscrapers, desert adventures, and luxury shopping.',
    languages: langs('en', 'ar'),
  },
  {
    id: 'istanbul',
    name: 'Istanbul',
    country: 'Turkey',
    image: '/images/istanbul.jpg',
    tagline: 'Where Europe meets Asia â€” mosques, bazaars, and the Bosphorus.',
    languages: langs('en', 'ar'),
  },
  {
    id: 'new-york',
    name: 'New York',
    country: 'United States',
    image: '/images/newyork.jpg',
    tagline: 'Skyline icons, neighborhoods, and endless energy.',
    languages: langs('en'),
  },
  {
    id: 'rio-de-janeiro',
    name: 'Rio de Janeiro',
    country: 'Brazil',
    image: '/images/rio.jpg',
    tagline: 'Beaches, samba, and mountains by the sea.',
    languages: langs('en', 'pt'),
  },
];

export const countries = [
  {
    id: 'armenia',
    name: 'Armenia',
    image: '/images/armenia.jpg',
    tagline: 'Ancient monasteries and mountain landscapes.',
    languages: langs('en'),
  },
  {
    id: 'south-africa',
    name: 'South Africa',
    image: '/images/south_africa.jpg',
    tagline: 'Safari, coastlines, and diverse cultures.',
    languages: langs('en'),
  },
  {
    id: 'botswana',
    name: 'Botswana',
    image: '/images/botswana.jpg',
    tagline: 'Wildlife reserves and the Okavango Delta.',
    languages: langs('en'),
  },
  {
    id: 'croatia',
    name: 'Croatia',
    image: '/images/croatia.jpg',
    tagline: 'Adriatic coast, islands, and medieval towns.',
    languages: langs('en'),
  },
  {
    id: 'argentina',
    name: 'Argentina',
    image: '/images/argentina.jpg',
    tagline: 'Tango, Patagonia, and Buenos Aires nightlife.',
    languages: langs('en', 'es'),
  },
  {
    id: 'mexico',
    name: 'Mexico',
    image: '/images/mexico.jpg',
    tagline: 'Mayan ruins, beaches, and bold flavours.',
    languages: langs('en', 'es'),
  },
  {
    id: 'kenya',
    name: 'Kenya',
    image: '/images/kenya.jpg',
    tagline: 'Safari plains, Maasai culture, and Indian Ocean coast.',
    languages: langs('en', 'sw'),
  },
  {
    id: 'tanzania',
    name: 'Tanzania',
    image: '/images/tanzania.jpg',
    tagline: 'Serengeti, Kilimanjaro, and Zanzibar spice shores.',
    languages: langs('en', 'sw'),
  },
];

/** Language practice catalogue (standalone tutor pages). */
export const languages = [
  {
    id: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '/images/en-flag.png',
    speakLang: 'en-US',
    greeting: 'Hello! Ready to practice English?',
  },
  {
    id: 'es',
    name: 'Spanish',
    nativeName: 'EspaÃ±ol',
    flag: '/images/es-flag.png',
    speakLang: 'es-ES',
    greeting: 'Â¡Hola! Â¿Listo para practicar espaÃ±ol?',
  },
  {
    id: 'fr',
    name: 'French',
    nativeName: 'FranÃ§ais',
    flag: '/images/fr-flag.png',
    speakLang: 'fr-FR',
    greeting: 'Bonjour ! PrÃªt Ã  pratiquer le franÃ§ais ?',
  },
  {
    id: 'ar',
    name: 'Arabic',
    nativeName: 'Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©',
    flag: '/images/ar-flag.png',
    speakLang: 'ar-SA',
    greeting: 'Ù…Ø±Ø­Ø¨Ø§! Ù‡Ù„ Ø£Ù†Øª Ù…Ø³ØªØ¹Ø¯ Ù„Ù…Ù…Ø§Ø±Ø³Ø© Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©ØŸ',
  },
  {
    id: 'pt',
    name: 'Portuguese',
    nativeName: 'PortuguÃªs',
    flag: '/images/pt-flag.png',
    speakLang: 'pt-BR',
    greeting: 'OlÃ¡! Pronto para praticar portuguÃªs?',
  },
  {
    id: 'sw',
    name: 'Swahili',
    nativeName: 'Kiswahili',
    flag: '/images/sw-flag.png',
    speakLang: 'sw-KE',
    greeting: 'Habari! Uko tayari kuzoeza Kiswahili?',
  },
  {
    id: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '/images/it-flag.png',
    speakLang: 'it-IT',
    greeting: 'Ciao! Pronto a praticare italiano?',
  },
  {
    id: 'hi',
    name: 'Hindi',
    nativeName: 'à¤¹à¤¿à¤¨à¥à¤¦à¥€',
    flag: '/images/hi-flag.png',
    speakLang: 'hi-IN',
    greeting: 'à¤¨à¤®à¤¸à¥à¤¤à¥‡! à¤¹à¤¿à¤¨à¥à¤¦à¥€ à¤…à¤­à¥à¤¯à¤¾à¤¸ à¤•à¥‡ à¤²à¤¿à¤ à¤¤à¥ˆà¤¯à¤¾à¤° à¤¹à¥ˆà¤‚?',
  },
];

export const quickPrompts = {
  city: [
    'What are the top 5 must-see spots?',
    'Best local food to try?',
    'How do I get around like a local?',
    'Hidden gems tourists miss?',
    'One-day itinerary suggestion',
  ],
  country: [
    'Best cities to visit?',
    'Travel tips and safety advice',
    'Local customs I should know',
    'Best time of year to visit?',
    'Budget travel recommendations',
  ],
  language: [
    'Teach me airport and taxi phrases',
    'Role-play checking into a hotel',
    'Help me order food at a restaurant',
    'Practice asking for directions',
    'Quiz me on useful travel words',
  ],
};

const GREETINGS = {
  en: (name, isCity) =>
    isCity
      ? `Welcome to ${name}! I'm your local AI guide. Ask me about sights, food, transport, or hidden gems.`
      : `Welcome! I'm your AI guide for ${name}. Ask about cities, culture, travel tips, or trip planning.`,
  es: (name, isCity) =>
    isCity
      ? `¡Bienvenido a ${name}! Soy tu guía local de IA. Pregúntame por lugares, comida, transporte o joyas ocultas.`
      : `¡Bienvenido! Soy tu guía de IA para ${name}. Pregunta por ciudades, cultura o consejos de viaje.`,
  fr: (name, isCity) =>
    isCity
      ? `Bienvenue Ã  ${name} ! Je suis votre guide IA local. Demandez-moi les sites, la cuisine, les transports ou les pÃ©pites cachÃ©es.`
      : `Bienvenue ! Je suis votre guide IA pour ${name}. Parlons villes, culture et conseils de voyage.`,
  ar: (name) =>
    `Ù…Ø±Ø­Ø¨Ø§Ù‹ Ø¨Ùƒ ÙÙŠ ${name}! Ø£Ù†Ø§ Ù…Ø±Ø´Ø¯Ùƒ Ø§Ù„Ø³ÙŠØ§Ø­ÙŠ Ø¨Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ. Ø§Ø³Ø£Ù„Ù†ÙŠ Ø¹Ù† Ø§Ù„Ù…Ø¹Ø§Ù„Ù… ÙˆØ§Ù„Ø·Ø¹Ø§Ù… ÙˆØ§Ù„Ù†ØµØ§Ø¦Ø­.`,
  pt: (name, isCity) =>
    isCity
      ? `Bem-vindo ao ${name}! Sou seu guia local de IA. Pergunte sobre atraÃ§Ãµes, comida, transporte ou dicas locais.`
      : `Bem-vindo! Sou seu guia de IA para ${name}. Pergunte sobre cidades, cultura e dicas de viagem.`,
  sw: (name) =>
    `Karibu ${name}! Mimi ni mwongoza wako wa AI. Niulize kuhusu vivutio, chakula, usafiri au vidokezo vya kusafiri.`,
  it: (name) =>
    `Benvenuto a ${name}! Sono la tua guida AI. Chiedimi di attrazioni, cibo e consigli di viaggio.`,
  hi: (name, isCity) =>
    isCity
      ? `à¤¨à¤®à¤¸à¥à¤¤à¥‡! ${name} à¤®à¥‡à¤‚ à¤†à¤ªà¤•à¤¾ à¤¸à¥à¤µà¤¾à¤—à¤¤ à¤¹à¥ˆà¥¤ à¤®à¥ˆà¤‚ à¤†à¤ªà¤•à¥€ à¤¸à¥à¤¥à¤¾à¤¨à¥€à¤¯ AI à¤—à¤¾à¤‡à¤¡ à¤¹à¥‚à¤à¥¤ à¤œà¤—à¤¹à¥‡à¤‚, à¤–à¤¾à¤¨à¤¾, à¤†à¤µà¤¾à¤—à¤®à¤¨ à¤¯à¤¾ à¤›à¥à¤ªà¥‡ à¤¹à¥à¤ à¤¨à¥à¤¸à¥à¤–à¥‡ à¤ªà¥‚à¤›à¥‡à¤‚à¥¤`
      : `à¤¨à¤®à¤¸à¥à¤¤à¥‡! à¤®à¥ˆà¤‚ ${name} à¤•à¥€ AI à¤—à¤¾à¤‡à¤¡ à¤¹à¥‚à¤à¥¤ à¤¶à¤¹à¤°, à¤¸à¤‚à¤¸à¥à¤•à¥ƒà¤¤à¤¿ à¤”à¤° à¤¯à¤¾à¤¤à¥à¤°à¤¾ à¤•à¥‡ à¤¸à¥à¤à¤¾à¤µ à¤ªà¥‚à¤›à¥‡à¤‚à¥¤`,
};

/** Turn free-text / URL slug into a title-cased country name. */
export function titleFromSlug(slug) {
  return decodeURIComponent(String(slug || ''))
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function slugifyCountryName(name) {
  return String(name || '')
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Build a virtual country destination for any place name. */
export function createCustomCountry(slugOrName) {
  const name = titleFromSlug(slugOrName);
  if (!name) return null;
  const id = slugifyCountryName(name) || 'custom';
  return {
    id,
    type: 'country',
    name,
    tagline: `AI travel guide for ${name}`,
    image: '/images/bg.jpg',
    languages: langs('en'),
    custom: true,
  };
}

export function getDestination(slug) {
  // Legacy Lahore URL → Kathmandu, Nepal
  const resolvedSlug = slug === 'lahore' ? 'kathmandu' : slug;
  const city = cities.find((c) => c.id === resolvedSlug);
  if (city) {
    return {
      ...city,
      type: 'city',
      languages: city.languages?.length ? city.languages : langs('en'),
    };
  }

  const country = countries.find((c) => c.id === slug);
  if (country) {
    return {
      ...country,
      type: 'country',
      languages: country.languages?.length ? country.languages : langs('en'),
    };
  }

  // Any other slug opens a free-form country guide
  if (slug && String(slug).trim()) {
    return createCustomCountry(slug);
  }

  return null;
}

export function getLanguage(id) {
  return languages.find((l) => l.id === id) ?? null;
}

export function getDestinationLanguages(destination) {
  if (!destination) return [GUIDE_LANGUAGES.en];
  return destination.languages?.length ? destination.languages : [GUIDE_LANGUAGES.en];
}

export function buildGuideGreeting(destination, languageId = 'en') {
  if (!destination) return '';
  // Use app language (en/es) directly — do not limit to destination.languages
  const fn = GREETINGS[languageId] || GREETINGS.en;
  return fn(destination.name, destination.type === 'city');
}

export function formatLanguageLabels(destination, langNames) {
  return getDestinationLanguages(destination)
    .map((l) => (langNames && langNames[l.id]) || l.name)
    .join(' · ');
}
