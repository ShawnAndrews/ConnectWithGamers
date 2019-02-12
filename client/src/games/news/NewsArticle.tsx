import * as React from 'react';
import { NewsArticle } from '../../../client-server-common/common';
import { Card } from '@material-ui/core';
import { formatDate, onImgError } from '../../util/main';

interface INewsArticleProps {
    article: NewsArticle;
}

const NewsArticle: React.SFC<INewsArticleProps> = (props: INewsArticleProps) => {

    return (
        <div className="news-article col-12 col-sm-6 col-lg-4 col-xl-3 mb-3 px-md-1 px-lg-3" onClick={() => { const win = window.open(props.article.url, '_blank'); win.focus(); }}>
            <Card className="news-container cursor-pointer primary-shadow color-secondary">
                <div className="hover-tertiary-solid">
                    <div className="title p-2">{props.article.title}</div>
                    <div className="row">
                        <div className="author col-8 pl-4 pr-2">By {props.article.author ? props.article.author.split(' ').slice(0, 2).join(' ') : 'Anonymous'} at {props.article.org}</div>
                        <div className="date col-4 pl-0 pr-4 mb-1">{formatDate(new Date(props.article.created_dt).getTime() / 1000, true)}</div>
                    </div>
                </div>
                <div className="news-media text-center">
                    {props.article.image &&
                        <img className={`${props.article.image ? '' : 'translucent'}`} src={props.article.image} onError={onImgError} />}
                </div>
            </Card>
        </div>
    );

}; 

export default NewsArticle;