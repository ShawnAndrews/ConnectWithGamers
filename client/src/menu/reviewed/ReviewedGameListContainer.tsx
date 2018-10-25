import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { PredefinedGameResponse } from '../../../client-server-common/common';
import ReviewedGameList from './ReviewedGameList';

interface IReviewedGameListContainerProps extends RouteComponentProps<any> {
    reviewedGames: PredefinedGameResponse[];
}

interface IReviewedGameListContainerState {
    randomFilterVals: number[];
    reviewedGames: PredefinedGameResponse[];
}

class ReviewedGameListContainer extends React.Component<IReviewedGameListContainerProps, IReviewedGameListContainerState> {

    constructor(props: IReviewedGameListContainerProps) {
        super(props);
        this.onClickGame = this.onClickGame.bind(this);

        this.state = {
            randomFilterVals: Array.from({ length: 6 }, () => Math.floor(Math.random() * 2)),
            reviewedGames: props.reviewedGames
        };
    }

    onClickGame(id: number): void {
        this.props.history.push(`/menu/search/game/${id}`);
    }

    render() {
        return (
            <ReviewedGameList
                randomFilterVals={this.state.randomFilterVals}
                reviewedGames={this.state.reviewedGames}
                onClickGame={this.onClickGame}
            />
        );
    }

}

export default withRouter(ReviewedGameListContainer);