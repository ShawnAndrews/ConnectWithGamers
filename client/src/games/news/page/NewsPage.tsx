import * as React from 'react';
import { NewsArticle as NewsArticleInterface } from '../../../../client-server-common/common';
import Spinner from '../../../spinner/main';
import { Paper } from '@material-ui/core';
import NewsListContainer from '../NewsListContainer';

interface INewsProps {
    isLoading: boolean;
    goBack: () => void;
    news: NewsArticleInterface[];
}

const News: React.SFC<INewsProps> = (props: INewsProps) => {
    
    if (props.isLoading) {
        return (
            <Spinner className="text-center mt-5 pt-5" loadingMsg="Loading news..." />
        );
    }
    
    return (
        <Paper className="results p-2 overflow-auto">
            <div className="topnav text-center color-tertiary p-2 mx-auto mb-3 mt-2">
                Gaming News
            </div>
            <div className="grid-results news pb-4">
                {props.news && 
                    <NewsListContainer
                        news={props.news}
                    />}
            </div>
        </Paper>
    );

}; 

export default News;