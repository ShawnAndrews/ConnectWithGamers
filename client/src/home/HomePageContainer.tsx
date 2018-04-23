import * as React from 'react';
import { withRouter } from 'react-router-dom';
import HomePage from './HomePage';

interface IHomePageContainerProps {
    history: any;
}

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