import * as React from 'react';
import { SingleNewsResponse } from '../../../../client-server-common/common';
import Spinner from '../../../spinner/main';
import NewsArticle from '../NewsArticle';
import { Button } from '@material-ui/core';

interface INewsProps {
    isLoading: boolean;
    goBack: () => void;
    news: SingleNewsResponse[];
}

const News: React.SFC<INewsProps> = (props: INewsProps) => {
    
    if (props.isLoading) {
        return (
            <Spinner className="middle" loadingMsg="Loading news..." />
        );
    }
    
    return (
        <div className="full-height">
            <div className="page-template-title-container">
                <div className="page-template-title">
                    <i className="far fa-newspaper"/>
                        Gaming news
                    <i className="far fa-newspaper"/>
                </div>
            </div>
            <div className="menu-items page-template">
                <div className="news-page-container">
                    {props.news && 
                        props.news.map((newsItem: SingleNewsResponse, index: number) => {
                            if (index % 2 !== 0 || (index +  1) >= props.news.length) {
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
            </div>
        </div>
    );

}; 

export default News;