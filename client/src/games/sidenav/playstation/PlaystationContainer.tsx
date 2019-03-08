import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Playstation, { PlaystationOptionsEnum } from './Playstation';

interface IPlayerAuctionsContainerProps extends RouteComponentProps<any> {
    
}

interface IPlaystationContainerState {
    selectedOption: PlaystationOptionsEnum;
}

class PlaystationContainer extends React.Component<IPlayerAuctionsContainerProps, IPlaystationContainerState> {

    constructor(props: IPlayerAuctionsContainerProps) {
        super(props);
        this.goToOption = this.goToOption.bind(this);
        this.onOptionClick = this.onOptionClick.bind(this);
        this.isSelected = this.isSelected.bind(this);

        this.state = {
            selectedOption: undefined
        };
    }

    goToOption(playstationOptionEnum: PlaystationOptionsEnum): void {
        if (playstationOptionEnum === PlaystationOptionsEnum.MostPopular) {
            this.props.history.push(`/search/Playstation/popular`);
        }
    }

    onOptionClick(playstationOptionEnum: PlaystationOptionsEnum): void {

        this.setState({
            selectedOption: playstationOptionEnum
        });

        this.goToOption(playstationOptionEnum);
    }

    isSelected(playstationOptionEnum: PlaystationOptionsEnum): boolean {

        if (playstationOptionEnum === this.state.selectedOption) {
            return true;
        }

        return false;
    }

    render() {
        return (
            <Playstation
                onOptionClick={this.onOptionClick}
                isSelected={this.isSelected}
            />
        );
    }

}

export default withRouter(PlaystationContainer);