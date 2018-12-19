import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Topnav from './Topnav';

interface ITopnavContainerProps extends RouteComponentProps<any> {
    title: string;
}

interface ITopnavContainerState {
    title: string;
}

class TopnavContainer extends React.Component<ITopnavContainerProps, ITopnavContainerState> {

    constructor(props: ITopnavContainerProps) {
        super(props);

        this.state = {
            title: props.title
        };
    }

    render() {
        return (
            <Topnav
                goBack={this.props.history.goBack}
                title={this.state.title}
            />
        );
    }

}

export default withRouter(TopnavContainer);