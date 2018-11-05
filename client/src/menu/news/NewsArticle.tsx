import * as React from 'react';
import { SingleNewsResponse } from '../../../client-server-common/common';
import { Card } from '@material-ui/core';

interface INewsArticleProps {
    article: SingleNewsResponse;
}

const NewsArticle: React.SFC<INewsArticleProps> = (props: INewsArticleProps) => {
    
    const formatDate = (date: number): string => {
        const CURRENT_UNIX_TIME_MS: number = new Date().getTime();
        const TARGET_UNIX_TIME_MS: number = date;
        let difference: number = CURRENT_UNIX_TIME_MS - TARGET_UNIX_TIME_MS;
        let hoursDifference: number = Math.floor(difference / 1000 / 60 / 60);
        
        if (hoursDifference < 1) {
            return `1 hrs ago`; 
        } else if (hoursDifference < 24) {
            return `${hoursDifference} hrs ago`;
        } else {
            return `${Math.floor(hoursDifference / 24)} days ago`;
        }
    };

    return (
        <div className="news-container" onClick={() => { const win = window.open(props.article.url, '_blank'); win.focus(); }}>
            <Card className="news-container-overlay">
                <div className="news-title">{props.article.title}</div>
                <div className="news-author">By {props.article.author ? props.article.author.split(' ').slice(0, 2).join(' ') : 'Anonymous'} at {props.article.newsOrg}</div>
                <div className="news-date">Posted {formatDate(props.article.created_at)}</div>
                <div className="news-media">
                    {props.article.image
                    ? <img className={props.article.image ? '' : 'translucent'} src={props.article.image ? props.article.image : 'https://i.imgur.com/WcPkTiF.png'} />
                    : props.article.video && <iframe src={props.article.video} frameBorder="0" custom-attribute="autoplay; encrypted-media" allowFullScreen={true}/>}
                </div>
            </Card>
        </div>
    );

}; 

export default NewsArticle;