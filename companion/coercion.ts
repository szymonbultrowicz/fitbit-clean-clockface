import { GoalType } from "../common/goal-type";
import { goalsOptions } from "../common/goals-options";
import { SettingsKeys } from "../common/settings-keys";
import { SelectValue } from "./select-value";

export function coerceBoolean(value: string) {
  return value === "true";
}

export function stringifyBoolean(value: boolean) {
  return value ? "true" : "false";
}

export function coerceSettingsValue(
  key: SettingsKeys,
  value: string,
): boolean | GoalType | null {
  switch (key) {
    case SettingsKeys.ENABLE_GOALS:
    case SettingsKeys.ENABLE_BATTERY:
      return coerceBoolean(value);
    case SettingsKeys.ENABLED_GOAL:
      return coerceGoalsValue(value);
  }
  return undefined;
}

export function stringifySettingsValue(
  key: SettingsKeys,
  value: boolean | GoalType,
): string | undefined {
  switch (key) {
    case SettingsKeys.ENABLE_GOALS:
    case SettingsKeys.ENABLE_BATTERY:
      return stringifyBoolean(value as boolean);
    case SettingsKeys.ENABLED_GOAL:
      return stringifyGoalsValue(value as GoalType);
  }
  return undefined;
}

export function coerceGoalsValue(value: string) {
  const selectValue = JSON.parse(value) as SelectValue;
  if (selectValue.values.length === 1) {
    return selectValue.values[0].value;
  } else if (selectValue.selected.length > 0) {
    return selectValue.values[selectValue.selected[0]].value;
  }
  return undefined;
}

export function stringifyGoalsValue(value: GoalType) {
  return JSON.stringify(getGoalsSelection(value));
}

function getGoalsSelection(value: GoalType): SelectValue {
  const selected = goalsOptions.findIndex((o) => o.value === value);
  return {
    selected: [selected],
    values: goalsOptions,
  };
}
