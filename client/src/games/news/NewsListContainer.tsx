const popupS = require('popups');
import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { NewsArticle } from '../../../client-server-common/common';
import NewsList from './NewsList';

interface INewsContainerProps extends RouteComponentProps<any> {
    news: NewsArticle[];
    limit?: number;
}

interface INewsListContainerState {
    news: NewsArticle[];
    newsImageRatio: number[];
}

class NewsListContainer extends React.Component<INewsContainerProps, INewsListContainerState> {

    constructor(props: INewsContainerProps) {
        super(props);
        this.getImageSizeRatio = this.getImageSizeRatio.bind(this);

        this.state = { 
            news: props.news,
            newsImageRatio: []
        };
    }

    componentWillMount(): void {
        const imageRatioPromises: Promise<number>[] = [];

        for (let i = 0; i < this.state.news.length; i++) {
            imageRatioPromises.push(this.getImageSizeRatio(this.state.news[i].image));
        }
        
        Promise.all(imageRatioPromises)
            .then((imageRatios: number[]) => {
                this.setState({ newsImageRatio: imageRatios });
            })
            .catch((error: string) => {
                popupS.modal({ content: `<div>• Error loading chatroom emotes: ${error}</div>` });
            });

    }

    getImageSizeRatio(imageURL: string): Promise<number> {

        return new Promise ((resolve, reject) => {
          const i: HTMLImageElement = new Image();
          i.src = imageURL;
          i.onload = (): void => {
            return resolve(i.width / i.height);
          };
          i.onerror = (): void => {
            return resolve(-1);
          };
        })

    }

    render() {
        return (
            <NewsList
                goToRedirectCallback={this.props.history.push}
                news={this.state.news}
                newsImageRatio={this.state.newsImageRatio}
                limit={this.props.limit}
            />
        );
    }

}

export default withRouter(NewsListContainer);