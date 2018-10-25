const popupS = require('popups');
import * as React from 'react';
import * as IGDBService from '../../../service/igdb/main';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { SingleNewsResponse, MultiNewsResponse } from '../../../../client-server-common/common';
import NewsPage from './NewsPage';

interface INewsPageContainerProps extends RouteComponentProps<any> {
    
}

interface INewsPageContainerState {
    isLoading: boolean;
    news: SingleNewsResponse[];
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
        IGDBService.httpGenericGetData<MultiNewsResponse>(`/igdb/games/news`)
            .then( (response: MultiNewsResponse) => {
                const news: SingleNewsResponse[] = response.data;
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