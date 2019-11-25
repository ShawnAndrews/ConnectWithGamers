const $ = require('jquery');
import * as React from 'react';
import * as Redux from 'redux';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Price from './Price';
import { GameResponse, CurrencyType } from '../../../client-server-common/common';
import { GlobalReduxState } from '../../reducers/main';
import { getPriceInUserCurrency } from '../../util/main';

interface IPriceContainerProps extends RouteComponentProps<any> {
    game: GameResponse;
    showTextStatus: boolean;
}

interface IPriceContainerState {
    
}

interface ReduxStateProps {
    currencyType: CurrencyType;
    currencyRate: number;
}

interface ReduxDispatchProps {

}

type Props = IPriceContainerProps & ReduxStateProps & ReduxDispatchProps;

class PriceContainer extends React.Component<Props, IPriceContainerState> {

    constructor(props: Props) {
        super(props);
        this.getConvertedPrice = this.getConvertedPrice.bind(this);

        this.state = {

        };
    }

    getConvertedPrice(price: number): string {
        return getPriceInUserCurrency(price, this.props.currencyType, this.props.currencyRate);
    }

    render() {
        return (
            <Price
                game={this.props.game}
                getConvertedPrice={this.getConvertedPrice}
                showTextStatus={this.props.showTextStatus}
            />
        );
    }

}

const mapStateToProps = (state: any, ownProps: IPriceContainerProps): ReduxStateProps => {
    const globalModalReduxState: GlobalReduxState = state;

    return {
        currencyType: globalModalReduxState.topnav.currencyType,
        currencyRate: globalModalReduxState.topnav.currencyRate
    };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch, ownProps: IPriceContainerProps): ReduxDispatchProps => ({

});

export default withRouter(connect<ReduxStateProps, ReduxDispatchProps, IPriceContainerProps>
    (mapStateToProps, mapDispatchToProps)(PriceContainer));