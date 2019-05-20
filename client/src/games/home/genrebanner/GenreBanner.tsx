import * as React from 'react';
import { GameResponse } from '../../../../client-server-common/common';
import GameListContainer, { GameListType } from '../../game/GameListContainer';
import { getGameBestPricingStatus } from '../../../util/main';

interface IGenreBannerProps {
    goToRedirect: (URL: string) => void;
    games: GameResponse[];
    maxDiscountPercent: number;
}

const GenreBanner: React.SFC<IGenreBannerProps> = (props: IGenreBannerProps) => {

    const noDiscountedGames: boolean = props.games.map((x: GameResponse) => getGameBestPricingStatus(x.pricings).discount_percent).every( x => x === undefined);

    return (
        <div className="genre-banner position-relative d-inline-block">
            <img src="https://i.imgur.com/0fizi4X.jpg" />
            <div className="filter-genre w-100"/>
            <div className="filter-genre-gradient w-100"/>
            <div className="title-one text-center w-100">Horror Games</div>
            {!noDiscountedGames && <div className="title-two text-center w-100">Up to -{props.maxDiscountPercent}% off</div>}
            <div className="genre-banner-games text-center w-100">
                <div className="grid-results genrebanner-games w-100">
                    {props.games && props.games
                        .map((game: GameResponse) => 
                            <GameListContainer
                                type={GameListType.Transparent}
                                game={game}
                                transparentSmallCover={true}
                            />
                        )}
                </div>
            </div>
        </div>
    );

};

export default GenreBanner;
