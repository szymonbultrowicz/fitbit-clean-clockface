import { SettingChangeMessage } from '../common/messages';
import { SettingsKeys } from '../common/settings-keys';

let appSettings: SettingChangeMessage[] = [];

export const getSetting = (key: SettingsKeys, defaultValue: string | undefined = undefined) => {
    const setting = appSettings.filter(s => s.key === key)[0];
    return setting ? setting.value : defaultValue
}

export const setSetting = (key: SettingsKeys, value: string) => {
    appSettings = [
        ...appSettings.filter(s => s.key !== key),
        {
            key: key,
            value: value,
        },
    ];
};