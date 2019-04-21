import { Config } from "./config";
import { MessageKey } from "./message-keys";

export interface Message {
  key: MessageKey;
  value: Partial<Config>;
}
