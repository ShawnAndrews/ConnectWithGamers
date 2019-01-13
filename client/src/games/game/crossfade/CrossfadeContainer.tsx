import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Crossfade from './Crossfade';

interface ICrossfadeContainerProps extends RouteComponentProps<any> {
    src: string[];
    index: number;
} 

interface ICrossfadeContainerState {

}

class CrossfadeContainer extends React.Component<ICrossfadeContainerProps, ICrossfadeContainerState> {

    constructor(props: ICrossfadeContainerProps) {
        super(props);

        this.state = {

        };
    }

    render() {
        return (
            <Crossfade
                src={this.props.src}
                index={this.props.index}
            />
        );
    }

}

export default withRouter(CrossfadeContainer);