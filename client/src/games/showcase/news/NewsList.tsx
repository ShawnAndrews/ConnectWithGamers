import * as React from 'react';
import { NewsArticle as NewsArticleInterface } from '../../../../client-server-common/common';
import NewsArticle from './NewsArticle';

interface INewsProps {
    goToRedirectCallback: (URL: string) => void;
    news: NewsArticleInterface[];
}

const News: React.SFC<INewsProps> = (props: INewsProps) => {
    
    return (
        <div className="news-list-container">
            <div className="news-list-header my-2 mb-3" onClick={() => { props.goToRedirectCallback(`/news`); }}>
                <a className="mr-2">News</a>
                <i className="fas fa-chevron-right"/>
            </div>
            <div className="row">
                {props.news && 
                    props.news.map((newsItem: NewsArticleInterface) => {
                        return (
                            <NewsArticle 
                                key={newsItem.id}
                                article={newsItem}
                            />
                        );
                    })}
            </div>
        </div>
    );

}; 

export default News;