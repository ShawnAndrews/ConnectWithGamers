import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import GenreBanner from './GenreBanner';
import { GameResponse, PriceInfoResponse } from '../../../../client-server-common/common';
import { getGameBestPricingStatus } from '../../../util/main';

interface IGenreBannerContainerProps extends RouteComponentProps<any> {
    goToRedirect: (URL: string) => void;
    games: GameResponse[];
}

interface IGenreBannerContainerState {
    maxDiscountPercent: number;
}

class GenreBannerContainer extends React.Component<IGenreBannerContainerProps, IGenreBannerContainerState> {

    constructor(props: IGenreBannerContainerProps) {
        super(props);

        this.state = {
            maxDiscountPercent: undefined
        };
    }

    componentWillMount(): void {
        let maxDiscountPercent: number = 0;

        for (let i = 0; i < this.props.games.length; i++) {
            const bestPrice: PriceInfoResponse = getGameBestPricingStatus(this.props.games[i].pricings);
            if (bestPrice.discount_percent > maxDiscountPercent) {
                maxDiscountPercent = bestPrice.discount_percent;
            }
        }

        this.setState({ maxDiscountPercent: maxDiscountPercent });
    }

    render() {
        return (
            <GenreBanner
                goToRedirect={this.props.goToRedirect}
                games={this.props.games}
                maxDiscountPercent={this.state.maxDiscountPercent}
            />
        );
    }

}

export default withRouter(GenreBannerContainer);