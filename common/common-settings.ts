import { Settings } from './settings-keys';
import { goalsOptions } from './goals-options';
import { GoalType } from './goal-type';

function getGoalsSelection(value: GoalType) {
    const selected = goalsOptions.findIndex(o => o.value === value);
    return { 
        selected: [selected],
        values: goalsOptions,
    };
}

function setDefaultSettingsValue(settingsStorage: LiveStorage, key: Settings, value: string) {
    const currentValue = settingsStorage.getItem(key);
    console.log("current " + currentValue);
    if (!currentValue) {
        settingsStorage.setItem(key, value);
    }
}

export function setDefaultSettings(settingsStorage: LiveStorage) {
    setDefaultSettingsValue(
        settingsStorage,
        Settings.ENABLED_GOAL, 
        JSON.stringify(getGoalsSelection(GoalType.steps))
    );
}