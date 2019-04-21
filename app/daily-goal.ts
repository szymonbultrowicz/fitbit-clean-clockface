import { me } from "appbit";
import { today } from "user-activity";
import { GoalType } from "../common/goal-type";
import { config } from "./config";

const DEFAULT_GOAL = GoalType.steps;

export class Goal {
  public type: GoalType = DEFAULT_GOAL;
  public get enabled() {
    return config.enableGoals;
  }
  public get value(): number | undefined {
    if (!me.permissions.granted("access_activity")) {
      return undefined;
    }
    const activity = today.adjusted;
    switch (this.type) {
      case GoalType.activeMinutes:
        return activity.activeMinutes;
      case GoalType.calories:
        return activity.calories;
      case GoalType.distance:
        return activity.distance;
      case GoalType.elevationGain:
        return activity.elevationGain;
      case GoalType.steps:
        return activity.steps;
      default:
        return undefined;
    }
  }
}

export const goal = new Goal();
