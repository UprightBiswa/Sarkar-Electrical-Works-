const u = (id: string) => `https://images.unsplash.com/photo-${id}`;

// Services from the shop's Google Business description. `image: ""` renders
// generated service artwork (components/site/ServiceArt) until a real photo is uploaded.
export const SEED_SERVICES = [
  {
    slug: "fan-repair",
    title: "Fan Repair",
    icon: "Fan",
    image: "",
    priceFrom: "",
    isFeatured: true,
    shortDesc: "Ceiling, table, pedestal, wall and exhaust fans — slow speed, noise, winding & capacitor issues.",
    description:
      "Fan running slow, making noise or not starting? We repair all kinds of fans: ceiling, table, pedestal, wall-mount and exhaust fans. Common jobs include capacitor replacement, bearing change, coil rewinding, regulator and switch faults.",
    features: ["Capacitor replacement", "Bearing & bush change", "Coil rewinding", "Regulator & switch repair", "Blade balancing & noise fix"],
  },
  {
    slug: "geyser-water-heater-repair",
    title: "Geyser & Water Heater Repair",
    icon: "Flame",
    image: "",
    priceFrom: "",
    isFeatured: true,
    shortDesc: "Not heating, tripping or leaking — heating element, thermostat and wiring repairs.",
    description:
      "We repair storage and instant geysers as well as immersion water heaters. From a burnt heating element or faulty thermostat to wiring and indicator problems, we find the fault and fix it safely.",
    features: ["Heating element replacement", "Thermostat & cut-out repair", "Indicator & wiring faults", "Immersion rod repair", "Safety check after repair"],
  },
  {
    slug: "mixer-grinder-repair",
    title: "Mixer Grinder Repair",
    icon: "Blend",
    image: "",
    priceFrom: "",
    isFeatured: true,
    shortDesc: "Motor not running, burning smell, jar coupler or speed switch problems.",
    description:
      "Bring your mixer grinder or juicer to our shop. We repair motors, carbon brushes, speed switches, overload protectors and couplers, and replace worn parts so it runs smoothly again.",
    features: ["Motor & armature repair", "Carbon brush replacement", "Speed switch repair", "Coupler & jar parts", "Overload protector fix"],
  },
  {
    slug: "iron-kettle-repair",
    title: "Iron & Electric Kettle Repair",
    icon: "Coffee",
    image: "",
    priceFrom: "",
    isFeatured: true,
    shortDesc: "Electric irons and kettles that don't heat, overheat or trip — element, thermostat & cord.",
    description:
      "Dry and steam irons, electric kettles and similar heating appliances repaired: heating element, thermostat, thermal fuse, power cord and switch problems.",
    features: ["Iron heating & thermostat repair", "Kettle element & base repair", "Thermal fuse replacement", "Power cord & plug change", "Steam iron servicing"],
  },
  {
    slug: "water-pump-repair",
    title: "Water Pump & Motor Repair",
    icon: "Droplets",
    image: "",
    priceFrom: "",
    isFeatured: true,
    shortDesc: "Domestic water pumps and motors — rewinding, starting problems, bearing and seal change.",
    description:
      "Motor humming but not pumping? Tripping or overheating? We repair and rewind domestic water pumps and electric motors, replace bearings, seals and capacitors, and test them before handover.",
    features: ["Motor rewinding", "Capacitor & starter repair", "Bearing & mechanical seal change", "Overheating & tripping fix", "Performance test before handover"],
  },
  {
    slug: "power-tool-repair",
    title: "Power Tool Repair",
    icon: "Drill",
    image: "",
    priceFrom: "",
    isFeatured: true,
    shortDesc: "Angle grinders, wood planer machines, marble cutters and other electric tools.",
    description:
      "Keep your work tools running. We repair angle grinders, wood planer machines, marble cutters, drills and similar power tools — armature and field coil rewinding, carbon brushes, switches, gears and bearings.",
    features: ["Angle grinder repair", "Wood planer machine repair", "Marble cutter repair", "Armature & field coil rewinding", "Switch, gear & bearing replacement"],
  },
  {
    slug: "electrical-goods-repair",
    title: "All Electrical Goods Repair",
    icon: "Plug",
    image: "",
    priceFrom: "",
    isFeatured: false,
    shortDesc: "Room heaters, induction cooktops, extension boards and other household electrical items.",
    description:
      "Have something else that stopped working? We repair all kinds of electrical goods. Bring it to the shop and we'll check it and tell you what's possible.",
    features: ["Room heaters", "Induction & hot plates", "Extension boards & adaptors", "Chargers & small appliances", "General electrical fault finding"],
  },
];

// Placeholder stock photos (Unsplash) with neutral captions. Replace them with real
// shop photos from Admin → Gallery, or import your Google Maps photos via Admin → Reviews → Sync.
export const SEED_GALLERY = [
  { url: u("1558618666-fcd25c85cd64"), title: "Appliance repair bench", category: "Repair" },
  { url: u("1581092918056-0c4c3acd3789"), title: "Circuit board repair", category: "Repair" },
  { url: u("1565608438257-fac3c27beb36"), title: "Testing with a multimeter", category: "Testing" },
  { url: u("1504328345606-18bbc8c9d7d1"), title: "Power tool work", category: "Power tools" },
  { url: u("1586864387967-d02ef85d93e8"), title: "Tools of the trade", category: "Power tools" },
  { url: u("1621905251189-08b45d6a269e"), title: "Electrical fault finding", category: "Testing" },
];

export const SEED_FAQS = [
  { question: "What items do you repair?", answer: "All kinds of electrical goods — fans, geysers, mixer grinders, irons, electric kettles, water pumps, angle grinders, wood planer machines, marble cutters, water heaters and more." },
  { question: "Where is the shop?", answer: "Indirapally, Shivmandir, near Gajen More, Siliguri (Bara Mohansingh), West Bengal 734011. Tap 'Directions' to open it in Google Maps." },
  { question: "What time do you open?", answer: "The shop opens at 9 AM. Call us on 095476 29016 before visiting if you want to check availability." },
  { question: "Do I need to book before bringing an item?", answer: "No — you can walk in. Booking online or calling first simply helps us keep time ready for you." },
  { question: "Will you tell me the price before repairing?", answer: "Yes. We check the item first and tell you the fault and the cost before starting the repair." },
  { question: "How do I pay?", answer: "Please ask at the shop for accepted payment methods (cash / UPI)." },
];

export const SEED_PAGES = [
  {
    slug: "about",
    title: "About Us",
    metaDescription: "Sarkar Electrical Works — electrical goods repair shop at Indirapally, Shivmandir, near Gajen More, Siliguri.",
    content: `## Who we are

**Sarkar Electrical Works** is a local electrical goods repair shop at **Indirapally, Shivmandir, near Gajen More, Siliguri** (Bara Mohansingh, West Bengal 734011).

We repair all kinds of electrical goods — from everyday home appliances to heavy-duty power tools.

## What we repair

- **Fans** — ceiling, table, pedestal and exhaust fans
- **Geysers & water heaters**
- **Mixer grinders, irons & electric kettles**
- **Water pumps & electric motors**
- **Power tools** — angle grinders, wood planer machines, marble cutters
- …and many other electrical items

## How we work

- We check your item and explain the fault first.
- You get the price **before** we start the repair.
- Repairs are done with proper parts and tested before handover.

## Visit us

Walk in to the shop or call **095476 29016**. You can also book a repair online and we'll call you back.`,
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
