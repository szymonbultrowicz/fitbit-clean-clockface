import { MessageKey } from './message-keys';
import { SettingsKeys } from './settings-keys';

export interface SettingChangeMessage {
    key: SettingsKeys,
    value: string,
}

export interface Message {
    key: MessageKey,
    value: SettingChangeMessage,
}