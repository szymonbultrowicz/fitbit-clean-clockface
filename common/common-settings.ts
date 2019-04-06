import { SettingsKeys } from './settings-keys';
import { goalsOptions } from './goals-options';
import { GoalType } from './goal-type';

export interface SelectValue {
    selected: number[],
    values: SelectOption[],
}

function getGoalsSelection(value: GoalType): SelectValue {
    const selected = goalsOptions.findIndex(o => o.value === value);
    return { 
        selected: [selected],
        values: goalsOptions,
    };
}

function setDefaultSettingsValue(settingsStorage: LiveStorage, key: SettingsKeys, value: string) {
    const currentValue = settingsStorage.getItem(key);
    console.log("current " + currentValue);
    if (!currentValue) {
        settingsStorage.setItem(key, value);
    }
}

export function setDefaultSettings(settingsStorage: LiveStorage) {
    setDefaultSettingsValue(
        settingsStorage,
        SettingsKeys.ENABLED_GOAL, 
        JSON.stringify(getGoalsSelection(GoalType.steps))
    );
}