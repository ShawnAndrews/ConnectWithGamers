import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import EndingSoonBanner from './EndingSoonBanner';
import { SidenavEnums, GameResponse, CurrencyType } from '../../../../client-server-common/common';
import { getGameBestPricingStatus } from '../../../util/main';

interface IEndingSoonBannerContainerProps extends RouteComponentProps<any> {
    goToRedirect: (URL: string) => void;
    sidebarActiveEnum: SidenavEnums;
    games: GameResponse[];
    currencyType: CurrencyType;
    currencyRate: number;
}

interface IEndingSoonBannerContainerState {
    discountEndDt: Date,
    currentSlideIndex: number
}

class EndingSoonBannerContainer extends React.Component<IEndingSoonBannerContainerProps, IEndingSoonBannerContainerState> {

    constructor(props: IEndingSoonBannerContainerProps) {
        super(props);
        this.updateCurrentSlideIndex = this.updateCurrentSlideIndex.bind(this);

        this.state = {
            discountEndDt: new Date(getGameBestPricingStatus(this.props.games[0].pricings).discount_end_dt),
            currentSlideIndex: 0
        };
    }

    updateCurrentSlideIndex(current: number): void {
        this.setState({
            discountEndDt: new Date(getGameBestPricingStatus(this.props.games[current].pricings).discount_end_dt),
            currentSlideIndex: current
        });
    }

    render() {
        return (
            <EndingSoonBanner
                goToRedirect={this.props.goToRedirect}
                sidebarActiveEnum={this.props.sidebarActiveEnum}
                games={this.props.games}
                discountEndDt={this.state.discountEndDt}
                currentSlideIndex={this.state.currentSlideIndex}
                updateCurrentSlideIndex={this.updateCurrentSlideIndex}
                currencyType={this.props.currencyType}
                currencyRate={this.props.currencyRate}
            />
        );
    }

}

export default withRouter(EndingSoonBannerContainer);