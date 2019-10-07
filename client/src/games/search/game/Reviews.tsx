import * as React from 'react';
import { Review } from '../../../../client-server-common/common';
import { List, Collapse, ListItem, ListItemText } from '@material-ui/core';
import { getFormattedDate } from '../../../util/main';
import Spinner from '../../../spinner/main';

interface IReviewsProps {
    reviews: Review[];
    handleReviewClick: (index: number) => void;
    reviewsCollapsed: boolean[];
}

const Reviews: React.SFC<IReviewsProps> = (props: IReviewsProps) => {

    if (!props.reviews) {
        return (<Spinner className="text-center my-4" loadingMsg="Loading reviews..."/>);
    }

    return (
        <div className="reviews">
            <List component="nav">
                {props.reviews.length === 0 &&
                    <h3 className="text-center my-4">Game does not have any reviews <i className="far fa-frown"/></h3>}
                {props.reviews.length > 0 && 
                    props.reviews
                        .sort((a: Review, b: Review) => b.timestamp_created - a.timestamp_created)
                        .map((x: Review, index: number) => (
                            <div key={index}>
                                <ListItem className={x.voted_up ? `green` : `red`} button onClick={() => props.handleReviewClick(index)}>
                                    <i className={`far fa-thumbs-${x.voted_up ? `up` : `down`}`}/>
                                    <ListItemText primary={`Posted ${getFormattedDate(new Date(x.timestamp_created * 1000))}`} />
                                </ListItem>
                                <Collapse className={`review-text ${x.voted_up ? `green-border` : `red-border`}`} in={props.reviewsCollapsed[index]} timeout="auto" unmountOnExit>
                                    {x.review}
                                </Collapse>
                            </div>
                        ))}
            </List>
        </div>
    );

};

export default Reviews;