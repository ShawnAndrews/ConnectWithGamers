import * as React from 'react';
import { SingleNewsResponse } from '../../../../client-server-common/common';
import Spinner from '../../../spinner/main';
import NewsArticle from '../NewsArticle';
import { Paper } from '@material-ui/core';

interface INewsProps {
    isLoading: boolean;
    goBack: () => void;
    news: SingleNewsResponse[];
}

const News: React.SFC<INewsProps> = (props: INewsProps) => {
    
    if (props.isLoading) {
        return (
            <Spinner className="text-center mt-5" loadingMsg="Loading news..." />
        );
    }
    
    return (
        <div className="results container">
            <Paper className="topnav bg-tertiary p-2 mx-auto my-4">
                <div className="text-center">
                    Gaming news
                </div>
            </Paper>
            <div className="row">
                {props.news && 
                    props.news.map((newsItem: SingleNewsResponse, index: number) => (
                        <NewsArticle 
                            article={props.news[index]}
                        />
                    ))}
            </div>
        </div>
    );

}; 

export default News;