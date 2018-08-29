const popupS = require('popups');
import * as React from 'react';
import Settings from "./Settings";
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { SwipeState } from '../ChatroomMenuContainer';

interface ISettingsContainerProps extends RouteComponentProps<any> {

}

class SettingsContainer extends React.Component<ISettingsContainerProps, any> {

    constructor(props: ISettingsContainerProps) {
        super(props);

        this.state = {  };
    }

    render() {
        return (
            <Settings/>
        );
    }

}

export default withRouter(SettingsContainer);