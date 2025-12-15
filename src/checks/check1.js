// Simple assumptions (document these in README)
const PROTEIN_SOURCES = [
  "protein",
  "paneer",
  "rajma",
  "curd",
  "greek"
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

// ---- Helpers ----
function estimateProtein(mealText = "") {
  const text = mealText.toLowerCase();
  let score = 0;

  PROTEIN_SOURCES.forEach(src => {
    if (text.includes(src)) score += 1;
  });

  return score; // heuristic, not grams
}

function hasPortion(mealText = "") {
  const text = mealText.toLowerCase();
  return PORTION_KEYWORDS.some(k => text.includes(k));
}

// ---- MAIN CHECK 1 ----
export function runCheck1(mealPlan) {
  const results = [];

  Object.entries(mealPlan).forEach(([day, meals]) => {
    ["breakfast", "lunch", "dinner"].forEach(mealType => {
      const mealText = meals[mealType];

      if (!mealText) return;

      // Protein check
      const proteinScore = estimateProtein(mealText);
      let proteinStatus = "Needs Improvement";

      if (proteinScore >= 2) proteinStatus = "OK";
      else if (proteinScore === 1) proteinStatus = "Warning";

      results.push({
        day,
        check: "Protein",
        meal: mealType,
        status: proteinStatus,
        reason:
          proteinStatus === "OK"
            ? "Clear protein sources present."
            : proteinStatus === "Warning"
            ? "Limited protein sources mentioned."
            : "No clear protein source mentioned."
      });

      // Portion size check
      const portionStatus = hasPortion(mealText)
        ? "OK"
        : "Needs Improvement";

      results.push({
        day,
        check: "Portion Size",
        meal: mealType,
        status: portionStatus,
        reason:
          portionStatus === "OK"
            ? "Portion sizes are specified."
            : "Meal lacks clear portion size details."
      });
    });
  });

  return results;
}
