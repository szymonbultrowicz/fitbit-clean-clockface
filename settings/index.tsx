import { setDefaultSettings } from "../common/common-settings";
import { goalsOptions } from "../common/goals-options";
import { hrTimeoutOptions } from "../common/hr-timeout-options";
import { SettingsKeys } from "../common/settings-keys";

function settings(props: SettingsComponentProps) {
  setDefaultSettings(props.settingsStorage);

  return (
    <Page>
      <Section
        title={
          <Text bold align="center">
            Statistics
          </Text>
        }
      >
        <Toggle
          settingsKey={SettingsKeys.ENABLE_BATTERY}
          label="Show battery indicator"
        />
        <Toggle
          settingsKey={SettingsKeys.ENABLE_GOALS}
          label="Show goal status"
        />
        <Select
          label="Goal to display"
          settingsKey={SettingsKeys.ENABLED_GOAL}
          options={goalsOptions}
          disabled={props.settings[SettingsKeys.ENABLE_GOALS] !== "true"}
        />
        <Select
          label="Heart rate reading timeout"
          settingsKey={SettingsKeys.HR_TIMEOUT}
          options={hrTimeoutOptions}
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(settings);
