import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { NewsArticle } from '../../../client-server-common/common';
import NewsList from './NewsList';

interface INewsContainerProps extends RouteComponentProps<any> {
    news: NewsArticle[];
}

interface INewsListContainerState {
    news: NewsArticle[];
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