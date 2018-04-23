import * as React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { SteamAPIReview } from '../../../../../client/client-server-common/common';

interface IReviewsProps {
    reviews: SteamAPIReview[];
    reviewsExpanded: boolean;
    handleReadReviewsClick: () => void;
}

const Reviews: React.SFC<IReviewsProps> = (props: IReviewsProps) => {

    if (!props.reviews) {
        return null;
    }

    return (
        <div className="menu-game-reviews">
            <h2 className="menu-game-reviews-header">Reviews</h2>
            <RaisedButton className="menu-game-reviews-btn" onClick={() => { props.handleReadReviewsClick(); }}>
                {props.reviewsExpanded ? "Collapse reviews" : "Read reviews"}
                {props.reviewsExpanded ? <i className="fas fa-chevron-circle-up"/> : <i className="fas fa-chevron-circle-down"/>}
            </RaisedButton>
            {props.reviewsExpanded && 
                <div className="menu-game-reviews-padding">
                    {props.reviews.map((review: SteamAPIReview, index: number) => {
                        return (
                            <div key={index} className="menu-game-reviews-container">
                                <div className="border">
                                    <div className="menu-game-review-header-container">
                                        <div className="menu-game-review-header">
                                            <div className="menu-game-review-header-hoursplayed">
                                                <i className="far fa-clock icon-hoursplayed"/>
                                                {review.hours_played} hours played
                                            </div>
                                            <div className="menu-game-review-header-upvotes">
                                                {review.up_votes}
                                                <i className="far fa-thumbs-up icon-upvotes"/>
                                            </div>
                                            <div className="border-bottom"/>
                                        </div>
                                    </div>
                                    <div className="menu-game-review-body-container">
                                        {review.text}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>}
        </div>
    );

};

export default Reviews;