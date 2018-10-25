import * as React from 'react';
import StarIcon from './StarIcon';

interface ICoverProps {
    cover: string;
    rating: number;
    rating_count: number;
    price: string;
    discount_percent: number;
    steam_url: string;
    name: string;
}

const Cover: React.SFC<ICoverProps> = (props: ICoverProps) => {

    return (
        <div className="menu-game-cover-container">
            <div className="menu-game-cover-overlay">
                <img className="menu-game-cover" width="100%" src={props.cover ? props.cover : 'https://i.imgur.com/WcPkTiF.png'} alt="Game cover"/>
            </div>
            {props.rating && 
                <span className="menu-game-rating-stars">
                    {props.rating > 0
                        ? props.rating <= 10 
                            ? <StarIcon halfStar={true} active={true} />
                            : <StarIcon halfStar={false} active={true} />
                        : <StarIcon halfStar={false} active={false} />}
                    {props.rating > 20
                        ? props.rating <= 30 
                            ? <StarIcon halfStar={true} active={true} />
                            : <StarIcon halfStar={false} active={true} />
                        : <StarIcon halfStar={false} active={false} />}
                    {props.rating > 40
                        ? props.rating <= 50 
                            ? <StarIcon halfStar={true} active={true} />
                            : <StarIcon halfStar={false} active={true} />
                        : <StarIcon halfStar={false} active={false} />}
                    {props.rating > 60
                        ? props.rating <= 70 
                            ? <StarIcon halfStar={true} active={true} />
                            : <StarIcon halfStar={false} active={true} />
                        : <StarIcon halfStar={false} active={false} />}
                    {props.rating > 80
                        ? props.rating <= 90 
                            ? <StarIcon halfStar={true} active={true} />
                            : <StarIcon halfStar={false} active={true} />
                        : <StarIcon halfStar={false} active={false} />}
                </span>}
            {props.rating_count !== undefined && 
                <strong className="menu-game-rating-count">{props.rating_count} Ratings</strong>}
            {props.price && 
                <div className="menu-game-price level-one">
                    <span className="menu-game-price-header">Price: </span>
                    {props.price === 'Free'
                        ? <strong>Free</strong>
                        : <span>${props.price} USD {props.discount_percent !== 0 && '(-' + props.discount_percent + '% SALE)'}</span>}
                    <a href={props.steam_url} className="menu-game-price-icon"><i className="fab fa-steam-square fa-lg"/></a>
                </div>}
            <span className={`menu-game-name ${props.price ? 'level-two' : 'level-one'}`}>{props.name}</span>
        </div>
    );

};

export default Cover;