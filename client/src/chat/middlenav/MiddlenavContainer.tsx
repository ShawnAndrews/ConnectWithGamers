import * as React from 'react';
import Middlenav from "./Middlenav";
import { withRouter, RouteComponentProps } from 'react-router-dom';

interface IMiddlenavContainerProps extends RouteComponentProps<any> { }

interface ISwipeContainerState { }

class MiddlenavContainer extends React.Component<IMiddlenavContainerProps, ISwipeContainerState> {

    constructor(props: IMiddlenavContainerProps) {
        super(props);

        this.state = {

        };
    }

    render() {
        return (
            <Middlenav/>
        );
    }

}

export default withRouter((MiddlenavContainer));