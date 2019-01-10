import * as React from 'react';
import Main from './main';

interface IChatroomContainerProps { }
interface IChatroomContainerState {
    expanded: boolean;
}

class MainContainer extends React.Component<IChatroomContainerProps, IChatroomContainerState> {

    constructor(props: IChatroomContainerProps) {
        super(props);
        this.toggleExpanded = this.toggleExpanded.bind(this);

        this.state = {
            expanded: true
        };
    }

    toggleExpanded(): void {
        this.setState({
            expanded: !this.state.expanded
        });
    }

    render() {
        return (
            <Main
                expanded={this.state.expanded}
                toggleExpanded={this.toggleExpanded}
            />
        );
    }

}

export default MainContainer;