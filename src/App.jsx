import { useState } from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import ClientSummary from "./components/ClientSummary";
import rawMealPlan from "./data/mealPlan.json";
import { runCheck1 } from "./checks/check1";
import { normalizeMealPlan } from "./utils/normalizeMealPlan";

function App() {
  const [check1Results, setCheck1Results] = useState([]);

  const runCheck1Handler = () => {
    const normalizedMealPlan = normalizeMealPlan(rawMealPlan);
    const results = runCheck1(normalizedMealPlan);
    setCheck1Results(results);
  };

  const runCheck2Handler = () => {
    console.log("Check 2 clicked");
  };

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

  return (
    <>
      <Navbar
        onRunCheck1={runCheck1Handler}
        onRunCheck2={runCheck2Handler}
      />

      <div className="page-container">
        <ClientSummary />

      {check1Results.length > 0 && (
        <div className="card">
          <h2>Check 1 – Quality Validation</h2>

          <div className="check-results">
            {/* Protein Check */}
            <div className="check-block">
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
                  Some meals do not clearly specify sufficient protein sources,
                  particularly across breakfast and lunch.
                </li>
              </ul>
            </div>

            <div className="check-divider"></div>

            {/* Portion Size Check */}
            <div className="check-block">
              <ul>
                <li>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`status ${portionStatus
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {portionStatus}
                  </span>
                </li>
                <li>
                  <strong>Why:</strong>{" "}
                  A few meals lack clearly defined portion sizes or measurable
                  quantities.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      </div>
    </>
  );
}

export default App;
