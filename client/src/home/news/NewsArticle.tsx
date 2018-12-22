import * as React from 'react';
import { SingleNewsResponse } from '../../../client-server-common/common';
import { Card } from '@material-ui/core';

interface INewsArticleProps {
    article: SingleNewsResponse;
}

const NewsArticle: React.SFC<INewsArticleProps> = (props: INewsArticleProps) => {
    
    const formatDate = (date: number): string => {
        const CURRENT_UNIX_TIME_MS: number = parseInt(new Date().getTime().toString().slice(0, -3));
        const TARGET_UNIX_TIME_MS: number = new Date(date).getTime();
        let difference: number = CURRENT_UNIX_TIME_MS - TARGET_UNIX_TIME_MS;
        let hoursDifference: number = Math.floor(difference / 60 / 60);
        
        if (hoursDifference < 1) {
            const minutes: number = Math.floor(60 * (difference / 60 / 60));
            return `${minutes} mins ago`; 
        } else if (hoursDifference < 24) {
            return `${hoursDifference} hrs ago`;
        } else {
            return `${Math.floor(hoursDifference / 24)} days ago`;
        }
    };
    
    const imgError = (image: any): any => {
        image.onerror = "";
        image.src = "https://i.imgur.com/WcPkTiF.png";
        return true;
    };

    return (
        <div className="news-article col-6 col-sm-4 col-lg-3 mb-3 px-md-1 px-lg-3" onClick={() => { const win = window.open(props.article.url, '_blank'); win.focus(); }}>
            <Card className="news-container cursor-pointer custom-shadow bg-primary color-secondary">
                <div className="hover-primary">
                    <div className="title p-2">{props.article.title}</div>
                    <div className="row">
                        <div className="author col-8 pl-4 pr-2">By {props.article.author ? props.article.author.split(' ').slice(0, 2).join(' ') : 'Anonymous'} at {props.article.newsOrg}</div>
                        <div className="date col-4 pl-0 pr-4 mb-1">{formatDate(props.article.created_at)}</div>
                    </div>
                </div>
                <div className="news-media">
                    {props.article.image &&
                        <img className={`w-100 ${props.article.image ? '' : 'translucent'}`} src={props.article.image} onError={(e: any) => { e.target.onerror = null; e.target.src = "https://i.imgur.com/WcPkTiF.png"; }} />}
                </div>
            </Card>
        </div>
    );

}; 

export default NewsArticle;