const u = (id: string) => `https://images.unsplash.com/photo-${id}`;

export const SEED_SERVICES = [
  {
    slug: "house-wiring",
    title: "House Wiring & Rewiring",
    icon: "Cable",
    image: u("1621905251189-08b45d6a269e"),
    priceFrom: "₹2,500",
    isFeatured: true,
    shortDesc: "New wiring, concealed & open wiring, and full rewiring of old homes.",
    description:
      "Complete wiring solutions for new construction and renovation. We plan circuits, fit distribution boards with MCB/RCCB protection, and use ISI-marked FR/FRLS copper wires. Old, overloaded or damaged wiring is safely replaced to protect your family and appliances.",
    features: [
      "Concealed & surface (casing-capping) wiring",
      "Distribution board, MCB & RCCB fitting",
      "Proper earthing & load balancing",
      "ISI-marked wires and fittings",
      "Neat finish with minimal wall damage",
    ],
  },
  {
    slug: "electrical-repair",
    title: "Electrical Repair & Fault Finding",
    icon: "Zap",
    image: u("1555963966-b7ae5404b6ed"),
    priceFrom: "₹199",
    isFeatured: true,
    shortDesc: "Short circuits, tripping MCBs, sparking sockets and power failures fixed fast.",
    description:
      "Power cut in one room? MCB keeps tripping? Burning smell from a switch? Our electricians trace the fault quickly with proper testing tools and fix it safely — switches, sockets, holders, MCBs, cables and more.",
    features: [
      "Short-circuit & tripping diagnosis",
      "Switch, socket & board repair",
      "MCB / fuse replacement",
      "Burnt wire replacement",
      "Same-day emergency visits",
    ],
  },
  {
    slug: "fan-light-installation",
    title: "Fan, Light & Fixture Installation",
    icon: "Lightbulb",
    image: u("1513506003901-1e6a229e2d15"),
    priceFrom: "₹149",
    isFeatured: true,
    shortDesc: "Ceiling & exhaust fans, LED panels, chandeliers, decorative and outdoor lights.",
    description:
      "From a single ceiling fan to a full LED lighting makeover, we install and repair all kinds of fans and light fixtures. We also fit regulators, dimmers, profile lights and outdoor/garden lighting.",
    features: [
      "Ceiling, wall & exhaust fans",
      "LED panel, strip & profile lights",
      "Chandelier & decorative fittings",
      "Fan regulator & dimmer fitting",
      "Outdoor & garden lighting",
    ],
  },
  {
    slug: "inverter-battery",
    title: "Inverter & Battery Installation",
    icon: "BatteryCharging",
    image: u("1581092918056-0c4c3acd3789"),
    priceFrom: "₹499",
    isFeatured: true,
    shortDesc: "Home UPS / inverter setup, separate wiring, battery service and repair.",
    description:
      "Stay powered through load-shedding. We install inverters with dedicated backup wiring for selected points, service and top-up batteries, and repair inverter faults for all major brands.",
    features: [
      "Inverter & battery installation",
      "Dedicated backup-point wiring",
      "Battery health check & water top-up",
      "Inverter repair (all brands)",
      "Load calculation & advice",
    ],
  },
  {
    slug: "solar-installation",
    title: "Solar Panel Installation",
    icon: "Sun",
    image: u("1509391366360-2e959784a276"),
    priceFrom: "Get a quote",
    isFeatured: true,
    shortDesc: "Rooftop solar systems for homes and shops — on-grid, off-grid and hybrid.",
    description:
      "Cut your electricity bill with rooftop solar. We help you size the system, install panels, inverter and protection gear, and guide you on net-metering and government subsidy paperwork.",
    features: [
      "Site survey & system sizing",
      "On-grid, off-grid & hybrid systems",
      "Mounting structure & wiring",
      "Earthing & lightning protection",
      "Subsidy & net-metering guidance",
    ],
  },
  {
    slug: "appliance-repair",
    title: "Appliance & Motor Repair",
    icon: "Wrench",
    image: u("1558618666-fcd25c85cd64"),
    priceFrom: "₹249",
    isFeatured: true,
    shortDesc: "Water pumps, motors, geysers, mixers, irons and other home appliances.",
    description:
      "Bring it to our Shivmandir shop or book a home visit. We repair and rewind motors and water pumps, and service geysers, induction cooktops, mixers, irons, heaters and more.",
    features: [
      "Water pump & motor repair / rewinding",
      "Geyser installation & repair",
      "Mixer, iron, heater & induction repair",
      "Starter & float switch fitting",
      "Genuine spare parts",
    ],
  },
  {
    slug: "smart-home-cctv",
    title: "Smart Home & CCTV",
    icon: "Cctv",
    image: u("1558002038-1055907df827"),
    priceFrom: "₹999",
    isFeatured: false,
    shortDesc: "CCTV cameras, video door phones, smart switches and home automation.",
    description:
      "Upgrade your home with modern security and convenience — CCTV cameras with mobile viewing, video door phones, smart switches, sensors and Wi-Fi controlled lighting.",
    features: [
      "CCTV camera & DVR/NVR setup",
      "Mobile app viewing configuration",
      "Video door phone installation",
      "Smart switches & automation",
      "Motion sensor lights",
    ],
  },
  {
    slug: "safety-inspection",
    title: "Electrical Safety Inspection",
    icon: "ShieldCheck",
    image: u("1592833159155-c62df1b65634"),
    priceFrom: "₹399",
    isFeatured: false,
    shortDesc: "Earthing test, load check and complete safety audit for home or shop.",
    description:
      "An electrical health check-up for your property. We test earthing, insulation and load, check for loose connections and overloaded circuits, and give you a clear report with recommendations.",
    features: [
      "Earthing resistance test",
      "Insulation & leakage check",
      "Load & circuit assessment",
      "RCCB / MCB function test",
      "Written recommendations",
    ],
  },
  {
    slug: "commercial-wiring",
    title: "Shop & Commercial Wiring",
    icon: "Building2",
    image: u("1473341304170-971dccb5ac1e"),
    priceFrom: "Get a quote",
    isFeatured: false,
    shortDesc: "Shops, offices, godowns and small industries — 3-phase and panel work.",
    description:
      "End-to-end electrical work for commercial spaces: 3-phase connections, panel boards, industrial sockets, lighting layouts and annual maintenance contracts.",
    features: [
      "3-phase wiring & panel boards",
      "Office & showroom lighting",
      "Industrial sockets & machines",
      "New meter / load application help",
      "Annual maintenance contracts (AMC)",
    ],
  },
];

export const SEED_GALLERY = [
  { url: u("1621905251189-08b45d6a269e"), title: "Distribution board work", category: "Wiring" },
  { url: u("1621905252507-b35492cc74b4"), title: "Our electrician on site", category: "Team" },
  { url: u("1555963966-b7ae5404b6ed"), title: "Line maintenance", category: "Repair" },
  { url: u("1513506003901-1e6a229e2d15"), title: "Pendant light fitting", category: "Lighting" },
  { url: u("1524484485831-a92ffc0de03f"), title: "Modern ceiling light", category: "Lighting" },
  { url: u("1509391366360-2e959784a276"), title: "Solar panel setup", category: "Solar" },
  { url: u("1545259741-2ea3ebf61fa3"), title: "Smart thermostat", category: "Smart Home" },
  { url: u("1560185007-cde436f6a4d0"), title: "Home interior lighting", category: "Lighting" },
  { url: u("1581092918056-0c4c3acd3789"), title: "Circuit repair", category: "Repair" },
  { url: u("1592833159155-c62df1b65634"), title: "Testing & inspection", category: "Inspection" },
  { url: u("1600585154340-be6161a56a0c"), title: "Complete home electrical", category: "Wiring" },
  { url: u("1611365892117-00ac5ef43c90"), title: "Rooftop solar", category: "Solar" },
];

export const SEED_FAQS = [
  { question: "Which areas do you serve?", answer: "We serve Shivmandir and all of Siliguri — including Bagdogra, Matigara, Champasari, Pradhan Nagar, Sevoke Road and nearby areas." },
  { question: "Do you offer same-day or emergency service?", answer: "Yes. For urgent problems like short circuits or complete power failure, call or WhatsApp us and we will try to reach you the same day." },
  { question: "How is the price decided?", answer: "Small jobs have fixed visiting and service charges. For bigger work like wiring or solar we inspect first and give you a clear written quote before starting." },
  { question: "Do you provide a warranty?", answer: "Yes, our workmanship comes with a service warranty, and parts carry the manufacturer's warranty." },
  { question: "Can I bring my appliance to the shop?", answer: "Absolutely. You can bring motors, pumps, mixers, irons and other small appliances to our Shivmandir shop for repair." },
  { question: "What payment methods do you accept?", answer: "Cash, UPI (Google Pay, PhonePe, Paytm) and bank transfer." },
];

export const SEED_PAGES = [
  {
    slug: "about",
    title: "About Us",
    metaDescription: "Learn about Sarkar Electrical Works, a trusted electrical shop and service team in Shivmandir, Siliguri.",
    content: `## Our story

**Sarkar Electrical Works** is a family-run electrical shop and service team based in **Shivmandir, Siliguri**. For over a decade we have been helping homes, shops and small businesses across Siliguri with safe, reliable electrical work.

What started as a small repair counter has grown into a full-service team — from fixing a single switch to wiring entire buildings, installing inverters and rooftop solar systems.

## What we believe in

- **Safety before everything** — correct earthing, proper protection devices and quality materials.
- **Honest pricing** — a clear quote before work begins.
- **Respect for your home** — we arrive on time, work neatly and clean up after.
- **Long-term relationships** — most of our customers come through referrals.

## Our shop

Visit our shop in Shivmandir for electrical goods, fittings and appliance repair. Our team is happy to advise you on the right products for your home.`,
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    metaDescription: "How Sarkar Electrical Works collects and uses your information.",
    content: `## Introduction

Sarkar Electrical Works ("we", "us") respects your privacy. This policy explains what information we collect through this website and how we use it.

## Information we collect

- **Booking details** — name, phone, email, address, preferred date/time and a description of the job.
- **Contact messages** — name, email, phone and your message.
- **Usage data** — anonymous analytics such as pages visited, device type and approximate country, used to improve the website.

## How we use your information

- To schedule and deliver the services you request.
- To contact you about your booking or enquiry.
- To improve our website and services.

We **do not sell** your personal information to anyone.

## Data storage & security

Your information is stored on secure cloud infrastructure and is accessible only to authorised staff of Sarkar Electrical Works.

## Your rights

You can ask us to view, correct or delete your personal information at any time by contacting us.

## Contact

For any privacy questions, please reach us through the Contact page.`,
  },
  {
    slug: "terms-and-conditions",
    title: "Terms & Conditions",
    metaDescription: "Terms and conditions for services by Sarkar Electrical Works.",
    content: `## Services

All electrical work is carried out by our trained electricians. The final scope and price are confirmed with you before the work begins.

## Bookings

- An online booking is a **request**; it is confirmed once our team calls you.
- Please make sure someone is available at the site during the visit.
- Visiting charges may apply for inspections, even if you decide not to proceed.

## Materials

Materials can be supplied by us or by you. We are not responsible for failures of materials supplied by the customer.

## Warranty

Workmanship warranty covers the work we perform. It does not cover damage from voltage fluctuation, misuse, water damage or tampering by third parties.

## Payment

Payment is due on completion of the job unless agreed otherwise. We accept cash, UPI and bank transfer.

## Liability

We take every care to work safely. Our liability is limited to the value of the service provided.`,
  },
  {
    slug: "refund-policy",
    title: "Cancellation & Refund Policy",
    metaDescription: "Cancellation and refund policy of Sarkar Electrical Works.",
    content: `## Cancellation

You can cancel or reschedule a booking free of charge by calling us before the technician leaves for your location.

## Refunds

- Advance payments for cancelled jobs are refunded within **5–7 working days**.
- If you are not satisfied with our workmanship, tell us within the warranty period and we will fix it at no extra labour cost.
- Materials that have been purchased specifically for your job and installed cannot be refunded.

## Contact

For cancellations or refund requests, please call us or use the Contact page.`,
  },
];
