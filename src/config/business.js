import lead from './lead.json';

/**
 * MAIN CLIENT CONFIGURATION
 * ------------------------------------------------------------
 * The n8n preview workflow should replace only `lead.json` and
 * upload the logo/favicon files referenced by it. The rest of this
 * file remains the stable content and UI configuration.
 */

const text = (value, fallback = '') =>
  typeof value === 'string' && value.trim() ? value.trim() : fallback;

const companyName = text(lead.companyName, 'Northline Motors');
const website = text(lead.website);
const email = text(lead.email);
const address = text(lead.address, 'United Kingdom');
const phoneDisplay = text(lead.phoneDisplay, 'Contact dealership');
const fallbackContactLink = website || (email ? `mailto:${email}` : '/#contact');
const phoneLink = text(
  lead.phoneLink,
  lead.phoneDisplay ? `tel:${String(lead.phoneDisplay).replace(/[^\d+]/g, '')}` : fallbackContactLink,
);
const whatsappLink = text(
  lead.whatsappLink,
  lead.phoneDisplay ? `https://wa.me/${String(lead.phoneDisplay).replace(/\D/g, '')}` : fallbackContactLink,
);
const mapsLink = text(
  lead.mapsLink,
  address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : fallbackContactLink,
);

const rawNameWords = companyName.split(/\s+/).filter(Boolean);
const nameWords = [...rawNameWords];
if (nameWords.length > 1 && ['ltd', 'limited', 'llp', 'plc'].includes(nameWords.at(-1).toLowerCase())) {
  nameWords.pop();
}
const defaultLogoLine2 = nameWords.length > 1 ? nameWords.at(-1) : 'Motors';
const defaultLogoLine1 = nameWords.length > 1 ? nameWords.slice(0, -1).join(' ') : companyName;
const shortName = text(lead.shortName, nameWords[0] || companyName);

export const business = {
  identity: {
    legalName: companyName,
    displayName: companyName,
    shortName,
    logoLine1: text(lead.logoLine1, defaultLogoLine1),
    logoLine2: text(lead.logoLine2, defaultLogoLine2),
    /** Leave blank to use the built-in animated text mark. */
    logoImage: text(lead.logoPath),
    logoAlt: `${companyName} logo`,
    faviconImage: text(lead.faviconPath, '/favicon.svg'),
    eyebrow: text(lead.eyebrow, 'Independent vehicle dealership'),
  },

  seo: {
    title: text(lead.seoTitle, `${companyName} | Quality Used Cars`),
    description: text(
      lead.seoDescription,
      `Explore carefully selected used vehicles and contact ${companyName} directly for availability and details.`,
    ),
    allowIndexing: lead.allowIndexing === true,
  },

  regional: {
    locale: 'en-GB',
    currency: 'GBP',
    currencySymbol: '£',
    distanceUnit: 'miles',
  },

  contact: {
    phoneDisplay,
    phoneLink,
    whatsappLink,
    email,
    address,
    mapsLink,
    website,
  },

  openingHours: [
    ['Monday–Friday', '09:00–18:00'],
    ['Saturday', '10:00–16:00'],
    ['Sunday', 'By appointment'],
  ],

  navigation: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/#about', sectionId: 'about' },
    { label: 'Stock', href: '/inventory', sectionId: 'stock' },
    { label: 'Services', href: '/#services', sectionId: 'services' },
    { label: 'Contact', href: '/#contact', sectionId: 'contact' },
  ],

  home: {
    hero: {
      /** Each item is rendered as a separate large line. */
      introLines: ['Find', 'what', 'moves you.'],
      scrollLabel: 'Scroll to enter',
      kineticWord: 'Drive',
      portalLabel: `${shortName} / 01`,
      inspectionSteps: ['History checked', 'Condition verified', 'Ready to drive'],
      finalEyebrow: 'Selected. Checked. Prepared.',
      finalTitleLines: ['Drive', 'something', 'worth remembering.'],
      finalBody:
        'Hand-selected vehicles, transparent information and a buying experience designed around confidence.',
      primaryButton: 'Explore current stock',
      secondaryButton: 'Message the dealer',
      progressLabels: ['Discover', 'Inspect', 'Drive'],
    },

    /** Add true as the third item to animate a numeric value when it first enters the viewport. */
    trustPoints: [
      ['Quality', 'Selected stock'],
      ['Clear', 'Vehicle details'],
      ['Direct', 'Dealer contact'],
      ['UK', 'Based dealership'],
    ],

    about: {
      sectionNumber: '01',
      sectionLabel: 'Different by intention',
      eyebrow: 'The dealership, reconsidered',
      headingLines: ['No pressure.', 'No vague history.'],
      headingAccent: 'Just clarity.',
      description:
        `${companyName} presents carefully selected used vehicles with straightforward information and direct support. Every car is displayed with the details that matter, so buyers can make a considered decision without unnecessary pressure.`,
      linkLabel: 'See what is available',
    },

    stockPreview: {
      eyebrow: 'Curated current stock',
      headingLines: ['Vehicles with a reason', 'to be here.'],
      buttonLabel: 'View all stock',
    },

    inspection: {
      /** Numeric metrics such as '200+', '150' or '1,000+' count up automatically on first view. */
      metric: 'Quality',
      metricLabel: 'checked vehicles',
      eyebrow: 'Confidence is engineered',
      heading: 'The details buyers need should never be hidden.',
      body:
        'Vehicle condition, ownership information, tyres, paint, cabin features and road readiness can be reviewed before a buyer makes contact.',
      points: ['Clear information', 'Straightforward enquiries', 'Prepared for the next step'],
    },

    servicesHeading: {
      eyebrow: 'More than inventory',
      headingLines: ['Useful services.', 'Without the theatre.'],
    },
  },

  services: [
    {
      number: '01',
      title: 'Vehicle sourcing',
      text: 'Share the model, budget and specification you need, and ask the dealership about suitable options.',
    },
    {
      number: '02',
      title: 'Part exchange',
      text: 'Discuss your current vehicle and whether it can contribute toward your next purchase.',
    },
    {
      number: '03',
      title: 'Finance support',
      text: 'Ask the dealership about any available finance introductions and application options.',
    },
  ],

  inventoryPage: {
    eyebrow: 'Current stock',
    titleLines: ['Find the car', 'that fits.'],
    intro: 'Browse available, reserved and recently sold vehicles in one searchable view.',
    searchPlaceholder: 'Search make, model or year',
  },

  vehiclePage: {
    descriptionHeading: 'About this vehicle',
    fallbackDescription: 'Contact the dealership for full specification, condition and history.',
    enquiryEyebrow: 'Interested in this vehicle?',
    enquiryHeading: 'Speak directly with the dealer.',
    callButton: 'Contact dealer',
    whatsappButton: 'WhatsApp',
    whatsappMessage: 'Hi, I am interested in the {vehicle}.',
  },

  footer: {
    eyebrow: 'Ready when you are',
    heading: 'Let’s find your next car.',
    emailButton: 'Send an email',
    description:
      `${companyName} is focused on presenting quality vehicles with clear information and straightforward support.`,
    creditLine: 'A modern dealership preview, built for a smoother buying journey.',
  },

  social: {
    instagram: text(lead.instagram),
    facebook: text(lead.facebook),
  },

  dashboard: {
    title: 'Dealer Console',
    subtitle: 'Inventory management',
    demoEmail: 'admin@demo.local',
    demoPassword: 'demo123',
  },

  inventoryOptions: {
    maxImages: 12,
    statuses: ['Available', 'Reserved', 'Sold'],
    fuels: ['Petrol', 'Diesel', 'Hybrid', 'Plug-in Hybrid', 'Electric'],
    transmissions: ['Automatic', 'Manual'],
    bodyTypes: ['Hatchback', 'Saloon', 'Estate', 'SUV', 'Coupe', 'Convertible', 'Van'],
  },
};
