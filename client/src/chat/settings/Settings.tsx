import * as React from 'react';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';

interface ISettingsProps {
    
}

const Settings: React.SFC<ISettingsProps> = (props: ISettingsProps) => {

    return (
        <div className={`settings scrollable fadeIn`}>
            Hello
        </div>
    );

};

export default Settings;