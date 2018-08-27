const popupS = require('popups');
import * as React from 'react';
import Settings from "./Settings";
import { withRouter, RouteComponentProps } from 'react-router-dom';

interface ISettingsContainerProps extends RouteComponentProps<any> {
    sidebarWidth: number;
    movedXPos: number;
    expanded: boolean;
}

class SettingsContainer extends React.Component<ISettingsContainerProps, any> {

    constructor(props: ISettingsContainerProps) {
        super(props);

        const settingsContainerRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
        this.state = { settingsContainerRef: settingsContainerRef, sidebarWidth: props.sidebarWidth, settingsContainerXPos: props.expanded ? `${props.sidebarWidth}px` : '0px'};
    }

    componentDidMount(): void {
        const divNode: HTMLDivElement = this.state.settingsContainerRef.current;
        divNode.style.left = this.state.settingsContainerXPos;
        if (this.state.settingsContainerXPos === `${this.state.sidebarWidth}px`) {
            this.setState({ settingsContainerXPos: '0px' });
        }
    }

    componentWillReceiveProps(newProps: ISettingsContainerProps): void {
        const divNode: HTMLDivElement = this.state.settingsContainerRef.current;
        let newSettingsContainerXPos: string = parseInt( this.state.settingsContainerXPos, 10 ) + newProps.movedXPos + "px";
        divNode.style.left = newSettingsContainerXPos;
    }

    render() {
        return (
            <Settings
                settingsContainerRef={this.state.settingsContainerRef}
            />
        );
    }

}

export default withRouter(SettingsContainer);