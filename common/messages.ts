import { MessageKey } from './message-keys';
import { Settings } from './settings-keys';

export interface SettingChangeMessage {
    key: Settings,
    value: string,
}

export interface Message {
    key: MessageKey,
    value: SettingChangeMessage,
}