import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Xbox, { XboxOptionsEnum } from './Xbox';

interface IXboxContainerProps extends RouteComponentProps<any> {
    
}

interface IXboxContainerState {
    selectedOption: XboxOptionsEnum;
}

class XboxContainer extends React.Component<IXboxContainerProps, IXboxContainerState> {

    constructor(props: IXboxContainerProps) {
        super(props);
        this.goToOption = this.goToOption.bind(this);
        this.onOptionClick = this.onOptionClick.bind(this);
        this.isSelected = this.isSelected.bind(this);

        this.state = {
            selectedOption: undefined
        };
    }

    goToOption(XboxOptionEnum: XboxOptionsEnum): void {
        if (XboxOptionEnum === XboxOptionsEnum.MostPopular) {
            this.props.history.push(`/search/xbox/popular`);
        }
    }

    onOptionClick(XboxOptionEnum: XboxOptionsEnum): void {

        this.setState({
            selectedOption: XboxOptionEnum
        });

        this.goToOption(XboxOptionEnum);
    }

    isSelected(xboxOptionEnum: XboxOptionsEnum): boolean {

        if (xboxOptionEnum === this.state.selectedOption) {
            return true;
        }

        return false;
    }

    render() {
        return (
            <Xbox
                onOptionClick={this.onOptionClick}
                isSelected={this.isSelected}
            />
        );
    }

}

export default withRouter(XboxContainer);