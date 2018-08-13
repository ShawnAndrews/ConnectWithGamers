const popupS = require('popups');
import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Sidenav from './Sidenav';

interface ISidenavContainerProps extends RouteComponentProps<any> {
    active: boolean;
    toggleSidebar: () => void;
}

class SidenavContainer extends React.Component<ISidenavContainerProps, any> {

    constructor(props: ISidenavContainerProps) {
        super(props);
        this.onOption1Click = this.onOption1Click.bind(this);
        this.onOption2Click = this.onOption2Click.bind(this);
    }

    onOption1Click(): void {
        this.props.history.push(`/chat`);
    }

    onOption2Click(): void {
        this.props.history.push(`/chat/users`);
    }

    render() {
        const path: string = this.props.history.location.pathname;
        let option1Selected: boolean = false;
        let option2Selected: boolean = false;

        if (path.startsWith(`/chat/users`)) {
            option2Selected = true;
        } else if (path.startsWith(`/chat`)) {
            option1Selected = true;
        }
        
        return (
            <Sidenav
                active={this.props.active}
                option1Selected={option1Selected}
                option2Selected={option2Selected}
                onOption1Click={this.onOption1Click}
                onOption2Click={this.onOption2Click}
            />
        );
    }

}

export default withRouter(SidenavContainer);