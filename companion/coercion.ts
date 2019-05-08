import { GoalType } from "../common/goal-type";
import { goalsOptions } from "../common/goals-options";
import { hrTimeoutOptions } from "../common/hr-timeout-options";
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
): boolean | number | GoalType | null {
  switch (key) {
    case SettingsKeys.ENABLE_GOALS:
    case SettingsKeys.ENABLE_BATTERY:
      return coerceBoolean(value);
    case SettingsKeys.ENABLED_GOAL:
      return coerceSelectionValue<GoalType>(value);
    case SettingsKeys.HR_TIMEOUT:
      return coerceSelectionValue<number>(value);
  }
  return undefined;
}

export function stringifySettingsValue(
  key: SettingsKeys,
  value: boolean | number | GoalType,
): string | undefined {
  switch (key) {
    case SettingsKeys.ENABLE_GOALS:
    case SettingsKeys.ENABLE_BATTERY:
      return stringifyBoolean(value as boolean);
    case SettingsKeys.ENABLED_GOAL:
      return stringifySelectionValue(value as GoalType, goalsOptions);
    case SettingsKeys.HR_TIMEOUT:
      return stringifySelectionValue(value as number, hrTimeoutOptions);
  }
  return undefined;
}

export function coerceSelectionValue<T>(value: string): T | undefined {
  const selectValue = JSON.parse(value) as SelectValue;
  if (selectValue.values.length === 1) {
    return selectValue.values[0].value;
  } else if (selectValue.selected.length > 0) {
    return selectValue.values[selectValue.selected[0]].value;
  }
  return undefined;
}

export function stringifySelectionValue<T>(value: T, options: SelectOption[]) {
  return JSON.stringify(getSelection(value, options));
}

function getSelection<T>(value: T, options: SelectOption[]): SelectValue {
  const selected = options.findIndex((o) => o.value === value);
  return {
    selected: [selected],
    values: options,
  };
}
