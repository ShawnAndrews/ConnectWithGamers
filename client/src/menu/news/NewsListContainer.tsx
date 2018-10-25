const popupS = require('popups');
import * as React from 'react';
import * as IGDBService from '../../service/igdb/main';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { SingleNewsResponse, MultiNewsResponse } from '../../../client-server-common/common';
import NewsList from './NewsList';

interface INewsContainerProps extends RouteComponentProps<any> {
    news: SingleNewsResponse[];
}

interface INewsListContainerState {
    news: SingleNewsResponse[];
}

class NewsListContainer extends React.Component<INewsContainerProps, INewsListContainerState> {

    constructor(props: INewsContainerProps) {
        super(props);
        this.state = { 
            news: props.news
        };
    }

    render() {
        return (
            <NewsList
                goToRedirectCallback={this.props.history.push}
                news={this.state.news}
            />
        );
    }

}

export default withRouter(NewsListContainer);