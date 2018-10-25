import * as React from 'react';
import { SingleNewsResponse } from '../../../client-server-common/common';
import NewsArticle from './NewsArticle';

interface INewsProps {
    goToRedirectCallback: (URL: string) => void;
    news: SingleNewsResponse[];
}

const News: React.SFC<INewsProps> = (props: INewsProps) => {
    
    return (
        <div className="news-list-container">
            <div className="news-list-header" onClick={() => { props.goToRedirectCallback(`/menu/news`); }}>
                <a className="news-list-header-link">News</a>
                <i className="fas fa-chevron-right"/>
            </div>
            {props.news && 
                props.news.map((newsItem: SingleNewsResponse, index: number) => {
                    if (index % 2 !== 0) {
                        return;
                    }

                    return (
                        <div key={props.news[index].id} className="news-table">
                            <NewsArticle 
                                article={props.news[index]}
                            />
                            <NewsArticle 
                                article={props.news[index + 1]}
                            />
                        </div>
                    );
                })}
        </div>
    );

}; 

export default News;