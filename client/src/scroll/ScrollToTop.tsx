import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

interface IScrollToTopProps extends RouteComponentProps<any> { }
interface IScrollToTopState { }

class ScrollToTop extends React.Component<IScrollToTopProps, IScrollToTopState> {

    constructor(props: IScrollToTopProps) {
        super(props);

        this.state = {};
    }

    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            window.scrollTo(0, 0);
        }
    }

    render() {
        return this.props.children;
    }

}

export default withRouter(ScrollToTop);