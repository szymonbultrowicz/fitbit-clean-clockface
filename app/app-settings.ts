import { SettingChangeMessage } from '../common/messages';
import { Settings } from '../common/settings-keys';

let appSettings: SettingChangeMessage[] = [];

export const getSetting = (key: Settings, defaultValue: string | undefined = undefined) => 
    appSettings.find(s => s.key === key) || defaultValue;

export const setSetting = (key: Settings, value: string) => {
    appSettings = [
        ...appSettings.filter(s => s.key !== key),
        {
            key: key,
            value: value,
        },
    ];
};