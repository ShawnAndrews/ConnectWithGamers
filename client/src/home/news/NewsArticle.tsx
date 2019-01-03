import * as React from 'react';
import { NewsArticle } from '../../../client-server-common/common';
import { Card } from '@material-ui/core';
import { formatDate, onImgError } from '../../util/main';

interface INewsArticleProps {
    article: NewsArticle;
}

const NewsArticle: React.SFC<INewsArticleProps> = (props: INewsArticleProps) => {

    return (
        <div className="news-article col-6 col-sm-4 col-lg-3 mb-3 px-md-1 px-lg-3" onClick={() => { const win = window.open(props.article.url, '_blank'); win.focus(); }}>
            <Card className="news-container cursor-pointer primary-shadow bg-tertiary color-secondary">
                <div className="hover-tertiary-solid">
                    <div className="title p-2">{props.article.title}</div>
                    <div className="row">
                        <div className="author col-8 pl-4 pr-2">By {props.article.author ? props.article.author.split(' ').slice(0, 2).join(' ') : 'Anonymous'} at {props.article.newsOrg}</div>
                        <div className="date col-4 pl-0 pr-4 mb-1">{formatDate(props.article.created_at, true)}</div>
                    </div>
                </div>
                <div className="news-media">
                    {props.article.image &&
                        <img className={`w-100 ${props.article.image ? '' : 'translucent'}`} src={props.article.image} onError={onImgError} />}
                </div>
            </Card>
        </div>
    );

}; 

export default NewsArticle;