import { useEffect, useState } from "react";
import "./App.css";

import ClientSummary from "./components/ClientSummary";

import rawMealPlan from "./data/mealPlan.json";
import { normalizeMealPlan } from "./utils/normalizeMealPlan";
import { runCheck1 } from "./checks/check1";

function App() {
  const [check1Results, setCheck1Results] = useState([]);

    useEffect(() => {
      console.log("App mounted");

      const normalizedMealPlan = normalizeMealPlan(rawMealPlan);
      console.log("Normalized:", normalizedMealPlan);

      const results = runCheck1(normalizedMealPlan);
      console.log("Check1 results:", results);

      setCheck1Results(results);
    }, []);


  // ---- SUMMARY LOGIC ----
  const proteinIssues = check1Results.filter(
    r => r.check === "Protein" && r.status !== "OK"
  );

  const portionIssues = check1Results.filter(
    r => r.check === "Portion Size" && r.status !== "OK"
  );

  const proteinStatus =
    proteinIssues.some(r => r.status === "Needs Improvement")
      ? "Needs Improvement"
      : proteinIssues.length > 0
      ? "Warning"
      : "OK";

  const portionStatus =
    portionIssues.length > 0 ? "Needs Improvement" : "OK";

  // ---- DERIVED INSIGHTS (IMPORTANT FIX) ----
  const detectedProteinSources = [
    ...new Set(
      check1Results
        .filter(
          r =>
            r.check === "Protein" &&
            Array.isArray(r.proteinSources) &&
            r.proteinSources.length > 0
        )
        .flatMap(r => r.proteinSources)
    )
  ];

  // ---- EXTRACT PORTION RESULT (FIX) ----
  const portionResult = check1Results.find(
    r => r.check === "Portion Size" && r.scope === "Weekly"
  );


  return (
    <div className="page-container">
      {/* 1. Client Summary */}
      <ClientSummary />

      {/* 2. Quality Check 1 */}
      <div className="card">
        

        {/* Protein Check */}
        <div className="check-block">
          <h2>Quality Check 1 - Protein Based</h2>
          <ul>
            <li>
              <strong>Status:</strong>{" "}
              <span
                className={`status ${proteinStatus
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                {proteinStatus}
              </span>
            </li>

            <li>
              <strong>Why:</strong>{" "}
            
              {proteinStatus === "OK" && (
                <>
                  Protein sources are consistently present across meals.
                  <br />
                  <strong>Detected sources:</strong>{" "}
                  {detectedProteinSources.join(", ")}
                </>
              )}

              {proteinStatus === "Warning" && (
                <>
                  Protein sources are present but limited in some meals.
                  <br />
                  <strong>Detected sources:</strong>{" "}
                  {detectedProteinSources.join(", ")}
                </>
              )}

              {proteinStatus === "Needs Improvement" && (
                <>
                  Several meals lack clearly defined protein sources,
                  particularly during earlier meals.
                </>
              )}
            </li>
          </ul>
        </div>

        <div className="check-divider"></div>

        {/* Portion Size Check */}
          {portionResult && (
          <div className="check-block">
            <h2>Quality Check 1 – Portion Based</h2>

            <ul>
              <li>
                <strong>Status:</strong>{" "}
                <span
                  className={`status ${portionResult.status
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {portionResult.status}
                </span>
              </li>

              <li>
                <strong>Coverage:</strong>{" "}
                {portionResult.mealsWithPortion} out of{" "}
                {portionResult.totalMeals} meals
                ({portionResult.coveragePercent}%) has portions defined explicitly.
              </li>

              <li>
                <strong>Why:</strong> {portionResult.reason}
              </li>
            </ul>
          </div>
        )}



        
      </div>

      {/* 3. Quality Check 2 (AI-assisted placeholder) */}
      <div className="card">
        <h2>Quality Check 2 (AI-assisted)</h2>
        <p>
          The meal plan broadly aligns with the client’s PCOS profile,
          but potential concerns exist around carbohydrate distribution
          and digestive sensitivity.
        </p>
      </div>
    </div>
  );
}

export default App;
