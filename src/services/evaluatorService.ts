import { Scenario } from '../data/scenarios';

export interface EvaluationResult {
  score: number; // 0 to 100
  passed: boolean;
  status: 'Needs Revision' | 'Approved with Commendation';
  managerCommentary: string;
  strengths: string[];
  growthAreas: string[];
  followUpChallenge: string;
  auditMetrics: {
    spotBrokerIdentified: boolean;
    detentionBottleneckIdentified: boolean;
    fuelIndexingIdentified: boolean;
    quantitativeRigorScore: number; // out of 10
  };
  stressTestVerdict?: {
    candidateResponse: string;
    managerFeedback: string;
    defenseScore: number;
    passed: boolean;
  };
}

export async function evaluateMemo(
  memoContent: string,
  scenario: Scenario,
  apiKey?: string
): Promise<EvaluationResult> {
  // If an API key is provided, we can call Gemini directly
  if (apiKey && apiKey.trim().length > 10) {
    try {
      return await evaluateWithGemini(memoContent, scenario, apiKey.trim());
    } catch (err) {
      console.warn('Gemini API call failed, falling back to local simulation evaluator:', err);
    }
  }

  // Intelligent local evaluator
  return evaluateLocally(memoContent, scenario);
}

export async function evaluateStressTestDefense(
  candidateRebuttal: string,
  scenario: Scenario,
  apiKey?: string
): Promise<{ managerFeedback: string; defenseScore: number; passed: boolean }> {
  if (apiKey && apiKey.trim().length > 10) {
    try {
      return await evaluateStressTestWithGemini(candidateRebuttal, scenario, apiKey.trim());
    } catch (err) {
      console.warn('Gemini API call failed for stress test, falling back to local evaluator:', err);
    }
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      const lower = candidateRebuttal.toLowerCase();
      const mentionsContracts = lower.includes('contract') || lower.includes('dedicated') || lower.includes('partner') || lower.includes('advance');
      const mentionsPreload = lower.includes('drop') || lower.includes('hook') || lower.includes('pre-load') || lower.includes('staging') || lower.includes('night');
      const mentionsSLA = lower.includes('sla') || lower.includes('tier') || lower.includes('window') || lower.includes('customer');

      let score = 55;
      if (mentionsContracts) score += 20;
      if (mentionsPreload) score += 15;
      if (mentionsSLA) score += 10;
      score = Math.min(score, 98);

      const passed = score >= 70;
      let feedback = '';

      if (passed) {
        feedback = `Excellent defense. Pre-contracting dedicated carrier capacity 6 weeks ahead instead of relying on the spot broker market solves the holiday volume surge without destroying our gross margins. That protects both customer SLAs and EBITDA. You've earned the executive sign-off.`;
      } else {
        feedback = `Your response is a bit too vague. Saying we'll "work harder" or "plan better" won't convince the Chief Commercial Officer. You need structural commitments: pre-negotiated dedicated carrier blocks and off-peak night shifts to handle peak load without emergency spot rates.`;
      }

      resolve({
        defenseScore: score,
        managerFeedback: feedback,
        passed,
      });
    }, 1000);
  });
}

function evaluateLocally(memoContent: string, scenario: Scenario): Promise<EvaluationResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lower = memoContent.toLowerCase();

      // Check key insights
      const mentionsBroker = lower.includes('broker') || lower.includes('third-party') || lower.includes('3rd party') || lower.includes('spot');
      const mentionsDetention = lower.includes('detention') || lower.includes('dwell') || lower.includes('congestion') || lower.includes('depot') || lower.includes('wait');
      const mentionsOvertime = lower.includes('overtime') || lower.includes('hours') || lower.includes('ot');
      const mentionsFuel = lower.includes('fuel') || lower.includes('diesel') || lower.includes('surcharge');
      const hasNumbers = /\d+%|\$\d+|\d+\s?hours|\d+\s?miles/i.test(memoContent);

      const strengths: string[] = [];
      const growthAreas: string[] = [];

      let score = 45;

      if (mentionsBroker) {
        score += 20;
        strengths.push('Spot-on diagnosis of our 3rd-party broker dependency and excessive spot rate premium ($4.12/mi vs $2.48/mi).');
      } else {
        growthAreas.push('Missed the major cost driver: 3rd-party broker runs cost ~$4.00+/mile compared to ~$2.45/mile for our own fleet.');
      }

      if (mentionsDetention && mentionsOvertime) {
        score += 20;
        strengths.push('Correctly linked driver overtime back to Chicago/Detroit depot detention dwell times (3.2hr avg) rather than driver laziness.');
      } else if (mentionsOvertime) {
        score += 10;
        growthAreas.push('You noted driver overtime, but failed to identify the root cause: cross-dock depot congestion and detention times.');
      } else {
        growthAreas.push('Did not analyze the surge in driver overtime hours driving labor variances.');
      }

      if (mentionsFuel) {
        score += 10;
        strengths.push('Flagged fuel surcharge exposure and lack of contractual pass-through indexing to enterprise accounts.');
      } else {
        growthAreas.push('Look closely at fuel line items: we absorbed diesel spikes without indexing them back to enterprise accounts.');
      }

      if (hasNumbers) {
        score += 5;
        strengths.push('High quantitative rigor; backed assertions up with specific dollar amounts and percentages.');
      } else {
        growthAreas.push('Needs more quantitative data backing: quantify the dollar/percentage impact of each factor.');
      }

      score = Math.min(score, 98);
      const passed = score >= 75;

      let managerCommentary = '';
      const followUpChallenge = scenario.stressTestScenario.question;

      if (passed) {
        managerCommentary = `This is sharp, thorough executive work. You didn't just accept the surface narrative that "drivers are costing too much"—you actually dug into the cross-dock dwell logs and identified the 3rd-party broker leakage. Your recommendations give me ammunition for tomorrow's board prep.`;
      } else {
        managerCommentary = `I appreciate the quick turnaround on this draft, but this isn't ready for the executive team yet. You touched on a few high-level symptoms, but you missed the primary operational leak: our reliance on emergency 3rd-party brokers at \$4.00+/mile, and the massive dwell bottlenecks at our Chicago cross-dock that are triggering 1.5x driver overtime. Refine your analysis and resubmit.`;
      }

      resolve({
        score,
        passed,
        status: passed ? 'Approved with Commendation' : 'Needs Revision',
        managerCommentary,
        strengths,
        growthAreas,
        followUpChallenge,
        auditMetrics: {
          spotBrokerIdentified: mentionsBroker,
          detentionBottleneckIdentified: mentionsDetention,
          fuelIndexingIdentified: mentionsFuel,
          quantitativeRigorScore: hasNumbers ? 9 : 4
        }
      });
    }, 1200);
  });
}

async function evaluateWithGemini(
  memoContent: string,
  scenario: Scenario,
  apiKey: string
): Promise<EvaluationResult> {
  const prompt = `
You are ${scenario.manager.name}, ${scenario.manager.title} at ${scenario.companyName}. You are reviewing an internal Executive Operations Memo submitted by a junior Associate Operations Analyst regarding why Midwest delivery gross margins contracted by 8.2% in Q3.

Candidate's Submitted Memo:
"""
${memoContent}
"""

Key Ground Truths in the Dispatch Data:
1. 3rd-party broker runs were used for overflow and cost ~$4.00+/mile vs ~$2.45/mile for Apex Fleet.
2. Chicago & Detroit depot dwell times averaged 3.2 hours, causing driver overtime (1.5x pay).
3. Fuel surcharge lag: unhedged diesel spikes were absorbed without pass-through to accounts like GreatLakes Retail.

Evaluate this memo critically with the standards of an executive VP. Return ONLY a valid JSON object matching this schema:
{
  "score": number (0 to 100),
  "passed": boolean (true if score >= 75),
  "status": "Approved with Commendation" | "Needs Revision",
  "managerCommentary": "string in ${scenario.manager.name}'s voice, direct, constructive, professional",
  "strengths": ["string", "string"],
  "growthAreas": ["string", "string"],
  "followUpChallenge": "${scenario.stressTestScenario.question}",
  "auditMetrics": {
    "spotBrokerIdentified": boolean,
    "detentionBottleneckIdentified": boolean,
    "fuelIndexingIdentified": boolean,
    "quantitativeRigorScore": number (1 to 10)
  }
}
`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return JSON.parse(rawText) as EvaluationResult;
}

async function evaluateStressTestWithGemini(
  rebuttal: string,
  scenario: Scenario,
  apiKey: string
): Promise<{ managerFeedback: string; defenseScore: number; passed: boolean }> {
  const prompt = `
You are ${scenario.manager.name}, ${scenario.manager.title} at ${scenario.companyName}.
You previously asked the candidate: "${scenario.stressTestScenario.question}".

Candidate's strategic rebuttal/defense:
"""
${rebuttal}
"""

Evaluate if their defense demonstrates genuine operational and supply-chain thinking (e.g. pre-negotiated dedicated partner capacity, off-peak cross-dock shifts, drop-and-hook pre-loading, tiered customer SLAs).
Return ONLY a valid JSON object:
{
  "managerFeedback": "string in ${scenario.manager.name}'s voice",
  "defenseScore": number (0 to 100),
  "passed": boolean (true if >= 70)
}
`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return JSON.parse(rawText);
}
