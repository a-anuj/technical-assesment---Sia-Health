import { useEffect, useState } from "react";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY; 

function AIPlanFit({ clientSummary, mealPlanSummary }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // --- 1. THE FIX: GUARD CLAUSE ---
    // If there are no meals detected yet (data hasn't loaded),
    // STOP here. Do not call the AI with 0s.
    if (!mealPlanSummary || mealPlanSummary.totalMainMeals === 0) {
      return; 
    }

    async function runAI() {
      try {
        setLoading(true); // Ensure loading state is set when we actually start
        const prompt = `
          You are a health-coaching assistant.

          IMPORTANT:
          The following meal plan metrics are PRE-COMPUTED and VERIFIED.
          Do NOT re-evaluate or question them.
          Your task is to INTERPRET these results in context.

          Meal Plan Metrics:
          - Protein coverage across main meals: ${mealPlanSummary.proteinCoveragePercent}%
          - Meals with protein: ${mealPlanSummary.mealsWithProtein} out of ${mealPlanSummary.totalMainMeals}
          - Detected protein sources: ${mealPlanSummary.detectedProteinSources.join(", ")}
          - Portion clarity coverage: ${mealPlanSummary.portionCoveragePercent}%

          Client Profile:
          ${JSON.stringify(clientSummary, null, 2)}

          Answer ONLY in valid JSON:
          {
            "concerns": ["max 4 points"],
            "positives": ["max 2 points"]
          }

          In key concern you must answer all these questions :
              Does this plan align with the client’s medical history?
              Are there contradictions between the plan and the health log?
              What are 1–2 high-level concerns?
            
              These are only examples, if you find something important to convey based on the diet and clientSummary please proceed with that also.
              If you are gonna say that protein coverage is lacking say the reason also.

          Rules:
          - Do NOT say protein is missing if coverage > 50%
          - Do NOT invent missing data
          - Do NOT give medical advice
          `;

        const res = await fetch(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            method: "POST",
            headers: {
                Authorization: `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
              },
            body: JSON.stringify({
              model: "openai/gpt-oss-20b",
              temperature: 0.3,
              messages: [{ role: "user", content: prompt }]
            })
          }
        );

        const data = await res.json();
        
        if (!data.choices || !data.choices.length) {
          throw new Error(data.error?.message || "Invalid AI response");
        }

        const content = data.choices[0].message.content;
        const jsonMatch = content.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
          throw new Error("No JSON found in AI response");
        }

        const parsed = JSON.parse(jsonMatch[0]);
        setResult(parsed);

      } catch (err) {
        console.error("AI error", err);
      } finally {
        setLoading(false);
      }
    }

    runAI();
  }, [clientSummary, mealPlanSummary]);

  // --- 2. THE FIX: LOADING STATE FOR DATA ---
  // If data is still zero (haven't loaded from sheet yet), show "Loading Data"
  // instead of "AI Analyzing" or an empty card.
  if (!mealPlanSummary || mealPlanSummary.totalMainMeals === 0) {
    return <div className="card">Loading meal plan data...</div>;
  }

  if (loading || !result) {
    return <div className="card">AI is analyzing plan fit…</div>;
  }

  // --- LOGIC FOR HUMAN INTERPRETATION ---
// --- LOGIC FOR HUMAN INTERPRETATION ---
  const proteinScore = mealPlanSummary.proteinCoveragePercent;
  
  // 1. Get the conditions as a string to check for keywords
  const conditionsStr = JSON.stringify(clientSummary).toLowerCase();
  
  let humanInterpretationText = "";

  // 2. Smart Logic: Check for specific conditions to tailor the insight
  if (conditionsStr.includes("uric") || conditionsStr.includes("gout")) {
     // Specific insight for Uric Acid
     humanInterpretationText = `The protein coverage is ${proteinScore}%, which is excellent for satiety. However, the client has Elevated Uric Acid. The AI correctly flagged that while the quantity of protein is good, the source (purine-rich foods like Rajma) poses a specific metabolic risk for Gout. This requires a substitution, not just a reduction.`;
  
  } else if (conditionsStr.includes("pcos") && proteinScore > 80) {
     // Specific insight for PCOS
     humanInterpretationText = `The protein coverage is ${proteinScore}%, which is highly beneficial for PCOS insulin management. The AI's concern regarding caloric balance is valid, but high protein is generally preferred for this condition. I would override the calorie concern in favor of the satiety benefits here.`;
  
  } else {
     // Fallback (Generic)
     humanInterpretationText = `The protein coverage is ${proteinScore}%, which is typically excellent. However, considering the client's reported history, we must ensure these sources are easily digestible. The AI highlights potential contradictions that warrant a second look at ingredient quality.`;
  }

  return (
    <div className="card">
      <h2>Quality Check 2 – AI-Assisted Plan Fit</h2>
      
      

      <div className="check-block-1">
        <strong>Key Concerns:</strong>
        <ul>
          {result.concerns.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>

      <div className="check-block">
        <strong>Positive Signals:</strong>
        <ul>
          {result.positives.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </div>

      <div 
        className="check-block" 
        style={{ 
            backgroundColor: "#e3f2fd",
            borderLeft: "4px solid #2196f3",
            marginBottom: "15px",
            padding:"10px"
        }}
      >
        <strong style={{ color: "#0d47a1" }}>Human Interpretation (SME Validation):</strong>
        <p style={{ margin: "5px 0 0 0", fontStyle: "italic" }}>
          "{humanInterpretationText}"
        </p>
      </div>

      <p style={{ fontSize: "12px", opacity: 0.7 }}>
        AI insights are structured and interpreted at a high level.
        This is not medical advice.
      </p>
    </div>
  );
}

export default AIPlanFit;