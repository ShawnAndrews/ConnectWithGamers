import * as React from 'react';
import * as Redux from 'redux';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { GameResponse, CurrencyType } from '../../../client-server-common/common';
import GameList from './GameList';
import { GlobalReduxState } from '../../reducers/main';
import { getPriceInUserCurrency } from '../../util/main';

export enum GameListType {
    FullsizeScreenshot,
    Search,
    Transparent,
    FullsizeCover,
    TransparentTime,
    ScrollingCover
}

interface IGameListContainerProps extends RouteComponentProps<any> {
    type: GameListType;
    game: GameResponse;
    index?: number;
} 

interface IGameListContainerState { }

interface ReduxStateProps {
    currencyType: CurrencyType;
    currencyRate: number;
}

interface ReduxDispatchProps {

}

type Props = IGameListContainerProps & ReduxStateProps & ReduxDispatchProps;

class GameListContainer extends React.Component<Props, IGameListContainerState> {

    constructor(props: Props) {
        super(props);
        this.goToGame = this.goToGame.bind(this);
        this.getConvertedPrice = this.getConvertedPrice.bind(this);
    }

    goToGame(): void {
        this.props.history.push(`/search/game/${this.props.game.steamId}`);
    }

    getConvertedPrice(price: number): string {
        return getPriceInUserCurrency(price, this.props.currencyType, this.props.currencyRate);
    }

    render() {
        return (
            <GameList
                type={this.props.type}
                game={this.props.game}
                goToGame={this.goToGame}
                getConvertedPrice={this.getConvertedPrice}
                index={this.props.index}
            />
        );
    }

}

const mapStateToProps = (state: any, ownProps: IGameListContainerProps): ReduxStateProps => {
    const globalModalReduxState: GlobalReduxState = state;

    return {
        currencyType: globalModalReduxState.topnav.currencyType,
        currencyRate: globalModalReduxState.topnav.currencyRate
    };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch, ownProps: IGameListContainerProps): ReduxDispatchProps => ({

});

export default withRouter(connect<ReduxStateProps, ReduxDispatchProps, IGameListContainerProps>
    (mapStateToProps, mapDispatchToProps)(GameListContainer));