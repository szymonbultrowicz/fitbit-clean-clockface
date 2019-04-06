import { GoalType } from "../common/goal-type";
import { SettingsKeys } from "../common/settings-keys"
import { goalsOptions } from "../common/goals-options";
import { setDefaultSettings } from '../common/common-settings';

function settings(props: SettingsComponentProps) {
    setDefaultSettings(props.settingsStorage);

    return (
        <Page>
            <Section title={
                <Text bold align="center">Goals</Text>
            }>
                <Toggle
                    settingsKey={SettingsKeys.ENABLE_GOALS}
                    label="Show goal status"
                 />
                 <Select 
                    label="Goal to display"
                    settingsKey={SettingsKeys.ENABLED_GOAL}
                    options={goalsOptions}
                 />
            </Section>
        </Page>
    );
}

registerSettingsPage(settings);