import { GoalType } from "./goal-type";

export const goalsOptions: SelectOption[] = [
  { name: "Active minutes", value: GoalType.activeMinutes },
  { name: "Calories", value: GoalType.calories },
  { name: "Distance", value: GoalType.distance },
  { name: "Floors", value: GoalType.elevationGain },
  { name: "Steps", value: GoalType.steps },
];
