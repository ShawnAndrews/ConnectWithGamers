import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import EditorsGames from './EditorsGames';
import { SidenavEnums, GameResponse, CurrencyType } from '../../../../client-server-common/common';

interface IEditorsGamesContainerProps extends RouteComponentProps<any> {
    goToRedirect: (URL: string) => void;
    sidebarActiveEnum: SidenavEnums;
    editorsGames: GameResponse[];
    currencyType: CurrencyType;
    currencyRate: number;
}

interface IEditorsGamesContainerState {
    currentIndex: number;
}

class EditorsGamesContainer extends React.Component<IEditorsGamesContainerProps, IEditorsGamesContainerState> {

    constructor(props: IEditorsGamesContainerProps) {
        super(props);
        this.slideChanged = this.slideChanged.bind(this);

        this.state = {
            currentIndex: 0
        };
    }

    slideChanged(index: number): void {
        this.setState({ currentIndex: index });
    }

    render() {
        return (
            <EditorsGames
                goToRedirect={this.props.goToRedirect}
                sidebarActiveEnum={this.props.sidebarActiveEnum}
                editorsGames={this.props.editorsGames}
                currencyRate={this.props.currencyRate}
                currencyType={this.props.currencyType}
                currentIndex={this.state.currentIndex}
                slideChanged={this.slideChanged}
            />
        );
    }

}

export default withRouter(EditorsGamesContainer);