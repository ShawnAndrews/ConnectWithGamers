import * as React from 'react';
import * as io from 'socket.io-client';
import Topnav from './Topnav';
import { withRouter, RouteComponentProps } from 'react-router-dom';

interface ITopnavContainerProps extends RouteComponentProps<any> {
    toggleSidebar: () => void;
}

class TopnavContainer extends React.Component<ITopnavContainerProps, any> {

    constructor(props: ITopnavContainerProps) {
        super(props);
        this.onClickTopnavBtn = this.onClickTopnavBtn.bind(this);
        this.getNewPathTitle = this.getNewPathTitle.bind(this);
        this.state = { bar1Active: false, bar2Active: false, bar3Active: false, title: this.getNewPathTitle() };
    }

    componentWillReceiveProps(props: ITopnavContainerProps): void {
        this.setState({ title: this.getNewPathTitle() });
    }

    onClickTopnavBtn(): void {
        this.props.toggleSidebar();
        this.setState({
            bar1Active: !this.state.bar1Active,
            bar2Active: !this.state.bar2Active,
            bar3Active: !this.state.bar3Active
        });
    }

    getNewPathTitle(): string {
        const path: string = this.props.history.location.pathname;

        if (path.startsWith(`/chat/users`)) {
            return "User List";
        } else if (path.startsWith(`/chat`)) {
            return "Chatroom";
        } else {
            return "Title Error";
        }
        
    }

    render() {
        return (
            <Topnav
                title={this.state.title}
                onClickTopnavBtn={this.onClickTopnavBtn}
                bar1Active={this.state.bar1Active}
                bar2Active={this.state.bar2Active}
                bar3Active={this.state.bar3Active}
            />
        );
    }

}

export default withRouter(TopnavContainer);