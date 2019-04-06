import { today } from "user-activity";
import { me } from "appbit";
import { GoalType } from "../common/goal-type";

export class Goal {
    public type: GoalType | undefined;
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
