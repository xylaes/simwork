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
        strengths.push('Spot-on diagnosis of our 3rd-party broker dependency and excessive spot rate premium.');
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
        strengths.push('Flagged fuel surcharge exposure and lack of contractual pass-through indexing.');
      } else {
        growthAreas.push('Look closely at fuel line items: we absorbed diesel spikes without indexing them back to enterprise accounts.');
      }

      if (hasNumbers) {
        score += 5;
        strengths.push('Good quantitative rigor; backed assertions up with specific numbers.');
      } else {
        growthAreas.push('Needs more quantitative data backing: quantify the dollar/percentage impact of each factor.');
      }

      score = Math.min(score, 98);
      const passed = score >= 75;

      let managerCommentary = '';
      let followUpChallenge = '';

      if (passed) {
        managerCommentary = `This is sharp, thorough executive work. You didn't just accept the surface narrative that "drivers are costing too much"—you actually dug into the cross-dock dwell logs and identified the 3rd-party broker leakage. Your recommendations give me ammunition for tomorrow's board prep.`;
        followUpChallenge = `For tomorrow's executive review: If we cap 3rd-party broker dispatches at 10% of total volume next quarter, how will we absorb peak holiday overflow without dropping customer SLAs?`;
      } else {
        managerCommentary = `I appreciate the quick turnaround on this draft, but this isn't ready for the executive team yet. You touched on a few high-level symptoms, but you missed the primary operational leak: our reliance on emergency 3rd-party brokers at \$4.00+/mile, and the massive dwell bottlenecks at our Chicago cross-dock that are triggering 1.5x driver overtime. Refine your analysis and resubmit.`;
        followUpChallenge = `Take a look at the dispatch table again. Compare the average cost-per-mile of 'Apex Fleet' vs. 'Third-Party Broker', and look at the 'Detention Hours' column in Chicago. Revise your numbers and send it back.`;
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
You are Sarah Lin, VP of Regional Operations at Apex Global Logistics. You are reviewing an internal Executive Operations Memo submitted by a junior Associate Operations Analyst regarding why Midwest delivery gross margins contracted by 8.2% in Q3.

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
  "managerCommentary": "string in Sarah Lin's voice, direct, constructive, professional",
  "strengths": ["string", "string"],
  "growthAreas": ["string", "string"],
  "followUpChallenge": "string (a strategic question to stress test their thinking)",
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
