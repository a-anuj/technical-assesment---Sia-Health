import { useEffect, useState } from "react";
import "./App.css";

import ClientSummary from "./components/ClientSummary";
import clientLog from "/home/a-anuj/Desktop/Sia_Health_Technical_Assignment/src/data/clientLog.json";

import rawMealPlan from "./data/mealPlan.json";
import mealPlanImg from "./assets/mealPlan.png"; 

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

  const proteinIssues = check1Results.filter(
    (r) => r.check === "Protein" && r.status !== "OK"
  );

  const proteinStatus = proteinIssues.some((r) => r.status === "Needs Improvement")
    ? "Needs Improvement"
    : proteinIssues.length > 0
    ? "Warning"
    : "OK";

  const proteinWeeklyResult = check1Results.find(
    (r) => r.check === "Protein" && r.scope === "Weekly"
  );

  const proteinCoveragePercent = proteinWeeklyResult?.coveragePercent ?? 0;
  const totalMainMeals = proteinWeeklyResult?.totalMainMeals ?? 0;
  const mealsWithProtein = proteinWeeklyResult?.mealsWithProtein ?? 0;

  const detectedProteinSources = [
    ...new Set(
      check1Results
        .filter(
          (r) =>
            r.check === "Protein" &&
            Array.isArray(r.proteinSources) &&
            r.proteinSources.length > 0
        )
        .flatMap((r) => r.proteinSources)
    ),
  ];

  const portionResult = check1Results.find(
    (r) => r.check === "Portion Size" && r.scope === "Weekly"
  );

  const portionCoveragePercent = portionResult?.coveragePercent ?? null;

  const planMetrics = {
    proteinCoveragePercent,
    proteinStatus,
    detectedProteinSources,
    portionCoveragePercent,
    totalMainMeals,
    mealsWithProtein,
  };

  return (
    <div className="page-container">
      
      <div className="top-layout" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        
        {/* LEFT: Client Summary */}
        <div className="left-panel" style={{ flex: 1.5 }}>
          <ClientSummary />
        </div>

        {/* RIGHT: Meal Plan Image (New) */}
        <div className="right-panel" style={{ flex: 2.5 }}>
          <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{marginTop: 0}}><b>Meal Plan Input</b></h2>
            <hr />
            <div 
              className="scrollable-image-container" 
              style={{marginTop:'20px', flex: 1, overflowY: 'auto', maxHeight: '70vh', borderRadius: '8px', border: '1px solid #eee' }}
            >
              <img 
                src={mealPlanImg} 
                alt="Nutritionist Meal Plan" 
                style={{ width: '100%', display: 'block' }} 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="middle-layout" style={{ marginBottom: '20px' }}>
        <div className="card">
          <h2><b>Quality Check - 1 (Rule Based)</b></h2>
          <hr />
          
          <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
            {/* Protein Check */}
            <div className="check-block" style={{ flex: 1, minWidth: '300px' }}>
              <h4 className="checks">Protein Based</h4>
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

            <div className="check-divider" style={{ borderLeft: '1px solid #eee' }}></div>

            {/* Portion Size Check */}
            {portionResult && (
              <div className="check-block" style={{ flex: 1, minWidth: '300px' }}>
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

      {/* QUALITY CHECK 2 (AI) */}
      <div className="bottom-layout">
        <QualityCheckAI clientSummary={clientLog} mealPlanSummary={planMetrics} />
      </div>

    </div>
  );
}

export default App;