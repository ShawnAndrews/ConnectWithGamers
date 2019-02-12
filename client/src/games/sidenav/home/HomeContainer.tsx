import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Home, { HomeOptionsEnum } from './Home';

interface IHomeContainerProps extends RouteComponentProps<any> {
    
}

interface IHomeContainerState {
    selectedOption: HomeOptionsEnum;
}

class HomeContainer extends React.Component<IHomeContainerProps, IHomeContainerState> {

    constructor(props: IHomeContainerProps) {
        super(props);
        this.goToOption = this.goToOption.bind(this);
        this.onOptionClick = this.onOptionClick.bind(this);
        this.isSelected = this.isSelected.bind(this);

        this.state = {
            selectedOption: undefined
        };
    }

    goToOption(homeOptionEnum: HomeOptionsEnum): void {
        if (homeOptionEnum === HomeOptionsEnum.MostPopular) {
            this.props.history.push(`/search/popular`);
        } else if (homeOptionEnum === HomeOptionsEnum.RecentlyReleased) {
            this.props.history.push(`/search/recent`);
        } else if (homeOptionEnum === HomeOptionsEnum.Upcoming) {
            this.props.history.push(`/search/upcoming`);
        } else if (homeOptionEnum === HomeOptionsEnum.IOSComingSoon) {
            this.props.history.push(`/search/ios-coming-soon`);
        } else if (homeOptionEnum === HomeOptionsEnum.AndroidComingSoon) {
            this.props.history.push(`/search/android-coming-soon`);
        }
    }

    onOptionClick(homeOptionEnum: HomeOptionsEnum): void {

        this.setState({
            selectedOption: homeOptionEnum
        });

        this.goToOption(homeOptionEnum);
    }

    isSelected(homeOptionEnum: HomeOptionsEnum): boolean {

        if (homeOptionEnum === this.state.selectedOption) {
            return true;
        }

        return false;
    }

    render() {
        return (
            <Home
                onOptionClick={this.onOptionClick}
                isSelected={this.isSelected}
            />
        );
    }

}

export default withRouter(HomeContainer);