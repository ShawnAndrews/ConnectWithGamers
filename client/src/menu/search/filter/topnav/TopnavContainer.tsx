import * as Redux from 'redux';
import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Topnav from './Topnav';
import { connect } from 'react-redux';
import { swipeLeftFilter } from '../../../../actions/main';

interface ITopnavContainerProps extends RouteComponentProps<any> {
    title: string;
}

interface ITopnavContainerState {
    title: string;
}

interface ReduxStateProps {

}

interface ReduxDispatchProps {
    swipeLeft: () => void;
}

type Props = ITopnavContainerProps & ReduxStateProps & ReduxDispatchProps;

class TopnavContainer extends React.Component<Props, ITopnavContainerState> {

    constructor(props: Props) {
        super(props);

        this.state = {
            title: props.title
        };
    }

    render() {
        return (
            <Topnav
                goBack={this.props.history.goBack}
                swipeLeft={this.props.swipeLeft}
                title={this.state.title}
            />
        );
    }

}

const mapStateToProps = (state: any, ownProps: ITopnavContainerProps): ReduxStateProps => ({
    
});

const mapDispatchToProps = (dispatch: Redux.Dispatch, ownProps: ITopnavContainerProps): ReduxDispatchProps => ({
    swipeLeft: () => { dispatch(swipeLeftFilter()); },
});

export default withRouter(connect<ReduxStateProps, ReduxDispatchProps, ITopnavContainerProps>
    (mapStateToProps, mapDispatchToProps)(TopnavContainer));