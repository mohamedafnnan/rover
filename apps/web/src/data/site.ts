export const siteMeta = {
  title: 'FISAT Rover Team — DAWN',
  description:
    'Official digital platform for the FISAT Rover Team and DAWN, an advanced Mars rover prototype built at the Federal Institute of Science and Technology, Angamaly, Kerala.',
  url: 'https://fisatrover.in',
  email: 'fisatroverteam@gmail.com',
  instagram: 'https://www.instagram.com/fisatroverteam?igsh=MXcyYTNpZzNubWh0Mw==',
  linkedin: 'https://www.linkedin.com/company/fisat-rover',
  institute: 'https://fisat.ac.in',
};

export const hero = {
  eyebrow: 'Build For Beyond',
  title: 'FISAT Rover Team',
  kicker: 'DAWN',
  description:
    'A student-built planetary robotics program from the Federal Institute of Science and Technology, engineering rover systems for Mars-analogue competition environments.',
  primaryCta: { label: 'Explore DAWN', href: '/dawn' },
  secondaryCta: { label: 'Enter 3D Mode', href: '/dawn-3d' },
  tertiaryCta: { label: 'IRC 2026', href: '/irc-2026' },
  backgroundVideo: '/fisat/video/landing.mp4',
};

export const mission = {
  aboutTitle: 'About the mission',
  about:
    'DAWN is an advanced Mars rover prototype engineered by the FISAT Rover Team, a passionate collective of engineering students from the Federal Institute of Science and Technology (FISAT), Angamaly, Kerala. United by a strong enthusiasm for robotics and space technology, the team designs and builds innovative planetary exploration systems while proudly representing India at the International Rover Challenge, a premier global competition.',
  builtTitle: 'Built differently',
  built:
    'Engineered to operate in Mars-analogue environments, DAWN features an advanced suspension system, a multi-degree-of-freedom robotic arm for precise manipulation, and robust autonomous navigation. Built through strong interdisciplinary collaboration in mechanical, electronics, and software engineering, DAWN is designed to complete complex scientific and maintenance tasks, showcasing innovation and technical excellence.',
  location: 'Angamaly, Kerala, India',
  institution: 'Federal Institute of Science and Technology (FISAT)',
  competition: 'International Rover Challenge',
};

export const verifiedSpecs = [
  { label: 'Suspension', value: 'Advanced suspension system', source: 'fisatrover.in home copy' },
  { label: 'Manipulator', value: 'Multi-degree-of-freedom robotic arm', source: 'fisatrover.in home copy' },
  { label: 'Autonomy', value: 'Robust autonomous navigation', source: 'fisatrover.in home copy' },
  { label: 'Electrical', value: 'Dual 25.2 V batteries with BMS and separate power lines', source: 'fisatrover.in home JavaScript modal copy' },
  { label: 'Power protection', value: 'Fused power board protects rover subsystems', source: 'fisatrover.in home JavaScript modal copy' },
  { label: 'Control stack', value: 'Jetson Nano for navigation/vision/speed control and ESP32 for PID speed control', source: 'fisatrover.in home JavaScript modal copy' },
  { label: 'Wheels', value: 'TPU wheels under development', source: 'fisatrover.in home JavaScript modal copy' },
];

export const departments = [
  {
    name: 'AI & Autonomy',
    slug: 'ai-autonomy',
    description:
      'AI and autonomy handle mapping, localization, and obstacle avoidance using vision and sensors. Their system also detects arrow signs for guided movement.',
  },
  {
    name: 'Electrical',
    slug: 'electrical',
    description:
      'Electrical team designed dual 25.2 V batteries with BMS and separate power lines. A fused power board protects all subsystems for the rover.',
  },
  {
    name: 'Mechanical',
    slug: 'mechanical',
    description:
      'Mechanical developed the suspension and chassis, is developing TPU wheels, and built a high-DOF robotic arm.',
  },
  {
    name: 'Control',
    slug: 'control',
    description:
      'The rover uses Jetson Nano for navigation, vision, and speed control, and ESP32 for PID speed control.',
  },
  {
    name: 'Research & Documentation',
    slug: 'research-documentation',
    description:
      'A verified team role present on the official roster, supporting documentation continuity and communication.',
  },
  {
    name: 'Science',
    slug: 'science',
    description:
      'A verified team role present on the official roster, supporting the scientific side of competition tasks.',
  },
];

export const sponsors = [
  {
    tier: 'Platinum Sponsors',
    items: [
      {
        name: 'General Datum',
        url: 'https://generaldatum.com/',
        blurb: 'Full-stack Engineering, Product Design & Development company dealing with Defence, Aerospace & Data center.',
        logo: '/fisat/images/General-Datum-Header-Logo.png',
      },
      {
        name: 'MRD Enterprises',
        url: 'https://mrad.co.in/',
        blurb: 'Industry-grade support for performance-driven projects.',
        logo: '/fisat/images/sponsor.png',
      },
    ],
  },
  {
    tier: 'Gold Sponsors',
    items: [
      {
        name: 'Senses',
        url: 'https://senseselec.com/',
        blurb: 'Smart technology and reliable engineering tools.',
        logo: '/fisat/images/spon.png',
      },
    ],
  },
  {
    tier: 'Regular Sponsors',
    items: [
      {
        name: 'FISAT',
        url: 'https://fisat.ac.in/',
        blurb: 'Supporting innovation and academic excellence in engineering.',
        logo: '/fisat/images/FISAT_LOGO.png',
      },
    ],
  },
];

export const sponsorReasons = [
  'NASA-Grade Visibility: Reach a global community of roboticists and industry leaders from organizations like ISRO and The Mars Society.',
  'Regional Prestige: Align your brand with the elite technical talent putting Kerala on the global space-tech map.',
  'Top-Tier Achievement: FISAT Rover Team states that it is one of only three teams from Kerala to qualify for the International Rover Challenge (IRC) 2026 Finals.',
  'Global Standard: The official site states that the design cleared the System Design and Development Review (SDDR).',
  'The official site describes IRC as a premier qualifying event positioned alongside major rover competitions in the USA and Poland.',
];

export const achievements = [
  {
    title: 'IRC 2026 finalist recognition',
    body: 'FISAT states that EIE students emerged as Finalists at the International Rover Challenge (IRC) 2026.',
    source: 'https://fisat.ac.in/event/international-rover-challenge-irc-2026/',
  },
  {
    title: 'Official DAWN campaign',
    body: 'The public rover site identifies DAWN as the team’s advanced Mars rover prototype for the current campaign.',
    source: 'https://fisatrover.in/',
  },
  {
    title: 'Kerala finalist claim',
    body: 'The official rover site claims the team is one of only three teams from Kerala to qualify for the IRC 2026 Finals.',
    source: 'https://fisatrover.in/',
  },
  {
    title: 'SDDR clearance claim',
    body: 'The official rover site states that the design cleared the System Design and Development Review (SDDR).',
    source: 'https://fisatrover.in/',
  },
];

export const irc = {
  title: 'International Rover Challenge 2026',
  subtitle: 'Competition log and verified public notes',
  summary:
    'The International Rover Challenge is described by FISAT as a worldwide competition requiring teams to design, build, and implement sophisticated rover systems capable of executing mission-specific tasks under simulated interplanetary environments.',
  source: 'https://fisat.ac.in/event/international-rover-challenge-irc-2026/',
  timeline: [
    {
      day: 'Day 01',
      title: 'IRC Rover Expo',
      body:
        'Day 1 at Manipal Institute of Technology, Udupi, began with an expo-style showcase where teams presented rover designs and engineering approaches. The official IRC page mentions interactions with teams from Madras, Poland, and various other states, followed by a visit to the competition arena and a rover photo session.',
      source: 'https://fisatrover.in/irc.html',
    },
    {
      day: 'Day 02',
      title: 'TBD — needs team input',
      body: 'The official public IRC page currently marks Day 02 as TBA.',
      source: 'https://fisatrover.in/irc.html',
    },
    {
      day: 'Day 03',
      title: 'TBD — needs team input',
      body: 'The official public IRC page currently marks Day 03 as TBA.',
      source: 'https://fisatrover.in/irc.html',
    },
  ],
};

export const gallery = [
  { src: '/fisat/images/Robo/about1.jpg', alt: 'DAWN rover hero view', caption: 'DAWN — official hero photograph' },
  { src: '/fisat/images/Robo/gal1.jpg', alt: 'DAWN rover detail view', caption: 'Manipulator and rover detail view' },
  { src: '/fisat/images/Robo/gal2.jpg', alt: 'DAWN rover gallery image', caption: 'Official rover gallery image' },
  { src: '/fisat/images/Robo/p1.JPG.jpg', alt: 'DAWN at competition venue', caption: 'Field photograph from the rover campaign' },
  { src: '/fisat/images/Robo/p2 (2)_20260130_222343.jpg', alt: 'DAWN team or event image', caption: 'Official campaign photograph' },
  { src: 'https://fisat.ac.in/wp-content/uploads/2026/02/rover1.jpeg', alt: 'DAWN rover from FISAT event post', caption: 'FISAT event coverage — rover photograph' },
  { src: 'https://fisat.ac.in/wp-content/uploads/2026/02/team1.jpeg', alt: 'FISAT Rover Team at IRC 2026', caption: 'FISAT event coverage — team photograph' },
  { src: 'https://fisat.ac.in/wp-content/uploads/2026/02/prize-scaled.jpeg', alt: 'FISAT Rover Team recognition photograph', caption: 'FISAT event coverage — finalist recognition' },
];

export const patrons = [
  { name: 'Mr. Shimith P R', role: 'Chairman', photo: '/fisat/images/team/shimithext.png' },
  { name: 'Dr. Jacob Thomas V', role: 'Principal', photo: '/fisat/images/team/jacob.jpg' },
  { name: 'Anil Johny', role: 'HOD - EIE DEPARTMENT', photo: '/fisat/images/team/anil.jpg' },
];

export const mentors = [
  { name: 'Harichand Adithya', role: 'Mentor', photo: '/fisat/images/team/harichand.jpg' },
  { name: 'Neal Titto', role: 'Mentor', photo: '/fisat/images/team/neal.jpg' },
  { name: 'Alen Joseph', role: 'Mentor', photo: '/fisat/images/team/alenlong.png' },
  { name: 'Dr.Sreevidya P', role: 'Faculty Mentor', photo: '/fisat/images/team/sreevidhya.jpg' },
];

export const teamMembers = [
  ['Hazim Karat', 'Lead', '/fisat/images/team/Hazim_Karatjpg.jpg'],
  ['Ann Maria Benny', 'Electrical', '/fisat/images/team/Ann Maria - Ann Maria Benny.jpg'],
  ['Aneena Manohar V V', 'Electrical', '/fisat/images/team/AneenaManoharVV.jpg'],
  ['Shinto S Pomson', 'Design', '/fisat/images/team/shinto.jpg'],
  ['Nibha Prasad', 'Design and Manufacturing', '/fisat/images/team/Nibha Prasad.jpg'],
  ['Nivin prakash', 'Controls', '/fisat/images/team/nivin.jpg'],
  ['Devika Rajeev', 'Electrical', '/fisat/images/team/Devika Rajeev.jpg'],
  ['Parvathy Shibu', 'Science team', '/fisat/images/team/Parvathy Shibu.jpg'],
  ['Ajwad N', 'Design and Manufacturing', '/fisat/images/team/Ajwad Ibn Nowshad.jpg'],
  ['Anirudh M', 'Controls', '/fisat/images/team/Anirudh Madhu.jpg'],
  ['Parthip Aji', 'Ai and Autonomy', '/fisat/images/team/parthipajii.jpg'],
  ['Bhowmick Narayanan. K', 'Ai and autonomy', '/fisat/images/team/Bhaumik Narayanan .k.jpg'],
  ['Gopika M', 'Design and Manufacturing', '/fisat/images/team/Gopika Manoj.jpg'],
  ['Vydhehy TM', 'Design and Manufacturing', '/fisat/images/team/Devika RajeevVydehy.jpg'],
  ['S.S SUSHOBH', 'Ai and Autonomy', '/fisat/images/team/Sushobh Satheesh.jpg'],
  ['Fahad Yazin M P', 'CONTROLS TEAM', '/fisat/images/team/Fahad.jpg'],
  ['Leo Denny', 'Electrical team', '/fisat/images/team/Leo Denny.jpg'],
  ['Saniya Thankachan', 'Research and Documentation', '/fisat/images/team/SANIYA THANKACHAN.jpg'],
  ['Fathima Nishida', 'Design And Manufacturing', '/fisat/images/team/Fathima Nishida.png'],
  ['Adithyan V A', 'Electrical Team', '/fisat/images/team/Adhithyan.jpg'],
  ['Govind Gopan', 'Design and manufacturing', '/fisat/images/team/Govind Gopan.jpg'],
  ['A B Navanika', 'Controls', '/fisat/images/team/Navanika.jpg'],
  ['Anjaly Krishna', 'Design and Manufacturing', '/fisat/images/team/Anjaly Krishna.jpg'],
  ['Niranjan Jagadeesan Nair', 'Controls', '/fisat/images/team/Niranjan JN.jpg'],
  ['Anerudh M K', 'AI And Autonomy', '/fisat/images/team/Anerudh M K.png'],
  ['Heera Henry', 'Science', '/fisat/images/team/Heera Henry.jpg'],
  ['Karthik M D', 'Controls', '/fisat/images/team/Karthik.jpg'],
  ['Salvion Thomas', 'Ai and Autonomy', '/fisat/images/team/Salvion.jpg'],
  ['Hareesh S Nair', 'Ai and Autonomy', '/fisat/images/team/Hareesh S Nair.jpg'],
  ['Vinay Krishna P V', 'Electrical', '/fisat/images/team/Vinay krishna Pv.jpg'],
  ['Dulfukkar Ali P B', 'Controls', '/fisat/images/team/Dulfukkar Ali.jpg'],
  ['Emil K Manoj', 'Design and manufacturing', '/fisat/images/team/Emil.jpg'],
  ['Anurag E', 'Electrical team', '/fisat/images/team/Anurag E.jpg'],
  ['Farzeen Fathima N', 'Controls', '/fisat/images/team/Farzeen Fathima N.jpg'],
  ['Aaron Varghese Jacoby', 'Electrical', '/fisat/images/team/Aaron.jpg'],
  ['Fathima Nishida T A', 'Design and manufacturing', '/fisat/images/team/Fathima Nishida.png'],
  ['Aysha Nourene', 'Design', '/fisat/images/team/Aysha Nourene.png'],
  ['Nimil Nazeer', 'Design', '/fisat/images/team/nimilnazeer.jpg'],
  ['Darwin Jose', 'Controls', '/fisat/images/team/IMG_0516 (2).jpg'],
].map(([name, role, photo]) => ({ name, role, photo }));

export const contact = {
  address: 'Federal Institute of Science and Technology, Hormis Nagar, Mookanoor, Ernakulam - 683 577, Kerala, India.',
  email: 'fisatroverteam@gmail.com',
  instagram: 'https://www.instagram.com/fisatroverteam?igsh=MXcyYTNpZzNubWh0Mw==',
  instagramShort: '@fisatroverteam',
  linkedin: 'https://www.linkedin.com/company/fisat-rover',
  institute: 'https://fisat.ac.in',
};

export const contentGaps = [
  'Detailed subsystem specifications beyond the official public copy.',
  'Verified autonomous stack metrics, sensors, and component SKUs.',
  'Verified team intake process and recruitment workflow.',
  'Official Day 02 and Day 03 IRC diary content.',
  'Official competition statistics, rankings, and scoring breakdowns.',
  'Verified sponsor deliverables or partnership package details.',
];
