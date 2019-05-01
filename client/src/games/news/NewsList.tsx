import * as React from 'react';
import { NewsArticle as NewsArticleInterface } from '../../../client-server-common/common';
import NewsArticle from './NewsArticle';

interface INewsProps {
    goToRedirectCallback: (URL: string) => void;
    news: NewsArticleInterface[];
    newsImageRatio: number[];
    limit?: number;
}

const News: React.SFC<INewsProps> = (props: INewsProps) => {
    
    return (
        <>
            {props.news && 
                props.news
                .filter((newsArticle: NewsArticleInterface, index: number) => props.newsImageRatio[index] > 0.9 && props.newsImageRatio[index] > 1.1)
                .slice(0, props.limit || 50)
                .map((newsItem: NewsArticleInterface) => {
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