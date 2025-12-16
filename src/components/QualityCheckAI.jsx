import { useEffect, useState } from "react";



const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY; 
// ⚠️ exposed intentionally for assignment
function AIPlanFit({ clientSummary, mealPlanSummary }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function runAI() {
      try {
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
            "alignment": "High | Medium | Low",
            "concerns": ["max 3 points"],
            "positives": ["max 2 points"]
          }

          In key concern you must answer all these questions :
              Does this plan align with the client’s medical history?
              Are there contradictions between the plan and the health log?
              What are 1–2 high-level concerns?
            
              These are only examples, if you find something important to convey based on the diet and clientSummary please proceed with that also
          
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
              model: "llama-3.3-70b-versatile",
              temperature: 0.3,
              messages: [{ role: "user", content: prompt }]
            })
          }
        );

        const data = await res.json();
        console.log("Groq raw response:", data);

        if (!data.choices || !data.choices.length) {
          throw new Error(
            data.error?.message || "Invalid AI response"
          );
        }

        const content = data.choices[0].message.content;
        console.log("Raw AI output:", content);

        // Extract first JSON block
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

  if (loading || !result) {
  return <div className="card">AI is analyzing plan fit…</div>;
}


  console.log("Client Summary : "+JSON.stringify(clientSummary, null, 2))
  console.log("Meal Plan summary : "+JSON.stringify(mealPlanSummary, null, 2))
  
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

      <p>
        <strong>Overall Alignment:</strong>{" "}
        <span className={`status ${result.alignment.toLowerCase()}`}>
          {result.alignment}
        </span>
      </p>

      <p style={{ fontSize: "12px", opacity: 0.7 }}>
        AI insights are structured and interpreted at a high level.
        This is not medical advice.
      </p>
    </div>
  );
}

export default AIPlanFit;
