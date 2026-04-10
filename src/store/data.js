// ─── CLUBS ────────────────────────────────────────────────────────────────────
export const CLUBS = [
  {
    id: "kjelsas", name: "Kjelsås IL", distance: 3.2,
    badge: "Top pick", badgeType: "green",
    tags: ["G17 div 3", "Senior div 4", "G19 div 2"],
    pathScore: 88, youthGap: 72,
    coachAlert: { name: "Tor Henriksen", role: "New head coach", weeksAgo: 3 },
    insight: "G17 div 3 lets you walk in and compete. Senior div 4 has aging squad — integration window 12–18 months. New coach means fresh squad selection starting NOW.",
    goldmine: false, avoid: false,
  },
  {
    id: "frigg", name: "Frigg Oslo FK", distance: 6.1,
    badge: "Goldmine", badgeType: "gold",
    tags: ["G17 div 3", "Senior div 4"],
    pathScore: 78, youthGap: 68,
    coachAlert: null,
    insight: "Hidden pipeline to Kjelsås senior — 3 players promoted this route 2022–24. Join by Oct 2026 to be positioned for 2 LM/CM vacancies opening June 2027.",
    goldmine: true, avoid: false,
  },
  {
    id: "grei", name: "Grei FK", distance: 5.7,
    badge: "Consider", badgeType: "amber",
    tags: ["G17 div 2", "Senior div 3"],
    pathScore: 61, youthGap: 45,
    coachAlert: null,
    insight: "G17 div 2 is stiffer competition. Senior div 3 reachable but squad depth is strong. Path exists but slower — expect 2–3 years.",
    goldmine: false, avoid: false,
  },
  {
    id: "valerenga", name: "Vålerenga II", distance: 6.1,
    badge: "Avoid", badgeType: "red",
    tags: ["G17 div 1", "Senior div 1"],
    pathScore: 29, youthGap: 12,
    coachAlert: null,
    insight: "Only 0.4% of 147k simulations through this club hit your target. Academy structure blocks senior path entirely.",
    goldmine: false, avoid: true,
  },
  {
    id: "skeid", name: "Skeid FK", distance: 5.1,
    badge: "Consider", badgeType: "amber",
    tags: ["G17 div 2", "Senior div 3"],
    pathScore: 55, youthGap: 50,
    coachAlert: null,
    insight: "Decent G17 programme. Senior team mid-table div 3 with some youth promotion history. Worth contacting after top targets.",
    goldmine: false, avoid: false,
  },
];

// ─── TRIALS ───────────────────────────────────────────────────────────────────
export const TRIALS = [
  { id: "t1", month: "Apr", day: "14", name: "Lyn FK — G17 open trial", sub: "Bislett · 4.3km · football.no", applied: true, source: "football.no" },
  { id: "t2", month: "Apr", day: "19", name: "Skeid — G16/G17 tryout", sub: "Voldsløkka · 5.1km · skeid.no", applied: false, source: "club website" },
  { id: "t3", month: "Apr", day: "22", name: "Frigg Oslo FK — Senior trial", sub: "Sandaker · 7.8km · Facebook", applied: false, source: "Facebook" },
  { id: "t4", month: "May", day: "3", name: "Kjelsås IL — G17/G19 trial", sub: "Kjelsås · 3.2km · club website", applied: false, source: "club website" },
  { id: "t5", month: "May", day: "11", name: "Ørn-Horten — G17 open day", sub: "Horten · 12km · NFF bulletin", applied: false, source: "NFF bulletin" },
  { id: "t6", month: "May", day: "18", name: "Stabæk II — Senior trial", sub: "Bekkestua · 8.1km · stabak.no", applied: false, source: "club website" },
];

// ─── INBOX ────────────────────────────────────────────────────────────────────
export const INBOX = [
  { id: "i1", club: "Kjelsås IL", preview: '"Hei! Vi vil gjerne invitere deg til trening mandag..."', status: "green", date: "Today", full: "Hei! Vi vil gjerne invitere deg til en prøvetrening mandag 14. april kl 18:00 på Kjelsåsbanene. Ta med treningstøy og studs. Hilsen Tor Henriksen, trener G17." },
  { id: "i2", club: "Lyn FK", preview: '"Interessant! Kan du komme på prøvetrening 14. april?"', status: "green", date: "Yesterday", full: "Hei, interessant henvendelse! Vi er alltid på jakt etter gode spillere til G17-laget vårt. Kan du komme på en prøvetrening onsdag 14. april? Ta kontakt for mer info." },
  { id: "i3", club: "Frigg Oslo FK", preview: '"Vi er interessert, kan du komme på en prøveøkt?"', status: "green", date: "2d ago", full: "Hei! Takk for henvendelsen. Vi er interessert i å se deg på trening. Har du mulighet til å komme på en prøveøkt i løpet av de neste to ukene?" },
  { id: "i4", club: "Vålerenga G17", preview: '"Takk for henvendelsen, men vi har dessverre ikke plass..."', status: "red", date: "3d ago", full: "Hei, takk for at du tok kontakt. Dessverre har vi ikke plass i G17-troppen vår for øyeblikket. Lykke til videre!" },
  { id: "i5", club: "Grei FK", preview: "No reply · Sent 10 days ago", status: "gray", date: "10d ago", full: null },
  { id: "i6", club: "Skeid", preview: "No reply · Sent 6 days ago", status: "gray", date: "6d ago", full: null },
  { id: "i7", club: "Bærum SK", preview: "No reply · Sent 4 days ago", status: "gray", date: "4d ago", full: null },
];

// ─── NETWORK ──────────────────────────────────────────────────────────────────
export const CONTACTS = [
  {
    id: "c1", initials: "TH", avColor: "red",
    name: "Tor Henriksen", role: "Head coach", club: "Kjelsås G17",
    lastContact: "Never", strength: 0, type: "coach_alert",
    tags: ["Kjelsås G17", "New coach"],
    connection: null,
    insight: "New coaches almost always want their own players. This is your window — email now before the squad is set.",
    somaliaLink: false,
  },
  {
    id: "c2", initials: "MK", avColor: "purple",
    name: "Mikkel Karlsen", role: "Coach", club: "Grei FK G17",
    lastContact: "12d ago", strength: 75, type: "bridge",
    tags: ["Grei FK", "Responded"],
    connection: "Previously coached alongside Tor Henriksen at Grei FK 2022–23",
    insight: "Mikkel knows the new Kjelsås coach personally. A warm intro via Mikkel is worth 3x a cold email.",
    somaliaLink: false,
  },
  {
    id: "c3", initials: "JA", avColor: "green",
    name: "Jonas Aas", role: "Player", club: "Lyn FK G17",
    lastContact: "Met at trial Apr 14", strength: 35, type: "bridge",
    tags: ["Lyn FK", "Player contact"],
    connection: "Trains with Frigg players on Tuesdays informally",
    insight: "Best intel source on Frigg's coach before you apply.",
    somaliaLink: false,
  },
  {
    id: "c4", initials: "PB", avColor: "amber",
    name: "Per Bakke", role: "Scout", club: "NFF Region Oslo",
    lastContact: "Never", strength: 0, type: "high_value",
    tags: ["NFF Scout", "High value"],
    connection: null,
    insight: "Regional NFF scout who attends div 3–4 matches. Getting on his radar early is a long game worth playing.",
    somaliaLink: false,
  },
  {
    id: "c5", initials: "AH", avColor: "green",
    name: "Abdullahi Hassan", role: "Community organiser", club: "Somali FA Oslo link",
    lastContact: "Never", strength: 0, type: "somalia_pipeline",
    tags: ["Somalia pipeline", "Diaspora"],
    connection: "Organises annual Somali diaspora football tournament in Oslo",
    insight: "Direct line to the Somalia FA network in Scandinavia. Critical relationship for national team pipeline.",
    somaliaLink: true,
  },
];

// ─── MATCHES ──────────────────────────────────────────────────────────────────
export const MATCHES = [
  { id: "m1", opp: "vs Lyn FK G17", date: "Apr 5", pos: "LM", mins: 90, goals: 1, assists: 2, result: "Win", score: "3–1", rating: 8.0 },
  { id: "m2", opp: "vs Skeid G17", date: "Mar 29", pos: "CAM", mins: 82, goals: 1, assists: 0, result: "Draw", score: "1–1", rating: 7.5 },
  { id: "m3", opp: "vs Kjelsås IL G17", date: "Mar 22", pos: "LM", mins: 68, goals: 0, assists: 0, result: "Loss", score: "0–2", rating: 5.9 },
  { id: "m4", opp: "vs Grei FK G17", date: "Mar 15", pos: "LM", mins: 90, goals: 2, assists: 1, result: "Win", score: "4–1", rating: 8.5 },
  { id: "m5", opp: "vs Frigg G17", date: "Mar 8", pos: "CM", mins: 74, goals: 0, assists: 1, result: "Draw", score: "2–2", rating: 7.2 },
  { id: "m6", opp: "vs Bærum SK G17", date: "Mar 1", pos: "LM", mins: 90, goals: 1, assists: 0, result: "Win", score: "2–0", rating: 7.8 },
  { id: "m7", opp: "vs Stabæk II G17", date: "Feb 22", pos: "LM", mins: 85, goals: 0, assists: 2, result: "Win", score: "3–1", rating: 8.0 },
  { id: "m8", opp: "vs Vålerenga G17", date: "Feb 15", pos: "CAM", mins: 60, goals: 0, assists: 0, result: "Loss", score: "0–3", rating: 5.5 },
];

// ─── PATHWAYS ─────────────────────────────────────────────────────────────────
export const PATHWAYS = [
  {
    id: "p1", rank: 1, badge: "Goldmine #1", badgeType: "gold",
    tag: "Highest EV", tagType: "green",
    title: "Frigg G17 → Kjelsås senior pipeline",
    successRate: 34, simCount: 147000,
    barColor: "var(--color-amber)",
    insight: "Frigg G17 has a documented pipeline to Kjelsås senior — 3 players promoted this route 2022–24. Kjelsås senior loses 2 midfielders in June 2027. Join Frigg by Oct 2026 and you're mathematically in the right place.",
    type: "gold",
    steps: [
      { color: "var(--color-green)", title: "Join Frigg G17", sub: "Mid-level div 3 — walkable competition", deadline: "Oct 2026" },
      { color: "var(--color-amber)", title: "Get promoted to Frigg G19", sub: "Target 7.5+ avg rating across 12 games", deadline: "Mar 2027" },
      { color: "var(--color-blue)", title: "Transfer to Kjelsås senior", sub: "2 LM/CM vacancies open. You are positioned.", deadline: "Jun–Aug 2027" },
    ],
  },
  {
    id: "p2", rank: 2, badge: "Goldmine #2", badgeType: "purple",
    tag: "Fastest route", tagType: "blue",
    title: "Kjelsås G17 → Kjelsås senior direct",
    successRate: 28, simCount: 147000,
    barColor: "var(--color-purple)",
    insight: "Direct route. Coach who has promoted 1 youth player per season for 3 years. You need to be that player. Requires 8.0+ rating consistency across 12+ games.",
    type: "purple",
    steps: [
      { color: "var(--color-green)", title: "Join Kjelsås G17", sub: "New coach = fresh opportunity NOW", deadline: "Aug 2026" },
      { color: "var(--color-amber)", title: "Become undeniable in G17", sub: "Senior coach watches training twice monthly", deadline: "8–14 months" },
    ],
  },
  {
    id: "p3", rank: 3, badge: "Safe floor", badgeType: "gray",
    tag: "Lowest risk", tagType: "gray",
    title: "Grei G17 → Grei senior → lateral move",
    successRate: 21, simCount: 147000,
    barColor: "var(--color-txt3)",
    insight: "Lower ceiling but almost zero downside risk. Grei senior div 3 gets you senior minutes at 17–18. From there a lateral transfer to div 3–4 elsewhere becomes very easy — you now have senior experience.",
    type: "gray",
    steps: [
      { color: "var(--color-green)", title: "Join Grei G17", sub: "Comfortable entry — div 2 competition", deadline: "Aug 2026" },
      { color: "var(--color-amber)", title: "Push for senior minutes at Grei", sub: "Build senior record at div 3 level", deadline: "Early 2027" },
      { color: "var(--color-blue)", title: "Lateral move up", sub: "Senior record unlocks higher div 3 clubs", deadline: "Summer 2027" },
    ],
  },
  {
    id: "p4", rank: null, badge: "Avoid", badgeType: "red",
    tag: null, tagType: null,
    title: "Vålerenga G17 — dead end",
    successRate: 4, simCount: 147000,
    barColor: "var(--color-red)",
    insight: "Only 0.4% of 147k simulations through this club hit your target. Academy structure blocks senior path entirely at div 1 level.",
    type: "red",
    steps: [],
  },
];

// ─── PHYSICAL ─────────────────────────────────────────────────────────────────
export const PHYSICAL = {
  height: { current: 187, unit: "cm", delta: "+0.5cm since Jan", good: true, color: "var(--color-green)", history: [185.0, 185.5, 186.0, 186.0, 186.5, 186.5, 187.0, 187.0] },
  weight: { current: 75, unit: "kg", delta: "+2kg since Jan", good: true, color: "var(--color-blue)", history: [73, 73, 73.5, 74, 74, 74.5, 75, 75] },
  sprint: { current: 5.1, unit: "s", delta: "-0.2s since Jan", good: true, color: "var(--color-purple)", history: [5.3, 5.3, 5.25, 5.2, 5.2, 5.15, 5.1, 5.1] },
  jump: { current: 58, unit: "cm", delta: "Same as Jan", good: null, color: "var(--color-amber)", history: [58, 57, 58, 59, 58, 58, 58, 58] },
};

export const PERCENTILES = [
  { label: "Height", val: 88, text: "Top 12%" },
  { label: "Sprint (40m)", val: 69, text: "Top 31%" },
  { label: "Weight/age", val: 72, text: "Top 28%" },
  { label: "Vertical jump", val: 56, text: "Top 44%" },
];

// ─── SOMALIA ──────────────────────────────────────────────────────────────────
export const SOMALIA_TIMELINE = [
  { year: "2026", age: 16, label: "Join target G17 club", status: "now", desc: "Land at the right club. Clean eligibility. Never accept a competitive Norway senior cap." },
  { year: "2027", age: 17, label: "Senior football debut", status: "next", desc: "First senior minutes at div 4–5 level. Senior record begins. Diaspora tournament appearances start." },
  { year: "2028", age: 18, label: "Establish in senior football", status: "future", desc: "Div 3–4 regular starter. Somalia FA contact network active. First national team communication." },
  { year: "2029", age: 19, label: "Somalia national team debut", status: "future", desc: "First cap. CECAFA campaign. Begin establishing as key player. First European interest appears." },
  { year: "2030", age: 20, label: "AFCON qualification push", status: "future", desc: "Somalia competitive in qualification. You are the spine of the team. European club interest grows." },
  { year: "2031", age: 21, label: "AFCON or World Cup qualification", status: "future", desc: "The moment everything changes. First major tournament. Transfer offers arrive." },
  { year: "2032", age: 22, label: "European club signing", status: "dream", desc: "Atletico, Marseille, Lens, Dortmund, Brentford. The system built this from day one." },
];

export const ELIGIBILITY = {
  status: "clean",
  norwayCompetitiveCaps: 0,
  norwayFriendlyCaps: 0,
  somaliaDeclaration: false,
  maxAllowedBefore21: 3,
  riskLevel: "none",
  notes: "Zero competitive caps for Norway. Fully free to declare for Somalia at any time. Youth caps (U17, U19) do NOT affect eligibility.",
};
