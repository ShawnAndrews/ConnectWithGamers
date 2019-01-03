import * as React from 'react';
import { NewsArticle as NewsArticleInterface } from '../../../../client-server-common/common';
import Spinner from '../../../spinner/main';
import NewsArticle from '../NewsArticle';
import { Paper } from '@material-ui/core';

interface INewsProps {
    isLoading: boolean;
    goBack: () => void;
    news: NewsArticleInterface[];
}

const News: React.SFC<INewsProps> = (props: INewsProps) => {
    
    if (props.isLoading) {
        return (
            <Spinner className="text-center mt-5" loadingMsg="Loading news..." />
        );
    }
    
    return (
        <Paper className="results bg-primary-solid p-2 overflow-auto">
            <Paper className="topnav bg-tertiary p-2 mx-auto my-4">
                <div className="text-center">
                    Gaming news
                </div>
            </Paper>
            <div className="row w-100 m-0">
                {props.news && 
                    props.news.map((newsItem: NewsArticleInterface, index: number) => (
                        <NewsArticle 
                            article={props.news[index]}
                        />
                    ))}
            </div>
        </Paper>
    );

}; 

export default News;