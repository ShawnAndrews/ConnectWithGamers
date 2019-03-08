import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Android, { AndroidOptionsEnum } from './Android';

interface IAndroidContainerProps extends RouteComponentProps<any> {
    
}

interface IAndroidContainerState {
    selectedOption: AndroidOptionsEnum;
}

class AndroidContainer extends React.Component<IAndroidContainerProps, IAndroidContainerState> {

    constructor(props: IAndroidContainerProps) {
        super(props);
        this.goToOption = this.goToOption.bind(this);
        this.onOptionClick = this.onOptionClick.bind(this);
        this.isSelected = this.isSelected.bind(this);

        this.state = {
            selectedOption: undefined
        };
    }

    goToOption(androidOptionEnum: AndroidOptionsEnum): void {
        if (androidOptionEnum === AndroidOptionsEnum.AndroidComingSoon) {
            this.props.history.push(`/search/android/coming-soon`);
        }
    }

    onOptionClick(androidOptionEnum: AndroidOptionsEnum): void {

        this.setState({
            selectedOption: androidOptionEnum
        });

        this.goToOption(androidOptionEnum);
    }

    isSelected(androidOptionEnum: AndroidOptionsEnum): boolean {

        if (androidOptionEnum === this.state.selectedOption) {
            return true;
        }

        return false;
    }

    render() {
        return (
            <Android
                onOptionClick={this.onOptionClick}
                isSelected={this.isSelected}
            />
        );
    }

}

export default withRouter(AndroidContainer);