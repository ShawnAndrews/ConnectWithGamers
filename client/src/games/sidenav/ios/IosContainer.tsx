import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Ios, { IosOptionsEnum } from './Ios';

interface IIosContainerProps extends RouteComponentProps<any> {
    
}

interface IIosContainerState {
    selectedOption: IosOptionsEnum;
}

class IosContainer extends React.Component<IIosContainerProps, IIosContainerState> {

    constructor(props: IIosContainerProps) {
        super(props);
        this.goToOption = this.goToOption.bind(this);
        this.onOptionClick = this.onOptionClick.bind(this);
        this.isSelected = this.isSelected.bind(this);

        this.state = {
            selectedOption: undefined
        };
    }

    goToOption(iosOptionEnum: IosOptionsEnum): void {
        if (iosOptionEnum === IosOptionsEnum.IOSComingSoon) {
            this.props.history.push(`/search/ios/coming-soon`);
        }
    }

    onOptionClick(iosOptionEnum: IosOptionsEnum): void {

        this.setState({
            selectedOption: iosOptionEnum
        });

        this.goToOption(iosOptionEnum);
    }

    isSelected(iosOptionEnum: IosOptionsEnum): boolean {

        if (iosOptionEnum === this.state.selectedOption) {
            return true;
        }

        return false;
    }

    render() {
        return (
            <Ios
                onOptionClick={this.onOptionClick}
                isSelected={this.isSelected}
            />
        );
    }

}

export default withRouter(IosContainer);