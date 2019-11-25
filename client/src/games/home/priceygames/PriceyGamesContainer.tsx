import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import PriceyGames from './PriceyGames';
import { SidenavEnums, GameResponse, CurrencyType } from '../../../../client-server-common/common';

interface IPriceyGamesContainerProps extends RouteComponentProps<any> {
    goToRedirect: (URL: string) => void;
    sidebarActiveEnum: SidenavEnums;
    under5Games: GameResponse[];
    under10Games: GameResponse[];
    mostexpensiveGames: GameResponse[];
    currencyType: CurrencyType;
    currencyRate: number;
}

interface IPriceyGamesContainerState {
    currentIndex: number;
}

class PriceyGamesContainer extends React.Component<IPriceyGamesContainerProps, IPriceyGamesContainerState> {

    constructor(props: IPriceyGamesContainerProps) {
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
            <PriceyGames
                goToRedirect={this.props.goToRedirect}
                sidebarActiveEnum={this.props.sidebarActiveEnum}
                under5Games={this.props.under5Games}
                under10Games={this.props.under10Games}
                mostexpensiveGames={this.props.mostexpensiveGames}
                currencyRate={this.props.currencyRate}
                currencyType={this.props.currencyType}
                currentIndex={this.state.currentIndex}
            />
        );
    }

}

export default withRouter(PriceyGamesContainer);