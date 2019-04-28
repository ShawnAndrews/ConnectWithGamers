import * as React from 'react';
import { NewsArticle as NewsArticleInterface } from '../../../client-server-common/common';
import NewsArticle from './NewsArticle';

interface INewsProps {
    goToRedirectCallback: (URL: string) => void;
    news: NewsArticleInterface[];
}

const News: React.SFC<INewsProps> = (props: INewsProps) => {
    
    return (
        <>
            {props.news && 
                props.news.map((newsItem: NewsArticleInterface) => {
                    return (
                        <NewsArticle
                            key={newsItem.title}
                            news={newsItem}
                        />
                    );
                })}
        </>
    );

}; 

export default News;