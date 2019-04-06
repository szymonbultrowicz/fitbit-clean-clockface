import { SettingChangeMessage } from '../common/messages';
import { SettingsKeys } from '../common/settings-keys';

let appSettings: SettingChangeMessage[] = [];

export const getSetting = (key: SettingsKeys, defaultValue: string | undefined = undefined) => 
    appSettings.find(s => s.key === key) || defaultValue;

export const setSetting = (key: SettingsKeys, value: string) => {
    appSettings = [
        ...appSettings.filter(s => s.key !== key),
        {
            key: key,
            value: value,
        },
    ];
};