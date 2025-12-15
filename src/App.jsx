import { useEffect, useState } from "react";
import "./App.css";

import ClientSummary from "./components/ClientSummary";
import clientLog from "/home/a-anuj/Desktop/Sia_Health_Technical_Assignment/src/data/clientLog.json";

import rawMealPlan from "./data/mealPlan.json";
import { normalizeMealPlan } from "./utils/normalizeMealPlan";
import { runCheck1 } from "./checks/check1";
import QualityCheckAI from "./components/QualityCheckAI";

function App() {
  const [check1Results, setCheck1Results] = useState([]);

  useEffect(() => {
    const normalizedMealPlan = normalizeMealPlan(rawMealPlan);
    const results = runCheck1(normalizedMealPlan);
    setCheck1Results(results);
  }, []);

  // ---- SUMMARY LOGIC (UNCHANGED) ----
  const proteinIssues = check1Results.filter(
    r => r.check === "Protein" && r.status !== "OK"
  );

  const proteinStatus =
    proteinIssues.some(r => r.status === "Needs Improvement")
      ? "Needs Improvement"
      : proteinIssues.length > 0
      ? "Warning"
      : "OK";

  const proteinWeeklyResult = check1Results.find(
    r => r.check === "Protein" && r.scope === "Weekly"
  );

  const proteinCoveragePercent = proteinWeeklyResult?.coveragePercent ?? 0;
  const totalMainMeals = proteinWeeklyResult?.totalMainMeals ?? 0;
  const mealsWithProtein = proteinWeeklyResult?.mealsWithProtein ?? 0;

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

  
    const portionResult = check1Results.find(
      r => r.check === "Portion Size" && r.scope === "Weekly"
    );

    const portionCoveragePercent = portionResult?.coveragePercent ?? null;

    const planMetrics = { proteinCoveragePercent, proteinStatus, detectedProteinSources,
       portionCoveragePercent, totalMainMeals, mealsWithProtein};

  return (
    <div className="page-container">
      {/* ===== TOP SECTION ===== */}
      <div className="top-layout">
        {/* LEFT: Client Summary */}
        <div className="left-panel">
          <ClientSummary />
        </div>

        {/* RIGHT: Quality Check 1 */}
        <div className="right-panel">
          <div className="card">
            <h2><b>Quality Check - 1</b></h2>
            <hr />
            {/* Protein Check */}
            <div className="check-block">
              <h4 className="checks">Protien Based</h4>
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
                <h4 className="checks">Portion Based</h4>

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
                    ({portionResult.coveragePercent}%) have explicitly defined portions.
                  </li>

                  <li>
                    <strong>Why:</strong> {portionResult.reason}
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== BOTTOM SECTION ===== */}
        <QualityCheckAI clientSummary={clientLog} mealPlanSummary={planMetrics}/>
    </div>
  );
}

export default App;
