export interface Question {
  id: string;
  text: string;
  options: { value: number; label: string }[];
}

export interface AssessmentDef {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  duration: string;
  questions: Question[];
}

const SCALE_OPTIONS = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly Agree" },
];

export const ASSESSMENTS: AssessmentDef[] = [
  {
    id: "communication",
    title: "Communication Mastery",
    description: "Evaluate your verbal, written, and interpersonal communication effectiveness",
    emoji: "💬",
    color: "blue",
    duration: "8 min",
    questions: [
      { id: "c1", text: "I clearly articulate my thoughts and ideas in conversations.", options: SCALE_OPTIONS },
      { id: "c2", text: "I actively listen without interrupting others.", options: SCALE_OPTIONS },
      { id: "c3", text: "I adapt my communication style to different audiences.", options: SCALE_OPTIONS },
      { id: "c4", text: "I can handle difficult conversations calmly and constructively.", options: SCALE_OPTIONS },
      { id: "c5", text: "My written communications are clear, concise, and professional.", options: SCALE_OPTIONS },
      { id: "c6", text: "I am comfortable speaking in front of groups and presenting ideas.", options: SCALE_OPTIONS },
      { id: "c7", text: "I give and receive feedback effectively.", options: SCALE_OPTIONS },
      { id: "c8", text: "I use non-verbal cues effectively (eye contact, posture, tone).", options: SCALE_OPTIONS },
      { id: "c9", text: "I resolve misunderstandings quickly and diplomatically.", options: SCALE_OPTIONS },
      { id: "c10", text: "People often seek me out as a communicator or spokesperson.", options: SCALE_OPTIONS },
    ],
  },
  {
    id: "leadership",
    title: "Leadership Intelligence",
    description: "Measure your capacity to inspire, influence, and lead others toward shared goals",
    emoji: "🎯",
    color: "red",
    duration: "10 min",
    questions: [
      { id: "l1", text: "I inspire others to reach their full potential.", options: SCALE_OPTIONS },
      { id: "l2", text: "I make decisions confidently, even with incomplete information.", options: SCALE_OPTIONS },
      { id: "l3", text: "I create environments where team members feel psychologically safe.", options: SCALE_OPTIONS },
      { id: "l4", text: "I delegate effectively and trust my team to execute.", options: SCALE_OPTIONS },
      { id: "l5", text: "I give clear direction and set measurable goals.", options: SCALE_OPTIONS },
      { id: "l6", text: "I hold myself and others accountable for results.", options: SCALE_OPTIONS },
      { id: "l7", text: "I navigate organizational politics and build strategic alliances.", options: SCALE_OPTIONS },
      { id: "l8", text: "I adapt my leadership style to the needs of individuals.", options: SCALE_OPTIONS },
      { id: "l9", text: "I actively develop the careers of people around me.", options: SCALE_OPTIONS },
      { id: "l10", text: "I maintain composure and lead effectively under pressure.", options: SCALE_OPTIONS },
    ],
  },
  {
    id: "sales",
    title: "Sales Effectiveness",
    description: "Assess your ability to build relationships, create value, and close deals",
    emoji: "📈",
    color: "cyan",
    duration: "8 min",
    questions: [
      { id: "s1", text: "I quickly build rapport and trust with prospects.", options: SCALE_OPTIONS },
      { id: "s2", text: "I effectively uncover the real pain points and needs of buyers.", options: SCALE_OPTIONS },
      { id: "s3", text: "I clearly communicate the value and ROI of my solution.", options: SCALE_OPTIONS },
      { id: "s4", text: "I handle objections confidently and turn them into opportunities.", options: SCALE_OPTIONS },
      { id: "s5", text: "I follow a structured sales process consistently.", options: SCALE_OPTIONS },
      { id: "s6", text: "I am confident asking for the business and closing deals.", options: SCALE_OPTIONS },
      { id: "s7", text: "I maintain a healthy pipeline and manage my time effectively.", options: SCALE_OPTIONS },
      { id: "s8", text: "I understand my buyer's business deeply before pitching.", options: SCALE_OPTIONS },
      { id: "s9", text: "I recover well from rejection and stay motivated.", options: SCALE_OPTIONS },
      { id: "s10", text: "I consistently meet or exceed my sales targets.", options: SCALE_OPTIONS },
    ],
  },
  {
    id: "confidence",
    title: "Confidence & Mindset",
    description: "Measure your self-belief, resilience, and growth mindset",
    emoji: "⚡",
    color: "yellow",
    duration: "6 min",
    questions: [
      { id: "cf1", text: "I believe in my ability to achieve difficult goals.", options: SCALE_OPTIONS },
      { id: "cf2", text: "I embrace challenges as opportunities to grow.", options: SCALE_OPTIONS },
      { id: "cf3", text: "I bounce back quickly from setbacks and failures.", options: SCALE_OPTIONS },
      { id: "cf4", text: "I take bold action even when I feel uncertain.", options: SCALE_OPTIONS },
      { id: "cf5", text: "I maintain a positive mindset in difficult circumstances.", options: SCALE_OPTIONS },
      { id: "cf6", text: "I don't let fear of judgment hold me back.", options: SCALE_OPTIONS },
      { id: "cf7", text: "I trust my own judgment and instincts.", options: SCALE_OPTIONS },
      { id: "cf8", text: "I consistently show up as my best self, even on tough days.", options: SCALE_OPTIONS },
    ],
  },
  {
    id: "productivity",
    title: "Productivity & Focus",
    description: "Evaluate your ability to manage time, energy, and attention",
    emoji: "🚀",
    color: "green",
    duration: "7 min",
    questions: [
      { id: "p1", text: "I consistently complete my most important tasks each day.", options: SCALE_OPTIONS },
      { id: "p2", text: "I minimize distractions and maintain deep focus.", options: SCALE_OPTIONS },
      { id: "p3", text: "I plan my week with clear priorities and outcomes.", options: SCALE_OPTIONS },
      { id: "p4", text: "I effectively manage my energy, not just my time.", options: SCALE_OPTIONS },
      { id: "p5", text: "I use systems and tools to stay organized and on track.", options: SCALE_OPTIONS },
      { id: "p6", text: "I say no to low-priority requests to protect focused time.", options: SCALE_OPTIONS },
      { id: "p7", text: "I review and improve my productivity systems regularly.", options: SCALE_OPTIONS },
      { id: "p8", text: "I am proactive rather than reactive in my daily work.", options: SCALE_OPTIONS },
    ],
  },
  {
    id: "emotional_intelligence",
    title: "Emotional Intelligence",
    description: "Assess your self-awareness, empathy, and emotional regulation",
    emoji: "🧠",
    color: "pink",
    duration: "8 min",
    questions: [
      { id: "eq1", text: "I accurately identify and understand my own emotions.", options: SCALE_OPTIONS },
      { id: "eq2", text: "I manage my emotional reactions effectively in stressful situations.", options: SCALE_OPTIONS },
      { id: "eq3", text: "I understand how my emotions affect others around me.", options: SCALE_OPTIONS },
      { id: "eq4", text: "I empathize with others and understand their perspectives.", options: SCALE_OPTIONS },
      { id: "eq5", text: "I read the emotional climate of a room or situation accurately.", options: SCALE_OPTIONS },
      { id: "eq6", text: "I navigate interpersonal conflicts with maturity.", options: SCALE_OPTIONS },
      { id: "eq7", text: "I remain motivated even when faced with obstacles.", options: SCALE_OPTIONS },
      { id: "eq8", text: "I build and maintain strong relationships at work.", options: SCALE_OPTIONS },
      { id: "eq9", text: "I give difficult feedback in a compassionate and effective way.", options: SCALE_OPTIONS },
      { id: "eq10", text: "I am aware of my blind spots and work to address them.", options: SCALE_OPTIONS },
    ],
  },
  {
    id: "business",
    title: "Business Effectiveness",
    description: "Measure your strategic thinking, business acumen, and execution capabilities",
    emoji: "💼",
    color: "orange",
    duration: "9 min",
    questions: [
      { id: "b1", text: "I understand the key drivers of business performance in my domain.", options: SCALE_OPTIONS },
      { id: "b2", text: "I think strategically about long-term goals and outcomes.", options: SCALE_OPTIONS },
      { id: "b3", text: "I make data-driven decisions and interpret business metrics.", options: SCALE_OPTIONS },
      { id: "b4", text: "I build and maintain valuable professional networks.", options: SCALE_OPTIONS },
      { id: "b5", text: "I identify and capitalize on business opportunities.", options: SCALE_OPTIONS },
      { id: "b6", text: "I manage projects and initiatives to successful completion.", options: SCALE_OPTIONS },
      { id: "b7", text: "I effectively navigate and influence organizational dynamics.", options: SCALE_OPTIONS },
      { id: "b8", text: "I understand customer needs and can build products/services around them.", options: SCALE_OPTIONS },
      { id: "b9", text: "I manage resources (time, money, people) efficiently.", options: SCALE_OPTIONS },
      { id: "b10", text: "I continuously learn and adapt to changing business environments.", options: SCALE_OPTIONS },
    ],
  },
];
