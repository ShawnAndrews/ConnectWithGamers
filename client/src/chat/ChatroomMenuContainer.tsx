const popupS = require('popups');
import * as React from 'react';
import ChatroomMenu from './ChatroomMenu';

class ChatroomMenuContainer extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.toggleSidebar = this.toggleSidebar.bind(this);
        this.state = { sidebarActive: false };
    }

    toggleSidebar(): void {
        this.setState({ sidebarActive: !this.state.sidebarActive });
    }

    render() {
        return (
            <ChatroomMenu
                sidebarActive={this.state.sidebarActive}
                toggleSidebar={this.toggleSidebar}
            />
        );
    }

}

export default ChatroomMenuContainer;