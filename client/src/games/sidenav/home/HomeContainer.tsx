import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Home from './Home';

interface IHomeContainerProps extends RouteComponentProps<any> {
    
}

interface IHomeContainerState {
    browsePopularSelected: boolean;
    browseRecentSelected: boolean;
    browseUpcomingSelected: boolean;
    browseIOSSoonSelected: boolean;
    browseAndroidSoonSelected: boolean;
}

class HomeContainer extends React.Component<IHomeContainerProps, IHomeContainerState> {

    constructor(props: IHomeContainerProps) {
        super(props);
        this.onPopularClick = this.onPopularClick.bind(this);
        this.onRecentClick = this.onRecentClick.bind(this);
        this.onUpcomingClick = this.onUpcomingClick.bind(this);
        this.onIOSSoonClick = this.onIOSSoonClick.bind(this);
        this.onAndroidSoonClick = this.onAndroidSoonClick.bind(this);

        this.state = {
            browsePopularSelected: false,
            browseRecentSelected: false,
            browseUpcomingSelected: false,
            browseIOSSoonSelected: false,
            browseAndroidSoonSelected: false
        };
    }

    onPopularClick(checked: boolean): void {

        this.setState({
            browsePopularSelected: checked,
            browseRecentSelected: false,
            browseUpcomingSelected: false,
            browseIOSSoonSelected: false,
            browseAndroidSoonSelected: false
        });

        if (checked) {
            this.props.history.push(`/search/popular`);
        }
    }

    onRecentClick(checked: boolean): void {

        this.setState({
            browsePopularSelected: false,
            browseRecentSelected: checked,
            browseUpcomingSelected: false,
            browseIOSSoonSelected: false,
            browseAndroidSoonSelected: false
        });

        if (checked) {
            this.props.history.push(`/search/recent`);
        }
    }

    onUpcomingClick(checked: boolean): void {

        this.setState({
            browsePopularSelected: false,
            browseRecentSelected: false,
            browseUpcomingSelected: checked,
            browseIOSSoonSelected: false,
            browseAndroidSoonSelected: false
        });

        if (checked) {
            this.props.history.push(`/search/upcoming`);
        }
    }

    onIOSSoonClick(checked: boolean): void {

        this.setState({
            browsePopularSelected: false,
            browseRecentSelected: false,
            browseUpcomingSelected: false,
            browseIOSSoonSelected: checked,
            browseAndroidSoonSelected: false
        });

        if (checked) {
            this.props.history.push(`/search/ios-coming-soon`);
        }
    }

    onAndroidSoonClick(checked: boolean): void {

        this.setState({
            browsePopularSelected: false,
            browseRecentSelected: false,
            browseUpcomingSelected: false,
            browseIOSSoonSelected: false,
            browseAndroidSoonSelected: checked
        });

        if (checked) {
            this.props.history.push(`/search/android-coming-soon`);
        }
    }

    render() {
        return (
            <Home
                browsePopularSelected={this.state.browsePopularSelected}
                browseRecentSelected={this.state.browseRecentSelected}
                browseUpcomingSelected={this.state.browseUpcomingSelected}
                browseIOSSoonSelected={this.state.browseIOSSoonSelected}
                browseAndroidSoonSelected={this.state.browseAndroidSoonSelected}
                onAndroidSoonClick={this.onAndroidSoonClick}
                onIOSSoonClick={this.onIOSSoonClick}
                onUpcomingClick={this.onUpcomingClick}
                onRecentClick={this.onRecentClick}
                onPopularClick={this.onPopularClick}
            />
        );
    }

}

export default withRouter(HomeContainer);