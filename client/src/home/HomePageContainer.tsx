import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import HomePage from './HomePage';

interface IHomePageContainerProps extends RouteComponentProps<any> { } 

class HomePageContainer extends React.Component<IHomePageContainerProps, any> {

    constructor(props: IHomePageContainerProps) {
        super(props);
        this.goToRedirect = this.goToRedirect.bind(this);
    }

    goToRedirect(URL: string): void {
        this.props.history.push(URL);
    }

    render() {
        return (
            <HomePage
                goToRedirect={this.goToRedirect}    
            />
        );
    }

}

export default withRouter(HomePageContainer);