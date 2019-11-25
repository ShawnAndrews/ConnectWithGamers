import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import HorrorGamesBanner from './HorrorGamesBanner';
import { SidenavEnums, GameResponse } from '../../../../client-server-common/common';

interface IHorrorGamesBannerContainerProps extends RouteComponentProps<any> {
    goToRedirect: (URL: string) => void;
    sidebarActiveEnum: SidenavEnums;
    games: GameResponse[];
}

interface IHorrorGamesBannerContainerState {
    mediaCarouselElement: any;
}

class HorrorGamesBannerContainer extends React.Component<IHorrorGamesBannerContainerProps, IHorrorGamesBannerContainerState> {

    constructor(props: IHorrorGamesBannerContainerProps) {
        super(props);

        this.state = {
            mediaCarouselElement: undefined,
        };
    }

    render() {
        return (
            <HorrorGamesBanner
                goToRedirect={this.props.goToRedirect}
                sidebarActiveEnum={this.props.sidebarActiveEnum}
                games={this.props.games}
                mediaCarouselElement={this.state.mediaCarouselElement}
            />
        );
    }

}

export default withRouter(HorrorGamesBannerContainer);