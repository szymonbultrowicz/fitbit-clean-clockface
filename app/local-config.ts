import { readFileSync, writeFileSync } from "fs";
import { Config, DEFAULT_CONFIG } from "../common/config";

const CONFIG_FILE_NAME = "config.json";

export function save(config: Config) {
  try {
    writeFileSync(CONFIG_FILE_NAME, config, "json");
  } catch (e) {
    console.error("Failed to save config file");
    console.error(e);
  }
}

export function load(): Partial<Config> {
  try {
    return {
      ...DEFAULT_CONFIG,
      ...readFileSync(CONFIG_FILE_NAME, "json"),
    };
  } catch (e) {
    console.error("Failed to read config file");
    console.error(e);
    return {};
  }
}
