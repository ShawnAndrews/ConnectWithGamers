import * as React from 'react';
import { NewsArticle as NewsArticleInterface } from '../../../../../client-server-common/common';
import Spinner from '../../../../spinner/main';
import NewsArticle from '../NewsArticle';
import { Paper } from '@material-ui/core';
import TopnavContainer from '../../../../games/search/filter/topnav/TopnavContainer';

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
        <Paper className="results p-2 overflow-auto">
            <div className="topnav text-center color-tertiary p-2 mx-auto mb-3 mt-2">
                Gaming News
            </div>
            <div className="row w-100 m-0">
                {props.news && 
                    props.news.map((newsItem: NewsArticleInterface) => (
                        <NewsArticle 
                            article={newsItem}
                        />
                    ))}
            </div>
        </Paper>
    );

}; 

export default News;