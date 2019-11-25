import * as React from 'react';
import { GameResponse, IdNamePair, PlatformEnum, PriceInfoResponse, StateEnum, PricingStatus } from '../../../../client-server-common/common';
import { formatDate, getLatestMainGamePricingStatus } from '../../../util/main';
import Slider from '@material-ui/core/Slider';
import PriceContainer from '../../price/PriceContainer';

interface ITransparentTimeGameProps {
    game: GameResponse;
    goToGame: () => void;
}

const TransparentTimeGame: React.SFC<ITransparentTimeGameProps> = (props: ITransparentTimeGameProps) => {
    
    const startDateSeconds: number = new Date().getTime() / 1000;
    const endDateSeconds: number = (new Date(props.game.first_release_date)).getTime() / 1000;
    const barPeriodSeconds: number = 60*60*24*35;
    const rawPercentBetween: number = ((endDateSeconds - startDateSeconds) / barPeriodSeconds) * 100;
    const percentBetween: number = rawPercentBetween > 100 ? 100 : rawPercentBetween;

    return (
        <div className="time-item position-relative mx-4">
            <div onClick={props.goToGame}>
                <img className="cover-img" src={props.game.cover  || 'https://i.imgur.com/WcPkTiF.png'} alt="Game cover"/>
                <div className="time-item-text pl-3 align-top">
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
                    <PriceContainer 
                        game={props.game}
                        showTextStatus={false}
                    />
                    <div className="time w-100 px-3 pt-3">
                        <Slider
                            aria-label={formatDate(new Date(props.game.first_release_date).getTime() / 1000)}
                            value={percentBetween}
                            valueLabelDisplay='on'
                            valueLabelFormat={() => { return `${formatDate(new Date(props.game.first_release_date).getTime() / 1000).replace(`In `, ``).replace(` ago`, ``)}`; }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

};

export default TransparentTimeGame;
