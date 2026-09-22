export interface DispatchRecord {
  id: string;
  date: string;
  origin: string;
  destination: string;
  region: 'Midwest' | 'Northeast' | 'Southeast' | 'Southwest';
  carrierType: 'Apex Fleet' | 'Third-Party Broker';
  miles: number;
  billedRevenue: number;
  fuelCost: number;
  driverRegularHours: number;
  driverOvertimeHours: number;
  detentionHoursAtDepot: number;
  status: 'On-Time' | 'Delayed - Weather' | 'Delayed - Depot Congestion' | 'Late Window';
  clientAccount: string;
}

export interface Scenario {
  id: string;
  title: string;
  companyName: string;
  companyIndustry: string;
  roleTitle: string;
  sprintDuration: string;
  manager: {
    name: string;
    title: string;
    avatar: string;
    email: string;
  };
  briefing: {
    urgentSubject: string;
    receivedTime: string;
    emailBody: string;
    targetObjectives: string[];
    keyConstraints: string[];
  };
  evaluationRubric: {
    keyInsightsExpected: string[];
    criticalPitfalls: string[];
  };
  sampleDispatchData: DispatchRecord[];
  resumeBulletTemplates: {
    action: string;
    impact: string;
    fullBullet: string;
  }[];
}

export const APEX_LOGISTICS_SCENARIO: Scenario = {
  id: 'apex-q3-margin-collapse',
  title: 'Q3 Midwest Delivery Margin Collapse',
  companyName: 'Apex Global Logistics',
  companyIndustry: 'B2B Regional Freight & Supply Chain Ops',
  roleTitle: 'Associate Operations & Data Analyst',
  sprintDuration: '5-Day Work Sprint (Simulated)',
  manager: {
    name: 'Sarah Lin',
    title: 'VP of Regional Operations',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    email: 's.lin@apexlogistics.internal',
  },
  briefing: {
    urgentSubject: 'URGENT: Midwest route gross margins down 8.2% in Q3 — need executive analysis by EOD',
    receivedTime: 'Today at 8:42 AM',
    emailBody: `Hey team,

I just got off a tense call with our Chief Operating Officer. Despite Midwest regional parcel volume growing +11.8% quarter-over-quarter, our regional net delivery margin collapsed from 18.4% down to 10.2%. On paper we are moving more freight than ever, but on the P&L we are severely leaking cash.

The leadership team is pointing fingers at everything from driver wage increases to diesel inflation, but I need hard operational data before tomorrow's board prep.

I've attached a raw dispatch export of 40 representative Midwest runs alongside control runs from Q3. 

I need you to pull together an Executive Operations Memo that answers:
1. What are the specific root causes of this 8.2% margin contraction?
2. Quantify the dollar impact of each leak (don't give me vague adjectives; show me the math).
3. Provide 3 concrete, prioritized operational fixes for Q4.

Take a look at the data tab, run your calculations, and send me your draft when you're ready. I'll review it with the same standards we hold for executive leadership.

Best,
Sarah`,
    targetObjectives: [
      'Identify the 3 distinct financial and operational leaks dragging down Midwest margins.',
      'Quantify the disparity between internal Apex Fleet runs vs. emergency 3rd-Party Broker dispatches.',
      'Analyze the impact of depot detention hours on driver overtime in the Chicago/Detroit hub.',
      'Synthesize findings into an executive-ready memo with immediate Q4 action items.'
    ],
    keyConstraints: [
      'Do not propose firing drivers; Midwest driver retention is already a company-wide risk.',
      'Enterprise client contracts cannot be renegotiated before annual renewal in December, except for pass-through fuel surcharges.',
      'Recommendations must show an estimated EBITDA margin recovery path.'
    ]
  },
  evaluationRubric: {
    keyInsightsExpected: [
      'Third-party spot freight costs: Broker runs cost ~$4.00+/mile vs ~$2.45/mile for Apex internal fleet, heavily diluting margins on overflow routes.',
      'Depot Detention Hours: Chicago & Detroit depot dwell times averaged 3.2 hours, directly triggering costly driver overtime multipliers (1.5x).',
      'Uncollected Fuel Surcharge Lag: Spikes in diesel fuel costs were not properly indexed/billed back to enterprise accounts like GreatLakes Retail.',
      'Concrete Q4 Recommendations: Staggered cross-dock loading to eliminate detention, reducing broker dependency by pre-allocating dedicated lanes.'
    ],
    criticalPitfalls: [
      'Blaming driver base wages instead of unmanaged overtime caused by warehouse bottleneck detention.',
      'Failing to compare Broker cost-per-mile against Fleet cost-per-mile.',
      'Writing vague advice without specific dollar or percentage estimates.'
    ]
  },
  sampleDispatchData: [
    {
      id: 'DISP-8921',
      date: '2025-08-02',
      origin: 'Chicago, IL',
      destination: 'Indianapolis, IN',
      region: 'Midwest',
      carrierType: 'Apex Fleet',
      miles: 182,
      billedRevenue: 620,
      fuelCost: 118,
      driverRegularHours: 4.5,
      driverOvertimeHours: 0.0,
      detentionHoursAtDepot: 0.5,
      status: 'On-Time',
      clientAccount: 'Midwest Auto Parts'
    },
    {
      id: 'DISP-8922',
      date: '2025-08-03',
      origin: 'Chicago, IL',
      destination: 'Detroit, MI',
      region: 'Midwest',
      carrierType: 'Third-Party Broker',
      miles: 285,
      billedRevenue: 910,
      fuelCost: 245,
      driverRegularHours: 6.0,
      driverOvertimeHours: 3.5,
      detentionHoursAtDepot: 3.8,
      status: 'Delayed - Depot Congestion',
      clientAccount: 'GreatLakes Retail'
    },
    {
      id: 'DISP-8923',
      date: '2025-08-04',
      origin: 'Columbus, OH',
      destination: 'Cleveland, OH',
      region: 'Midwest',
      carrierType: 'Apex Fleet',
      miles: 142,
      billedRevenue: 510,
      fuelCost: 92,
      driverRegularHours: 3.8,
      driverOvertimeHours: 0.0,
      detentionHoursAtDepot: 0.4,
      status: 'On-Time',
      clientAccount: 'Buckeye Hardware'
    },
    {
      id: 'DISP-8924',
      date: '2025-08-05',
      origin: 'Detroit, MI',
      destination: 'Grand Rapids, MI',
      region: 'Midwest',
      carrierType: 'Third-Party Broker',
      miles: 158,
      billedRevenue: 580,
      fuelCost: 170,
      driverRegularHours: 4.0,
      driverOvertimeHours: 2.2,
      detentionHoursAtDepot: 2.9,
      status: 'Delayed - Depot Congestion',
      clientAccount: 'GreatLakes Retail'
    },
    {
      id: 'DISP-8925',
      date: '2025-08-06',
      origin: 'Indianapolis, IN',
      destination: 'Louisville, KY',
      region: 'Midwest',
      carrierType: 'Apex Fleet',
      miles: 114,
      billedRevenue: 440,
      fuelCost: 75,
      driverRegularHours: 3.2,
      driverOvertimeHours: 0.0,
      detentionHoursAtDepot: 0.3,
      status: 'On-Time',
      clientAccount: 'Hoosier Beverage'
    },
    {
      id: 'DISP-8926',
      date: '2025-08-08',
      origin: 'Chicago, IL',
      destination: 'Milwaukee, WI',
      region: 'Midwest',
      carrierType: 'Third-Party Broker',
      miles: 92,
      billedRevenue: 390,
      fuelCost: 110,
      driverRegularHours: 3.0,
      driverOvertimeHours: 2.5,
      detentionHoursAtDepot: 3.4,
      status: 'Delayed - Depot Congestion',
      clientAccount: 'Northern Grocery'
    },
    {
      id: 'DISP-8927',
      date: '2025-08-10',
      origin: 'Columbus, OH',
      destination: 'Pittsburgh, PA',
      region: 'Northeast',
      carrierType: 'Apex Fleet',
      miles: 185,
      billedRevenue: 720,
      fuelCost: 115,
      driverRegularHours: 4.6,
      driverOvertimeHours: 0.0,
      detentionHoursAtDepot: 0.5,
      status: 'On-Time',
      clientAccount: 'Allegheny Industrial'
    },
    {
      id: 'DISP-8928',
      date: '2025-08-11',
      origin: 'Chicago, IL',
      destination: 'Detroit, MI',
      region: 'Midwest',
      carrierType: 'Third-Party Broker',
      miles: 285,
      billedRevenue: 920,
      fuelCost: 260,
      driverRegularHours: 6.2,
      driverOvertimeHours: 4.1,
      detentionHoursAtDepot: 4.2,
      status: 'Late Window',
      clientAccount: 'GreatLakes Retail'
    },
    {
      id: 'DISP-8929',
      date: '2025-08-12',
      origin: 'Indianapolis, IN',
      destination: 'Chicago, IL',
      region: 'Midwest',
      carrierType: 'Apex Fleet',
      miles: 182,
      billedRevenue: 640,
      fuelCost: 116,
      driverRegularHours: 4.7,
      driverOvertimeHours: 0.0,
      detentionHoursAtDepot: 0.6,
      status: 'On-Time',
      clientAccount: 'Midwest Auto Parts'
    },
    {
      id: 'DISP-8930',
      date: '2025-08-14',
      origin: 'Detroit, MI',
      destination: 'Toledo, OH',
      region: 'Midwest',
      carrierType: 'Third-Party Broker',
      miles: 60,
      billedRevenue: 310,
      fuelCost: 85,
      driverRegularHours: 2.2,
      driverOvertimeHours: 2.8,
      detentionHoursAtDepot: 3.5,
      status: 'Delayed - Depot Congestion',
      clientAccount: 'Midwest Auto Parts'
    },
    {
      id: 'DISP-8931',
      date: '2025-08-15',
      origin: 'Atlanta, GA',
      destination: 'Charlotte, NC',
      region: 'Southeast',
      carrierType: 'Apex Fleet',
      miles: 245,
      billedRevenue: 890,
      fuelCost: 140,
      driverRegularHours: 5.5,
      driverOvertimeHours: 0.0,
      detentionHoursAtDepot: 0.5,
      status: 'On-Time',
      clientAccount: 'Piedmont Foods'
    },
    {
      id: 'DISP-8932',
      date: '2025-08-17',
      origin: 'Chicago, IL',
      destination: 'Cleveland, OH',
      region: 'Midwest',
      carrierType: 'Third-Party Broker',
      miles: 345,
      billedRevenue: 1050,
      fuelCost: 310,
      driverRegularHours: 7.0,
      driverOvertimeHours: 3.5,
      detentionHoursAtDepot: 3.1,
      status: 'Delayed - Depot Congestion',
      clientAccount: 'GreatLakes Retail'
    },
    {
      id: 'DISP-8933',
      date: '2025-08-19',
      origin: 'Columbus, OH',
      destination: 'Cincinnati, OH',
      region: 'Midwest',
      carrierType: 'Apex Fleet',
      miles: 107,
      billedRevenue: 420,
      fuelCost: 68,
      driverRegularHours: 3.0,
      driverOvertimeHours: 0.0,
      detentionHoursAtDepot: 0.4,
      status: 'On-Time',
      clientAccount: 'Buckeye Hardware'
    },
    {
      id: 'DISP-8934',
      date: '2025-08-20',
      origin: 'Chicago, IL',
      destination: 'Rockford, IL',
      region: 'Midwest',
      carrierType: 'Apex Fleet',
      miles: 88,
      billedRevenue: 350,
      fuelCost: 55,
      driverRegularHours: 2.5,
      driverOvertimeHours: 0.0,
      detentionHoursAtDepot: 0.5,
      status: 'On-Time',
      clientAccount: 'Prairie Supply'
    },
    {
      id: 'DISP-8935',
      date: '2025-08-22',
      origin: 'Detroit, MI',
      destination: 'Chicago, IL',
      region: 'Midwest',
      carrierType: 'Third-Party Broker',
      miles: 285,
      billedRevenue: 940,
      fuelCost: 255,
      driverRegularHours: 6.0,
      driverOvertimeHours: 3.9,
      detentionHoursAtDepot: 4.0,
      status: 'Delayed - Depot Congestion',
      clientAccount: 'GreatLakes Retail'
    },
    {
      id: 'DISP-8936',
      date: '2025-08-24',
      origin: 'Indianapolis, IN',
      destination: 'Fort Wayne, IN',
      region: 'Midwest',
      carrierType: 'Apex Fleet',
      miles: 125,
      billedRevenue: 480,
      fuelCost: 78,
      driverRegularHours: 3.4,
      driverOvertimeHours: 0.0,
      detentionHoursAtDepot: 0.3,
      status: 'On-Time',
      clientAccount: 'Hoosier Beverage'
    },
    {
      id: 'DISP-8937',
      date: '2025-08-26',
      origin: 'Grand Rapids, MI',
      destination: 'Chicago, IL',
      region: 'Midwest',
      carrierType: 'Third-Party Broker',
      miles: 178,
      billedRevenue: 640,
      fuelCost: 190,
      driverRegularHours: 4.5,
      driverOvertimeHours: 2.8,
      detentionHoursAtDepot: 3.3,
      status: 'Delayed - Depot Congestion',
      clientAccount: 'Northern Grocery'
    },
    {
      id: 'DISP-8938',
      date: '2025-08-28',
      origin: 'Chicago, IL',
      destination: 'Peoria, IL',
      region: 'Midwest',
      carrierType: 'Apex Fleet',
      miles: 165,
      billedRevenue: 590,
      fuelCost: 102,
      driverRegularHours: 4.2,
      driverOvertimeHours: 0.0,
      detentionHoursAtDepot: 0.4,
      status: 'On-Time',
      clientAccount: 'Prairie Supply'
    },
    {
      id: 'DISP-8939',
      date: '2025-08-30',
      origin: 'Cleveland, OH',
      destination: 'Detroit, MI',
      region: 'Midwest',
      carrierType: 'Third-Party Broker',
      miles: 169,
      billedRevenue: 610,
      fuelCost: 185,
      driverRegularHours: 4.4,
      driverOvertimeHours: 2.6,
      detentionHoursAtDepot: 3.0,
      status: 'Delayed - Depot Congestion',
      clientAccount: 'GreatLakes Retail'
    },
    {
      id: 'DISP-8940',
      date: '2025-09-02',
      origin: 'Chicago, IL',
      destination: 'Detroit, MI',
      region: 'Midwest',
      carrierType: 'Third-Party Broker',
      miles: 285,
      billedRevenue: 930,
      fuelCost: 265,
      driverRegularHours: 6.1,
      driverOvertimeHours: 4.5,
      detentionHoursAtDepot: 4.5,
      status: 'Late Window',
      clientAccount: 'GreatLakes Retail'
    }
  ],
  resumeBulletTemplates: [
    {
      action: 'Diagnosed an 8.2% operating margin contraction',
      impact: 'uncovered $142,000/mo in margin leakage across 40+ regional freight dispatches by isolating 3rd-party spot broker markups and Chicago cross-dock dwell times.',
      fullBullet: 'Engineered operational cost audit for regional freight logistics model; isolated an 8.2% gross margin deficit across Midwest routes, attributing 64% of variance to unhedged spot broker premiums and 3.2-hour average cross-dock detention.'
    },
    {
      action: 'Constructed Root-Cause Mitigation Strategy',
      impact: 'formulated cross-dock queue restructuring and fuel surcharge pass-through indexing model projected to restore 680 bps of EBITDA margin.',
      fullBullet: 'Authored executive mitigation brief detailing staggered cross-dock scheduling and fuel index adjustments; modeled operational turnaround projected to recover 680 bps of gross margin without fleet expansion.'
    }
  ]
};
