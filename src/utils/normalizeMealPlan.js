export function normalizeMealPlan(rawPlan) {
  const days = ["Day1","Day2","Day3","Day4","Day5","Day6","Day7"];
  const normalized = {};

  days.forEach(day => {
    normalized[day] = {
      breakfast: rawPlan.breakfast_9_10_am?.[day],
      midMorningSnack: rawPlan.midMorning_11_am?.[day],
      lunch: rawPlan.lunch_1_2_pm?.[day],
      eveningSnack: rawPlan.eveningSnack_5_pm?.[day],
      dinner: rawPlan.dinner_7_8_pm?.[day]
    };
  });

  return normalized;
}
