const popupS = require('popups');
import * as React from 'react';
import * as SteamService from '../../../service/steam/main';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { NewsArticle, MultiNewsResponse } from '../../../../client-server-common/common';
import NewsPage from './NewsPage';

interface INewsPageContainerProps extends RouteComponentProps<any> {
    
}

interface INewsPageContainerState {
    isLoading: boolean;
    news: NewsArticle[];
}

class NewsPageContainer extends React.Component<INewsPageContainerProps, INewsPageContainerState> {

    constructor(props: INewsPageContainerProps) {
        super(props);
        this.state = { 
            isLoading: true,
            news: undefined
        };
        this.loadNews = this.loadNews.bind(this);
        this.loadNews();
    }

    loadNews(): void {
        SteamService.httpGenericGetData<MultiNewsResponse>(`/steam/games/news`)
            .then( (response: MultiNewsResponse) => {
                const news: NewsArticle[] = response.data;
                this.setState({ isLoading: false, news: news });
            })
            .catch( (error: string) => {
                popupS.modal({ content: `<div>• ${error}</div>` });
                this.setState({ isLoading: false });
            });
    }

    render() {
        return (
            <NewsPage
                isLoading={this.state.isLoading}
                goBack={this.props.history.goBack}
                news={this.state.news}
            />
        );
    }

}

export default withRouter(NewsPageContainer);