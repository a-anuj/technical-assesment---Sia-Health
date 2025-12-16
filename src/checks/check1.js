// ---------------- ASSUMPTIONS (document in README) ----------------
const PROTEIN_SOURCES = [
  "protein",
  "paneer",
  "rajma",
  "curd",
  "greek",
  "salad",
  "chana"
];

const PORTION_KEYWORDS = [
  "gm",
  "g",
  "ml",
  "tbsp",
  "tsp",
  "bowl",
  "cup",
  "glass",
  "scoop"
];

const MEAL_TYPES = [
  "breakfast",
  "lunch",
  "dinner",
  "midMorningSnack",
  "eveningSnack"
];

const MAIN_MEALS = ["breakfast", "lunch", "dinner","eveningSnack"];

// ---------------- HELPERS ----------------
function estimateProtein(mealText = "") {
  const text = mealText.toLowerCase();
  const sources = [];

  PROTEIN_SOURCES.forEach(src => {
    if (text.includes(src)) sources.push(src);
  });

  return {
    score: sources.length,
    sources
  };
}

function hasPortion(mealText = "") {
  const text = mealText.toLowerCase();
  return PORTION_KEYWORDS.some(k => text.includes(k));
}

// ---------------- CHECK 1 ----------------
export function runCheck1(mealPlan) {
  const results = [];

  // ---------- WEEKLY PROTEIN METRICS ----------
  let totalMainMeals = 0;
  let mealsWithProtein = 0;
  const detectedProteinSources = new Set();

  // ---------- WEEKLY PORTION METRICS ----------
  let totalMeals = 0;
  let mealsWithPortion = 0;

  Object.values(mealPlan).forEach(meals => {
    MEAL_TYPES.forEach(mealType => {
      const mealText = meals[mealType];
      if (!mealText) return;

      totalMeals += 1;

      // ---- Protein (ONLY main meals) ----
      const { score, sources } = estimateProtein(mealText);

      if (MAIN_MEALS.includes(mealType)) {
        totalMainMeals += 1;

        if (score > 0) {
          mealsWithProtein += 1;
          sources.forEach(src => detectedProteinSources.add(src));
        }
      }

      // ---- Portion (ALL meals) ----
      if (hasPortion(mealText)) {
        mealsWithPortion += 1;
      }
    });
  });

  // ---------- FINAL WEEKLY PROTEIN RESULT ----------
  const proteinCoverage = mealsWithProtein / totalMainMeals;

  let proteinStatus = "Needs Improvement";
  if (proteinCoverage >= 0.8) proteinStatus = "OK";
  else if (proteinCoverage >= 0.5) proteinStatus = "Warning";

  results.push({
    check: "Protein",
    scope: "Weekly",
    status: proteinStatus,
    coveragePercent: Math.round(proteinCoverage * 100),
    mealsWithProtein,
    totalMainMeals,
    proteinSources: Array.from(detectedProteinSources),
    reason:
      proteinStatus === "OK"
        ? "Protein sources are consistently present across the weekly plan."
        : proteinStatus === "Warning"
        ? "Protein sources are present but inconsistent across the weekly plan."
        : "The weekly plan lacks sufficient protein coverage across main meals."
  });

  // ---------- FINAL WEEKLY PORTION RESULT ----------
  const portionCoverage = mealsWithPortion / totalMeals;

  let portionStatus = "Needs Improvement";
  if (portionCoverage >= 0.8) portionStatus = "OK";
  else if (portionCoverage >= 0.5) portionStatus = "Warning";

  results.push({
    check: "Portion Size",
    scope: "Weekly",
    status: portionStatus,
    coveragePercent: Math.round(portionCoverage * 100),
    mealsWithPortion,
    totalMeals,
    reason:
      portionStatus === "OK"
        ? "Portion sizes are clearly specified for most meals in the weekly plan."
        : portionStatus === "Warning"
        ? "Portion sizes are specified for some meals but missing in others."
        : "A large number of meals lack clearly specified portion sizes."
  });

  return results;
}
