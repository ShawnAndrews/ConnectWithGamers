import * as React from 'react';
import { GameResponse, IdNamePair, PlatformEnum, PriceInfoResponse, StateEnum } from '../../../../client-server-common/common';
import { formatDate, getGameBestPricingStatus } from '../../../util/main';
import Slider from '@material-ui/core/Slider';

interface ITransparentTimeGameProps {
    game: GameResponse;
    goToGame: () => void;
    getConvertedPrice: (price: number) => string;
}

const TransparentTimeGame: React.SFC<ITransparentTimeGameProps> = (props: ITransparentTimeGameProps) => {
    
    const startDateSeconds: number = new Date().getTime() / 1000;
    const endDateSeconds: number = (new Date(props.game.first_release_date)).getTime() / 1000;
    const barPeriodSeconds: number = 60*60*24*35;
    const rawPercentBetween: number = ((endDateSeconds - startDateSeconds) / barPeriodSeconds) * 100;
    const percentBetween: number = rawPercentBetween > 100 ? 100 : rawPercentBetween;
    const bestPricing: PriceInfoResponse = getGameBestPricingStatus(props.game.pricings);
    const bestPricingBasePrice: number = bestPricing.price && bestPricing.discount_percent && + (bestPricing.price / ((100 - bestPricing.discount_percent) / 100)).toFixed(2);
    const numericalStatus: boolean = props.game.state.id != 4 && props.game.state.id != 5 && props.game.pricings.length > 0;

    return (
        <div className="time-item position-relative mx-4">
            <div onClick={props.goToGame}>
                <img className="cover-img" src={props.game.cover  || 'https://i.imgur.com/WcPkTiF.png'} alt="Game cover"/>
                <div className="time-item-text pl-3 align-top d-inline-block">
                    <div className="name pr-2 pt-2">
                        {props.game.name}
                    </div>
                    {props.game.platforms &&
                        <div className={`platforms`}>
                            {props.game.platforms && props.game.platforms.length === 0 && <i className="fab fa-windows mr-2"/>}
                            {props.game.platforms.map((platform: IdNamePair) => {
                                if (platform.id === PlatformEnum.windows) return <i className="fab fa-windows mr-2"/>;
                                if (platform.id === PlatformEnum.linux) return <i className="fab fa-linux mr-2"/>;
                                if (platform.id === PlatformEnum.mac) return <i className="fab fa-apple mr-2"/>;
                                })}
                        </div>}
                    <div className="genres font-italic pt-1">
                        {props.game.genres && props.game.genres.map(x => x.name).splice(0, 2).join(`, `)}
                    </div>
                    <div className="time w-100 px-3 pt-3">
                        <Slider
                            aria-label={formatDate(new Date(props.game.first_release_date).getTime() / 1000)}
                            value={percentBetween}
                            valueLabelDisplay='on'
                            valueLabelFormat={() => { return `${formatDate(new Date(props.game.first_release_date).getTime() / 1000).replace(`In `, ``).replace(` ago`, ``)}`; }}
                        />
                    </div>
                    <div className={`price-container`}>
                        {numericalStatus &&
                            <>
                                {bestPricing.discount_percent && 
                                    <>
                                        <div className="discount d-inline-block px-1 mr-2">SALE</div>
                                        <div className="base-price d-inline-block"><del>{props.getConvertedPrice(bestPricingBasePrice)}</del></div>
                                    </>}
                            </>}
                        <div className={`text ${numericalStatus && bestPricing.discount_percent ? `with-discount` : ``} d-inline-block`}>{numericalStatus ? props.getConvertedPrice(bestPricing.price) : props.game.state.id === StateEnum["Early Access"] ? `Early Access` : props.game.state.id === StateEnum.Preorder ? `Preorder` : props.game.state.id === StateEnum.Released ? `Free` : ``}</div>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default TransparentTimeGame;
