import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import CheapGamesBanner from './CheapGamesBanner';
import { SidenavEnums, GameResponse } from '../../../../client-server-common/common';

interface ICheapGamesBannerContainerProps extends RouteComponentProps<any> {
    goToRedirect: (URL: string) => void;
    sidebarActiveEnum: SidenavEnums;
    games: GameResponse[];
}

interface ICheapGamesBannerContainerState {
    mediaCarouselElement: any;
}

class CheapGamesBannerContainer extends React.Component<ICheapGamesBannerContainerProps, ICheapGamesBannerContainerState> {

    constructor(props: ICheapGamesBannerContainerProps) {
        super(props);

        this.state = {
            mediaCarouselElement: undefined,
        };
    }

    render() {
        return (
            <CheapGamesBanner
                goToRedirect={this.props.goToRedirect}
                sidebarActiveEnum={this.props.sidebarActiveEnum}
                games={this.props.games}
                mediaCarouselElement={this.state.mediaCarouselElement}
            />
        );
    }

}

export default withRouter(CheapGamesBannerContainer);