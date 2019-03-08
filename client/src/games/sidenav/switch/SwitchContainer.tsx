import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Switch, { SwitchOptionsEnum } from './Switch';

interface ISwitchContainerProps extends RouteComponentProps<any> {
    
}

interface ISwitchContainerState {
    selectedOption: SwitchOptionsEnum;
}

class SwitchContainer extends React.Component<ISwitchContainerProps, ISwitchContainerState> {

    constructor(props: ISwitchContainerProps) {
        super(props);
        this.goToOption = this.goToOption.bind(this);
        this.onOptionClick = this.onOptionClick.bind(this);
        this.isSelected = this.isSelected.bind(this);

        this.state = {
            selectedOption: undefined
        };
    }

    goToOption(switchOptionEnum: SwitchOptionsEnum): void {
        if (switchOptionEnum === SwitchOptionsEnum.MostPopular) {
            this.props.history.push(`/search/switch/popular`);
        }
    }

    onOptionClick(switchOptionEnum: SwitchOptionsEnum): void {

        this.setState({
            selectedOption: switchOptionEnum
        });

        this.goToOption(switchOptionEnum);
    }

    isSelected(switchOptionEnum: SwitchOptionsEnum): boolean {

        if (switchOptionEnum === this.state.selectedOption) {
            return true;
        }

        return false;
    }

    render() {
        return (
            <Switch
                onOptionClick={this.onOptionClick}
                isSelected={this.isSelected}
            />
        );
    }

}

export default withRouter(SwitchContainer);