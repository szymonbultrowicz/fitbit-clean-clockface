import { GoalType } from "../common/goal-type";
import { Settings } from "../common/settings-keys"
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
                    settingsKey={Settings.ENABLE_GOALS}
                    label="Show goal status"
                 />
                 <Select 
                    label="Goal to display"
                    settingsKey={Settings.ENABLED_GOAL}
                    options={goalsOptions}
                 />
            </Section>
        </Page>
    );
}

registerSettingsPage(settings);