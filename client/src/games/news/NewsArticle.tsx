import * as React from 'react';
import { NewsArticle } from '../../../client-server-common/common';
import { Card } from '@material-ui/core';
import { formatDate, onImgError } from '../../util/main';

interface INewsArticleProps {
    news: NewsArticle;
}

const NewsArticle: React.SFC<INewsArticleProps> = (props: INewsArticleProps) => {

    return (
        <Card className='cursor-pointer' onClick={() => { const win = window.open(props.news.url, '_blank'); win.focus(); }}>
            {props.news.image &&
                <img className='w-100' src={props.news.image} onError={onImgError} />}
            <>
                <div className="title p-2">{props.news.title}</div>
                <div className="row pb-2">
                    <div className="author col-12 pl-4 pr-2">By {props.news.author ? props.news.author.split(' ').slice(0, 2).join(' ') : 'Anonymous'} at {props.news.org}</div>
                </div>
            </>
        </Card>
    );

}; 

export default NewsArticle;
